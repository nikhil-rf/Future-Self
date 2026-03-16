'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(24, 23, 23, 0.88)',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid #252323',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 clamp(16px, 4vw, 32px)',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #4b2bee, #7c5af0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#fff', fontVariationSettings: "'FILL' 1" }}>electric_bolt</span>
          </div>
          <span style={{ fontSize: '17px', fontWeight: 700, color: '#f0eded', letterSpacing: '-0.3px' }}>
            FutureSelf
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          className="hidden md:flex"
        >
          {[
            { label: 'The Problem', href: '#problem' },
            { label: 'How it works', href: '#how-it-works' },
            { label: 'Features', href: '#features' },
            { label: 'Stories', href: '#social-proof' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                color: '#9c9898',
                fontSize: '14px',
                padding: '8px 14px',
                borderRadius: '8px',
                transition: 'color 0.2s, background 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = '#f0eded';
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = '#9c9898';
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link
            href="/login"
            style={{ color: '#9c9898', fontSize: '14px', fontWeight: 500, padding: '8px 14px', borderRadius: '8px', transition: 'color 0.2s', textDecoration: 'none' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#f0eded')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#9c9898')}
          >
            Login
          </Link>
          <Link href="/register">
            <button className="btn-primary" style={{ padding: '9px 18px', fontSize: '14px' }}>
              Get Started →
            </button>
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-nav"
            style={{
              background: 'transparent',
              border: '1px solid #2c2a2a',
              borderRadius: '8px',
              color: '#9c9898',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="mobile-nav"
          style={{
            background: '#111010',
            borderTop: '1px solid #252323',
            padding: '16px clamp(16px, 4vw, 32px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {[
            { label: 'The Problem', href: '#problem' },
            { label: 'How it works', href: '#how-it-works' },
            { label: 'Features', href: '#features' },
            { label: 'Stories', href: '#social-proof' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                color: '#9c9898',
                fontSize: '15px',
                padding: '12px 16px',
                borderRadius: '8px',
                display: 'block',
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(75,43,238,0.08)';
                (e.currentTarget as HTMLElement).style.color = '#f0eded';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = '#9c9898';
              }}
            >
              {link.label}
            </a>
          ))}
          <div style={{ height: '1px', background: '#252323', margin: '8px 0' }} />
          <Link href="/login" style={{ color: '#9c9898', fontSize: '15px', padding: '12px 16px', borderRadius: '8px' }} onClick={() => setMenuOpen(false)}>
            Login
          </Link>
          <Link href="/register" onClick={() => setMenuOpen(false)}>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}>
              Get Started →
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
}
