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
      const saved = localStorage.getItem('zorgvank_cookie_consent');
      if (!saved) {
        setAccepted(false);
        setVisible(true);
      }
    }
  }, []);

  const handleAccept = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('zorgvank_cookie_consent', 'accepted');
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
          ZorgVonk gebruikt cookies om de app goed te laten werken. 
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
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '24px',
        background: 'linear-gradient(180deg, #fff7ed 0%, #fed7aa 50%, #fdba74 100%)',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251, 146, 60, 0.3) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-80px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251, 146, 60, 0.2) 0%, transparent 70%)',
        }} />

        <div style={{ textAlign: 'center', marginBottom: '32px', position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'inline-block',
            padding: '16px 24px',
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 4px 12px rgba(251, 146, 60, 0.2)',
            marginBottom: '20px',
          }}>
            <span style={{ fontSize: '16px', color: '#c2410c', fontWeight: 600 }}>
              🇳🇱 In heel Nederland
            </span>
          </div>
          
          <div style={{ fontSize: '80px', marginBottom: '16px', filter: 'drop-shadow(0 4px 8px rgba(251, 146, 60, 0.3))' }}>
            🧡
          </div>
          
          <h1 style={{ 
            color: '#c2410c', 
            marginBottom: '12px',
            fontSize: '42px',
            fontWeight: 800,
            textShadow: '0 2px 4px rgba(251, 146, 60, 0.2)',
          }}>
            ZorgVonk
          </h1>
          
          <p style={{ 
            color: '#9a3412', 
            fontSize: '20px',
            maxWidth: '320px',
            margin: '0 auto',
            fontWeight: 500,
          }}>
            Vind jouw perfecte zorgmatch — persoonlijk, dichtbij en met een klik
          </p>
        </div>

        <div className="card" style={{ 
          maxWidth: '420px', 
          width: '100%', 
          padding: '32px',
          boxShadow: '0 8px 32px rgba(251, 146, 60, 0.2)',
          borderRadius: '24px',
          position: 'relative',
          zIndex: 1,
          border: '2px solid rgba(251, 146, 60, 0.2)',
        }}>
          {!showLogin ? (
            <>
              <h2 style={{ textAlign: 'center', marginBottom: '8px', color: '#c2410c' }}>
                Hoe wil je beginnen?
              </h2>
              
              <p style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                ZorgVonk verbindt jou met de juiste zorg of hulp in de buurt
              </p>
              
              <button 
                onClick={() => handleStartRegistration('zorgzoeker')}
                className="btn-primary"
                style={{ 
                  width: '100%', 
                  marginBottom: '16px', 
                  padding: '20px',
                  background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
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
                  borderColor: '#f97316',
                  color: '#c2410c',
                }}
              >
                <span style={{ fontSize: '28px', marginRight: '16px' }}>💛</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '16px' }}>Ik bied zorg of hulp aan</div>
                  <div style={{ fontSize: '14px', opacity: 0.7 }}>ZZP'er, student, of vrijwilliger</div>
                </div>
              </button>

              <button 
                onClick={() => router.push('/hoe-werkt-het')}
                className="btn-ghost"
                style={{ width: '100%', marginBottom: '16px', color: '#c2410c' }}
              >
                📖 Hoe werkt het?
              </button>

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
                style={{ width: '100%', marginBottom: '16px', background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)' }}
              >
                Inloggen
              </button>
            </>
          )}
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
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
          position: 'relative',
          zIndex: 1,
        }}>
          <p>Gemaakt met 💛 voor de Nederlandse zorg</p>
        </div>
      </main>
    </div>
  );
}