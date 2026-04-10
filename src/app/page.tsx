'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserType } from '@/types';

function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('zorgmatch_cookie_consent');
      if (!saved) {
        setAccepted(false);
        setVisible(true);
      }
    }
  }, []);

  const handleAccept = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('zorgmatch_cookie_consent', 'accepted');
    }
    setAccepted(true);
    setVisible(false);
  };

  if (!visible || accepted) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
      padding: '20px',
      zIndex: 1000,
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>🍪</div>
        <h3 style={{ marginBottom: '12px', color: 'var(--primary)' }}>Privacy & Cookies</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
          ZorgMatch gebruikt cookies om de app goed te laten werken. 
          We verwerken je persoonsgegevens alleen voor het matchen van zorgvragers en zorgverleners. 
          Je gegevens worden nooit gedeeld met derden.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button 
            onClick={handleAccept}
            className="btn-primary"
            style={{ padding: '12px 32px' }}
          >
            Akkoord
          </button>
          <a 
            href="#"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              color: 'var(--text-secondary)',
              textDecoration: 'underline',
              fontSize: '14px'
            }}
            onClick={(e) => {
              e.preventDefault();
              alert('Lees meer over ons privacybeleid op onze website.');
            }}
          >
            Meer info
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const { login, users } = useApp();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showFeatures, setShowFeatures] = useState(false);

  const handleLogin = () => {
    const user = users.find(u => u.email === email);
    if (user) {
      login(user);
      router.push('/app');
    } else {
      setError('Geen account gevonden met dit e-mailadres');
    }
  };

  const handleStartRegistration = (type: UserType) => {
    router.push(`/register?type=${type}`);
  };

  const handleDemoLogin = (isPGB: boolean) => {
    const demoUser = isPGB 
      ? users.find(u => u.type === 'pgb_houder') 
      : users.find(u => u.type === 'zorgverlener' && !u.isPremium);
    
    if (demoUser) {
      login(demoUser);
      router.push('/app');
    }
  };

  return (
    <div className="page-container">
      <CookieConsent />
      
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '24px',
        background: 'linear-gradient(180deg, #fdf4ff 0%, #f3e8ff 50%, #ede9fe 100%)',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167, 139, 250, 0.3) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-150px',
          left: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196, 181, 253, 0.4) 0%, transparent 70%)',
        }} />

        <div style={{ textAlign: 'center', marginBottom: '32px', position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'inline-block',
            padding: '16px 24px',
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)',
            marginBottom: '20px',
          }}>
            <span style={{ fontSize: '16px', color: 'var(--primary)', fontWeight: 600 }}>
              🇳🇱 Nederlandse zorgmatching
            </span>
          </div>
          
          <div style={{ fontSize: '80px', marginBottom: '16px', filter: 'drop-shadow(0 4px 8px rgba(124, 58, 237, 0.3))' }}>
            🏥
          </div>
          
          <h1 style={{ 
            color: 'var(--primary)', 
            marginBottom: '12px',
            fontSize: '36px',
            fontWeight: 700,
            textShadow: '0 2px 4px rgba(124, 58, 237, 0.2)',
          }}>
            ZorgMatch
          </h1>
          
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '18px',
            maxWidth: '300px',
            margin: '0 auto',
          }}>
            Vind de perfecte zorgverlener die bij jou past
          </p>
        </div>

        <div className="card" style={{ 
          maxWidth: '420px', 
          width: '100%', 
          padding: '32px',
          boxShadow: '0 8px 32px rgba(124, 58, 237, 0.15)',
          borderRadius: '24px',
          position: 'relative',
          zIndex: 1,
        }}>
          {!showLogin ? (
            <>
              <h2 style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--primary)' }}>
                Hoe wil je beginnen?
              </h2>
              
              <button 
                onClick={() => handleStartRegistration('pgb_houder')}
                className="btn-primary"
                style={{ 
                  width: '100%', 
                  marginBottom: '16px', 
                  padding: '20px',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
                }}
              >
                <span style={{ fontSize: '28px', marginRight: '16px' }}>🧑‍🤝‍🧑</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '16px' }}>Ik zoek zorg</div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>PGB-houder</div>
                </div>
              </button>
              
              <button 
                onClick={() => handleStartRegistration('zorgverlener')}
                className="btn-secondary"
                style={{ 
                  width: '100%', 
                  marginBottom: '16px', 
                  padding: '20px',
                  background: 'white',
                }}
              >
                <span style={{ fontSize: '28px', marginRight: '16px' }}>👩‍⚕️</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '16px' }}>Ik bied zorg aan</div>
                  <div style={{ fontSize: '14px', opacity: 0.7 }}>ZZP'er of student</div>
                </div>
              </button>

              <button 
                onClick={() => setShowFeatures(true)}
                className="btn-ghost"
                style={{ width: '100%', marginBottom: '16px' }}
              >
                📘 Meer informatie
              </button>

              {showFeatures && (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f5f3ff',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  textAlign: 'left',
                }}>
                  <p style={{ fontWeight: 600, marginBottom: '12px' }}>Waarom ZorgMatch?</p>
                  <ul style={{ fontSize: '14px', paddingLeft: '16px', margin: 0, lineHeight: 1.8 }}>
                    <li>Gratis voor PGB-houders</li>
                    <li>Eenvoudig swipen naar je ideale zorgverlener</li>
                    <li>Veilig en vertrouwelijk</li>
                    <li>Direct contact na een match</li>
                  </ul>
                </div>
              )}

              <div style={{ textAlign: 'center', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '14px' }}>
                  Al een account?
                </p>
                <button 
                  onClick={() => setShowLogin(true)}
                  className="btn-ghost"
                >
                  Inloggen →
                </button>
              </div>
            </>
          ) : (
            <>
              <button 
                onClick={() => setShowLogin(false)}
                className="btn-ghost"
                style={{ marginBottom: '16px', padding: '8px 0' }}
              >
                ← Terug
              </button>
              
              <h2 style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--primary)' }}>
                Welkom terug 👋
              </h2>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>E-mailadres</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="jouw@email.nl"
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Wachtwoord</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>

              {error && <p className="error-message">{error}</p>}
              
              <button 
                onClick={handleLogin}
                className="btn-primary"
                style={{ width: '100%', marginBottom: '16px' }}
              >
                Inloggen
              </button>
            </>
          )}
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
            Of probeer de app direct uit:
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => handleDemoLogin(true)}
              className="btn-ghost"
              style={{ 
                border: '2px solid #e5e7eb',
                backgroundColor: 'white',
                padding: '12px 20px',
                borderRadius: '12px',
              }}
            >
              <span style={{ marginRight: '8px' }}>🧑‍🤝‍🧑</span>
              Demo PGB-houder
            </button>
            <button 
              onClick={() => handleDemoLogin(false)}
              className="btn-ghost"
              style={{ 
                border: '2px solid #e5e7eb',
                backgroundColor: 'white',
                padding: '12px 20px',
                borderRadius: '12px',
              }}
            >
              <span style={{ marginRight: '8px' }}>👩‍⚕️</span>
              Demo zorgverlener
            </button>
          </div>
        </div>

        <div style={{ 
          marginTop: '48px', 
          fontSize: '12px', 
          color: 'var(--text-secondary)',
          position: 'relative',
          zIndex: 1,
        }}>
          <p>Gemaakt met ❤️ voor de Nederlandse zorg</p>
        </div>
      </main>
    </div>
  );
}