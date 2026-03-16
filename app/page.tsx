'use client';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const problems = [
  {
    icon: 'psychology',
    title: 'The Mental Load',
    desc: 'Trying to remember everything leads to anxiety and mental fatigue. You\'re using processing power just to hold onto data.',
  },
  {
    icon: 'link_off',
    title: 'Broken Context',
    desc: 'Reminders pop up at the wrong time or place. Seeing "Buy Milk" during deep work is useless noise.',
  },
  {
    icon: 'notifications_off',
    title: 'Digital Noise',
    desc: 'Important tasks get lost in a sea of unimportant notifications from social media, news, and spam.',
  },
];

const steps = [
  { step: '01', icon: 'edit', title: 'Write', desc: 'Jot down a thought instantly. Natural language processing understands "Remind me to buy milk tomorrow".' },
  { step: '02', icon: 'tune', title: 'Choose', desc: 'Set the context — is it a time, a location, or when you open a specific app? You define the trigger.' },
  { step: '03', icon: 'notifications_active', title: 'Nudge', desc: 'Receive a gentle, inescapable nudge exactly when it\'s relevant. Close the loop and free your mind.' },
];

const features = [
  { icon: 'my_location', title: 'Contextual Reminders', desc: 'Triggers based on where you are, not just when. "Remind me to pick up dry cleaning when I leave the office."' },
  { icon: 'devices', title: 'Multi-platform', desc: 'Seamless sync across all your devices.' },
  { icon: 'loop', title: 'Habit Loops', desc: 'Recurring reminders that adapt to your completion streaks.' },
  { icon: 'mic', title: 'Voice Capture', desc: 'Capture thoughts on the go with high-fidelity voice-to-text.' },
];

const testimonials = [
  { name: 'Priya S.', role: 'Product Designer', quote: 'FutureSelf helped me actually follow through on career goals I kept forgetting. The AI nudge felt uncannily personal.' },
  { name: 'Arjun M.', role: 'Software Engineer', quote: 'I set a reminder about a side project 3 months ago. When it arrived, I remembered exactly why it mattered. Shipped it last week.' },
  { name: 'Leila K.', role: 'Founder', quote: 'Finally a reminder tool that doesn\'t treat context like an afterthought. My future self thanks my past self every week.' },
];

