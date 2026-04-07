"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";

export default function CTA() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        // Breathing glow
        gsap.to(glowRef.current, {
            scale: 1.2,
            opacity: 0.65,
            duration: 4.5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
        });

        // Scroll entrance
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    gsap.set(contentRef.current?.children ?? [], { opacity: 0, y: 32 });
                    gsap.to(contentRef.current?.children ?? [], {
                        opacity: 1,
                        y: 0,
                        duration: 0.65,
                        ease: "power3.out",
                        stagger: 0.14,
                        delay: 0.1,
                    });
                }
            },
            { threshold: 0.2 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full py-32 px-6 overflow-hidden flex items-center justify-center"
            style={{ background: "#0a0a0a" }}
        >
            {/* Purple radial glow */}
            <div
                ref={glowRef}
                className="pointer-events-none absolute"
                style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "700px",
                    height: "420px",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(ellipse at center, rgba(88,60,245,0.55) 0%, rgba(111,60,220,0.3) 38%, rgba(60,20,180,0.1) 65%, transparent 100%)",
                    filter: "blur(22px)",
                    opacity: 0.5,
                    zIndex: 0,
                }}
            />

            {/* Content */}
            <div
                ref={contentRef}
                className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto"
            >
                {/* Heading */}
                <h2
                    className="font-black tracking-tight leading-[1.08] mb-6"
                    style={{ fontSize: "clamp(40px, 6vw, 74px)" }}
                >
                    <span className="text-white">Your future self </span>
                    <br />
                    <span
                        style={{
                            background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 60%, #6d28d9 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        will thank you
                    </span>
                    <span className="text-white">.</span>
                </h2>

                {/* Subtitle */}
                <p
                    className="text-base leading-relaxed mb-10 max-w-md"
                    style={{ color: "rgba(255,255,255,0.48)" }}
                >
                    Stop letting your best ideas and warmest intentions fade away. Capture
                    them now. Receive them when they matter most.
                </p>

                {/* CTA Button */}
                <Link href="/register">
                <button
                    className="px-9 py-4 rounded-full text-base font-bold text-[#0a0a0a] transition-all duration-200"
                    style={{ background: "#5b3cf5", color: "white" }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 36px rgba(255,255,255,0.18)";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    }}
                >
                    Start Your Journey →
                </button></Link>
                

                {/* Fine print */}
                <p className="mt-4 text-xs" style={{ color: "rgba(255,255,255,0.28)" }}>
                    No credit card required. Cancel anytime.
                </p>
            </div>
        </section>
    );
}