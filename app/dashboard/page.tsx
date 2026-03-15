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
  High: { bg: 'rgba(239,68,68,0.1)', text: '#f87171', border: 'rgba(239,68,68,0.25)' },
  Medium: { bg: 'rgba(234,179,8,0.1)', text: '#facc15', border: 'rgba(234,179,8,0.25)' },
  Low: { bg: 'rgba(34,197,94,0.1)', text: '#4ade80', border: 'rgba(34,197,94,0.25)' },
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [upcoming, setUpcoming] = useState<Reminder[]>([]);
  const [delivered, setDelivered] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

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
        const upData = await upRes.json();
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
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <main style={{ marginLeft: '240px', flex: 1, padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: '#6b7280', fontSize: '16px' }}>Loading...</div>
        </main>
      </div>
    );
  }

  const firstName = session?.user?.name?.split(' ')[0] || 'there';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f' }}>
      <Sidebar />
      <main style={{ marginLeft: '240px', flex: 1, padding: '40px', maxWidth: 'calc(100vw - 240px)', overflowX: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.03em' }}>
              Hello, {firstName} 👋
            </h1>
            <p style={{ color: '#6b7280', fontSize: '15px', margin: 0 }}>Here&apos;s what your future self is waiting for.</p>
          </div>
          <Link href="/create">
            <button className="btn-primary">
              <span>＋</span> Create Reminder
            </button>
          </Link>
        </div>

        {/* Upcoming Pipeline */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />
            Upcoming Pipeline
          </h2>

          {upcoming.length === 0 ? (
            <div style={{ background: '#111118', border: '1px dashed #1e1e2e', borderRadius: '14px', padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🕳️</div>
              <p style={{ color: '#6b7280', fontSize: '15px', margin: '0 0 16px' }}>No upcoming reminders. Create one now!</p>
              <Link href="/create"><button className="btn-primary" style={{ fontSize: '14px', padding: '10px 20px' }}>+ Create Reminder</button></Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {upcoming.map((r) => {
                const daysLeft = differenceInDays(new Date(r.reminderDate), new Date());
                const imp = importanceColors[r.importance] || importanceColors.Medium;
                return (
                  <div
                    key={r._id}
                    style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: '14px', padding: '20px', transition: 'transform 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.4)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ background: imp.bg, color: imp.text, border: `1px solid ${imp.border}`, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                        {r.importance}
                      </span>
                      <span style={{ background: daysLeft < 0 ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)', color: daysLeft < 0 ? '#f87171' : '#a5b4fc', border: `1px solid ${daysLeft < 0 ? 'rgba(239,68,68,0.2)' : 'rgba(99,102,241,0.2)'}`, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                        {daysLeft < 0 ? 'overdue' : daysLeft === 0 ? 'today' : `in ${daysLeft}d`}
                      </span>
                    </div>
                    <p style={{ color: '#d1d5db', fontSize: '14px', lineHeight: 1.6, margin: '0 0 10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      📝 {r.note}
                    </p>
                    <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>📅 {format(new Date(r.reminderDate), 'MMM d, yyyy · h:mm a')}</p>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Recent Time Capsules */}
        <section>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            Recent Time Capsules
          </h2>

          {delivered.length === 0 ? (
            <div style={{ background: '#111118', border: '1px dashed #1e1e2e', borderRadius: '14px', padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📪</div>
              <p style={{ color: '#6b7280', fontSize: '15px', margin: 0 }}>No delivered reminders yet. They&apos;ll appear here once sent.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {delivered.map((r) => (
                <div key={r._id} style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: '14px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>✅ Delivered</span>
                    {r.deliveredAt && <span style={{ color: '#6b7280', fontSize: '12px' }}>{format(new Date(r.deliveredAt), 'MMM d')}</span>}
                  </div>
                  <p style={{ color: '#d1d5db', fontSize: '14px', lineHeight: 1.6, margin: '0 0 16px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {r.note}
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleArchive(r._id)}
                      style={{ padding: '6px 12px', borderRadius: '7px', border: '1px solid #1e1e2e', background: 'transparent', color: '#6b7280', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      🗄️ Archive
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
