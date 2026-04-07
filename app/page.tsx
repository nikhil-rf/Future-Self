'use client';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import HeroSection from "./pages/heropage";
import Problem from "./pages/Problem";
import Testimonials from "./pages/TestimonialPage";
import Timeline from "./pages/Timeline";
import Tools from "./pages/Tools";
import CTA from "./pages/CTA";


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
    <div style={{minHeight: '100vh', color: '#f0eded' }}>
      <Navbar />

      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Problem ── 
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
      </section>  */}
      <Problem />

      {/* ── How it works ── */}
      <section id="how-it-works" style={{ padding: 'clamp(60px, 8vw, 100px) clamp(16px, 5vw, 48px)', background: '#0a0a0a', borderTop: '1px solid #252323', borderBottom: '1px solid #252323' }}>
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

      {/* ── Features ── 
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
      </section>  */}



      {/* ── Testimonials ── */}
      <Testimonials />


      {/* ── Timeline ── */}
      <Timeline />


      {/* ── Tools ── */}
      <Tools />

      {/* ── CTA ── */}
      <CTA />

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: '1px solid #1a1a1a',
          background: '#0a0a0a',
          padding: '28px clamp(16px, 5vw, 48px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

          <div
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #0a0a0a, #1f1f1f)',
              border: '1px solid #2a2a2a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: '13px',
                color: '#e5e5e5',
                fontVariationSettings: "'FILL' 1"
              }}
            >
              electric_bolt
            </span>
          </div>

          <span style={{ color: '#8a8a8a', fontSize: '12px' }}>
            FutureSelf © 2025 · Mindful Tech Group
          </span>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          {['Privacy', 'Terms', 'Twitter'].map((l) => (
            <a
              key={l}
              href="#"
              style={{
                color: '#8a8a8a',
                fontSize: '12px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = '#ffffff')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = '#8a8a8a')
              }
            >
              {l}
            </a>
          ))}

          <Link href="/login" style={{ color: '#8a8a8a', fontSize: '12px' }}>
            Login
          </Link>
          <Link href="/register" style={{ color: '#8a8a8a', fontSize: '12px' }}>
            Sign Up
          </Link>
        </div>
      </footer>

    </div>
  );
}
