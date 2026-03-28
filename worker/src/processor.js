// worker/src/processor.js
// Core polling loop: finds due reminders, claims them atomically, processes them.

import { differenceInDays } from 'date-fns';
import Reminder from './models/Reminder.js';
import { generateNudgeMessage } from './gemini.js';
import { sendReminderEmail } from './email.js';
import User from './models/User.js';

const MAX_RETRIES = 3;

// How long a reminder can stay in 'processing' before we consider it stale
// (e.g., the worker crashed mid-flight). 10 minutes is generous.
const STALE_LOCK_MS = 10 * 60 * 1000;

/**
 * Main polling function — called by node-cron every minute.
 * Finds all due pending reminders, claims each one with an atomic update,
 * and processes them one by one.
 */
export async function processDueReminders() {
  const now = new Date();

  // ── 1. Release stale locks (crashed worker) ──────────────────────────────
  //    If a reminder has been 'processing' for > STALE_LOCK_MS, reset it so
  //    it can be retried on the next poll.
  const staleThreshold = new Date(now.getTime() - STALE_LOCK_MS);
  await Reminder.updateMany(
    { status: 'processing', processingAt: { $lt: staleThreshold } },
    { $set: { status: 'pending', processingAt: null } }
  );

  // ── 2. Find eligible reminders ────────────────────────────────────────────
  //    Only pick reminders that are still 'pending', past their date, and
  //    have not exceeded the retry cap.
  const due = await Reminder.find({
    status: 'pending',
    reminderDate: { $lte: now },
    retryCount: { $lt: MAX_RETRIES },
  }).limit(50); // process at most 50 per minute

  if (due.length === 0) return;

  console.log(`[Worker] Found ${due.length} due reminder(s) at ${now.toISOString()}`);

  for (const reminder of due) {
    await claimAndProcess(reminder, now);
  }
}

/**
 * Atomically claim a single reminder (optimistic lock) then process it.
 * If another worker instance claims it first, this call is a no-op.
 */
async function claimAndProcess(reminder, now) {
  // ── Optimistic lock: only update if still 'pending' ─────────────────────
  const claimed = await Reminder.findOneAndUpdate(
    { _id: reminder._id, status: 'pending' },    // condition
    { $set: { status: 'processing', processingAt: now } }, // claim it
    { new: true }
  );

  if (!claimed) {
    // Another worker instance grabbed it first — skip silently
    return;
  }

  console.log(`[Worker] Processing reminder ${reminder._id} for ${reminder.email}`);

  try {
    // ── Fetch user name for personalised email ───────────────────────────
    const user = await User.findById(reminder.userId).lean();
    const userName = user?.name || 'Friend';

    // ── Generate AI nudge ────────────────────────────────────────────────
    const daysAgo = differenceInDays(now, reminder.createdAt);
    const nudgeMessage = await generateNudgeMessage(
      reminder.note,
      reminder.importance,
      daysAgo
    );

    // ── Send email ───────────────────────────────────────────────────────
    await sendReminderEmail({
      to:           reminder.email,
      name:         userName,
      note:         reminder.note,
      nudgeMessage,
      reminderId:   reminder._id.toString(),
    });

    // ── Mark delivered ───────────────────────────────────────────────────
    await Reminder.findByIdAndUpdate(reminder._id, {
      $set: {
        status:       'delivered',
        nudgeMessage,
        deliveredAt:  new Date(),
        processingAt: null,
        lastError:    null,
      },
    });

    console.log(`[Worker] ✅ Delivered reminder ${reminder._id}`);

  } catch (err) {
    const errorMessage = err?.message || String(err);
    console.error(`[Worker] ❌ Failed reminder ${reminder._id}:`, errorMessage);

    const newRetryCount = (reminder.retryCount || 0) + 1;
    const exhausted     = newRetryCount >= MAX_RETRIES;

    await Reminder.findByIdAndUpdate(reminder._id, {
      $set: {
        // Reset to 'pending' for retry, or 'failed' if retries exhausted
        status:       exhausted ? 'failed' : 'pending',
        processingAt: null,
        retryCount:   newRetryCount,
        lastError:    errorMessage,
      },
    });

    if (exhausted) {
      console.error(
        `[Worker] 🚫 Reminder ${reminder._id} marked FAILED after ${MAX_RETRIES} attempts`
      );
    }
  }
}
