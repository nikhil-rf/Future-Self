export default function Problem() {
  const cards = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          <path d="M18.63 13A17.89 17.89 0 0 1 18 8"/>
          <path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"/>
          <path d="M18 8a6 6 0 0 0-9.33-5"/>
          <line x1="2" y1="2" x2="22" y2="22"/>
        </svg>
      ),
      title: "Urgency vs. Importance",
      description:
        "Immediate notifications drown out long-term life goals. We react to the loud, not the vital. The urgent always wins, unless you create a system for the important.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M3 9h18"/>
          <path d="M3 15h18"/>
          <path d="M9 3v18"/>
          <path d="M15 3v18"/>
        </svg>
      ),
      title: "Mental Drift",
      description:
        "Motivation has a half-life. Without a nudge, the resolutions you made 14 days ago fade into the background noise of daily life. We forget who we wanted to be.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      title: "Short-termism",
      description:
        "We optimize for today at the expense of next year. Our brains are wired for immediate rewards. FutureSelf bridges the gap between your present actions and future identity.",
    },
  ];

  return (
    <section className="bg-[#0a0a0a] overflow-x-hidden w-full py-20 px-6">
      {/* Divider */}
      <div className="w-full h-px bg-white/10 mb-16" />

      {/* Section label */}
      <p className="text-center text-[#6d4ef7] text-xs font-bold uppercase tracking-[0.18em] mb-4">
        The Problem
      </p>

      {/* Heading */}
      <h2 className="text-center text-white font-extrabold text-4xl md:text-5xl tracking-tight mb-16">
        Why we lose sight of what matters
      </h2>

      {/* Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl p-7 flex flex-col gap-5 card-glow"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              transition: "border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
            }}
          >
            {/* Icon box */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(109,78,247,0.18)",
                color: "#a78bfa",
              }}
            >
              {card.icon}
            </div>

            {/* Title */}
            <h3 className="text-white font-bold text-lg leading-snug">
              {card.title}
            </h3>

            {/* Description */}
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              {card.description}
            </p>
          </div>
        ))}
      </div>
      <style>{`
        .card-glow:hover {
          border-color: rgba(109, 78, 247, 0.55) !important;
          box-shadow:
            0 0 24px rgba(109, 78, 247, 0.25),
            0 0 48px rgba(109, 78, 247, 0.12),
            inset 0 0 24px rgba(109, 78, 247, 0.05);
          transform: translateY(-4px);
          background: rgba(109, 78, 247, 0.07) !important;
        }
      `}</style>
    </section>
  );
}