'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WachtwoordVergetenPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Voer je e-mailadres in');
      return;
    }
    
    if (!email.includes('@')) {
      setError('Voer een geldig e-mailadres in');
      return;
    }
    
    setSubmitted(true);
    setError('');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)',
      padding: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ 
        maxWidth: '400px', 
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '32px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '40px' }}>🧡</span>
            <h1 style={{ color: '#c2410c', fontSize: '28px', margin: '8px 0 0' }}>Naastje</h1>
          </Link>
        </div>

        <h2 style={{ color: '#c2410c', fontSize: '20px', marginBottom: '8px', textAlign: 'center' }}>
          Wachtwoord resetten
        </h2>
        
        {!submitted ? (
          <>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px', textAlign: 'center' }}>
              Voer je e-mailadres in. Als dit account bij ons bekend is, ontvang je binnen enkele minuten een link om je wachtwoord te resetten.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '14px' }}>
                  E-mailadres
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jouw@email.nl"
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
                {error && (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px' }}>{error}</p>
                )}
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
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
                Verzenden
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
            <p style={{ color: '#059669', fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
              E-mail verzonden!
            </p>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
              Als dit e-mailadres bij ons bekend is, ontvang je binnen enkele minuten een link om je wachtwoord te resetten.
            </p>
            <button
              onClick={() => router.push('/')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#1B8C82',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Terug naar inloggen
            </button>
          </div>
        )}

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link 
            href="/" 
            style={{ color: '#c2410c', fontSize: '14px', textDecoration: 'underline' }}
          >
            ← Terug naar inloggen
          </Link>
        </div>
      </div>
    </div>
  );
}