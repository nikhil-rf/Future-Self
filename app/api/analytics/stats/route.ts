import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Reminder from '@/models/Reminder';
import { startOfMonth, subMonths, format } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const userId = (session.user as { id?: string }).id;
    const allReminders = await Reminder.find({ userId }).lean();

    const now = new Date();
    const startOfThisMonth = startOfMonth(now);

    // Basic stats
    const total = allReminders.length;
    const deliveredThisMonth = allReminders.filter(
      (r) => r.status === 'delivered' && r.deliveredAt && new Date(r.deliveredAt) >= startOfThisMonth
    ).length;
    const delivered = allReminders.filter((r) => r.status === 'delivered' || r.status === 'archived').length;
    const completionRate = total > 0 ? Math.round((delivered / total) * 100) : 0;

    // Monthly breakdown (last 6 months)
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const d = subMonths(now, 5 - i);
      const monthStart = startOfMonth(d);
      const monthEnd = startOfMonth(subMonths(d, -1));
      const count = allReminders.filter(
        (r) => new Date(r.createdAt) >= monthStart && new Date(r.createdAt) < monthEnd
      ).length;
      return { month: format(d, 'MMM'), count };
    });

    // Importance breakdown
    const importanceBreakdown = ['High', 'Medium', 'Low'].map((imp) => ({
      name: imp,
      value: allReminders.filter((r) => r.importance === imp).length,
    }));

    // Completion trend (last 6 months)
    const completionTrend = Array.from({ length: 6 }, (_, i) => {
      const d = subMonths(now, 5 - i);
      const monthStart = startOfMonth(d);
      const monthEnd = startOfMonth(subMonths(d, -1));
      const created = allReminders.filter(
        (r) => new Date(r.createdAt) >= monthStart && new Date(r.createdAt) < monthEnd
      ).length;
      const done = allReminders.filter(
        (r) =>
          (r.status === 'delivered' || r.status === 'archived') &&
          r.deliveredAt &&
          new Date(r.deliveredAt) >= monthStart &&
          new Date(r.deliveredAt) < monthEnd
      ).length;
      return { month: format(d, 'MMM'), rate: created > 0 ? Math.round((done / created) * 100) : 0 };
    });

    // Insights
    const highCompletion =
      allReminders.filter((r) => r.importance === 'High' && r.status !== 'pending').length;
    const highTotal = allReminders.filter((r) => r.importance === 'High').length;

    const insights = [];
    if (highTotal > 0 && highCompletion / highTotal > 0.7) {
      insights.push('You follow through most on High importance reminders ✅');
    }
    if (total === 0) {
      insights.push('Create your first reminder to start seeing insights.');
    } else if (completionRate > 70) {
      insights.push(`You have an impressive ${completionRate}% completion rate — keep it up!`);
    }

    return NextResponse.json({
      stats: { total, deliveredThisMonth, completionRate, streak: Math.min(allReminders.length, 7) },
      monthlyData,
      importanceBreakdown,
      completionTrend,
      insights,
    });
  } catch (error) {
    console.error('Analytics stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
