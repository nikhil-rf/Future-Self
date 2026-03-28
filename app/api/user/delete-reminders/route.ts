import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Reminder from '@/models/Reminder';

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = (session.user as { id?: string }).id;
    await dbConnect();
    await Reminder.deleteMany({ userId });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete reminders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
