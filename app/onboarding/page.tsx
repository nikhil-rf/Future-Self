'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const focusAreas = [
  {
    id: 'follow-ups',
    icon: 'reply_all',
    title: 'Follow-ups',
    desc: 'Replies and connections',
  },
  {
    id: 'habits',
    icon: 'self_improvement',
    title: 'Habits',
    desc: 'Consistency and routines',
  },
  {
    id: 'ideas',
    icon: 'lightbulb',
    title: 'Ideas',
    desc: 'Notes and brainwaves',
  },
  {
    id: 'goals',
    icon: 'flag',
    title: 'Goals',
    desc: 'Long-term milestones',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    // Future: POST selected focus areas to /api/user/preferences
    router.push('/dashboard');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#181717',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(40px, 8vw, 80px) clamp(16px, 5vw, 48px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(75,43,238,0.1) 0%, transparent 68%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '560px', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '48px', textDecoration: 'none', justifyContent: 'center' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg, #4b2bee, #7c5af0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#fff', fontVariationSettings: "'FILL' 1" }}>electric_bolt</span>
          </div>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#f0eded' }}>FutureSelf</span>
        </Link>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '36px' }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                height: '3px',
                width: i === 0 ? '32px' : '16px',
                borderRadius: '2px',
                background: i === 0 ? '#4b2bee' : '#2c2a2a',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1
            style={{
              fontSize: 'clamp(22px, 4vw, 30px)',
              fontWeight: 800,
              margin: '0 0 10px',
              letterSpacing: '-0.03em',
              color: '#f0eded',
            }}
          >
            What do you want to remember?
          </h1>
          <p style={{ color: '#7a7676', fontSize: '14px', margin: 0, lineHeight: 1.6 }}>
            Choose the focus areas for your FutureSelf reminders.
          </p>
        </div>

        {/* Focus area cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '32px' }}>
          {focusAreas.map((area) => {
            const isSelected = selected.includes(area.id);
            return (
              <button
                key={area.id}
                onClick={() => toggle(area.id)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '18px 20px',
                  borderRadius: '14px',
                  border: `1px solid ${isSelected ? 'rgba(75,43,238,0.45)' : '#2c2a2a'}`,
                  background: isSelected ? 'rgba(75,43,238,0.09)' : '#1e1d1d',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(75,43,238,0.25)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = '#2c2a2a';
                }}
              >
                {/* Selection checkmark */}
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#4b2bee',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '12px', color: '#fff', fontVariationSettings: "'FILL' 1" }}>check</span>
                  </div>
                )}

                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(75,43,238,0.18)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isSelected ? 'rgba(75,43,238,0.3)' : '#2c2a2a'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: '20px',
                      color: isSelected ? '#c4b5fd' : '#7a7676',
                      fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0",
                      transition: 'all 0.2s',
                    }}
                  >
                    {area.icon}
                  </span>
                </div>

                <div>
                  <p style={{ color: isSelected ? '#f0eded' : '#c8c4c4', fontSize: '14px', fontWeight: 600, margin: '0 0 3px', transition: 'color 0.2s' }}>
                    {area.title}
                  </p>
                  <p style={{ color: '#7a7676', fontSize: '12px', margin: 0, lineHeight: 1.5 }}>
                    {area.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '14px', opacity: selected.length === 0 ? 0.55 : 1 }}
        >
          {selected.length === 0 ? 'Select at least one area' : `Continue with ${selected.length} area${selected.length > 1 ? 's' : ''} →`}
        </button>

        <p style={{ textAlign: 'center', color: '#4a4848', fontSize: '12px', marginTop: '20px' }}>
          FutureSelf · Premium Intelligence
        </p>
      </div>
    </div>
  );
}
