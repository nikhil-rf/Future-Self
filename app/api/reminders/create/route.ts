import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Reminder from '@/models/Reminder';
import { buildReminderSchedule } from '@/lib/reminderSchedule';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { note, reminderDate, importance, email } = await req.json();

    if (!note || !reminderDate || !email) {
      return NextResponse.json({ error: 'Note, reminder date, and email are required' }, { status: 400 });
    }

    await dbConnect();

    const userId = (session.user as { id?: string }).id;
    const createdAt = new Date();
    const reminderDateObj = new Date(reminderDate);
    const schedule = buildReminderSchedule(createdAt, reminderDateObj);

    const reminder = await Reminder.create({
      userId,
      note: note.trim(),
      reminderDate: reminderDateObj,
      importance: importance || 'Medium',
      email,
      status: 'pending',
      createdAt,
      schedule,
    });

    return NextResponse.json({ success: true, reminder }, { status: 201 });
  } catch (error) {
    console.error('Create reminder error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
