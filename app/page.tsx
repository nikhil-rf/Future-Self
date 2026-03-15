'use client';
import Navbar from "@/components/Navbar";
import Link from "next/link";

const problems = [
  {
    icon: "🧠",
    title: "Mental Load",
    desc: "Your brain is not designed to hold context across weeks or months. Important thoughts fade before you can act on them.",
  },
  {
    icon: "🔗",
    title: "Broken Context",
    desc: "A generic calendar alert never tells you why something mattered. You forget the reason before you even open the note.",
  },
  {
    icon: "📣",
    title: "Digital Noise",
    desc: "Notifications are everywhere. Your important reminders get buried under the noise of the unimportant.",
  },
];

const steps = [
  { step: "01", icon: "✍️", title: "Write", desc: "Capture what matters now — a decision, a goal, a reflection — in plain words to your future self." },
  { step: "02", icon: "📅", title: "Choose", desc: "Set a date and importance level. Days, weeks, or months — you decide when your future self needs to hear it." },
  { step: "03", icon: "💌", title: "Nudge", desc: "At the right time, FutureSelf sends a personalized AI-crafted email that restores the context you set." },
];

const features = [
  { icon: "🎯", title: "Contextual Reminders", desc: "Unlike calendars, FutureSelf preserves the context of why something mattered." },
  { icon: "🤖", title: "AI-Powered Nudges", desc: "Gemini generates a warm, personalized message tailored to your note and timeframe." },
  { icon: "📊", title: "Timeline View", desc: "See your past and future reminders in one beautiful, organized timeline." },
  { icon: "📈", title: "Analytics", desc: "Track your completion rate, streaks, and patterns over time to grow intentionally." },
];

const testimonials = [
  { name: "Priya S.", role: "Product Designer", quote: "FutureSelf helped me actually follow through on career goals I kept forgetting. The AI nudge felt uncannily personal." },
  { name: "Arjun M.", role: "Software Engineer", quote: "I set a reminder about a side project idea 3 months ago. When it arrived, I remembered exactly why it mattered. Shipped it last week." },
  { name: "Leila K.", role: "Founder", quote: "Finally a reminder tool that doesn't treat context like an afterthought. My future self thanks my past self every week." },
];

export default function LandingPage() {
  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh", color: "#e2e8f0" }}>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "100px 24px 60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "780px", zIndex: 1, animation: "fadeIn 0.8s ease-in-out" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "20px", padding: "6px 16px", marginBottom: "28px" }}>
            <span style={{ fontSize: "12px", color: "#a5b4fc", fontWeight: 600 }}>✦ AI-Powered Reminder System</span>
          </div>

          <h1 style={{ fontSize: "clamp(42px, 7vw, 80px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", margin: "0 0 24px", color: "#f1f5f9" }}>
            Don&apos;t let important things{" "}
            <span style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              quietly disappear
            </span>
          </h1>

          <p style={{ fontSize: "18px", color: "#9ca3af", lineHeight: 1.7, margin: "0 0 40px", maxWidth: "580px", marginLeft: "auto", marginRight: "auto" }}>
            Write a message to your future self today. FutureSelf delivers it when the moment comes — with personalized AI context that makes you actually remember why it mattered.
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register">
              <button className="btn-primary" style={{ fontSize: "16px", padding: "14px 32px" }}>
                Get Started Free →
              </button>
            </Link>
            <a href="#how-it-works">
              <button className="btn-secondary" style={{ fontSize: "16px", padding: "14px 32px" }}>
                See How it Works
              </button>
            </a>
          </div>

          <p style={{ color: "#4b5563", fontSize: "12px", marginTop: "24px" }}>No credit card required · Free to start</p>
        </div>
      </section>

      {/* Problem */}
      <section style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "36px", fontWeight: 800, margin: "0 0 12px" }}>Why calendars keep failing you</h2>
          <p style={{ color: "#6b7280", fontSize: "16px", margin: 0 }}>The tools you use were built for scheduling, not remembering what matters.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {problems.map((p) => (
            <div key={p.title} className="glass-card" style={{ padding: "32px" }}>
              <div style={{ fontSize: "36px", marginBottom: "16px" }}>{p.icon}</div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 10px" }}>{p.title}</h3>
              <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: "80px 24px", background: "rgba(99,102,241,0.03)", borderTop: "1px solid #1e1e2e", borderBottom: "1px solid #1e1e2e" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ fontSize: "36px", fontWeight: 800, margin: "0 0 12px" }}>How it works</h2>
            <p style={{ color: "#6b7280", fontSize: "16px", margin: 0 }}>Simple, powerful, and personal.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "32px" }}>
            {steps.map((s) => (
              <div key={s.step} style={{ textAlign: "center" }}>
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", borderRadius: "16px", background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", marginBottom: "20px", fontSize: "28px" }}>
                  {s.icon}
                </div>
                <div style={{ color: "#6366f1", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", marginBottom: "8px" }}>STEP {s.step}</div>
                <h3 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 10px" }}>{s.title}</h3>
                <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "36px", fontWeight: 800, margin: "0 0 12px" }}>Everything you need to remember what matters</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
          {features.map((f) => (
            <div key={f.title} className="glass-card" style={{ padding: "28px" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.3)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(30,30,46,0.8)'; }}
            >
              <div style={{ fontSize: "30px", marginBottom: "14px" }}>{f.icon}</div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 8px" }}>{f.title}</h3>
              <p style={{ color: "#6b7280", fontSize: "13px", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "80px 24px", background: "rgba(99,102,241,0.03)", borderTop: "1px solid #1e1e2e", borderBottom: "1px solid #1e1e2e" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ fontSize: "36px", fontWeight: 800, margin: "0 0 12px" }}>What people are saying</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card" style={{ padding: "28px" }}>
                <p style={{ color: "#d1d5db", fontSize: "15px", lineHeight: 1.7, margin: "0 0 20px", fontStyle: "italic" }}>&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: 600, margin: "0 0 2px" }}>{t.name}</p>
                  <p style={{ color: "#6b7280", fontSize: "12px", margin: 0 }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "48px", fontWeight: 800, margin: "0 0 16px", letterSpacing: "-0.03em" }}>Your future self is waiting.</h2>
        <p style={{ color: "#6b7280", fontSize: "18px", margin: "0 0 40px" }}>Start writing notes that actually make it through time.</p>
        <Link href="/register">
          <button className="btn-primary" style={{ fontSize: "16px", padding: "16px 40px" }}>
            Create Your First Reminder →
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1e1e2e", padding: "32px 24px", textAlign: "center" }}>
        <p style={{ color: "#4b5563", fontSize: "13px", margin: 0 }}>
          © 2025 FutureSelf · Built with care ·{" "}
          <Link href="/login" style={{ color: "#6366f1", textDecoration: "none" }}>Login</Link>
          {" · "}
          <Link href="/register" style={{ color: "#6366f1", textDecoration: "none" }}>Sign Up</Link>
        </p>
      </footer>
    </div>
  );
}
