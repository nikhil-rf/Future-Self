"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const steps = [
  {
    number: "01",
    title: "Capture",
    description:
      "Quickly jot down ideas, notes, or goals that don't need immediate action. Clear your mental RAM.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/>
        <line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
    extra: null,
  },
  {
    number: "02",
    title: "Incubate",
    description:
      'Set a specific future date or a fuzzy timeframe like "next winter". We keep it safe.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
        <path d="M8 3v4"/>
        <path d="M16 3v4"/>
        <path d="M12 8v4l3 3"/>
      </svg>
    ),
    extra: (
      <div
        className="mt-5 flex items-center justify-between rounded-lg px-4 py-2.5 text-sm"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.5)" }}>Remind me in:</span>
        <span
          className="rounded-md px-3 py-1 text-xs font-semibold text-white"
          style={{ background: "#5b3cf5" }}
        >
          3 Months
        </span>
      </div>
    ),
  },
  {
    number: "03",
    title: "Rediscover",
    description:
      "Receive your past thoughts exactly when they become relevant again. Like magic.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    extra: null,
  },
];

export default function Timeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const iconsRowRef = useRef<HTMLDivElement>(null);
  const cardsRowRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const [activeStep, setActiveStep] = useState(1); // 0-indexed, step 02 is active by default

  useEffect(() => {
    // Glow breathe
    gsap.to(glowRef.current, {
      scale: 1.2,
      opacity: 0.4,
      duration: 5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Scroll entrance
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          gsap.set([headingRef.current], { opacity: 0, y: 30 });
          gsap.set(iconsRowRef.current?.children ?? [], { opacity: 0, y: -20, scale: 0.8 });
          gsap.set(cardsRowRef.current?.children ?? [], { opacity: 0, y: 40 });

          const tl = gsap.timeline({ delay: 0.1 });
          tl.to(headingRef.current, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" })
            .to(
              iconsRowRef.current?.children ?? [],
              { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.6)", stagger: 0.12 },
              "-=0.3"
            )
            .to(lineRef.current, { scaleX: 1, duration: 0.6, ease: "power2.inOut" }, "-=0.3")
            .to(
              cardsRowRef.current?.children ?? [],
              { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", stagger: 0.15 },
              "-=0.3"
            );
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#0a0a0a] w-full py-24 px-6 overflow-hidden">
      {/* Glow blob */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute"
        style={{
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "380px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(88,60,245,0.38) 0%, rgba(111,60,220,0.18) 40%, transparent 70%)",
          filter: "blur(24px)",
          opacity: 0.3,
          zIndex: 0,
        }}
      />

      {/* Divider */}
      <div className="w-full h-px bg-white/10 mb-16 relative z-10" />

      {/* Heading */}
      <div ref={headingRef} className="relative z-10 text-center mb-16">
        <h2 className="text-white font-extrabold text-4xl md:text-5xl tracking-tight mb-4">
          Design Your Future Timeline
        </h2>
        <p className="text-white/45 text-base max-w-md mx-auto leading-relaxed">
          A simple, linear process to clear your mind today and surprise yourself tomorrow.
        </p>
      </div>

      {/* Icons row + connector line */}
      <div className="relative z-10 max-w-4xl mx-auto mb-0">
        <div ref={iconsRowRef} className="flex items-center justify-between px-12 md:px-20 relative">
          {steps.map((step, i) => (
            <button
              key={step.number}
              onClick={() => setActiveStep(i)}
              className="flex flex-col items-center gap-2 focus:outline-none group"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  background:
                    activeStep === i
                      ? "rgba(91,60,245,0.25)"
                      : "rgba(255,255,255,0.05)",
                  border:
                    activeStep === i
                      ? "1.5px solid rgba(109,78,247,0.7)"
                      : "1.5px solid rgba(255,255,255,0.12)",
                  color: activeStep === i ? "#a78bfa" : "rgba(255,255,255,0.35)",
                  boxShadow:
                    activeStep === i
                      ? "0 0 20px rgba(109,78,247,0.35), 0 0 40px rgba(109,78,247,0.15)"
                      : "none",
                }}
              >
                {step.icon}
              </div>
            </button>
          ))}

          {/* Connector line behind icons */}
          <div
            className="absolute top-7 left-0 right-0 mx-[72px] md:mx-[100px] h-px pointer-events-none"
            style={{ background: "rgba(255,255,255,0.08)", zIndex: -1 }}
          >
            {/* Active progress fill */}
            <div
              ref={lineRef}
              className="h-full transition-all duration-500"
              style={{
                background: "linear-gradient(90deg, #5b3cf5, #a78bfa)",
                width: activeStep === 0 ? "0%" : activeStep === 1 ? "50%" : "100%",
                transformOrigin: "left",
              }}
            />
          </div>
        </div>
      </div>

      {/* Cards row */}
      <div
        ref={cardsRowRef}
        className="relative z-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
      >
        {steps.map((step, i) => (
          <div
            key={step.number}
            onClick={() => setActiveStep(i)}
            className="rounded-2xl p-6 cursor-pointer transition-all duration-300"
            style={{
              background:
                activeStep === i
                  ? "rgba(91,60,245,0.08)"
                  : "rgba(255,255,255,0.03)",
              border:
                activeStep === i
                  ? "1px solid rgba(109,78,247,0.5)"
                  : "1px solid rgba(255,255,255,0.08)",
              boxShadow:
                activeStep === i
                  ? "0 0 28px rgba(109,78,247,0.2), 0 0 60px rgba(109,78,247,0.08)"
                  : "none",
              transform: activeStep === i ? "translateY(-4px)" : "translateY(0)",
            }}
          >
            {/* Active top bar */}
            {activeStep === i && (
              <div
                className="w-full h-[3px] rounded-full mb-5 -mt-1"
                style={{
                  background: "linear-gradient(90deg, #5b3cf5, #a78bfa)",
                }}
              />
            )}

            <p
              className="text-xs font-bold uppercase tracking-[0.16em] mb-3"
              style={{ color: activeStep === i ? "#6d4ef7" : "rgba(255,255,255,0.3)" }}
            >
              Step {step.number}
            </p>

            <h3 className="text-white font-bold text-xl mb-3">{step.title}</h3>

            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              {step.description}
            </p>

            {step.extra}
          </div>
        ))}
      </div>

    </section>
  );
}