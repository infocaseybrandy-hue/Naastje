'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';

const navItems = [
  { href: '/app/discover', icon: '🔍', label: 'Ontdekken' },
  { href: '/app/matches', icon: '❤️', label: 'Matches' },
  { href: '/app/profile', icon: '👤', label: 'Profiel' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, logout, matches, getMatches } = useApp();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768);
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  const userMatches = getMatches();
  const unreadCount = userMatches.length;

  return (
    <div className="page-container">
      {!isMobile && (
        <nav className="nav-bar" style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: '240px', flexDirection: 'column', justifyContent: 'flex-start', padding: '24px 16px', backgroundColor: 'white' }}>
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--primary)', fontSize: '24px' }}>🏥 ZorgMatch</h2>
          </div>
          
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href ? 'active' : ''}`}
              style={{ flexDirection: 'row', gap: '12px', justifyContent: 'flex-start' }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}

          <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
            <button onClick={logout} className="btn-ghost" style={{ width: '100%', justifyContent: 'flex-start' }}>
              🚪 Uitloggen
            </button>
          </div>
        </nav>
      )}

      <main className="main-content" style={{ paddingLeft: isMobile ? 0 : '240px' }}>
        {children}
      </main>

      {isMobile && (
        <nav className="nav-bar">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href ? 'active' : ''}`}
            >
              <span style={{ fontSize: '20px', position: 'relative' }}>
                {item.icon}
                {item.href === '/app/matches' && unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: '-4px', right: '-8px', backgroundColor: 'var(--error)', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {unreadCount}
                  </span>
                )}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
