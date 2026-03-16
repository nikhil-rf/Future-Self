'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

const navItems = [
  { href: '/dashboard', icon: 'grid_view',      label: 'Dashboard' },
  { href: '/create',    icon: 'edit_note',       label: 'Create Reminder' },
  { href: '/timeline',  icon: 'timeline',        label: 'Timeline' },
  { href: '/analytics', icon: 'analytics',       label: 'Analytics' },
  { href: '/settings',  icon: 'settings',        label: 'Settings' },
];

export default function Sidebar() {
  const pathname  = usePathname();
  const { data: session } = useSession();
  const userName  = session?.user?.name || 'User';
  const userEmail = session?.user?.email || '';
  const initials  = userName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <aside
      className="sidebar-desktop"
      style={{
        width: 'var(--sidebar-w, 240px)',
        minHeight: '100vh',
        background: '#111010',
        borderRight: '1px solid #252323',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 12px',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 40,
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <Link
        href="/dashboard"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '32px',
          padding: '4px 8px',
          textDecoration: 'none',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #4b2bee, #7c5af0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#fff', fontVariationSettings: "'FILL' 1" }}>
            electric_bolt
          </span>
        </div>
        <span style={{ fontSize: '16px', fontWeight: 700, color: '#f0eded', letterSpacing: '-0.3px' }}>
          FutureSelf
        </span>
      </Link>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  fontSize: '20px',
                }}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div style={{ height: '1px', background: '#252323', margin: '16px 0' }} />

      {/* User block */}
      <div style={{ padding: '8px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '8px',
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'rgba(75, 43, 238, 0.2)',
              border: '1px solid rgba(75, 43, 238, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700,
              color: '#c4b5fd',
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#f0eded', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userName}
            </p>
            <p style={{ margin: 0, fontSize: '11px', color: '#7a7676', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userEmail}
            </p>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 10px',
            borderRadius: '8px',
            color: '#7a7676',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            background: 'transparent',
            border: 'none',
            width: '100%',
            transition: 'all 0.2s',
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#f87171';
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239, 68, 68, 0.08)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#7a7676';
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
