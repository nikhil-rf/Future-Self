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

  const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: '14px', padding: '28px', marginBottom: '24px' }}>
      <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 20px', color: '#e2e8f0' }}>{title}</h2>
      {children}
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f' }}>
      <Sidebar />
      <main style={{ marginLeft: '240px', flex: 1, padding: '40px', maxWidth: '700px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.03em' }}>Settings ⚙️</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 36px' }}>Manage your account and preferences.</p>

        {/* Profile */}
        <SectionCard title="Profile">
          <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Display Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%' }} placeholder="Your name" />
            </div>
            <div>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%' }} placeholder="your@email.com" />
            </div>
            <button type="submit" disabled={saving} className="btn-primary" style={{ alignSelf: 'flex-start', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </SectionCard>

        {/* Password */}
        <SectionCard title="Change Password">
          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Current Password</label>
              <input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} style={{ width: '100%' }} placeholder="Current password" />
            </div>
            <div>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>New Password</label>
              <input type="password" value={passwords.newPass} onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })} style={{ width: '100%' }} placeholder="Min. 6 characters" />
            </div>
            <div>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Confirm New Password</label>
              <input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} style={{ width: '100%' }} placeholder="Repeat new password" />
            </div>
            <button type="submit" disabled={saving} className="btn-primary" style={{ alignSelf: 'flex-start', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </SectionCard>

        {/* Danger Zone */}
        <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '14px', padding: '28px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px', color: '#f87171' }}>⚠️ Danger Zone</h2>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 20px' }}>These actions are permanent and cannot be undone.</p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={handleDeleteAllReminders}
              style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#f87171', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}
            >
              🗑️ Delete All Reminders
            </button>
            <button
              onClick={handleDeleteAccount}
              style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.5)', background: 'rgba(239,68,68,0.15)', color: '#f87171', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}
            >
              💀 Delete Account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
