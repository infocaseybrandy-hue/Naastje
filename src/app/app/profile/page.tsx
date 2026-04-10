'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, logout, updateProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    description: currentUser?.description || '',
    location: currentUser?.location || '',
    religion: currentUser?.religion || '',
    interests: currentUser?.interests.join(', ') || '',
    availability: currentUser?.availability || 8,
    education: currentUser?.education.join(', ') || '',
  });

  if (!currentUser) return null;

  const isZorgzoeker = currentUser.type === 'zorgzoeker';
  const isZorgaanbieder = currentUser.type === 'zorgaanbieder';

  const handleSave = () => {
    updateProfile({
      name: formData.name,
      description: formData.description,
      location: formData.location,
      religion: formData.religion || undefined,
      interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean),
      availability: formData.availability,
      education: formData.education.split(',').map(e => e.trim()).filter(Boolean),
    });
    setIsEditing(false);
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
            <select
              value={formData.availability}
              onChange={(e) => setFormData(prev => ({ ...prev, availability: parseInt(e.target.value) }))}
              className="input-field"
            >
              {[4, 8, 12, 16, 20, 24, 32, 40].map(h => (
                <option key={h} value={h}>{h} uur per week</option>
              ))}
            </select>
          ) : (
            <p>⏰ {currentUser.availability} uur per week</p>
          )}
        </div>

        {currentUser.religion && (
          <div className="profile-section">
            <div className="profile-section-title">Geloofsovertuiging</div>
            {isEditing ? (
              <select
                value={formData.religion}
                onChange={(e) => setFormData(prev => ({ ...prev, religion: e.target.value }))}
                className="input-field"
              >
                <option value="">Kies</option>
                <option value="Geen">Geen</option>
                <option value="Christelijk">Christelijk</option>
                <option value="Katholiek">Katholiek</option>
                <option value="Protestants">Protestants</option>
                <option value="Islam">Islam</option>
              </select>
            ) : (
              <p>🕊️ {currentUser.religion}</p>
            )}
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
              {currentUser.interests.map((interest, idx) => (
                <span key={idx} className="tag">{interest}</span>
              ))}
            </div>
          )}
        </div>

        {isZorgaanbieder && (
          <div className="profile-section">
            <div className="profile-section-title">Opleidingen en cursussen</div>
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
