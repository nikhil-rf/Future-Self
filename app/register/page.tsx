'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      toast.success('Account created! Signing you in...');
      const { signIn } = await import('next-auth/react');
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (result?.ok) router.push('/dashboard');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        background: '#181717',
      }}
    >
      {/* Left panel */}
      <div
        style={{
          background: 'linear-gradient(155deg, #1a1530 0%, #111010 60%)',
          borderRight: '1px solid #252323',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'clamp(40px, 6vw, 72px)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '280px',
        }}
      >
        <div style={{ position: 'absolute', top: '30%', left: '40%', transform: 'translate(-50%,-50%)', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(75,43,238,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', position: 'relative', zIndex: 1 }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #4b2bee, #7c5af0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#fff', fontVariationSettings: "'FILL' 1" }}>electric_bolt</span>
          </div>
          <span style={{ fontSize: '17px', fontWeight: 700, color: '#f0eded' }}>FutureSelf</span>
        </Link>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: 700, color: '#f0eded', lineHeight: 1.3, letterSpacing: '-0.03em', margin: '0 0 20px' }}>
            Write to the person you&apos;re becoming.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { icon: 'rocket_launch', text: 'Set goals with built-in accountability' },
              { icon: 'psychology_alt', text: 'AI that understands your context' },
              { icon: 'favorite', text: 'Be kind to your future self' },
            ].map((item) => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#a78bfa', fontVariationSettings: "'FILL' 0" }}>{item.icon}</span>
                <span style={{ color: '#9c9898', fontSize: '13px' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: '#4a4848', fontSize: '12px', margin: 0, position: 'relative', zIndex: 1 }}>FutureSelf · Premium Intelligence</p>
      </div>

      {/* Right panel — form */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(40px, 6vw, 72px) clamp(24px, 5vw, 72px)',
        }}
      >
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.03em', color: '#f0eded' }}>
              Create your account
            </h1>
            <p style={{ color: '#7a7676', fontSize: '14px', margin: 0 }}>Your future self will thank you.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Full Name', type: 'text', placeholder: 'Jane Smith', key: 'name' as const },
              { label: 'Email', type: 'email', placeholder: 'jane@example.com', key: 'email' as const },
              { label: 'Password', type: 'password', placeholder: 'Min. 6 characters', key: 'password' as const },
              { label: 'Confirm Password', type: 'password', placeholder: 'Repeat your password', key: 'confirm' as const },
            ].map((field) => (
              <div key={field.key}>
                <label style={{ display: 'block', color: '#9c9898', fontSize: '12px', fontWeight: 600, marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  required
                  placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '6px', padding: '14px' }}
            >
              {loading ? 'Creating account...' : 'Get Started →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#7a7676', fontSize: '13px', margin: '28px 0 0' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#a78bfa', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
