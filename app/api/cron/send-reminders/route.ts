import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Reminder from '@/models/Reminder';
import User from '@/models/User';
import { generateNudgeMessage } from '@/lib/gemini';
import { sendReminderEmail } from '@/lib/resend';
import { differenceInDays } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    // Protect cron with secret header
    const cronSecret = req.headers.get('x-cron-secret');
    if (cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const now = new Date();
    const dueReminders = await Reminder.find({
      status: 'pending',
      reminderDate: { $lte: now },
    });

    if (dueReminders.length === 0) {
      return NextResponse.json({ message: 'No due reminders', processed: 0 });
    }

    let processed = 0;
    const errors: string[] = [];

    for (const reminder of dueReminders) {
      try {
        const user = await User.findById(reminder.userId);
        if (!user) continue;

        const daysAgo = differenceInDays(now, reminder.createdAt);
        const nudgeMessage = await generateNudgeMessage(reminder.note, reminder.importance, daysAgo);

        await sendReminderEmail({
          to: reminder.email,
          name: user.name,
          note: reminder.note,
          nudgeMessage,
          reminderId: reminder._id.toString(),
        });

        await Reminder.findByIdAndUpdate(reminder._id, {
          $set: {
            status: 'delivered',
            nudgeMessage,
            deliveredAt: now,
          },
        });

        processed++;
      } catch (err) {
        console.error(`Failed to process reminder ${reminder._id}:`, err);
        errors.push(reminder._id.toString());
      }
    }

    return NextResponse.json({ message: 'Done', processed, errors });
  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
