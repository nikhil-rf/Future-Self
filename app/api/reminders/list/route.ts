import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Reminder from '@/models/Reminder';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    await dbConnect();

    const userId = (session.user as { id?: string }).id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = { userId };
    if (status) query.status = status;

    let reminderQuery = Reminder.find(query).sort({ reminderDate: 1 });
    if (limit) reminderQuery = reminderQuery.limit(parseInt(limit));

    const reminders = await reminderQuery.lean();
    return NextResponse.json({ reminders });
  } catch (error) {
    console.error('List reminders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
