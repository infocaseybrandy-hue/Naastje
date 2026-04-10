'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Gender, AvailabilityTime } from '@/types';

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
    availabilityTimes: currentUser?.availabilityTimes || [] as AvailabilityTime[],
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
      availabilityTimes: formData.availabilityTimes,
      education: formData.education.split(',').map(e => e.trim()).filter(Boolean),
      diplomas: formData.diplomas.split(',').map(d => d.trim()).filter(Boolean),
    });
    setIsEditing(false);
  };

  const timeLabels: Record<AvailabilityTime, string> = {
    'ochtend': 'Ochtend',
    'middag': 'Middag',
    'avond': 'Avond',
    'nacht': 'Nacht',
    '24_uur': '24-uurs',
  };

  const genderLabels: Record<Gender, string> = {
    'man': '👨 Man',
    'vrouw': '👩 Vrouw',
    'anders': '🌈 Anders',
  };

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: 'var(--primary)' }}>Mijn Profiel</h1>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="btn-secondary">
            Bewerken
          </button>
        )}
      </div>

      <div className="card" style={{ marginBottom: '24px', textAlign: 'center' }}>
        <img 
          src={currentUser.photo} 
          alt={currentUser.name}
          className="avatar-xl"
          style={{ width: '150px', height: '150px', marginBottom: '16px' }}
        />
        <h2>{currentUser.name}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>📍 {currentUser.location}</p>
        
        {currentUser.gender && (
          <div style={{ marginTop: '8px' }}>
            <span className="badge">{genderLabels[currentUser.gender]}</span>
          </div>
        )}
        
        {isZorgaanbieder && !currentUser.isPremium && (
          <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#fef3c7', borderRadius: '12px' }}>
            <p style={{ margin: 0, color: '#92400e', fontWeight: 600 }}>
              Gratis account - Upgrade naar Premium
            </p>
            <button 
              onClick={() => router.push('/app/upgrade')}
              className="btn-primary"
              style={{ marginTop: '12px', backgroundColor: '#f59e0b' }}
            >
              Upgrade nu voor €19,95/maand
            </button>
          </div>
        )}
        
        {currentUser.isPremium && (
          <div style={{ marginTop: '16px' }}>
            <span className="badge badge-premium">⭐ Premium lid</span>
          </div>
        )}

        <div style={{ marginTop: '16px' }}>
          <span className="badge">{isZorgzoeker ? '🏠 Zorgzoeker' : '💛 Zorgaanbieder'}</span>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="profile-section">
          <div className="profile-section-title">Over mij</div>
          {isEditing ? (
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="textarea-field"
              style={{ minHeight: '100px' }}
            />
          ) : (
            <p>{currentUser.description}</p>
          )}
        </div>

        <div className="profile-section">
          <div className="profile-section-title">Locatie</div>
          {isEditing ? (
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="input-field"
            />
          ) : (
            <p>📍 {currentUser.location}</p>
          )}
        </div>

        <div className="profile-section">
          <div className="profile-section-title">Beschikbaarheid</div>
          {isEditing ? (
            <>
              <select
                value={formData.availabilityHours}
                onChange={(e) => setFormData(prev => ({ ...prev, availabilityHours: parseInt(e.target.value) }))}
                className="input-field"
                style={{ marginBottom: '12px' }}
              >
                {[4, 8, 12, 16, 20, 24, 32, 40].map(h => (
                  <option key={h} value={h}>{h} uur per week</option>
                ))}
              </select>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(Object.keys(timeLabels) as AvailabilityTime[]).map(time => (
                  <label
                    key={time}
                    style={{
                      padding: '8px 12px',
                      border: formData.availabilityTimes.includes(time) 
                        ? '2px solid var(--primary)' 
                        : '2px solid #e5e7eb',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.availabilityTimes.includes(time)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({ ...prev, availabilityTimes: [...prev.availabilityTimes, time] }));
                        } else {
                          setFormData(prev => ({ ...prev, availabilityTimes: prev.availabilityTimes.filter(t => t !== time) }));
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                    {timeLabels[time]}
                  </label>
                ))}
              </div>
            </>
          ) : (
            <div>
              <p>⏰ {currentUser.availabilityHours} uur per week</p>
              {currentUser.availabilityTimes && currentUser.availabilityTimes.length > 0 && (
                <div style={{ marginTop: '8px' }}>
                  {currentUser.availabilityTimes.map((time, idx) => (
                    <span key={idx} className="tag">{timeLabels[time]}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {currentUser.religion && (
          <div className="profile-section">
            <div className="profile-section-title">Geloofsovertuiging</div>
            <p>🕊️ {currentUser.religion}</p>
          </div>
        )}

        <div className="profile-section">
          <div className="profile-section-title">Interesses en hobby&apos;s</div>
          {isEditing ? (
            <input
              type="text"
              value={formData.interests}
              onChange={(e) => setFormData(prev => ({ ...prev, interests: e.target.value }))}
              className="input-field"
              placeholder="Gescheiden door komma's"
            />
          ) : (
            <div>
              {currentUser.interests.length > 0 ? (
                currentUser.interests.map((interest, idx) => (
                  <span key={idx} className="tag">{interest}</span>
                ))
              ) : (
                <p style={{ color: 'var(--text-secondary)' }}>Geen interesses toegevoegd</p>
              )}
            </div>
          )}
        </div>

        {isZorgaanbieder && (
          <>
            <div className="profile-section">
              <div className="profile-section-title">🎓 Opleidingen</div>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                  className="input-field"
                  placeholder="Gescheiden door komma's"
                />
              ) : (
                <div>
                  {currentUser.education.length > 0 ? (
                    currentUser.education.map((edu, idx) => (
                      <span key={idx} className="tag">{edu}</span>
                    ))
                  ) : (
                    <p style={{ color: 'var(--text-secondary)' }}>Geen opleidingen toegevoegd</p>
                  )}
                </div>
              )}
            </div>

            <div className="profile-section">
              <div className="profile-section-title">📜 Diploma&apos;s en certificaten</div>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.diplomas}
                  onChange={(e) => setFormData(prev => ({ ...prev, diplomas: e.target.value }))}
                  className="input-field"
                  placeholder="Gescheiden door komma's"
                />
              ) : (
                <div>
                  {currentUser.diplomas && currentUser.diplomas.length > 0 ? (
                    currentUser.diplomas.map((dip, idx) => (
                      <span key={idx} className="tag">{dip}</span>
                    ))
                  ) : (
                    <p style={{ color: 'var(--text-secondary)' }}>Geen diploma&apos;s toegevoegd</p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {isEditing && (
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleSave} className="btn-primary" style={{ flex: 1 }}>
            Opslaan
          </button>
          <button onClick={() => setIsEditing(false)} className="btn-secondary" style={{ flex: 1 }}>
            Annuleren
          </button>
        </div>
      )}

      <div style={{ marginTop: '48px', textAlign: 'center' }}>
        <button onClick={logout} className="btn-ghost" style={{ color: 'var(--error)' }}>
          Uitloggen
        </button>
      </div>
    </div>
  );
}