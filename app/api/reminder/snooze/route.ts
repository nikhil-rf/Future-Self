import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Reminder from '@/models/Reminder';
import { buildReminderSchedule, type ScheduleSlot } from '@/lib/reminderSchedule';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Reminder ID is required' }, { status: 400 });
    }

    await dbConnect();
    const reminder = await Reminder.findById(id);

    if (!reminder) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }

    const delta = 7 * 24 * 60 * 60 * 1000;
    const newDate = new Date(reminder.reminderDate.getTime() + delta);

    const schedule = Array.isArray(reminder.schedule) ? reminder.schedule : [];
    const hasSchedule = schedule.length > 0;
    const allSent = hasSchedule && schedule.every((s: ScheduleSlot) => s.status === 'sent');

    let newSchedule;
    if (!hasSchedule || allSent) {
      newSchedule = buildReminderSchedule(new Date(), newDate);
    } else {
      newSchedule = schedule.map((slot: ScheduleSlot) => {
        if (slot.status === 'sent') return slot;
        return {
          sendAt: new Date(new Date(slot.sendAt).getTime() + delta),
          status: slot.status,
        };
      });
      const lastIdx = newSchedule.length - 1;
      if (newSchedule[lastIdx].status !== 'sent') {
        newSchedule[lastIdx] = {
          ...newSchedule[lastIdx],
          sendAt: newDate,
        };
      }
    }

    await Reminder.findByIdAndUpdate(id, {
      $set: {
        reminderDate: newDate,
        schedule: newSchedule,
        status: 'pending',
      },
    });

    return new NextResponse(
      `<!DOCTYPE html><html><body style="font-family:sans-serif;background:#0a0a0f;color:#e2e8f0;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
        <div style="text-align:center;background:#111118;padding:40px;border-radius:16px;border:1px solid #1e1e2e;">
          <h2 style="color:#6366f1;margin:0 0 12px;">⏰ Snoozed!</h2>
          <p style="color:#9ca3af;margin:0;">We'll remind you again in 1 week.</p>
        </div>
      </body></html>`,
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    );
  } catch (error) {
    console.error('Snooze error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
