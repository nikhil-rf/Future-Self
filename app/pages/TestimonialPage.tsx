"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

const tabs = ["Students", "Professionals", "Freelancers"] as const;
type Tab = (typeof tabs)[number];

const content: Record<
    Tab,
    {
        image: string;
        name: string;
        role: string;
        quote: string;
    }
> = {
    Students: {
        image: "/professionals.png",
        name: "Sarah Jenkins",
        role: "Graduate Student",
        quote:
            "Before FutureSelf, my thesis deadlines were a nightmare. Now, I get nudged exactly when I plan to study, not when I'm out with friends. It's like having a project manager in my pocket.",
    },
    Professionals: {
        image: "/professionals.png",
        name: "Marcus Webb",
        role: "Senior Product Manager",
        quote:
            "I schedule quarterly career check-ins with my future self. FutureSelf keeps me honest about whether I'm actually moving toward my goals or just staying busy.",
    },
    Freelancers: {
        image: "/professionals.png",
        name: "Priya Nair",
        role: "Independent UX Designer",
        quote:
            "Freelancing is feast or famine. I use FutureSelf to send contract reminders and rate-increase nudges to myself during busy periods. It's like my business partner actually plans ahead.",
    },
};

export default function Testimonials() {
    const [activeTab, setActiveTab] = useState<Tab>("Students");
    const sectionRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    // Entrance animation on mount
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    gsap.set([headingRef.current, cardRef.current, imageRef.current], {
                        opacity: 0,
                        y: 36,
                    });
                    const tl = gsap.timeline({ delay: 0.1 });
                    tl.to(headingRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" })
                        .to(cardRef.current, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }, "-=0.35")
                        .to(imageRef.current, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }, "-=0.45");
                }
            },
            { threshold: 0.15 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // Glow blob breathe
    useEffect(() => {
        gsap.to(glowRef.current, {
            scale: 1.2,
            opacity: 0.45,
            duration: 4.5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
        });
    }, []);

    // Tab switch animation
    const switchTab = (tab: Tab) => {
        if (tab === activeTab) return;
        gsap.to([cardRef.current, imageRef.current], {
            opacity: 0,
            y: 16,
            duration: 0.22,
            ease: "power2.in",
            onComplete: () => {
                setActiveTab(tab);
                gsap.to([cardRef.current, imageRef.current], {
                    opacity: 1,
                    y: 0,
                    duration: 0.38,
                    ease: "power3.out",
                    stagger: 0.08,
                });
            },
        });
    };

    const data = content[activeTab];

    return (
        <section ref={sectionRef} className="relative bg-[#0a0a0a] w-full py-24 px-6 overflow-hidden">

            {/* Glow blob */}
            <div
                ref={glowRef}
                className="pointer-events-none absolute"
                style={{
                    top: "30%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "700px",
                    height: "420px",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(ellipse at center, rgba(88,60,245,0.4) 0%, rgba(111,60,220,0.22) 40%, rgba(60,20,180,0.08) 65%, transparent 100%)",
                    filter: "blur(22px)",
                    opacity: 0.35,
                    zIndex: 0,
                }}
            />

            {/* Divider */}
            <div className="w-full h-px bg-white/10 mb-16 relative z-10" />

            {/* Heading block */}
            <div ref={headingRef} className="relative z-10 text-center mb-12">
                <p className="text-[#6d4ef7] text-xs font-bold uppercase tracking-[0.18em] mb-4">
                    Testimonials
                </p>
                <h2 className="text-white font-extrabold text-4xl md:text-5xl tracking-tight mb-3">
                    Who is this for?
                </h2>
            </div>

            {/* Tab switcher */}
            <div className="relative z-10 flex justify-center mb-12">
                <div
                    className="inline-flex items-center rounded-full p-1 gap-1"
                    style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                    }}
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => switchTab(tab)}
                            className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300"
                            style={{
                                background: activeTab === tab ? "#5b3cf5" : "transparent",
                                color: activeTab === tab ? "#fff" : "rgba(255,255,255,0.5)",
                                boxShadow:
                                    activeTab === tab
                                        ? "0 4px 16px rgba(91,60,245,0.4)"
                                        : "none",
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-2xl mx-auto">

                {/* Testimonial card */}
                <div
                    ref={cardRef}
                    className="rounded-2xl px-10 py-10 flex flex-col items-center text-center"
                    style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.09)",
                    }}
                >
                    {/* Large decorative quote marks — top left */}
                    <div className="w-full flex justify-start mb-4">
                        <span
                            className="font-black leading-none select-none"
                            style={{
                                fontSize: "64px",
                                color: "#5b3cf5",
                                opacity: 0.7,
                                lineHeight: "0.8",
                            }}
                        >
                            &ldquo;
                        </span>
                    </div>

                    {/* Quote text */}
                    <p
                        className="text-white/85 text-lg md:text-xl leading-relaxed mb-10 max-w-lg mx-auto"
                        style={{ fontWeight: 500 }}
                    >
                        &ldquo;{data.quote}&rdquo;
                    </p>

                    {/* Avatar + name + role */}
                    <div className="flex items-center gap-3">
                        <div
                            className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0"
                            style={{
                                background: "rgba(109,78,247,0.2)",
                                border: "2px solid rgba(109,78,247,0.35)",
                            }}
                        >
                            <Image
                                src={data.image}
                                alt={data.name}
                                width={44}
                                height={44}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="text-left">
                            <p className="text-white font-semibold text-sm leading-tight">{data.name}</p>
                            <p className="text-[#6d4ef7] text-xs font-medium">{data.role}</p>
                        </div>
                    </div>
                </div>

                {/* Right — image */}
                {/* <div
                    ref={imageRef}
                    className="hidden md:block rounded-2xl overflow-hidden relative"
                    style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.09)",
                        minHeight: "320px",
                    }}
                >
                    <Image
                        src={data.image}
                        alt={`${activeTab} dashboard`}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div> */}

            </div>
        </section>
    );
}