'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';

const navItems = [
  { href: '/app/discover', icon: '🔍', label: 'Ontdekken' },
  { href: '/app/berichten', icon: '📝', label: 'Berichten' },
  { href: '/app/matches', icon: '❤️', label: 'Matches' },
  { href: '/app/profile', icon: '👤', label: 'Profiel' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, logout, getMatches } = useApp();
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
      <main className="main-content">
        {children}
      </main>

      <nav className="nav-bar" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        padding: '12px 8px',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
        zIndex: 100,
      }}>
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 16px',
              borderRadius: '12px',
              textDecoration: 'none',
              color: pathname === item.href ? '#1B8C82' : '#6b7280',
              backgroundColor: pathname === item.href ? '#fff7ed' : 'transparent',
              fontSize: '12px',
            }}
          >
            <span style={{ fontSize: '24px', position: 'relative' }}>
              {item.icon}
              {item.href === '/app/matches' && unreadCount > 0 && (
                <span style={{ 
                  position: 'absolute', 
                  top: '-4px', 
                  right: '-8px', 
                  backgroundColor: '#ef4444', 
                  color: 'white', 
                  borderRadius: '50%', 
                  width: '18px', 
                  height: '18px', 
                  fontSize: '10px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  {unreadCount}
                </span>
              )}
            </span>
            <span style={{ fontWeight: pathname === item.href ? 600 : 400 }}>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}