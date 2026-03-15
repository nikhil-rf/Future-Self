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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f' }}>
      <Sidebar />
      <main style={{ marginLeft: '240px', flex: 1, padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.03em' }}>Create a Reminder 🔔</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 36px' }}>Write something to your future self. We&apos;ll deliver it at the right time.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Note */}
            <div>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: '13px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                📝 Your Note
              </label>
              <textarea
                required
                rows={6}
                placeholder="Write a message to your future self... What context do you want to preserve? What do you want to remember?"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                style={{ width: '100%', resize: 'vertical', fontSize: '15px', lineHeight: 1.7 }}
              />
              <p style={{ color: '#4b5563', fontSize: '12px', margin: '6px 0 0' }}>{form.note.length} characters</p>
            </div>

            {/* Date & Importance */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '13px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  📅 Reminder Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={form.reminderDate}
                  onChange={(e) => setForm({ ...form, reminderDate: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '13px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  🔥 Importance
                </label>
                <select
                  value={form.importance}
                  onChange={(e) => setForm({ ...form, importance: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="High">🔴 High</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Low">🟢 Low</option>
                </select>
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: '13px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                📧 Send Reminder To
              </label>
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>

            {/* Preview */}
            <div style={{ background: '#0f0f1a', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '20px' }}>
              <p style={{ color: '#6b7280', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 10px' }}>Preview</p>
              <p style={{ color: '#9ca3af', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                A personalized AI nudge will be emailed to <span style={{ color: '#a5b4fc' }}>{form.email || 'your email'}</span>{' '}
                {form.reminderDate ? `on ${new Date(form.reminderDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : 'on your chosen date'}.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ justifyContent: 'center', fontSize: '16px', padding: '14px', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Setting reminder...' : 'Set Reminder 🔔'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
