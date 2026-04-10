'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserType } from '@/types';

export default function Home() {
  const router = useRouter();
  const { login, register, users } = useApp();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
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
    setSelectedType(type);
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
    <div className="page-container" style={{ background: 'linear-gradient(135deg, #FEFCFF 0%, #f3e8ff 100%)' }}>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>🏥</div>
          <h1 style={{ color: 'var(--primary)', marginBottom: '8px' }}>ZorgMatch</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
            Vind de perfecte match voor jouw zorg
          </p>
        </div>

        <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '32px' }}>
          {!showLogin ? (
            <>
              <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Hoe wil je beginnen?</h2>
              
              <button 
                onClick={() => handleStartRegistration('pgb_houder')}
                className="btn-primary"
                style={{ width: '100%', marginBottom: '16px', padding: '20px' }}
              >
                <span style={{ fontSize: '24px', marginRight: '12px' }}>🧑‍🤝‍🧑</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700 }}>Ik zoek zorg</div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>PGB-houder</div>
                </div>
              </button>
              
              <button 
                onClick={() => handleStartRegistration('zorgverlener')}
                className="btn-secondary"
                style={{ width: '100%', marginBottom: '24px', padding: '20px' }}
              >
                <span style={{ fontSize: '24px', marginRight: '12px' }}>👩‍⚕️</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700 }}>Ik bied zorg aan</div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>ZZP&apos;er of student</div>
                </div>
              </button>

              <div style={{ textAlign: 'center', borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>Al een account?</p>
                <button 
                  onClick={() => setShowLogin(true)}
                  className="btn-ghost"
                >
                  Inloggen
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Inloggen</h2>
              
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
                style={{ width: '100%', marginBottom: '24px' }}
              >
                Inloggen
              </button>

              <div style={{ textAlign: 'center' }}>
                <button 
                  onClick={() => setShowLogin(false)}
                  className="btn-ghost"
                >
                  Terug
                </button>
              </div>
            </>
          )}
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px' }}>Of probeer de app uit met een demo:</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button 
              onClick={() => handleDemoLogin(true)}
              className="btn-ghost"
              style={{ border: '1px solid #e5e7eb' }}
            >
              Demo als PGB-houder
            </button>
            <button 
              onClick={() => handleDemoLogin(false)}
              className="btn-ghost"
              style={{ border: '1px solid #e5e7eb' }}
            >
              Demo als zorgverlener
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
