'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserType } from '@/types';

function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    console.log('CookieConsent mounted, checking localStorage...');
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('naastje_cookie_consent');
      console.log('Saved cookie consent:', saved);
      if (!saved) {
        console.log('Setting visible to true');
        setVisible(true);
      } else {
        setAccepted(true);
      }
    }
  }, []);

  const handleAccept = () => {
    console.log('Cookie accepted');
    if (typeof window !== 'undefined') {
      localStorage.setItem('naastje_cookie_consent', 'accepted');
    }
    setAccepted(true);
    setVisible(false);
  };

  console.log('CookieConsent rendering, visible:', visible, 'accepted:', accepted);

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
          Naastje gebruikt cookies om de app goed te laten werken. 
          We verwerken je persoonsgegevens alleen voor het matchen van zorgvragers en zorgverleners. 
          Je gegevens worden nooit gedeeld met derden.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button 
            onClick={handleAccept}
            className="btn-primary"
            style={{ padding: '12px 32px', background: '#f97316' }}
          >
            Akkoord
          </button>
          <a 
            href="/privacy"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              color: 'var(--text-secondary)',
              textDecoration: 'underline',
              fontSize: '14px'
            }}
          >
            Privacyverklaring
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

  const handleLogin = () => {
    if (!email.trim()) {
      setError('Voer je e-mailadres in');
      return;
    }
    if (!password.trim()) {
      setError('Voer je wachtwoord in');
      return;
    }
    if (password.length < 6) {
      setError('Wachtwoord moet minstens 6 tekens zijn');
      return;
    }
    
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

  const handleDemoLogin = (isZorgzoeker: boolean) => {
    const demoUser = isZorgzoeker 
      ? users.find(u => u.type === 'zorgzoeker') 
      : users.find(u => u.type === 'zorgaanbieder' && !u.isPremium);
    
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
        alignItems: 'center', 
        padding: '24px',
        background: `
          linear-gradient(rgba(255, 248, 240, 0.85), rgba(255, 248, 240, 0.85)),
          url('https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1920&q=80') center/cover no-repeat
        `,
        minHeight: '100vh',
        position: 'relative',
      }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '24px', 
          marginTop: '32px',
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: '16px 32px',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(249, 115, 22, 0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '40px' }}>🤝</span>
            <div>
              <span style={{ fontSize: '14px', color: '#9a3412', fontWeight: 500 }}>
                🇳🇱 In heel Nederland
              </span>
            </div>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px', 
          marginBottom: '16px' 
        }}>
          <span style={{ fontSize: '56px', filter: 'drop-shadow(0 4px 8px rgba(251, 146, 60, 0.3))' }}>
            🧡
          </span>
          <h1 style={{ 
            color: '#c2410c', 
            fontSize: '48px',
            fontWeight: 800,
            textShadow: '0 2px 4px rgba(251, 146, 60, 0.2)',
            margin: 0,
          }}>
            Naastje
          </h1>
        </div>
        
        <p style={{ 
          color: '#9a3412', 
          fontSize: '20px',
          maxWidth: '320px',
          margin: '0 auto 32px',
          fontWeight: 500,
        }}>
          Vind jouw perfecte zorgmatch — persoonlijk, dichtbij en met een klik
        </p>

        <div className="card" style={{ 
          maxWidth: '420px', 
          width: '100%', 
          padding: '32px',
          boxShadow: '0 8px 32px rgba(251, 146, 60, 0.2)',
          borderRadius: '24px',
          border: '2px solid rgba(251, 146, 60, 0.2)',
        }}>
          {!showLogin ? (
            <>
              <h2 style={{ textAlign: 'center', marginBottom: '8px', color: '#c2410c' }}>
                Hoe wil je beginnen?
              </h2>
              
              <p style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                Naastje verbindt jou met de juiste zorg of hulp in de buurt
              </p>
              
              <button 
                onClick={() => handleStartRegistration('zorgzoeker')}
                className="btn-primary"
                style={{ 
                  width: '100%', 
                  marginBottom: '12px', 
                  padding: '20px',
                  background: '#f97316',
                  border: 'none',
                }}
              >
                <span style={{ fontSize: '28px', marginRight: '16px' }}>🏠</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '16px' }}>Ik zoek zorg of hulp</div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>PGB-houder, zorgvrager, of mantelzorger</div>
                </div>
              </button>
              
              <button 
                onClick={() => handleStartRegistration('zorgaanbieder')}
                className="btn-secondary"
                style={{ 
                  width: '100%', 
                  marginBottom: '16px', 
                  padding: '20px',
                  background: 'white',
                  border: '2px solid #f97316',
                  color: '#c2410c',
                }}
              >
                <span style={{ fontSize: '28px', marginRight: '16px' }}>💛</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '16px' }}>Ik bied zorg of hulp aan</div>
                  <div style={{ fontSize: '14px', opacity: 0.7 }}>ZZP&apos;er, student, of vrijwilliger</div>
                </div>
              </button>

              <div style={{ 
                background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '16px',
                textAlign: 'center',
              }}>
                <button 
                  onClick={() => router.push('/hoe-werkt-het')}
                  style={{ 
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    width: '100%',
                    color: '#c2410c',
                  }}
                >
                  <span style={{ fontSize: '32px' }}>💡</span>
                  <span style={{ fontSize: '18px', fontWeight: 600 }}>Hoe werkt het?</span>
                </button>
                <p style={{ fontSize: '13px', color: '#9a3412', marginTop: '8px', margin: '8px 0 0' }}>
                  Ontdek in 4 eenvoudige stappen hoe Naastje werkt
                </p>
              </div>

              <div style={{ textAlign: 'center', borderTop: '1px solid #fed7aa', paddingTop: '20px', marginTop: '8px' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '14px' }}>
                  Al een account?
                </p>
                <button 
                  onClick={() => setShowLogin(true)}
                  className="btn-ghost"
                  style={{ color: '#c2410c' }}
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
                style={{ marginBottom: '16px', padding: '8px 0', color: '#c2410c' }}
              >
                ← Terug
              </button>
              
              <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#c2410c' }}>
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
                style={{ width: '100%', marginBottom: '16px', background: '#f97316', border: 'none' }}
              >
                Inloggen
              </button>

              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <button 
                  onClick={() => router.push('/wachtwoord-vergeten')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#c2410c',
                    fontSize: '14px',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Wachtwoord vergeten?
                </button>
              </div>
            </>
          )}
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ color: '#9a3412', fontSize: '14px', marginBottom: '16px' }}>
            Of probeer de app direct uit:
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => handleDemoLogin(true)}
              className="btn-ghost"
              style={{ 
                border: '2px solid #fed7aa',
                backgroundColor: 'white',
                padding: '12px 20px',
                borderRadius: '12px',
                color: '#c2410c',
              }}
            >
              <span style={{ marginRight: '8px' }}>🏠</span>
              Demo zorgzoeker
            </button>
            <button 
              onClick={() => handleDemoLogin(false)}
              className="btn-ghost"
              style={{ 
                border: '2px solid #fed7aa',
                backgroundColor: 'white',
                padding: '12px 20px',
                borderRadius: '12px',
                color: '#c2410c',
              }}
            >
              <span style={{ marginRight: '8px' }}>💛</span>
              Demo zorgaanbieder
            </button>
          </div>
        </div>

        <div style={{ 
          marginTop: '48px', 
          fontSize: '12px', 
          color: '#9a3412',
        }}>
          <p>Gemaakt met 💛 voor de Nederlandse zorg</p>
        </div>
      </main>
    </div>
  );
}