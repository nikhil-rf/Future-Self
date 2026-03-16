'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (result?.error) throw new Error(result.error);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
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
      {/* Left panel — decorative */}
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
        {/* Glow */}
        <div style={{ position: 'absolute', top: '30%', left: '40%', transform: 'translate(-50%, -50%)', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(75,43,238,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', position: 'relative', zIndex: 1 }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #4b2bee, #7c5af0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#fff', fontVariationSettings: "'FILL' 1" }}>electric_bolt</span>
          </div>
          <span style={{ fontSize: '17px', fontWeight: 700, color: '#f0eded' }}>FutureSelf</span>
        </Link>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <blockquote style={{ margin: 0 }}>
            <p style={{ fontSize: 'clamp(22px, 3.5vw, 34px)', fontWeight: 700, color: '#f0eded', lineHeight: 1.25, letterSpacing: '-0.03em', margin: '0 0 14px' }}>
              &ldquo;Patience is the architect of progress.&rdquo;
            </p>
            <footer style={{ color: '#7a7676', fontSize: '13px' }}>— FutureSelf</footer>
          </blockquote>

          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { icon: 'lock', text: 'End-to-end encrypted vault' },
              { icon: 'smart_toy', text: 'AI-powered nudges by Gemini' },
              { icon: 'schedule', text: 'Timely, contextual delivery' },
            ].map((item) => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#a78bfa', fontVariationSettings: "'FILL' 0" }}>{item.icon}</span>
                <span style={{ color: '#9c9898', fontSize: '13px' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: '#4a4848', fontSize: '12px', margin: 0 }}>FutureSelf © 2025</p>
        </div>
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
          <div style={{ marginBottom: '36px' }}>
            <h1 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.03em', color: '#f0eded' }}>
              Welcome back
            </h1>
            <p style={{ color: '#7a7676', fontSize: '14px', margin: 0 }}>Sign in to sync with your future.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', color: '#9c9898', fontSize: '12px', fontWeight: 600, marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Email
              </label>
              <input
                type="email"
                required
                placeholder="jane@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                <label style={{ color: '#9c9898', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Password
                </label>
                <a href="#" style={{ color: '#a78bfa', fontSize: '12px', fontWeight: 500 }}>Forgot?</a>
              </div>
              <input
                type="password"
                required
                placeholder="Your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '4px', padding: '14px' }}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#7a7676', fontSize: '13px', margin: '28px 0 0' }}>
            New to the future?{' '}
            <Link href="/register" style={{ color: '#a78bfa', fontWeight: 600 }}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
