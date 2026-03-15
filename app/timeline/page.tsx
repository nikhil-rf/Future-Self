'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
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
  createdAt: string;
}

const tabs = ['Scheduled', 'Delivered', 'Archived'];

const importanceColors: Record<string, { bg: string; text: string; border: string }> = {
  High: { bg: 'rgba(239,68,68,0.1)', text: '#f87171', border: 'rgba(239,68,68,0.25)' },
  Medium: { bg: 'rgba(234,179,8,0.1)', text: '#facc15', border: 'rgba(234,179,8,0.25)' },
  Low: { bg: 'rgba(34,197,94,0.1)', text: '#4ade80', border: 'rgba(34,197,94,0.25)' },
};

export default function TimelinePage() {
  const { status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (status === 'unauthenticated') router.push('/login'); }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    const statusMap = ['pending', 'delivered', 'archived'];
    const fetchReminders = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/reminders/list?status=${statusMap[activeTab]}`);
        const data = await res.json();
        setReminders(data.reminders || []);
      } catch { toast.error('Failed to load reminders'); }
      finally { setLoading(false); }
    };
    fetchReminders();
  }, [status, activeTab]);

  const updateStatus = async (id: string, newStatus: string) => {
    await fetch('/api/reminders/update', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: newStatus }) });
    setReminders((prev) => prev.filter((r) => r._id !== id));
    toast.success(newStatus === 'archived' ? 'Archived' : 'Done');
  };

  const deleteReminder = async (id: string) => {
    if (!confirm('Permanently delete this reminder?')) return;
    await fetch('/api/reminders/update', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'archived' }) });
    setReminders((prev) => prev.filter((r) => r._id !== id));
    toast.success('Deleted');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f' }}>
      <Sidebar />
      <main style={{ marginLeft: '240px', flex: 1, padding: '40px', maxWidth: 'calc(100vw - 240px)', overflowX: 'hidden' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.03em' }}>Timeline 📅</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 32px' }}>All your reminders across time.</p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', background: '#111118', padding: '4px', borderRadius: '12px', border: '1px solid #1e1e2e', marginBottom: '32px', width: 'fit-content' }}>
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                background: activeTab === i ? '#1e1e2e' : 'transparent',
                color: activeTab === i ? '#e2e8f0' : '#6b7280',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ color: '#6b7280', padding: '40px', textAlign: 'center' }}>Loading...</div>
        ) : reminders.length === 0 ? (
          <div style={{ background: '#111118', border: '1px dashed #1e1e2e', borderRadius: '14px', padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>
              {activeTab === 0 ? '🗓️' : activeTab === 1 ? '📬' : '🗃️'}
            </div>
            <p style={{ color: '#6b7280', fontSize: '15px' }}>
              {activeTab === 0 ? 'No scheduled reminders.' : activeTab === 1 ? 'No delivered reminders yet.' : 'No archived reminders.'}
            </p>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            {/* Timeline line */}
            {activeTab === 0 && (
              <div style={{ position: 'absolute', left: '19px', top: '20px', bottom: '20px', width: '2px', background: 'linear-gradient(to bottom, #6366f1, transparent)', borderRadius: '2px' }} />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {reminders.map((r) => {
                const imp = importanceColors[r.importance] || importanceColors.Medium;
                return (
                  <div key={r._id} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    {/* Dot */}
                    {activeTab === 0 && (
                      <div style={{ width: '40px', flexShrink: 0, display: 'flex', justifyContent: 'center', paddingTop: '20px', zIndex: 1 }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6366f1', border: '2px solid #0a0a0f', boxShadow: '0 0 0 3px rgba(99,102,241,0.2)' }} />
                      </div>
                    )}
                    <div style={{ flex: 1, background: activeTab === 2 ? 'rgba(17,17,24,0.5)' : '#111118', border: '1px solid #1e1e2e', borderRadius: '14px', padding: '20px', opacity: activeTab === 2 ? 0.65 : 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ background: imp.bg, color: imp.text, border: `1px solid ${imp.border}`, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>{r.importance}</span>
                          {activeTab === 1 && <span style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>✅ Delivered</span>}
                        </div>
                        <span style={{ color: '#6b7280', fontSize: '12px' }}>
                          {activeTab === 1 && r.deliveredAt ? format(new Date(r.deliveredAt), 'MMM d, yyyy') : format(new Date(r.reminderDate), 'MMM d, yyyy · h:mm a')}
                        </span>
                      </div>
                      <p style={{ color: '#d1d5db', fontSize: '14px', lineHeight: 1.7, margin: '0 0 12px' }}>{r.note}</p>
                      {r.nudgeMessage && activeTab === 1 && (
                        <div style={{ background: '#0f0f1a', border: '1px solid #1e1e2e', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
                          <p style={{ color: '#a78bfa', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 6px' }}>AI Nudge</p>
                          <p style={{ color: '#9ca3af', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{r.nudgeMessage}</p>
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {activeTab === 1 && (
                          <>
                            <button onClick={() => updateStatus(r._id, 'archived')} style={{ padding: '6px 12px', borderRadius: '7px', border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.08)', color: '#10b981', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>✅ Mark Done</button>
                            <button onClick={() => updateStatus(r._id, 'archived')} style={{ padding: '6px 12px', borderRadius: '7px', border: '1px solid #1e1e2e', background: 'transparent', color: '#6b7280', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>🗄️ Archive</button>
                          </>
                        )}
                        {activeTab === 0 && (
                          <button onClick={() => updateStatus(r._id, 'archived')} style={{ padding: '6px 12px', borderRadius: '7px', border: '1px solid #1e1e2e', background: 'transparent', color: '#6b7280', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>🗄️ Archive</button>
                        )}
                        {activeTab === 2 && (
                          <button onClick={() => deleteReminder(r._id)} style={{ padding: '6px 12px', borderRadius: '7px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>🗑️ Delete</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
