"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function Hero2() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const [inputValue, setInputValue] = useState("");

  // Typewriter effect on the placeholder
  useEffect(() => {
    const text = "Remind me to call Mom";
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setInputValue(text.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // Cursor blink
  useEffect(() => {
    gsap.to(cursorRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "steps(1)",
      yoyo: true,
      repeat: -1,
    });
  }, []);

  // Glow breathe
  useEffect(() => {
    gsap.to(glowRef.current, {
      scale: 1.18,
      opacity: 0.55,
      duration: 4.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }, []);

  // Entrance animation
  useEffect(() => {
    gsap.set(
      [badgeRef.current, line1Ref.current, line2Ref.current, subtitleRef.current, inputRef.current, ctaRef.current],
      { opacity: 0, y: 28 }
    );
    const tl = gsap.timeline({ delay: 0.2 });
    tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" })
      .to(line1Ref.current, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }, "-=0.25")
      .to(line2Ref.current, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }, "-=0.45")
      .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, "-=0.3")
      .to(inputRef.current, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, "-=0.25")
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, "-=0.25");
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden px-6"
      style={{ background: "#0e0e12" }}
    >
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow blob */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute"
        style={{
          top: "42%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "750px",
          height: "450px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(88,60,245,0.42) 0%, rgba(111,60,220,0.22) 40%, rgba(60,20,180,0.08) 65%, transparent 100%)",
          filter: "blur(24px)",
          opacity: 0.45,
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto w-full">


        {/* Backed by u */}
        <div
          className="mb-2 inline-flex items-center gap-2 rounded-full px-4 py-2"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.38)" }}>
            Backed by
          </span>
          <div
            className="w-5 h-5 rounded-[5px] flex items-center justify-center flex-shrink-0"
            style={{ background: "#FF6600" }}
          >
            <span className="text-white font-black text-[11px] leading-none">U</span>
          </div>
        </div>


        {/* Badge */}
        <div
          ref={badgeRef}
          className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]"
          style={{
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.65)",
          }}
        >
          <span
            className="w-[7px] h-[7px] rounded-full"
            style={{
              background: "#7c5cfa",
              boxShadow: "0 0 8px rgba(124,92,250,0.95)",
              animation: "pulseDot 2s ease-in-out infinite",
              display: "inline-block",
            }}
          />
          Public Beta Now Live
        </div>

        {/* Line 1 */}
        <div ref={line1Ref}>
          <h1
            className="font-black text-white leading-[1] tracking-tight whitespace-nowrap"
            style={{ fontSize: "clamp(25px, 5.5vw, 80px)" }}
          >
            Don&apos;t let important things
          </h1>
        </div>

        {/* Line 2 — muted white */}
        <div ref={line2Ref} className="mb-7">
          <h1
            className="font-black leading-[1.05] tracking-tight whitespace-nowrap"
            style={{
              fontSize: "clamp(25px, 5.5vw, 80px)",
              background: "linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.25))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            quietly disappear.
          </h1>
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-base leading-relaxed mb-10 max-w-lg"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          The reminder system for your future self. Simple, contextual, and
          impossible to ignore when it matters most.
        </p>

        {/* Input bar */}
        <div
          ref={inputRef}
          className="w-full max-w-xl flex items-center gap-3 rounded-2xl px-4 py-3.5 mb-8"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Plus icon */}
          <div style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </div>

          {/* Typed text */}
          <div className="flex-1 text-left text-[15px] flex items-center gap-1" style={{ color: "rgba(255,255,255,0.75)" }}>
            <span>{inputValue}</span>
            {inputValue.length > 0 && inputValue.length < 21 ? (
              <span
                ref={cursorRef}
                className="inline-block w-[2px] h-[18px] rounded-sm"
                style={{ background: "#7c5cfa", verticalAlign: "middle" }}
              />
            ) : null}
            {inputValue.length === 21 && (
              <>
                <span style={{ color: "#7c5cfa" }}> @ 7pm</span>
                <span
                  ref={cursorRef}
                  className="inline-block w-[2px] h-[18px] rounded-sm ml-0.5"
                  style={{ background: "#7c5cfa", verticalAlign: "middle" }}
                />
              </>
            )}
          </div>

          {/* Enter badge */}
          <div
            className="flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Enter ↵
          </div>
        </div>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/register">
            <button
            className="px-7 py-3.5 rounded-xl text-[15px] font-bold text-white transition-all duration-200"
            style={{ background: "#5b3cf5" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#6d4ef7";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(91,60,245,0.45)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#5b3cf5";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            Start for free
          </button>
          </Link>
          

          <button
            className="px-7 py-3.5 rounded-xl text-[15px] font-bold text-white transition-all duration-200"
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.18)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            See how it works →
          </button>
        </div>

      </div>

      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </section>
  );
}