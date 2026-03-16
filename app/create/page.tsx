'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import toast from 'react-hot-toast';

export default function CreatePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    note: '',
    reminderDate: '',
    importance: 'Medium',
    email: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (session?.user?.email) setForm((f) => ({ ...f, email: session.user?.email || '' }));
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.note.trim()) { toast.error('Please write a note'); return; }
    if (!form.reminderDate) { toast.error('Please select a reminder date'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/reminders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('Reminder set! 🔔');
      router.push('/dashboard');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create reminder');
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = form.reminderDate
    ? new Date(form.reminderDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main animate-fade-in">
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'rgba(75,43,238,0.12)',
                  border: '1px solid rgba(75,43,238,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <span className="material-symbols-outlined" style={{ color: '#a78bfa', fontVariationSettings: "'FILL' 0" }}>lock</span>
              </div>
              <div>
                <p style={{ color: '#7a7676', fontSize: '11px', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Encrypted Vault</p>
                <p style={{ color: '#4a4848', fontSize: '11px', margin: 0 }}>
                  {formattedDate ? `Securely encrypted until ${formattedDate}.` : 'Set a date to begin encryption.'}
                </p>
              </div>
            </div>
            <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 800, margin: '16px 0 6px', letterSpacing: '-0.03em', color: '#f0eded' }}>
              Create a Future Reminder
            </h1>
            <p style={{ color: '#7a7676', fontSize: '14px', margin: 0 }}>
              Write something to your future self. We&apos;ll deliver it at the right time.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Note */}
            <div style={{ background: '#1e1d1d', border: '1px solid #2c2a2a', borderRadius: '14px', padding: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9c9898', fontSize: '11px', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#a78bfa' }}>edit_note</span>
                Your Note
              </label>
              <textarea
                required
                rows={6}
                placeholder="Write a message to your future self... What context do you want to preserve? What do you want to remember?"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                style={{ resize: 'vertical', fontSize: '15px', lineHeight: 1.75, background: 'transparent', border: 'none', padding: '0', width: '100%', fontFamily: 'inherit', color: '#f0eded', outline: 'none' }}
              />
              <p style={{ color: '#4a4848', fontSize: '11px', margin: '10px 0 0', textAlign: 'right' }}>{form.note.length} characters</p>
            </div>

            {/* Date & Importance */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9c9898', fontSize: '11px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#a78bfa' }}>calendar_today</span>
                  Delivery Date &amp; Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={form.reminderDate}
                  onChange={(e) => setForm({ ...form, reminderDate: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9c9898', fontSize: '11px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#a78bfa' }}>priority_high</span>
                  Importance
                </label>
                <select
                  value={form.importance}
                  onChange={(e) => setForm({ ...form, importance: e.target.value })}
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9c9898', fontSize: '11px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#a78bfa' }}>alternate_email</span>
                Send Reminder To
              </label>
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* Preview */}
            <div
              style={{
                background: 'rgba(75,43,238,0.05)',
                border: '1px solid rgba(75,43,238,0.15)',
                borderRadius: '12px',
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#a78bfa', flexShrink: 0, marginTop: '1px', fontVariationSettings: "'FILL' 0" }}>auto_awesome</span>
              <p style={{ color: '#9c9898', fontSize: '13px', lineHeight: 1.65, margin: 0 }}>
                A personalized AI nudge will be emailed to{' '}
                <span style={{ color: '#c4b5fd', fontWeight: 600 }}>{form.email || 'your email'}</span>{' '}
                {formattedDate ? `on ${formattedDate}` : 'on your chosen date'}.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ justifyContent: 'center', fontSize: '15px', padding: '14px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>notifications</span>
              {loading ? 'Setting reminder...' : 'Set Reminder'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
