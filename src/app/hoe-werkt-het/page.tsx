'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
        <button 
          onClick={handleAccept}
          className="btn-primary"
          style={{ padding: '12px 32px', background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)' }}
        >
          Akkoord
        </button>
      </div>
    </div>
  );
}

const steps = [
  {
    icon: '📝',
    title: 'Maak je profiel aan',
    description: 'Vertel ons wat je zoekt of wat je kunt bieden. Het duurt maar 2 minuten!',
  },
  {
    icon: '👆',
    title: 'Swipe op matches in jouw buurt',
    description: 'Bekijk profielen van mensen in jouw regio en geef een like aan wie je aanspreekt.',
  },
  {
    icon: '💚',
    title: 'Match en ontvang berichten',
    description: 'Als jullie beide liken, ontstaat er een match! Je kunt dan berichten sturen.',
  },
  {
    icon: '💬',
    title: 'Chat en maak een afspraak',
    description: 'Leer elkaar beter kennen via de chat en regel een eerste kennismaking.',
  },
];

export default function HoeWerktHetPage() {
  const router = useRouter();

  return (
    <div className="page-container">
      <CookieConsent />
      
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '24px',
        background: 'linear-gradient(180deg, #fff7ed 0%, #fed7aa 50%, #fdba74 100%)',
        minHeight: '100vh',
        position: 'relative',
      }}>
        <button 
          onClick={() => router.push('/')}
          className="btn-ghost"
          style={{ 
            position: 'absolute',
            top: '20px',
            left: '20px',
            color: '#c2410c',
            fontSize: '24px',
          }}
        >
          ←
        </button>

        <div style={{ textAlign: 'center', marginBottom: '32px', marginTop: '32px' }}>
          <h1 style={{ 
            color: '#c2410c', 
            marginBottom: '16px',
            fontSize: '32px',
            fontWeight: 800,
          }}>
            Hoe werkt ZorgVonk?
          </h1>
          
          <p style={{ 
            color: '#9a3412', 
            fontSize: '16px',
            maxWidth: '300px',
            margin: '0 auto',
          }}>
            In 4 eenvoudige stappen naar jouw perfecte zorgmatch
          </p>
        </div>

        <div style={{ width: '100%', maxWidth: '400px' }}>
          {steps.map((step, index) => (
            <div 
              key={index}
              className="card card-hover"
              style={{ 
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '20px',
                border: '2px solid rgba(251, 146, 60, 0.2)',
              }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                flexShrink: 0,
              }}>
                {index + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{step.icon}</div>
                <h3 style={{ color: '#c2410c', marginBottom: '8px', fontSize: '18px' }}>{step.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ 
          marginTop: '32px', 
          textAlign: 'center',
          padding: '24px',
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 4px 16px rgba(251, 146, 60, 0.2)',
          maxWidth: '400px',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
          <h3 style={{ color: '#c2410c', marginBottom: '12px' }}>Gratis voor zorgzoekers</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
            Als PGB-houder of zorgvrager betaal je nooit. Zorgaanbieders kunnen gratis matchen, maar betalen €19,95/maand om te chatten.
          </p>
          
          <Link href="/register?type=zorgzoeker">
            <button 
              className="btn-primary"
              style={{ 
                width: '100%', 
                background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                padding: '16px',
                fontSize: '16px',
              }}
            >
              Begin nu — het is gratis
            </button>
          </Link>
        </div>

        <div style={{ marginTop: '32px' }}>
          <button 
            onClick={() => router.push('/')}
            className="btn-ghost"
            style={{ color: '#c2410c' }}
          >
            ← Terug naar home
          </button>
        </div>
      </main>
    </div>
  );
}