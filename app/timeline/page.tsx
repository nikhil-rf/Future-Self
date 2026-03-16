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
  High:   { bg: 'rgba(239,68,68,0.1)',  text: '#f87171', border: 'rgba(239,68,68,0.25)' },
  Medium: { bg: 'rgba(234,179,8,0.1)',  text: '#facc15', border: 'rgba(234,179,8,0.25)' },
  Low:    { bg: 'rgba(34,197,94,0.1)',  text: '#4ade80', border: 'rgba(34,197,94,0.25)' },
};

const tabIcons = ['schedule', 'mail', 'inventory_2'];

export default function TimelinePage() {
  const { status } = useSession();
  const router = useRouter();
  const [activeTab,  setActiveTab]  = useState(0);
  const [reminders,  setReminders]  = useState<Reminder[]>([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => { if (status === 'unauthenticated') router.push('/login'); }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    const statusMap = ['pending', 'delivered', 'archived'];
    const fetchReminders = async () => {
      setLoading(true);
      try {
        const res  = await fetch(`/api/reminders/list?status=${statusMap[activeTab]}`);
        const data = await res.json();
        setReminders(data.reminders || []);
      } catch { toast.error('Failed to load reminders'); }
      finally { setLoading(false); }
    };
    fetchReminders();
  }, [status, activeTab]);

  const updateStatus = async (id: string, newStatus: string) => {
    await fetch('/api/reminders/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
    setReminders((prev) => prev.filter((r) => r._id !== id));
    toast.success(newStatus === 'archived' ? 'Archived' : 'Done');
  };

  const deleteReminder = async (id: string) => {
    if (!confirm('Permanently delete this reminder?')) return;
    await fetch('/api/reminders/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'archived' }),
    });
    setReminders((prev) => prev.filter((r) => r._id !== id));
    toast.success('Deleted');
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main animate-fade-in">
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.03em', color: '#f0eded' }}>
            Timeline
          </h1>
          <p style={{ color: '#7a7676', fontSize: '14px', margin: 0 }}>All your reminders across time.</p>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            background: '#1e1d1d',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid #2c2a2a',
            marginBottom: '32px',
            width: 'fit-content',
          }}
        >
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500,
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                background: activeTab === i ? '#2c2a2a' : 'transparent',
                color: activeTab === i ? '#f0eded' : '#7a7676',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: activeTab === i ? "'FILL' 1" : "'FILL' 0" }}>
                {tabIcons[i]}
              </span>
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ color: '#7a7676', padding: '60px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#4b2bee', animation: 'spin 1.2s linear infinite' }}>refresh</span>
            <p style={{ margin: 0 }}>Loading...</p>
          </div>
        ) : reminders.length === 0 ? (
          <div className="empty-state">
            <span className="material-symbols-outlined empty-icon" style={{ color: '#4a4848' }}>
              {activeTab === 0 ? 'calendar_today' : activeTab === 1 ? 'mail' : 'inventory_2'}
            </span>
            <p>
              {activeTab === 0 ? 'No scheduled reminders.' : activeTab === 1 ? 'No delivered reminders yet.' : 'No archived reminders.'}
            </p>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            {/* Timeline vertical line */}
            {activeTab === 0 && (
              <div style={{ position: 'absolute', left: '21px', top: '28px', bottom: '28px', width: '2px', background: 'linear-gradient(to bottom, rgba(75,43,238,0.6), transparent)', borderRadius: '2px' }} />
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {reminders.map((r) => {
                const imp = importanceColors[r.importance] || importanceColors.Medium;
                return (
                  <div key={r._id} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    {/* Timeline dot */}
                    {activeTab === 0 && (
                      <div style={{ width: '44px', flexShrink: 0, display: 'flex', justifyContent: 'center', paddingTop: '22px', zIndex: 1 }}>
                        <div className="timeline-dot" />
                      </div>
                    )}

                    <div
                      style={{
                        flex: 1,
                        background: activeTab === 2 ? 'rgba(30,29,29,0.5)' : '#1e1d1d',
                        border: '1px solid #2c2a2a',
                        borderRadius: '14px',
                        padding: '18px 20px',
                        opacity: activeTab === 2 ? 0.65 : 1,
                        transition: 'border-color 0.2s',
                      }}
                      onMouseEnter={(e) => { if (activeTab !== 2) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(75,43,238,0.2)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#2c2a2a'; }}
                    >
                      {/* Card header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '7px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span
                            style={{
                              background: imp.bg, color: imp.text, border: `1px solid ${imp.border}`,
                              padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                            }}
                          >
                            {r.importance}
                          </span>
                          {activeTab === 1 && (
                            <span style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                              ✓ Delivered
                            </span>
                          )}
                        </div>
                        <span style={{ color: '#7a7676', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>calendar_today</span>
                          {activeTab === 1 && r.deliveredAt
                            ? format(new Date(r.deliveredAt), 'MMM d, yyyy')
                            : format(new Date(r.reminderDate), 'MMM d, yyyy · h:mm a')}
                        </span>
                      </div>

                      {/* Note */}
                      <p style={{ color: '#c8c4c4', fontSize: '14px', lineHeight: 1.7, margin: '0 0 12px' }}>{r.note}</p>

                      {/* AI Nudge */}
                      {r.nudgeMessage && activeTab === 1 && (
                        <div style={{ background: 'rgba(75,43,238,0.05)', border: '1px solid rgba(75,43,238,0.15)', borderRadius: '10px', padding: '12px 14px', marginBottom: '12px' }}>
                          <p style={{ color: '#a78bfa', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '13px', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                            AI Nudge
                          </p>
                          <p style={{ color: '#9c9898', fontSize: '13px', lineHeight: 1.65, margin: 0 }}>{r.nudgeMessage}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {activeTab === 1 && (
                          <>
                            <button
                              onClick={() => updateStatus(r._id, 'archived')}
                              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.08)', color: '#10b981', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                              Mark Done
                            </button>
                            <button
                              onClick={() => updateStatus(r._id, 'archived')}
                              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '8px', border: '1px solid #2c2a2a', background: 'transparent', color: '#7a7676', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>archive</span>
                              Archive
                            </button>
                          </>
                        )}
                        {activeTab === 0 && (
                          <button
                            onClick={() => updateStatus(r._id, 'archived')}
                            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '8px', border: '1px solid #2c2a2a', background: 'transparent', color: '#7a7676', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>archive</span>
                            Archive
                          </button>
                        )}
                        {activeTab === 2 && (
                          <button
                            onClick={() => deleteReminder(r._id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#f87171', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>delete</span>
                            Delete
                          </button>
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
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
