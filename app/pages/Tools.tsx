"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";

const tools = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    title: "Contextual Reminders",
    description:
      "Don't just set a time. Add location or mood context to ensure the reminder lands perfectly when you are in the right headspace.",
    preview: <ContextualPreview />,
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 2v6h-6"/>
        <path d="M3 12a9 9 0 0 1 15-6.7L21 8"/>
        <path d="M3 22v-6h6"/>
        <path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
      </svg>
    ),
    title: "Habit Check-ins",
    description:
      "Send yourself accountability check-ins 1, 5, or 10 years from now. Create a feedback loop with your future self.",
    preview: <HabitPreview />,
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="2" x2="12" y2="6"/>
        <line x1="12" y1="18" x2="12" y2="22"/>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
        <line x1="2" y1="12" x2="6" y2="12"/>
        <line x1="18" y1="12" x2="22" y2="12"/>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
      </svg>
    ),
    title: "Idea Revisit",
    description:
      "A specialized inbox for reviewing old ideas with fresh eyes. Keep your best thoughts from disappearing into the void.",
    preview: <IdeaPreview />,
  },
];

function ContextualPreview() {
  const dotRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.to(dotRef.current, {
      x: 60,
      duration: 2.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }, []);
  return (
    <div
      className="w-full h-20 rounded-xl flex items-center justify-center relative overflow-hidden"
      style={{ background: "rgba(0,0,0,0.35)" }}
    >
      {/* Ripple rings */}
      <div className="absolute w-16 h-16 rounded-full animate-ping" style={{ background: "rgba(109,78,247,0.08)" }} />
      <div className="absolute w-10 h-10 rounded-full animate-ping" style={{ background: "rgba(109,78,247,0.12)", animationDelay: "0.4s" }} />
      <div
        ref={dotRef}
        className="w-4 h-4 rounded-full relative z-10"
        style={{
          background: "#7c5cfa",
          boxShadow: "0 0 14px rgba(124,92,250,0.8)",
        }}
      />
    </div>
  );
}

function HabitPreview() {
  const dotRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.to(dotRef.current, {
      left: "62%",
      duration: 3,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
    });
  }, []);
  return (
    <div
      className="w-full h-20 rounded-xl px-4 flex flex-col justify-center relative overflow-hidden"
      style={{ background: "rgba(0,0,0,0.35)" }}
    >
      <div className="flex justify-between text-[10px] mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
        <span>2024</span>
        <span>2029</span>
      </div>
      {/* Track */}
      <div className="relative w-full h-[3px] rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
        {/* Fill */}
        <div className="absolute left-0 top-0 h-full w-[55%] rounded-full" style={{ background: "linear-gradient(90deg,#5b3cf5,#a78bfa)" }} />
        {/* Start dot */}
        <div className="absolute top-1/2 left-[8%] -translate-y-1/2 w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.25)", border: "1.5px solid rgba(255,255,255,0.2)" }} />
        {/* Moving dot */}
        <div
          ref={dotRef}
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full"
          style={{
            left: "48%",
            background: "#7c5cfa",
            boxShadow: "0 0 10px rgba(124,92,250,0.9)",
            border: "2px solid #fff",
          }}
        />
        {/* End dot */}
        <div className="absolute top-1/2 right-[4%] -translate-y-1/2 w-2.5 h-2.5 rounded-full" style={{ background: "#5b3cf5", opacity: 0.5 }} />
      </div>
    </div>
  );
}

function IdeaPreview() {
  return (
    <div
      className="w-full h-20 rounded-xl px-4 flex flex-col justify-center gap-2"
      style={{ background: "rgba(0,0,0,0.35)" }}
    >
      {[80, 55, 68].map((w, i) => (
        <div key={i} className="rounded-full h-2" style={{ width: `${w}%`, background: i === 0 ? "rgba(109,78,247,0.55)" : "rgba(255,255,255,0.1)" }} />
      ))}
    </div>
  );
}

export default function Tools() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    gsap.to(glowRef.current, {
      scale: 1.15,
      opacity: 0.4,
      duration: 4.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          gsap.set([headerRef.current], { opacity: 0, y: 28 });
          gsap.set(cardsRef.current?.children ?? [], { opacity: 0, y: 44 });

          const tl = gsap.timeline({ delay: 0.1 });
          tl.to(headerRef.current, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" })
            .to(
              cardsRef.current?.children ?? [],
              { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.14 },
              "-=0.3"
            );
        }
      },
      { threshold: 0.12 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#0a0a0a] w-full py-20 px-6 overflow-hidden">
      {/* Glow blob */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute"
        style={{
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "650px",
          height: "380px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(88,60,245,0.35) 0%, rgba(111,60,220,0.16) 45%, transparent 70%)",
          filter: "blur(24px)",
          opacity: 0.28,
          zIndex: 0,
        }}
      />

      {/* Divider */}
      <div className="w-full h-px bg-white/10 mb-14 relative z-10" />

      {/* Header row */}
      <div ref={headerRef} className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12 max-w-6xl mx-auto">
        <div className="max-w-lg">
          <h2 className="text-white font-extrabold text-3xl md:text-4xl tracking-tight mb-3">
            Tools for Long-Term Thinkers
          </h2>
          <p className="text-white/45 text-sm leading-relaxed">
            Features designed to help you communicate with your future self without the noise of daily to-do lists.
          </p>
        </div>
        <Link href="/register">
        <button
          className="self-start md:self-center flex-shrink-0 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200"
          style={{ background: "#5b3cf5" }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "#6d4ef7";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(91,60,245,0.45)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "#5b3cf5";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          }}
        >
          Start Your Journey →
        </button>
        </Link>
      </div>

      {/* Cards */}
      <div ref={cardsRef} className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
        {tools.map((tool) => (
          <div
            key={tool.title}
            className="rounded-2xl p-6 flex flex-col gap-4 card-tool-glow"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              transition: "border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease, background 0.3s ease",
            }}
          >
            {/* Icon */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(109,78,247,0.18)", color: "#a78bfa" }}
            >
              {tool.icon}
            </div>

            {/* Title */}
            <h3 className="text-white font-bold text-lg">{tool.title}</h3>

            {/* Description */}
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              {tool.description}
            </p>

            {/* Animated preview */}
            {tool.preview}
          </div>
        ))}
      </div>

      <style>{`
        .card-tool-glow:hover {
          border-color: rgba(109,78,247,0.5) !important;
          box-shadow: 0 0 24px rgba(109,78,247,0.22), 0 0 50px rgba(109,78,247,0.1);
          transform: translateY(-4px);
          background: rgba(109,78,247,0.07) !important;
        }
      `}</style>
    </section>
  );
}