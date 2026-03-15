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
        background: 'rgba(10, 10, 15, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(30, 30, 46, 0.6)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
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
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
            }}
          >
            ⚡
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.3px' }}>
            FutureSelf
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hidden md:flex">
          <a
            href="#features"
            style={{ color: '#9ca3af', fontSize: '14px', padding: '8px 16px', borderRadius: '8px', transition: 'color 0.2s', cursor: 'pointer' }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#e2e8f0')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#9ca3af')}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            style={{ color: '#9ca3af', fontSize: '14px', padding: '8px 16px', borderRadius: '8px', transition: 'color 0.2s', cursor: 'pointer' }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#e2e8f0')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#9ca3af')}
          >
            How it Works
          </a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/login"
            style={{
              color: '#9ca3af',
              fontSize: '14px',
              fontWeight: 500,
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'color 0.2s',
              textDecoration: 'none',
            }}
          >
            Login
          </Link>
          <Link href="/register">
            <button className="btn-primary" style={{ padding: '9px 20px', fontSize: '14px' }}>
              Get Started →
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
