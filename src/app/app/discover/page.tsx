'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { User, ZORG_CATEGORIES } from '@/types';

const SUBTYPE_LABELS: Record<string, string> = {
  pgb_houder: 'PGB-houder',
  zorgvrager: 'Zorgvrager',
  ouder: 'Ouder',
  mantelzorger: 'Mantelzorger',
  zzp_zorgverlener: 'ZZP\'er',
  student: 'Student',
  huishoudelijke_hulp: 'Huishoudelijke hulp',
  vrijwilliger: 'Vrijwilliger',
};

export default function DiscoverPage() {
  const router = useRouter();
  const { currentUser, users, swipe, swipes } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [showFilter, setShowFilter] = useState(false);

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
        <h2 style={{ marginBottom: '16px', color: '#c2410c' }}>Je hebt alle profielen gezien!</h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Kom later terug voor nieuwe profielen.
        </p>
        <button 
          onClick={() => router.push('/app/matches')} 
          className="btn-primary"
          style={{ background: '#f97316', border: 'none' }}
        >
          Bekijk je matches
        </button>
      </div>
    );
  }

  const currentProfile = potentialUsers[currentIndex];
  const userCategories = ZORG_CATEGORIES.filter(cat => currentProfile.categories?.includes(cat.id));

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '400px', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '20px', color: '#c2410c', margin: 0 }}>Ontdekken</h1>
        <button 
          onClick={() => setShowFilter(!showFilter)}
          style={{
            padding: '8px 16px',
            backgroundColor: 'white',
            border: '2px solid #fed7aa',
            borderRadius: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#c2410c',
            fontSize: '14px',
          }}
        >
          <span>🔍</span>
          <span>Filter</span>
        </button>
      </div>

      {showFilter && (
        <div style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center' }}>
            Filters binnenkort beschikbaar — filter op locatie, beschikbaarheid en meer
          </p>
        </div>
      )}

      {showMatch && matchedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(249, 115, 22, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '24px',
        }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>💛</div>
          <h1 style={{ color: 'white', marginBottom: '8px', fontSize: '32px' }}>Het is een match!</h1>
          <p style={{ color: 'white', opacity: 0.9, marginBottom: '24px', fontSize: '18px' }}>
            Jij en {matchedUser.name} hebben interesse in elkaar!
          </p>
          <img 
            src={matchedUser.photo} 
            alt={matchedUser.name}
            style={{ width: '150px', height: '150px', border: '4px solid white', borderRadius: '50%', marginBottom: '24px', objectFit: 'cover' }}
          />
          <button 
            onClick={handleViewMatches} 
            style={{ 
              backgroundColor: 'white', 
              color: '#f97316', 
              padding: '16px 48px', 
              borderRadius: '30px',
              border: 'none',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Bericht sturen
          </button>
          <button 
            onClick={() => setShowMatch(false)} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'white', 
              marginTop: '16px', 
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Doorgaan met swipen
          </button>
        </div>
      )}

      <div style={{
        width: '100%',
        maxWidth: '360px',
        backgroundColor: 'white',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        position: 'relative',
      }}>
        <div style={{ position: 'relative', height: '320px' }}>
          <img 
            src={currentProfile.photo} 
            alt={currentProfile.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            padding: '20px',
            paddingTop: '60px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <h2 style={{ color: 'white', fontSize: '24px', margin: 0 }}>{currentProfile.name}</h2>
              {currentProfile.subtype && (
                <span style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}>
                  {SUBTYPE_LABELS[currentProfile.subtype] || currentProfile.subtype}
                </span>
              )}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '8px', fontSize: '14px' }}>
              📍 {currentProfile.location}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>
              ⏰ {currentProfile.availabilityHours} uur/week • {currentProfile.gender}
            </p>
          </div>
        </div>

        <div style={{ padding: '16px' }}>
          <p style={{ color: '#374151', fontSize: '14px', marginBottom: '12px', lineHeight: 1.5 }}>
            {currentProfile.description}
          </p>

          {currentProfile.interests && currentProfile.interests.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {currentProfile.interests.slice(0, 4).map((interest, idx) => (
                  <span 
                    key={idx} 
                    style={{ 
                      backgroundColor: '#fff7ed', 
                      color: '#c2410c', 
                      padding: '4px 10px', 
                      borderRadius: '12px', 
                      fontSize: '12px',
                    }}
                  >
                    {interest}
                  </span>
                ))}
                {currentProfile.interests.length > 4 && (
                  <span style={{ fontSize: '12px', color: '#6b7280', padding: '4px' }}>
                    +{currentProfile.interests.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {userCategories.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {userCategories.slice(0, 3).map(cat => (
                  <span 
                    key={cat.id}
                    style={{ 
                      backgroundColor: '#fef3c7', 
                      color: '#92400e', 
                      padding: '4px 10px', 
                      borderRadius: '12px', 
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>{cat.icon}</span>
                    {cat.label}
                  </span>
                ))}
                {userCategories.length > 3 && (
                  <span style={{ fontSize: '12px', color: '#6b7280', padding: '4px' }}>
                    +{userCategories.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {currentProfile.religion && (
            <div style={{ marginBottom: '8px' }}>
              <span style={{ 
                backgroundColor: '#f3f4f6', 
                color: '#4b5563', 
                padding: '4px 10px', 
                borderRadius: '12px', 
                fontSize: '12px',
              }}>
                🕊️ {currentProfile.religion}
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', marginTop: '24px' }}>
        <button 
          onClick={() => handleSwipe('left')}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: '3px solid #ef4444',
            backgroundColor: 'white',
            color: '#ef4444',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </button>
        <button 
          onClick={() => handleSwipe('right')}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: '3px solid #f97316',
            backgroundColor: '#f97316',
            color: 'white',
            fontSize: '28px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ♥
        </button>
      </div>

      <p style={{ color: '#9ca3af', fontSize: '13px', marginTop: '16px' }}>
        {currentIndex + 1} van {potentialUsers.length} profielen
      </p>
    </div>
  );
}