export default function LandingPage() {
  return (
    <div style={{ background: '#181717', minHeight: '100vh', color: '#f0eded' }}>
      <Navbar />

      {/* ── Hero ── */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 'clamp(100px, 14vw, 180px) clamp(16px, 5vw, 48px) clamp(60px, 8vw, 100px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: 'min(700px, 90vw)', height: 'min(700px, 90vw)', background: 'radial-gradient(circle, rgba(75,43,238,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(124,90,240,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '820px', zIndex: 1, animation: 'fadeInUp 0.8s ease-out both' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(75,43,238,0.1)', border: '1px solid rgba(75,43,238,0.28)', borderRadius: '20px', padding: '6px 16px', marginBottom: '32px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#a78bfa', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span style={{ fontSize: '12px', color: '#a78bfa', fontWeight: 600 }}>AI-Powered Reminder System</span>
          </div>

          <h1 style={{ fontSize: 'clamp(38px, 6.5vw, 80px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', margin: '0 0 24px', color: '#f0eded' }}>
            Don&apos;t let important things{' '}
            <span style={{ background: 'linear-gradient(135deg, #7c5af0, #a78bfa, #c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              quietly disappear.
            </span>
          </h1>

          <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: '#7a7676', lineHeight: 1.75, margin: '0 0 44px', maxWidth: '580px', marginLeft: 'auto', marginRight: 'auto' }}>
            The reminder system for your future self. Simple, contextual, and impossible to ignore when it matters most.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register">
              <button className="btn-primary" style={{ fontSize: '15px', padding: '14px 32px' }}>
                Start for Free →
              </button>
            </Link>
            <a href="#how-it-works">
              <button className="btn-secondary" style={{ fontSize: '15px', padding: '14px 32px' }}>
                See How it Works
              </button>
            </a>
          </div>

          <p style={{ color: '#4a4848', fontSize: '12px', marginTop: '20px' }}>14-day free trial · No credit card required</p>
        </div>
      </section>

      {/* ── Problem ── */}
      <section id="problem" style={{ padding: 'clamp(60px, 8vw, 100px) clamp(16px, 5vw, 48px)', borderTop: '1px solid #252323' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ color: '#a78bfa', fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 12px' }}>The Problem</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.03em' }}>Why traditional reminders fail</h2>
            <p style={{ color: '#7a7676', fontSize: '16px', margin: 0 }}>Your brain isn&apos;t designed to hold onto everything.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {problems.map((p) => (
              <div
                key={p.title}
                style={{
                  background: '#1e1d1d',
                  border: '1px solid #2c2a2a',
                  borderRadius: '16px',
                  padding: '28px',
                  transition: 'border-color 0.2s, transform 0.2s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(75,43,238,0.3)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#2c2a2a'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(75,43,238,0.1)', border: '1px solid rgba(75,43,238,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                  <span className="material-symbols-outlined" style={{ color: '#a78bfa', fontVariationSettings: "'FILL' 0" }}>{p.icon}</span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px', color: '#f0eded' }}>{p.title}</h3>
                <p style={{ color: '#7a7676', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" style={{ padding: 'clamp(60px, 8vw, 100px) clamp(16px, 5vw, 48px)', background: 'rgba(75,43,238,0.03)', borderTop: '1px solid #252323', borderBottom: '1px solid #252323' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ color: '#a78bfa', fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 12px' }}>How it works</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.03em' }}>Offload your brain in 3 steps</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px' }}>
            {steps.map((s) => (
              <div key={s.step} style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(75,43,238,0.12)', border: '1px solid rgba(75,43,238,0.22)', marginBottom: '20px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#a78bfa', fontVariationSettings: "'FILL' 0" }}>{s.icon}</span>
                </div>
                <div style={{ color: '#a78bfa', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>STEP {s.step}</div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 10px' }}>{s.title}</h3>
                <p style={{ color: '#7a7676', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ padding: 'clamp(60px, 8vw, 100px) clamp(16px, 5vw, 48px)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ color: '#a78bfa', fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 12px' }}>Features</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, margin: 0, letterSpacing: '-0.03em' }}>Everything you need to focus</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {features.map((f) => (
              <div
                key={f.title}
                style={{ background: '#1e1d1d', border: '1px solid #2c2a2a', borderRadius: '14px', padding: '24px', transition: 'border-color 0.2s, transform 0.2s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(75,43,238,0.3)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#2c2a2a'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(75,43,238,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <span className="material-symbols-outlined" style={{ color: '#a78bfa', fontSize: '20px', fontVariationSettings: "'FILL' 0" }}>{f.icon}</span>
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px', color: '#f0eded' }}>{f.title}</h3>
                <p style={{ color: '#7a7676', fontSize: '13px', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="social-proof" style={{ padding: 'clamp(60px, 8vw, 100px) clamp(16px, 5vw, 48px)', background: 'rgba(75,43,238,0.03)', borderTop: '1px solid #252323', borderBottom: '1px solid #252323' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 800, margin: '0', letterSpacing: '-0.03em' }}>Who is this for?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '40px' }}>
            {testimonials.map((t) => (
              <div key={t.name} style={{ background: '#1e1d1d', border: '1px solid #2c2a2a', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined" style={{ fontSize: '16px', color: '#f59e0b', fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p style={{ color: '#b8b4b4', fontSize: '14px', lineHeight: 1.75, margin: '0 0 18px', fontStyle: 'italic' }}>&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p style={{ color: '#f0eded', fontSize: '14px', fontWeight: 600, margin: '0 0 2px' }}>{t.name}</p>
                  <p style={{ color: '#7a7676', fontSize: '12px', margin: 0 }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: 'clamp(80px, 10vw, 120px) clamp(16px, 5vw, 48px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(75,43,238,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 58px)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.04em' }}>
            Your future self will{' '}
            <span style={{ background: 'linear-gradient(135deg, #7c5af0, #c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              thank you.
            </span>
          </h2>
          <p style={{ color: '#7a7676', fontSize: 'clamp(15px, 2vw, 18px)', margin: '0 0 40px' }}>
            Join thousands of focused individuals who have stopped forgetting and started doing.
          </p>
          <Link href="/register">
            <button className="btn-primary" style={{ fontSize: '16px', padding: '16px 40px' }}>
              Create Your First Reminder →
            </button>
          </Link>
          <p style={{ color: '#4a4848', fontSize: '12px', marginTop: '20px' }}>14-day free trial. No credit card required.</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid #252323', padding: '28px clamp(16px, 5vw, 48px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'linear-gradient(135deg, #4b2bee, #7c5af0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '13px', color: '#fff', fontVariationSettings: "'FILL' 1" }}>electric_bolt</span>
          </div>
          <span style={{ color: '#4a4848', fontSize: '12px' }}>FutureSelf © 2025 · Mindful Tech Group</span>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          {['Privacy', 'Terms', 'Twitter'].map((l) => (
            <a key={l} href="#" style={{ color: '#4a4848', fontSize: '12px', transition: 'color 0.2s' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#9c9898')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#4a4848')}
            >{l}</a>
          ))}
          <Link href="/login" style={{ color: '#4a4848', fontSize: '12px' }}>Login</Link>
          <Link href="/register" style={{ color: '#4a4848', fontSize: '12px' }}>Sign Up</Link>
        </div>
      </footer>
    </div>
  );
}
