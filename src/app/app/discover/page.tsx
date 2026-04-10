'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { User } from '@/types';

export default function DiscoverPage() {
  const router = useRouter();
  const { currentUser, users, swipe, swipes } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);

  const potentialUsers = users.filter(user => {
    if (!currentUser) return false;
    if (user.id === currentUser.id) return false;
    if (user.type === currentUser.type) return false;
    
    const hasSwiped = swipes.some(s => s.fromUserId === currentUser.id && s.toUserId === user.id);
    return !hasSwiped;
  });

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex >= potentialUsers.length) return;
    
    const targetUser = potentialUsers[currentIndex];
    swipe(targetUser.id, direction);

    if (direction === 'right') {
      const otherSwipedRight = swipes.some(
        s => s.toUserId === currentUser?.id && s.fromUserId === targetUser.id && s.direction === 'right'
      );
      
      if (otherSwipedRight) {
        setMatchedUser(targetUser);
        setShowMatch(true);
      }
    }

    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, 300);
  };

  const handleViewMatches = () => {
    setShowMatch(false);
    router.push('/app/matches');
  };

  if (!currentUser) return null;

  if (currentIndex >= potentialUsers.length) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
        <h2 style={{ marginBottom: '16px', color: 'var(--primary)' }}>Je hebt alle profielen gezien!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Kom later terug voor nieuwe profielen.
        </p>
        <button onClick={() => router.push('/app/matches')} className="btn-primary">
          Bekijk je matches
        </button>
      </div>
    );
  }

  const currentProfile = potentialUsers[currentIndex];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {showMatch && matchedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(124, 58, 237, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '24px',
        }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>💜</div>
          <h1 style={{ color: 'white', marginBottom: '8px', fontSize: '32px' }}>Het is een match!</h1>
          <p style={{ color: 'white', opacity: 0.9, marginBottom: '24px', fontSize: '18px' }}>
            Jij en {matchedUser.name} hebben interesse in elkaar!
          </p>
          <img 
            src={matchedUser.photo} 
            alt={matchedUser.name}
            className="avatar-xl"
            style={{ width: '150px', height: '150px', border: '4px solid white', marginBottom: '24px' }}
          />
          <button onClick={handleViewMatches} className="btn-primary" style={{ backgroundColor: 'white', color: 'var(--primary)', padding: '16px 48px' }}>
            Bericht sturen
          </button>
          <button onClick={() => setShowMatch(false)} className="btn-ghost" style={{ color: 'white', marginTop: '16px' }}>
            Doorgaan met swipen
          </button>
        </div>
      )}

      <div className="swipe-card">
        <img 
          src={currentProfile.photo} 
          alt={currentProfile.name}
          className="swipe-card-image"
        />
        <div className="swipe-card-overlay">
          <h2 style={{ marginBottom: '4px' }}>{currentProfile.name}</h2>
          <p style={{ opacity: 0.9, marginBottom: '8px' }}>📍 {currentProfile.location}</p>
          <p style={{ opacity: 0.8, fontSize: '14px' }}>
            ⏰ {currentProfile.availabilityHours} uur/week • {currentProfile.availabilityTimes?.join(', ') || 'flexibel'}
          </p>
        </div>
      </div>

      <div style={{ marginTop: '24px', maxWidth: '360px', width: '100%' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', textAlign: 'center' }}>
          {currentProfile.description}
        </p>

        {currentProfile.interests && currentProfile.interests.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontWeight: 600, marginBottom: '8px' }}>Interesses:</p>
            <div>
              {currentProfile.interests.map((interest, idx) => (
                <span key={idx} className="tag">{interest}</span>
              ))}
            </div>
          </div>
        )}

        {currentProfile.type === 'zorgaanbieder' && currentProfile.education && currentProfile.education.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontWeight: 600, marginBottom: '8px' }}>Opleidingen:</p>
            <div>
              {currentProfile.education.map((edu, idx) => (
                <span key={idx} className="tag">{edu}</span>
              ))}
            </div>
          </div>
        )}

        {currentProfile.religion && (
          <div style={{ marginBottom: '16px' }}>
            <span className="badge">🕊️ {currentProfile.religion}</span>
          </div>
        )}
      </div>

      <div className="swipe-actions">
        <button 
          className="swipe-btn swipe-btn-no"
          onClick={() => handleSwipe('left')}
        >
          ✕
        </button>
        <button 
          className="swipe-btn swipe-btn-yes"
          onClick={() => handleSwipe('right')}
        >
          ♥
        </button>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
        {currentIndex + 1} van {potentialUsers.length} profielen
      </p>
    </div>
  );
}
