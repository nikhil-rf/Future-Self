import { NextRequest, NextResponse } from 'next/server';
import { differenceInDays } from 'date-fns';
import dbConnect from '@/lib/mongodb';
import Reminder from '@/models/Reminder';
import User from '@/models/User';
import { generateNudgeMessage } from '@/lib/gemini';
import { sendReminderEmail } from '@/lib/resend';
import {
  getEffectiveSchedule,
  findNextDueSlotIndex,
  hasPendingAfter,
  buildNudgeContext,
} from '@/lib/reminderSchedule';

const MAX_RETRIES = 3;

function fallbackNudge(note: string, importance: string, daysAgo: number) {
  const time =
    daysAgo <= 0
      ? 'recently'
      : `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
  return (
    `You asked ${time} to remember this (${importance} priority). ` +
    `Take a small step today toward: "${note}". Your past self believed it mattered.`
  );
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const now = new Date();
    const dueReminders = await Reminder.find({
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
    });

    if (dueReminders.length === 0) {
      return NextResponse.json({ message: 'No due sends', processed: 0 });
    }

    let processed = 0;
    const errors: { reminderId: string; error: string }[] = [];

    for (const reminder of dueReminders) {
      try {
        const fresh = getEffectiveSchedule(reminder);
        const slotIndex = findNextDueSlotIndex(fresh, now);
        if (slotIndex < 0) continue;

        const claimed = await Reminder.findOneAndUpdate(
          { _id: reminder._id, status: 'pending' },
          { $set: { status: 'processing', processingAt: now } },
          { new: true }
        );
        if (!claimed) continue;

        const schedule = getEffectiveSchedule(claimed);
        const idx = findNextDueSlotIndex(schedule, now);
        if (idx < 0 || idx !== slotIndex) {
          await Reminder.findByIdAndUpdate(reminder._id, {
            $set: { status: 'pending', processingAt: null },
          });
          continue;
        }

        const user = await User.findById(reminder.userId);
        if (!user) {
          await Reminder.findByIdAndUpdate(reminder._id, {
            $set: { status: 'pending', processingAt: null },
          });
          continue;
        }

        const daysAgo = differenceInDays(now, reminder.createdAt);
        const nudgeCtx = buildNudgeContext(reminder, now, slotIndex, schedule.length);
        let nudgeMessage: string;
        try {
          nudgeMessage = await generateNudgeMessage(
            reminder.note,
            reminder.importance,
            daysAgo,
            nudgeCtx
          );
        } catch {
          nudgeMessage = fallbackNudge(reminder.note, reminder.importance, daysAgo);
        }

        const sequenceLabel = `Reminder ${nudgeCtx.sequenceIndex} of ${nudgeCtx.sequenceTotal}`;

        await sendReminderEmail({
          to: reminder.email,
          name: user.name || 'Friend',
          note: reminder.note,
          nudgeMessage,
          reminderId: reminder._id.toString(),
          sequenceLabel,
        });

        const sentAt = new Date();
        const morePending = hasPendingAfter(schedule, slotIndex);

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
        } else if (morePending) {
          await Reminder.findByIdAndUpdate(reminder._id, {
            $set: {
              [`schedule.${slotIndex}.status`]: 'sent',
              [`schedule.${slotIndex}.sentAt`]: sentAt,
              nudgeMessage,
              status: 'pending',
              processingAt: null,
              retryCount: 0,
              lastError: null,
            },
          });
        } else {
          await Reminder.findByIdAndUpdate(reminder._id, {
            $set: {
              [`schedule.${slotIndex}.status`]: 'sent',
              [`schedule.${slotIndex}.sentAt`]: sentAt,
              nudgeMessage,
              status: 'delivered',
              deliveredAt: sentAt,
              processingAt: null,
              retryCount: 0,
              lastError: null,
            },
          });
        }

        processed++;
      } catch (err) {
        console.error(`Failed to process reminder ${reminder._id}:`, err);
        errors.push({
          reminderId: reminder._id.toString(),
          error: err instanceof Error ? err.message : String(err),
        });
        await Reminder.findByIdAndUpdate(reminder._id, {
          $set: { status: 'pending', processingAt: null },
        });
      }
    }

    return NextResponse.json({
      message: 'Done',
      processed,
      errors,
      totalCandidates: dueReminders.length,
    });
  } catch (error) {
    console.error('Test cron error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
