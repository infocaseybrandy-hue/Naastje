'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Gender, ZORG_CATEGORIES, ZORGZOEKER_TASKS } from '@/types';

const DAYS_FULL: Record<string, string> = {
  'maandag': 'Maandag', 'dinsdag': 'Dinsdag', 'woensdag': 'Woensdag', 
  'donderdag': 'Donderdag', 'vrijdag': 'Vrijdag', 'zaterdag': 'Zaterdag', 'zondag': 'Zondag'
};

const TIME_SLOTS_READABLE: Record<string, string> = {
  'ochtend': 'ochtend', 'middag': 'middag', 'avond': 'avond', '24_uur': '24-uur'
};

const formatAvailabilityReadable = (key: string): string => {
  if (key === '24_uur') return '24-uur beschikbaar';
  
  const dayMatch = key.match(/^(maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag|zondag)/);
  const timeMatch = key.match(/(ochtend|middag|avond)$/);
  
  if (!dayMatch && !timeMatch) return key;
  
  const day = dayMatch ? DAYS_FULL[dayMatch[1]] || dayMatch[1] : '';
  const time = timeMatch ? TIME_SLOTS_READABLE[timeMatch[1]] || timeMatch[1] : '';
  
  return `${day} ${time}`.trim();
};

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, logout, updateProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    gender: currentUser?.gender || '' as Gender | '',
    description: currentUser?.description || '',
    location: currentUser?.location || '',
    religion: currentUser?.religion || '',
    interests: currentUser?.interests.join(', ') || '',
    availabilityHours: currentUser?.availabilityHours || 8,
    education: currentUser?.education.join(', ') || '',
    diplomas: currentUser?.diplomas.join(', ') || '',
  });

  if (!currentUser) return null;

  const isZorgzoeker = currentUser.type === 'zorgzoeker';
  const isZorgaanbieder = currentUser.type === 'zorgaanbieder';

  const handleSave = () => {
    updateProfile({
      name: formData.name,
      gender: formData.gender as Gender,
      description: formData.description,
      location: formData.location,
      religion: formData.religion || undefined,
      interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean),
      availabilityHours: formData.availabilityHours,
      education: formData.education.split(',').map(e => e.trim()).filter(Boolean),
      diplomas: formData.diplomas.split(',').map(d => d.trim()).filter(Boolean),
    });
    setIsEditing(false);
  };

  const getCategoryLabel = (id: string) => {
    const cat = ZORG_CATEGORIES.find(c => c.id === id);
    return cat ? { icon: cat.icon, label: cat.label } : { icon: '', label: id };
  };

  const getTaskLabel = (id: string) => {
    const task = ZORGZOEKER_TASKS.find(t => t.id === id);
    return task?.label || id;
  };

  const tagStyle = {
    backgroundColor: '#fff7ed',
    color: '#c2410c',
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', paddingBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#c2410c', fontSize: '20px', margin: 0 }}>Mijn Profiel</h1>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            style={{
              padding: '8px 16px',
              backgroundColor: 'white',
              border: '2px solid #1B8C82',
              borderRadius: '20px',
              color: '#c2410c',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Bewerken
          </button>
        )}
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '20px', 
        padding: '24px', 
        marginBottom: '20px', 
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          margin: '0 auto 16px',
          overflow: 'hidden',
          backgroundColor: '#E8763A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '4px solid #fff7ed',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          fontSize: '36px',
          fontWeight: '500',
          color: 'white',
        }}>
          {currentUser.photo ? (
            <img 
              src={currentUser.photo} 
              alt={currentUser.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span style={{ fontWeight: '500', fontSize: '36px' }}>
              {currentUser.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          )}
        </div>
        
        <h2 style={{ margin: '0 0 8px', fontSize: '22px', color: '#1f2937' }}>{currentUser.name}</h2>
        <p style={{ margin: '0', color: '#6b7280', fontSize: '14px' }}>📍 {currentUser.location}</p>
        
        {isZorgaanbieder && currentUser.isPremium && (
          <div style={{ marginTop: '16px' }}>
            <span style={{
              backgroundColor: '#fef3c7',
              color: '#92400e',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 600,
            }}>
              ⭐ Premium lid
            </span>
          </div>
        )}

        {isZorgaanbieder && !currentUser.isPremium && (
          <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#fef3c7', borderRadius: '12px' }}>
            <p style={{ margin: '0 0 8px', color: '#92400e', fontSize: '13px', fontWeight: 600 }}>Gratis account</p>
            <button 
              onClick={() => router.push('/app/upgrade')}
              style={{
                padding: '8px 20px',
                backgroundColor: '#1B8C82',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Upgrade voor €19,95/maand
            </button>
          </div>
        )}
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '20px', 
        padding: '20px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Over mij</h3>
          {isEditing ? (
            <textarea 
              value={formData.description} 
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '14px',
                minHeight: '100px',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
          ) : (
            <p style={{ margin: 0, color: '#374151', lineHeight: 1.6 }}>{currentUser.description}</p>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Locatie</h3>
          <p style={{ margin: 0, color: '#374151' }}>📍 {currentUser.location}</p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Beschikbaarheid</h3>
          <p style={{ margin: '0 0 12px', color: '#374151' }}>⏰ {currentUser.availabilityHours} uur per week</p>
          {currentUser.availabilityTimes && currentUser.availabilityTimes.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {currentUser.availabilityTimes.map((time, idx) => (
                <span key={idx} style={tagStyle}>
                  {formatAvailabilityReadable(time)}
                </span>
              ))}
            </div>
          )}
        </div>

        {currentUser.religion && currentUser.religion !== 'Geen' && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Geloof of levensbeschouwing</h3>
            <span style={tagStyle}>
              🕊️ {currentUser.religion}
            </span>
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Interesses</h3>
          {isEditing ? (
            <input 
              type="text" 
              value={formData.interests} 
              onChange={(e) => setFormData(prev => ({ ...prev, interests: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {currentUser.interests.length > 0 ? (
                currentUser.interests.map((i, idx) => (
                  <span key={idx} style={tagStyle}>{i}</span>
                ))
              ) : (
                <p style={{ color: '#9ca3af', margin: 0, fontSize: '14px' }}>Geen interesses toegevoegd</p>
              )}
            </div>
          )}
        </div>

        {isZorgzoeker && currentUser.searchTasks && currentUser.searchTasks.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hulp nodig bij</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {currentUser.searchTasks.map((task, idx) => (
                <span key={idx} style={tagStyle}>{getTaskLabel(task)}</span>
              ))}
            </div>
          </div>
        )}

        {isZorgzoeker && (currentUser.hasPets || currentUser.cleaningProducts || currentUser.otherNotes) && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Situatie</h3>
            {currentUser.hasPets && (
              <div style={{ marginBottom: '8px' }}>
                <span style={tagStyle}>🐾 Huisdieren: {currentUser.petType || 'aanwezig'}</span>
              </div>
            )}
            {currentUser.cleaningProducts && (
              <div style={{ marginBottom: '8px' }}>
                <span style={tagStyle}>
                  🧹 Schoonmaakspullen: {currentUser.cleaningProducts === 'mee' ? 'Meenemen' : currentUser.cleaningProducts === 'zelf' ? 'Zelf regelen' : 'Geen voorkeur'}
                </span>
              </div>
            )}
            {currentUser.otherNotes && (
              <p style={{ margin: '8px 0 0', color: '#374151', fontSize: '14px' }}>📝 {currentUser.otherNotes}</p>
            )}
          </div>
        )}

        {isZorgaanbieder && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Opleidingen</h3>
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.education} 
                  onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {currentUser.education.length > 0 ? (
                    currentUser.education.map((e, idx) => (
                      <span key={idx} style={tagStyle}>{e}</span>
                    ))
                  ) : (
                    <p style={{ color: '#9ca3af', margin: 0, fontSize: '14px' }}>Geen opleidingen toegevoegd</p>
                  )}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Diploma&apos;s</h3>
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.diplomas} 
                  onChange={(e) => setFormData(prev => ({ ...prev, diplomas: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {currentUser.diplomas && currentUser.diplomas.length > 0 ? (
                    currentUser.diplomas.map((d, idx) => (
                      <span key={idx} style={tagStyle}>{d}</span>
                    ))
                  ) : (
                    <p style={{ color: '#9ca3af', margin: 0, fontSize: '14px' }}>Geen diploma&apos;s toegevoegd</p>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {currentUser.categories && currentUser.categories.length > 0 && (
          <div>
            <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Zorgcategorieën</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {currentUser.categories.map((cat, idx) => {
                const catInfo = getCategoryLabel(cat);
                return (
                  <span key={idx} style={tagStyle}>
                    {catInfo.icon && <span>{catInfo.icon} </span>}
                    {catInfo.label}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {isEditing && (
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button 
            onClick={handleSave}
            style={{
              flex: 1,
              padding: '14px',
              backgroundColor: '#1B8C82',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Opslaan
          </button>
          <button 
            onClick={() => setIsEditing(false)}
            style={{
              flex: 1,
              padding: '14px',
              backgroundColor: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '16px',
              cursor: 'pointer',
              color: '#6b7280',
            }}
          >
            Annuleren
          </button>
        </div>
      )}

      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <button 
          onClick={logout}
          style={{
            background: 'none',
            border: 'none',
            color: '#ef4444',
            fontSize: '14px',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Uitloggen
        </button>
      </div>
    </div>
  );
}