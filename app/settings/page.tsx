'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>('general');

  // Notification toggles – UI only, no backend
  const [notifs, setNotifs] = useState({
    onDelivery: true,
    weeklyNudge: true,
    updates: false,
  });

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [status, session, router]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) { toast.error('Passwords do not match'); return; }
    if (passwords.newPass.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPass }),
      });
      if (!res.ok) throw new Error('Failed to change password');
      toast.success('Password changed!');
      setPasswords({ current: '', newPass: '', confirm: '' });
    } catch {
      toast.error('Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAllReminders = async () => {
    if (!confirm('Delete ALL your reminders? This cannot be undone.')) return;
    try {
      const res = await fetch('/api/user/delete-reminders', { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('All reminders deleted.');
    } catch { toast.error('Failed to delete reminders'); }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Delete your account and all data? This is permanent.')) return;
    try {
      const res = await fetch('/api/user/delete-account', { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Account deleted. Goodbye!');
      const { signOut } = await import('next-auth/react');
      await signOut({ callbackUrl: '/' });
    } catch { toast.error('Failed to delete account'); }
  };

  const navSections = [
    { id: 'general',  icon: 'tune',          label: 'General Preferences' },
    { id: 'notifs',   icon: 'notifications', label: 'Notification Strategy' },
    { id: 'identity', icon: 'person',        label: 'Personal Identity' },
    { id: 'danger',   icon: 'warning',       label: 'Deactivate Account' },
  ];

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      style={{
        width: '44px', height: '24px', borderRadius: '12px', border: 'none',
        background: value ? 'var(--accent)' : '#2c2a2a',
        cursor: 'pointer', transition: 'background 0.2s', position: 'relative', flexShrink: 0,
      }}
      aria-checked={value}
      role="switch"
    >
      <span style={{
        position: 'absolute', top: '3px', left: value ? '23px' : '3px',
        width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s', display: 'block',
      }} />
    </button>
  );

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main animate-fade-in">

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.03em', color: '#f0eded' }}>
            Account Settings
          </h1>
          <p style={{ color: '#7a7676', fontSize: '14px', margin: 0 }}>
            Customize your journey and fine-tune your future connections.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: '24px' }}>

          {/* ── Section nav pills ── */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {navSections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(activeSection === s.id ? null : s.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 14px', borderRadius: '8px', border: '1px solid',
                  borderColor: activeSection === s.id ? 'rgba(75,43,238,0.35)' : '#2c2a2a',
                  background: activeSection === s.id ? 'rgba(75,43,238,0.1)' : '#1e1d1d',
                  color: activeSection === s.id ? '#c4b5fd' : '#7a7676',
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: activeSection === s.id ? "'FILL' 1" : "'FILL' 0" }}>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>

          {/* ── General Preferences ── */}
          {activeSection === 'general' && (
            <div className="section-card">
              <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px', color: '#f0eded', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#a78bfa', fontVariationSettings: "'FILL' 0" }}>tune</span>
                General Preferences
              </h2>
              <p style={{ color: '#7a7676', fontSize: '13px', margin: '0 0 20px' }}>Delivery schedules sync with your local clock. Set the aesthetic tone for your reflection space.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Timezone', value: Intl.DateTimeFormat().resolvedOptions().timeZone },
                  { label: 'Theme', value: 'Refined Charcoal (Dark)' },
                  { label: 'Language', value: 'English (US)' },
                ].map((row) => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #252323' }}>
                    <span style={{ color: '#9c9898', fontSize: '13px' }}>{row.label}</span>
                    <span style={{ color: '#f0eded', fontSize: '13px', fontWeight: 500 }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Notification Strategy ── */}
          {activeSection === 'notifs' && (
            <div className="section-card">
              <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px', color: '#f0eded', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#a78bfa', fontVariationSettings: "'FILL' 0" }}>notifications</span>
                Notification Strategy
              </h2>
              <p style={{ color: '#7a7676', fontSize: '13px', margin: '0 0 20px' }}>Control how and when FutureSelf reaches you.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {[
                  { key: 'onDelivery' as const, label: 'Reminder Delivery',    desc: 'Immediate notification when a message from the past arrives.' },
                  { key: 'weeklyNudge' as const, label: 'Weekly Reflection',   desc: 'Weekly gentle reminders to pause and document your present self.' },
                  { key: 'updates' as const,     label: 'Platform Updates',    desc: 'Occasional updates on new features and improvements.' },
                ].map((item) => (
                  <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #252323' }}>
                    <div>
                      <p style={{ color: '#f0eded', fontSize: '14px', fontWeight: 500, margin: '0 0 3px' }}>{item.label}</p>
                      <p style={{ color: '#7a7676', fontSize: '12px', margin: 0 }}>{item.desc}</p>
                    </div>
                    <Toggle value={notifs[item.key]} onChange={() => setNotifs((n) => ({ ...n, [item.key]: !n[item.key] }))} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Personal Identity ── */}
          {activeSection === 'identity' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Profile form */}
              <div className="section-card">
                <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 18px', color: '#f0eded', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#a78bfa', fontVariationSettings: "'FILL' 0" }}>person</span>
                  Profile
                </h2>
                <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#9c9898', fontSize: '11px', fontWeight: 700, marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Display Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#9c9898', fontSize: '11px', fontWeight: 700, marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
                  </div>
                  <button type="submit" disabled={saving} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>

              {/* Password form */}
              <div className="section-card">
                <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 4px', color: '#f0eded', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#a78bfa', fontVariationSettings: "'FILL' 0" }}>lock</span>
                  Update Security Password
                </h2>
                <p style={{ color: '#7a7676', fontSize: '12px', margin: '0 0 18px' }}>Min. 6 characters required.</p>
                <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { label: 'Current Password', key: 'current' as const, ph: 'Current password' },
                    { label: 'New Password',     key: 'newPass' as const, ph: 'Min. 6 characters' },
                    { label: 'Confirm Password', key: 'confirm' as const, ph: 'Repeat new password' },
                  ].map((f) => (
                    <div key={f.key}>
                      <label style={{ display: 'block', color: '#9c9898', fontSize: '11px', fontWeight: 700, marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.label}</label>
                      <input type="password" value={passwords[f.key]} onChange={(e) => setPasswords({ ...passwords, [f.key]: e.target.value })} placeholder={f.ph} />
                    </div>
                  ))}
                  <button type="submit" disabled={saving} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                    {saving ? 'Changing...' : 'Change Password'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ── Danger Zone ── */}
          {activeSection === 'danger' && (
            <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: '14px', padding: '24px 28px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#f87171', fontVariationSettings: "'FILL' 1" }}>warning</span>
                Deactivate Account
              </h2>
              <p style={{ color: '#7a7676', fontSize: '13px', margin: '0 0 4px' }}>
                This action is irreversible. All letters to your future self will be permanently deleted from our encrypted vault.
              </p>
              <p style={{ color: '#4a4848', fontSize: '12px', margin: '0 0 22px' }}>FutureSelf © 2024 · Mindful Tech Group</p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleDeleteAllReminders}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#f87171', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500, transition: 'all 0.2s' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete_sweep</span>
                  Delete All Reminders
                </button>
                <button
                  onClick={handleDeleteAccount}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.5)', background: 'rgba(239,68,68,0.14)', color: '#f87171', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, transition: 'all 0.2s' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>no_accounts</span>
                  Delete Account
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
