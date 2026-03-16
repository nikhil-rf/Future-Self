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
  const [data,    setData]    = useState<AnalyticsData | null>(null);
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
      <div className="app-layout">
        <Sidebar />
        <main className="app-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '36px', color: '#4b2bee', animation: 'spin 1.2s linear infinite' }}>refresh</span>
            <p style={{ color: '#7a7676', fontSize: '14px' }}>Loading analytics...</p>
          </div>
        </main>
      </div>
    );
  }

  const statsList = [
    { icon: 'confirmation_number', label: 'Reminders Sent',      value: data.stats.total,              sub: 'All time',       color: '#a78bfa' },
    { icon: 'task_alt',            label: 'Completion Rate',      value: `${data.stats.completionRate}%`, sub: 'Overall',       color: '#10b981' },
    { icon: 'self_improvement',    label: 'Habits Sustained',     value: data.stats.deliveredThisMonth, sub: 'This month',    color: '#f59e0b' },
    { icon: 'forward_to_inbox',    label: 'Follow-ups',           value: data.stats.streak,             sub: 'Active streak', color: '#60a5fa' },
  ];

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main animate-fade-in">

        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.03em', color: '#f0eded' }}>
            Growth Overview
          </h1>
          <p style={{ color: '#7a7676', fontSize: '14px', margin: 0 }}>
            Quantifying the connection between your present actions and future aspirations.
          </p>
        </div>

        {/* Stat boxes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '36px' }}>
          {statsList.map((s) => (
            <div key={s.label} className="stat-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: s.color, fontVariationSettings: "'FILL' 0" }}>{s.icon}</span>
              </div>
              <div className="stat-value" style={{ fontSize: '28px', color: s.color }}>{s.value}</div>
              <div className="stat-label" style={{ color: '#9c9898' }}>{s.label}</div>
              <div style={{ fontSize: '11px', color: '#4a4848', marginTop: '2px' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Charts — unchanged component */}
        <div
          style={{
            background: '#1e1d1d',
            border: '1px solid #2c2a2a',
            borderRadius: '14px',
            padding: '24px',
            marginBottom: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px', color: '#f0eded' }}>Consistency Trends</h2>
              <p style={{ color: '#7a7676', fontSize: '12px', margin: 0 }}>Year-to-date data insights</p>
            </div>
            <span style={{ color: '#7a7676', fontSize: '12px', fontStyle: 'italic' }}>
              &ldquo;The future depends on what you do today.&rdquo;
            </span>
          </div>
          <Charts
            monthlyData={data.monthlyData}
            completionTrend={data.completionTrend}
            importanceBreakdown={data.importanceBreakdown}
          />
        </div>

        {/* Legacy StatsCard component (kept for any external use) */}
        <div style={{ display: 'none' }}>
          <StatsCard icon="📝" label="Total Reminders" value={data.stats.total} sub="All time" color="#6366f1" />
        </div>

        {/* Insights */}
        {data.insights.length > 0 && (
          <div style={{ background: '#1e1d1d', border: '1px solid #2c2a2a', borderRadius: '14px', padding: '24px' }}>
            <h2 className="section-title" style={{ marginBottom: '16px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#f59e0b', fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
              Insights
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.insights.map((insight, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px',
                    background: '#252323',
                    border: '1px solid #2c2a2a',
                    borderRadius: '10px',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#a78bfa', flexShrink: 0, fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  <p style={{ color: '#c8c4c4', fontSize: '14px', lineHeight: 1.65, margin: 0 }}>{insight}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
