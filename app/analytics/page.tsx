'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import StatsCard from '@/components/StatsCard';
import Charts from '@/components/Charts';
import toast from 'react-hot-toast';

interface AnalyticsData {
  stats: { total: number; deliveredThisMonth: number; completionRate: number; streak: number };
  monthlyData: { month: string; count: number }[];
  completionTrend: { month: string; rate: number }[];
  importanceBreakdown: { name: string; value: number }[];
  insights: string[];
}

export default function AnalyticsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (status === 'unauthenticated') router.push('/login'); }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/analytics/stats')
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, [status]);

  if (loading || !data) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <main style={{ marginLeft: '240px', flex: 1, padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: '#6b7280' }}>Loading analytics...</div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f' }}>
      <Sidebar />
      <main style={{ marginLeft: '240px', flex: 1, padding: '40px', maxWidth: 'calc(100vw - 240px)', overflowX: 'hidden' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.03em' }}>Growth Overview 📈</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 36px' }}>
          Quantifying the connection between your present actions and future aspirations.
        </p>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '36px' }}>
          <StatsCard icon="📝" label="Total Reminders" value={data.stats.total} sub="All time" color="#6366f1" />
          <StatsCard icon="📬" label="Delivered This Month" value={data.stats.deliveredThisMonth} sub="Current month" color="#10b981" />
          <StatsCard icon="✅" label="Completion Rate" value={`${data.stats.completionRate}%`} sub="Overall" color="#a78bfa" />
          <StatsCard icon="🔥" label="Streak" value={data.stats.streak} sub="Active days" color="#f59e0b" />
        </div>

        {/* Charts */}
        <div style={{ marginBottom: '36px' }}>
          <Charts
            monthlyData={data.monthlyData}
            completionTrend={data.completionTrend}
            importanceBreakdown={data.importanceBreakdown}
          />
        </div>

        {/* Insights */}
        {data.insights.length > 0 && (
          <div style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: '14px', padding: '28px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              💡 Insights
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data.insights.map((insight, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px', background: '#0f0f1a', border: '1px solid #1e1e2e', borderRadius: '10px' }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>✨</span>
                  <p style={{ color: '#d1d5db', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{insight}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
