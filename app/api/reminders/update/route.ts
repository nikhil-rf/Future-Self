import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Reminder from '@/models/Reminder';
import { buildReminderSchedule } from '@/lib/reminderSchedule';

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, ...updates } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Reminder ID is required' }, { status: 400 });
    }

    await dbConnect();

    const userId = (session.user as { id?: string }).id;

    let payload: Record<string, unknown> = { ...updates };
    if (updates.reminderDate != null) {
      const existing = await Reminder.findOne({ _id: id, userId }).lean();
      if (!existing || Array.isArray(existing)) {
        return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
      }
      const reminderDateObj = new Date(updates.reminderDate);
      payload.reminderDate = reminderDateObj;
      payload.schedule = buildReminderSchedule(
        new Date(existing.createdAt as Date),
        reminderDateObj
      );
    }

    const reminder = await Reminder.findOneAndUpdate(
      { _id: id, userId },
      { $set: payload },
      { new: true }
    );

    if (!reminder) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, reminder });
  } catch (error) {
    console.error('Update reminder error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
