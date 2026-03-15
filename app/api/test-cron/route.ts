import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Reminder from '@/models/Reminder';
import User from '@/models/User';
import { generateNudgeMessage } from '@/lib/gemini';
import { sendReminderEmail } from '@/lib/resend';
import { differenceInDays } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const now = new Date();
    const dueReminders = await Reminder.find({
      status: 'pending',
      reminderDate: { $lte: now },
    });

    console.log(`Found ${dueReminders.length} due reminders`);

    if (dueReminders.length === 0) {
      return NextResponse.json({ message: 'No due reminders', processed: 0 });
    }

    let processed = 0;
    const errors: { reminderId: string; error: string }[] = [];

    for (const reminder of dueReminders) {
      try {
        console.log(`Processing reminder: ${reminder._id}`);
        const user = await User.findById(reminder.userId);
        if (!user) {
          console.log(`User not found for reminder ${reminder._id}`);
          continue;
        }

        const daysAgo = differenceInDays(now, reminder.createdAt);
        console.log(`Generating nudge message for ${daysAgo} days`);
        const nudgeMessage = await generateNudgeMessage(reminder.note, reminder.importance, daysAgo);

        console.log(`Sending email to ${reminder.email}`);
        const emailResult = await sendReminderEmail({
          to: reminder.email,
          name: user.name,
          note: reminder.note,
          nudgeMessage,
          reminderId: reminder._id.toString(),
        });

        console.log(`Email sent successfully:`, emailResult);

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
        errors.push({ 
          reminderId: reminder._id.toString(), 
          error: err instanceof Error ? err.message : String(err) 
        });
      }
    }

    return NextResponse.json({ 
      message: 'Done', 
      processed, 
      errors,
      totalProcessed: dueReminders.length 
    });
  } catch (error) {
    console.error('Test cron error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
