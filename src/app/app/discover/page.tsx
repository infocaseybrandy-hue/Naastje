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

interface FilterState {
  search: string;
  maxDistance: number;
  categories: string[];
  genderPreference: string;
}

export default function DiscoverPage() {
  const router = useRouter();
  const { currentUser, users, swipe, swipes } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    maxDistance: 50,
    categories: [],
    genderPreference: '',
  });

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const renderPhoto = (photo: string, name: string, style: React.CSSProperties) => {
    if (photo && photo.length > 0) {
      return <img src={photo} alt={name} style={style} />;
    }
    return (
      <div style={{ ...style, backgroundColor: '#E8763A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', fontWeight: '500', color: 'white' }}>
        {name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
      </div>
    );
  };

  const filteredUsers = users.filter(user => {
    if (!currentUser) return false;
    if (user.id === currentUser.id) return false;
    if (user.type === currentUser.type) return false;
    
    const hasSwiped = swipes.some(s => s.fromUserId === currentUser.id && s.toUserId === user.id);
    if (hasSwiped) return false;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!user.location.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    if (filters.genderPreference && user.gender !== filters.genderPreference) {
      return false;
    }

    if (filters.categories.length > 0) {
      const userCategories = user.categories || [];
      const hasMatch = filters.categories.some(cat => userCategories.includes(cat));
      if (!hasMatch) return false;
    }

    return true;
  });

  const potentialUsers = filteredUsers;

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex >= potentialUsers.length) return;
    
    const targetUser = potentialUsers[currentIndex];
    swipe(targetUser.id, direction);

    if (direction === 'right') {
      setMatchedUser(targetUser);
      setShowMatch(true);
    }

    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, 300);
  };

  const handleViewMatches = () => {
    setShowMatch(false);
    router.push('/app/matches');
  };

  const handleCategoryToggle = (catId: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(catId)
        ? prev.categories.filter(c => c !== catId)
        : [...prev.categories, catId]
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      maxDistance: 50,
      categories: [],
      genderPreference: '',
    });
  };

  if (!currentUser) return null;

  if (currentIndex >= potentialUsers.length) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', paddingBottom: '80px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
        <h2 style={{ marginBottom: '16px', color: '#c2410c' }}>Je hebt alle profielen gezien!</h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Kom later terug voor nieuwe profielen.
        </p>
        <button 
          onClick={() => router.push('/app/matches')} 
          className="btn-primary"
          style={{ background: '#1B8C82', border: 'none' }}
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
          padding: '20px',
          marginBottom: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          <h3 style={{ color: '#c2410c', marginBottom: '16px', fontSize: '16px' }}>Filters</h3>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Stad of postcode</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Bijv. Amsterdam of 1011"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Maximale reisafstand</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[5, 10, 20, 50].map(dist => (
                <button
                  key={dist}
                  onClick={() => setFilters(prev => ({ ...prev, maxDistance: dist }))}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: filters.maxDistance === dist ? '2px solid #1B8C82' : '2px solid #e5e7eb',
                    borderRadius: '10px',
                    backgroundColor: filters.maxDistance === dist ? '#fff7ed' : 'white',
                    color: filters.maxDistance === dist ? '#c2410c' : '#6b7280',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  {dist} km
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Geslachtsvoorkeur</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { value: '', label: 'Geen voorkeur' },
                { value: 'vrouw', label: 'Vrouw' },
                { value: 'man', label: 'Man' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setFilters(prev => ({ ...prev, genderPreference: opt.value }))}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: filters.genderPreference === opt.value ? '2px solid #1B8C82' : '2px solid #e5e7eb',
                    borderRadius: '10px',
                    backgroundColor: filters.genderPreference === opt.value ? '#fff7ed' : 'white',
                    color: filters.genderPreference === opt.value ? '#c2410c' : '#6b7280',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Zorgcategorieën</label>
            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {ZORG_CATEGORIES.map(cat => (
                <label key={cat.id} style={{ display: 'flex', alignItems: 'center', padding: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(cat.id)}
                    onChange={() => handleCategoryToggle(cat.id)}
                    style={{ marginRight: '10px', width: '18px', height: '18px', accentColor: '#1B8C82' }}
                  />
                  <span style={{ fontSize: '16px', marginRight: '8px' }}>{cat.icon}</span>
                  <span style={{ fontSize: '14px' }}>{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => setShowFilter(false)}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#1B8C82',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Toepassen
            </button>
            <button
              onClick={resetFilters}
              style={{
                background: 'none',
                border: 'none',
                color: '#6b7280',
                fontSize: '14px',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Reset
            </button>
          </div>
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
          {renderPhoto(matchedUser.photo, matchedUser.name, { width: '150px', height: '150px', border: '4px solid white', borderRadius: '50%', marginBottom: '24px', objectFit: 'cover' })}
          <button 
            onClick={handleViewMatches} 
            style={{ 
              backgroundColor: 'white', 
              color: '#1B8C82', 
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
          {renderPhoto(currentProfile.photo, currentProfile.name, { width: '100%', height: '100%', objectFit: 'cover' })}
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
              {currentProfile.birthDate && (
                <span style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}>
                  {currentProfile.birthDate}
                </span>
              )}
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
            <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '4px', fontSize: '14px' }}>
              📍 {currentProfile.location}
            </p>
            {currentProfile.religion && (
              <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '4px', fontSize: '12px' }}>
                🕊️ {currentProfile.religion}
              </p>
            )}
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
                      backgroundColor: '#fff7ed', 
                      color: '#c2410c', 
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
            border: '3px solid #1B8C82',
            backgroundColor: '#1B8C82',
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
        Profiel {currentIndex + 1} van {potentialUsers.length} — swipe of gebruik de knoppen
      </p>
    </div>
  );
}