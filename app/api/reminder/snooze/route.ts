import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Reminder from '@/models/Reminder';

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

    const newDate = new Date(reminder.reminderDate);
    newDate.setDate(newDate.getDate() + 7);

    await Reminder.findByIdAndUpdate(id, {
      $set: { reminderDate: newDate, status: 'pending' },
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
