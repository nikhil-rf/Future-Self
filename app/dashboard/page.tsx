'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format, differenceInDays } from 'date-fns';
import Sidebar from '@/components/Sidebar';
import toast from 'react-hot-toast';

interface Reminder {
  _id: string;
  note: string;
  reminderDate: string;
  importance: 'High' | 'Medium' | 'Low';
  status: string;
  nudgeMessage?: string;
  deliveredAt?: string;
}

const importanceColors: Record<string, { bg: string; text: string; border: string }> = {
  High:   { bg: 'rgba(239,68,68,0.1)',  text: '#f87171', border: 'rgba(239,68,68,0.25)' },
  Medium: { bg: 'rgba(234,179,8,0.1)',  text: '#facc15', border: 'rgba(234,179,8,0.25)' },
  Low:    { bg: 'rgba(34,197,94,0.1)',  text: '#4ade80', border: 'rgba(34,197,94,0.25)' },
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [upcoming,  setUpcoming]  = useState<Reminder[]>([]);
  const [delivered, setDelivered] = useState<Reminder[]>([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    const fetchData = async () => {
      try {
        const [upRes, delRes] = await Promise.all([
          fetch('/api/reminders/list?status=pending&limit=5'),
          fetch('/api/reminders/list?status=delivered&limit=5'),
        ]);
        const upData  = await upRes.json();
        const delData = await delRes.json();
        setUpcoming(upData.reminders || []);
        setDelivered(delData.reminders || []);
      } catch {
        toast.error('Failed to load reminders');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [status]);

  const handleArchive = async (id: string) => {
    await fetch('/api/reminders/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'archived' }),
    });
    setDelivered((prev) => prev.filter((r) => r._id !== id));
    toast.success('Archived');
  };

  if (status === 'loading' || loading) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="app-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '36px', color: '#4b2bee', animation: 'spin 1.2s linear infinite' }}>refresh</span>
            <p style={{ color: '#7a7676', fontSize: '14px' }}>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  const firstName = session?.user?.name?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main animate-fade-in">

        {/* ── Header ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '36px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 'clamp(24px, 4vw, 34px)',
                fontWeight: 800,
                margin: '0 0 6px',
                letterSpacing: '-0.03em',
                color: '#f0eded',
              }}
            >
              {greeting}, {firstName}.
            </h1>
            <p style={{ color: '#7a7676', fontSize: '14px', margin: 0 }}>
              Ready to think ahead? Your future self is waiting.
            </p>
          </div>
          <Link href="/create">
            <button className="btn-primary">
              <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>add_circle</span>
              Create Reminder
            </button>
          </Link>
        </div>

        {/* ── Quick stats ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {[
            { label: 'Pending Delivery', value: upcoming.length, icon: 'schedule', color: '#a78bfa' },
            { label: 'Messages Received', value: delivered.length, icon: 'mail', color: '#10b981' },
          ].map((s) => (
            <div key={s.label} className="stat-box">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="material-symbols-outlined" style={{ color: s.color, fontSize: '22px', fontVariationSettings: "'FILL' 0" }}>{s.icon}</span>
              </div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Upcoming Pipeline ── */}
        <section style={{ marginBottom: '48px' }}>
          <h2 className="section-title">
            <span className="section-dot" />
            Upcoming Pipeline
          </h2>

          {upcoming.length === 0 ? (
            <div className="empty-state">
              <span className="material-symbols-outlined empty-icon" style={{ color: '#4a4848' }}>inbox</span>
              <p>No upcoming reminders. Create one now!</p>
              <Link href="/create">
                <button className="btn-primary" style={{ fontSize: '13px', padding: '10px 20px', marginTop: '4px' }}>
                  + Create Reminder
                </button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '16px' }}>
              {upcoming.map((r) => {
                const daysLeft = differenceInDays(new Date(r.reminderDate), new Date());
                const imp = importanceColors[r.importance] || importanceColors.Medium;
                return (
                  <div
                    key={r._id}
                    style={{
                      background: '#1e1d1d',
                      border: '1px solid #2c2a2a',
                      borderRadius: '14px',
                      padding: '20px',
                      transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.35)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(75,43,238,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                      (e.currentTarget as HTMLElement).style.borderColor = '#2c2a2a';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ background: imp.bg, color: imp.text, border: `1px solid ${imp.border}`, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                        {r.importance}
                      </span>
                      <span
                        style={{
                          background: daysLeft < 0 ? 'rgba(239,68,68,0.1)' : 'rgba(75,43,238,0.1)',
                          color: daysLeft < 0 ? '#f87171' : '#a78bfa',
                          border: `1px solid ${daysLeft < 0 ? 'rgba(239,68,68,0.2)' : 'rgba(75,43,238,0.2)'}`,
                          padding: '3px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        {daysLeft < 0 ? 'overdue' : daysLeft === 0 ? 'today' : `in ${daysLeft}d`}
                      </span>
                    </div>
                    <p style={{ color: '#c8c4c4', fontSize: '14px', lineHeight: 1.65, margin: '0 0 12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {r.note}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7a7676', fontSize: '12px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>calendar_today</span>
                      {format(new Date(r.reminderDate), 'MMM d, yyyy · h:mm a')}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Recent Time Capsules ── */}
        <section>
          <h2 className="section-title">
            <span className="section-dot" style={{ background: '#10b981' }} />
            Recent Time Capsules
          </h2>

          {delivered.length === 0 ? (
            <div className="empty-state">
              <span className="material-symbols-outlined empty-icon" style={{ color: '#4a4848' }}>mail</span>
              <p>No delivered reminders yet. They&apos;ll appear here once sent.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '16px' }}>
              {delivered.map((r) => (
                <div
                  key={r._id}
                  style={{ background: '#1e1d1d', border: '1px solid #2c2a2a', borderRadius: '14px', padding: '20px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                      ✓ Delivered
                    </span>
                    {r.deliveredAt && (
                      <span style={{ color: '#7a7676', fontSize: '12px' }}>{format(new Date(r.deliveredAt), 'MMM d')}</span>
                    )}
                  </div>
                  <p style={{ color: '#c8c4c4', fontSize: '14px', lineHeight: 1.65, margin: '0 0 16px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {r.note}
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleArchive(r._id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', border: '1px solid #2c2a2a', background: 'transparent', color: '#7a7676', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#4a4848'; (e.currentTarget as HTMLElement).style.color = '#9c9898'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#2c2a2a'; (e.currentTarget as HTMLElement).style.color = '#7a7676'; }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>archive</span>
                      Archive
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
