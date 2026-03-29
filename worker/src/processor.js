// worker/src/processor.js
// Core polling loop: finds due reminder sends, claims them atomically, processes them.

import { differenceInDays } from 'date-fns';
import Reminder from './models/Reminder.js';
import { generateNudgeMessage } from './gemini.js';
import { sendReminderEmail } from './email.js';
import User from './models/User.js';
import {
  getEffectiveSchedule,
  findNextDueSlotIndex,
  hasPendingAfter,
  buildNudgeContext,
} from './reminderSchedule.js';

const MAX_RETRIES = 3;

// How long a reminder can stay in 'processing' before we consider it stale
const STALE_LOCK_MS = 10 * 60 * 1000;

function fallbackNudgeMessage(note, importance, daysAgo) {
  const time =
    daysAgo <= 0
      ? 'recently'
      : `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
  return (
    `You asked ${time} to remember this (${importance} priority). ` +
    `Take a small step today toward: "${note}". Your past self believed it mattered.`
  );
}

export async function processDueReminders() {
  const now = new Date();

  // ── 1. Release stale locks ────────────────────────────────────────────────
  const staleThreshold = new Date(now.getTime() - STALE_LOCK_MS);
  const staleReleased = await Reminder.updateMany(
    { status: 'processing', processingAt: { $lt: staleThreshold } },
    { $set: { status: 'pending', processingAt: null } }
  );
  if (staleReleased.modifiedCount > 0) {
    console.log(`[Worker] Released ${staleReleased.modifiedCount} stale lock(s)`);
  }

  // ── 2. Find reminders with at least one due send ─────────────────────────
  const due = await Reminder.find({
    status: 'pending',
    retryCount: { $lt: MAX_RETRIES },
    $or: [
      {
        $and: [
          { $or: [{ schedule: { $exists: false } }, { schedule: { $size: 0 } }] },
          { reminderDate: { $lte: now } },
        ],
      },
      {
        schedule: { $elemMatch: { status: 'pending', sendAt: { $lte: now } } },
      },
    ],
  }).limit(50);

  if (due.length === 0) return;

  console.log(`[Worker] Found ${due.length} reminder(s) with due send(s) at ${now.toISOString()}`);

  for (const reminder of due) {
    const eff = getEffectiveSchedule(reminder);
    const slotIndex = findNextDueSlotIndex(eff, now);
    console.log(
      `[Worker] Attempting to claim ${reminder._id} | slots=${eff.length} | nextSlot=${slotIndex} | reminderDate=${reminder.reminderDate?.toISOString()}`
    );
    if (slotIndex < 0) continue;
    await claimAndProcess(reminder, now, slotIndex, eff);
  }
}

async function claimAndProcess(reminder, now, slotIndex, effectiveSchedule) {
  const claimed = await Reminder.findOneAndUpdate(
    { _id: reminder._id, status: 'pending' },
    { $set: { status: 'processing', processingAt: now } },
    { new: true }
  );

  if (!claimed) {
    console.warn(
      `[Worker] ⚠️  Could not claim reminder ${reminder._id} — already processing or status changed.`,
      JSON.stringify(await Reminder.findById(reminder._id).lean(), null, 2)
    );
    return;
  }

  const fresh = getEffectiveSchedule(claimed);
  const idx = findNextDueSlotIndex(fresh, now);
  if (idx < 0 || idx !== slotIndex) {
    await Reminder.findByIdAndUpdate(reminder._id, {
      $set: { status: 'pending', processingAt: null },
    });
    console.warn(`[Worker] Slot changed after claim for ${reminder._id}; released.`);
    return;
  }

  console.log(
    `[Worker] Claimed reminder ${reminder._id} send ${slotIndex + 1}/${fresh.length} for ${reminder.email}`
  );

  try {
    const user = await User.findById(reminder.userId).lean();
    const userName = user?.name || 'Friend';
    console.log(`[Worker] User resolved: "${userName}"`);

    const daysAgo = differenceInDays(now, reminder.createdAt);
    const nudgeCtx = buildNudgeContext(reminder, now, slotIndex, fresh.length);

    let nudgeMessage;
    try {
      console.log(`[Worker] Calling Gemini API (nudge ${nudgeCtx.sequenceIndex}/${nudgeCtx.sequenceTotal})...`);
      nudgeMessage = await generateNudgeMessage(
        reminder.note,
        reminder.importance,
        daysAgo,
        nudgeCtx
      );
      console.log(`[Worker] Gemini responded (${nudgeMessage.length} chars)`);
    } catch (geminiErr) {
      const reason = geminiErr?.message || String(geminiErr);
      console.warn(`[Worker] Gemini skipped (${reason}); using fallback nudge`);
      nudgeMessage = fallbackNudgeMessage(reminder.note, reminder.importance, daysAgo);
    }

    const sequenceLabel = `Reminder ${nudgeCtx.sequenceIndex} of ${nudgeCtx.sequenceTotal}`;

    console.log(`[Worker] Sending email to ${reminder.email} via Resend...`);
    const emailResult = await sendReminderEmail({
      to: reminder.email,
      name: userName,
      note: reminder.note,
      nudgeMessage,
      reminderId: reminder._id.toString(),
      sequenceLabel,
    });
    console.log(`[Worker] Resend response:`, JSON.stringify(emailResult));

    const sentAt = new Date();
    const morePending = hasPendingAfter(fresh, slotIndex);

    if (!Array.isArray(claimed.schedule) || claimed.schedule.length === 0) {
      await Reminder.findByIdAndUpdate(reminder._id, {
        $set: {
          status: 'delivered',
          schedule: [{ sendAt: reminder.reminderDate, status: 'sent', sentAt }],
          nudgeMessage,
          deliveredAt: sentAt,
          processingAt: null,
          retryCount: 0,
          lastError: null,
        },
      });
    } else {
      const base = {
        [`schedule.${slotIndex}.status`]: 'sent',
        [`schedule.${slotIndex}.sentAt`]: sentAt,
        nudgeMessage,
        processingAt: null,
        retryCount: 0,
        lastError: null,
      };
      if (morePending) {
        await Reminder.findByIdAndUpdate(reminder._id, {
          $set: { ...base, status: 'pending' },
        });
      } else {
        await Reminder.findByIdAndUpdate(reminder._id, {
          $set: {
            ...base,
            status: 'delivered',
            deliveredAt: sentAt,
          },
        });
      }
    }

    console.log(
      morePending
        ? `[Worker] ✅ Sent nudge ${slotIndex + 1}/${fresh.length} for ${reminder._id} — more scheduled`
        : `[Worker] ✅ Final send delivered for reminder ${reminder._id}`
    );
  } catch (err) {
    const errorMessage = err?.message || String(err);
    console.error(`[Worker] ❌ Failed reminder ${reminder._id}:`, errorMessage);
    console.error(`[Worker] Full error:`, err);

    const newRetryCount = (reminder.retryCount || 0) + 1;
    const exhausted = newRetryCount >= MAX_RETRIES;

    await Reminder.findByIdAndUpdate(reminder._id, {
      $set: {
        status: exhausted ? 'failed' : 'pending',
        processingAt: null,
        retryCount: newRetryCount,
        lastError: errorMessage,
      },
    });

    if (exhausted) {
      console.error(
        `[Worker] 🚫 Reminder ${reminder._id} FAILED permanently after ${MAX_RETRIES} attempts. Last error: ${errorMessage}`
      );
    } else {
      console.log(`[Worker] Will retry reminder ${reminder._id} (attempt ${newRetryCount}/${MAX_RETRIES})`);
    }
  }
}
