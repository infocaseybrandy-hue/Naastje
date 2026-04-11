'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

function CookieConsent() {
  const [visible, setVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('naastje_cookie_consent') === null;
    }
    return false;
  });
  const [accepted, setAccepted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('naastje_cookie_consent') !== null;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.getItem('naastje_cookie_consent');
    }
  }, []);

  const handleAccept = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('naastje_cookie_consent', 'accepted');
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
        <h3 style={{ marginBottom: '12px', color: '#c2410c' }}>Privacy & Cookies</h3>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px', lineHeight: 1.6 }}>
          Naastje gebruikt cookies om de app goed te laten werken. 
          Je persoonsgegevens worden alleen gebruikt voor het matchen van zorgvragers en zorgverleners.
        </p>
        <button 
          onClick={handleAccept}
          style={{
            padding: '12px 32px',
            background: '#f97316',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          Akkoord
        </button>
      </div>
    </div>
  );
}

export default function PrivacyPage() {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage('Voer je e-mailadres in');
      return;
    }
    setMessage('Als dit e-mailadres bij ons bekend is, ontvang je binnen enkele minuten een link om je wachtwoord te resetten.');
    setShowEmailForm(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)',
      padding: '24px',
    }}>
      <CookieConsent />
      
      <div style={{ 
        maxWidth: '700px', 
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '32px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '40px' }}>🧡</span>
            <h1 style={{ color: '#c2410c', fontSize: '28px', margin: '8px 0 0' }}>Naastje</h1>
          </Link>
        </div>

        <h1 style={{ color: '#c2410c', fontSize: '24px', marginBottom: '24px' }}>Privacyverklaring</h1>
        
        <div style={{ fontSize: '14px', lineHeight: 1.8, color: '#374151' }}>
          <p style={{ marginBottom: '16px' }}>
            <strong>Laatst bijgewerkt:</strong> 11 april 2026
          </p>

          <h2 style={{ fontSize: '18px', color: '#c2410c', marginTop: '24px', marginBottom: '12px' }}>1. Wie we zijn</h2>
          <p style={{ marginBottom: '16px' }}>
            Naastje is een Nederlands platform dat PGB-houders en zorgvragers verbindt met zorgverleners, mantelzorgers en vrijwilligers. 
            Wij zijn verantwoordelijk voor de verwerking van uw persoonsgegevens zoals beschreven in deze privacyverklaring.
          </p>

          <h2 style={{ fontSize: '18px', color: '#c2410c', marginTop: '24px', marginBottom: '12px' }}>2. Welke gegevens we verzamelen</h2>
          <p style={{ marginBottom: '12px' }}>Wij verzamelen de volgende persoonsgegevens:</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <li>Naam en e-mailadres (bij registratie)</li>
            <li>Profielfoto en profielbeschrijving</li>
            <li>Locatie (stad of regio)</li>
            <li>Geslacht/gender en geboortedatum</li>
            <li>Geloof of levensbeschouwing (optioneel)</li>
            <li>Interesses en hobbies</li>
            <li>Beschikbaarheid (dagen en tijden)</li>
            <li>Opleiding en diploma&apos;s (voor zorgverleners)</li>
            <li>Zorgcategorieën en hulpbehoeften</li>
          </ul>

          <h2 style={{ fontSize: '18px', color: '#c2410c', marginTop: '24px', marginBottom: '12px' }}>3. Waarom we gegevens verwerken</h2>
          <p style={{ marginBottom: '12px' }}>Wij gebruiken uw gegevens voor:</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <li>Het matchen van zorgvragers met zorgverleners</li>
            <li>Het tonen van profielen op ons platform</li>
            <li>Communicatie tussen matched gebruikers</li>
            <li>Verificatie van uw identiteit bij inloggen</li>
          </ul>

          <h2 style={{ fontSize: '18px', color: '#c2410c', marginTop: '24px', marginBottom: '12px' }}>4. Delen met derden</h2>
          <p style={{ marginBottom: '16px' }}>
            Wij delen uw gegevens <strong>niet</strong> met derden voor commerciële doeleinden. 
            Uw profiel is zichtbaar voor andere gebruikers van het platform. 
            Bij een match kunnen beide partijen elkaars profielgegevens zien.
          </p>

          <h2 style={{ fontSize: '18px', color: '#c2410c', marginTop: '24px', marginBottom: '12px' }}>5. Cookies</h2>
          <p style={{ marginBottom: '16px' }}>
            Wij gebruiken cookies om de app goed te laten werken en uw sessie te onthouden. 
            Cookies worden alleen gebruikt voor functionele doeleinden en worden niet gedeeld met advertentiepartijen.
          </p>

          <h2 style={{ fontSize: '18px', color: '#c2410c', marginTop: '24px', marginBottom: '12px' }}>6. Uw rechten</h2>
          <p style={{ marginBottom: '12px' }}>U heeft het recht om:</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <li>Uw profielgegevens in te zien en te wijzigen</li>
            <li>Uw account te verwijderen</li>
            <li>Uw gegevens op te vragen (dataportabiliteit)</li>
            <li>Bezwaar te maken tegen verwerking</li>
          </ul>
          <p style={{ marginBottom: '16px' }}>
            Om deze rechten uit te oefenen kunt u contact met ons opnemen via <strong>info@naastje.nl</strong>.
          </p>

          <h2 style={{ fontSize: '18px', color: '#c2410c', marginTop: '24px', marginBottom: '12px' }}>7. Bewijs en Klachten</h2>
          <p style={{ marginBottom: '16px' }}>
            Wij bewaren alleen gegevens die noodzakelijk zijn voor onze dienstverlening. 
            U kunt een klacht indienen bij de Autoriteit Persoonsgegevens als u vindt dat wij niet correct met uw gegevens omgaan.
          </p>

          <h2 style={{ fontSize: '18px', color: '#c2410c', marginTop: '24px', marginBottom: '12px' }}>8. Contact</h2>
          <p style={{ marginBottom: '16px' }}>
            Voor vragen over deze privacyverklaring kunt u contact opnemen:<br/>
            <strong>E-mail:</strong> info@naastje.nl<br/>
            <strong>Adres:</strong> Naastje, Nederland
          </p>
        </div>

        <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
          <Link 
            href="/" 
            style={{ 
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#f97316',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            ← Terug naar home
          </Link>
        </div>
      </div>

      {/* Wachtwoord vergeten modal */}
      {showEmailForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%',
          }}>
            <h3 style={{ marginBottom: '16px', color: '#c2410c' }}>Wachtwoord resetten</h3>
            <p style={{ marginBottom: '16px', color: '#6b7280', fontSize: '14px' }}>
              Voer je e-mailadres in. Als dit account bij ons bekend is, ontvang je een link om je wachtwoord te resetten.
            </p>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jouw@email.nl"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  boxSizing: 'border-box',
                }}
              />
              {message && (
                <p style={{ color: '#059669', fontSize: '14px', marginBottom: '16px' }}>{message}</p>
              )}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#f3f4f6',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#f97316',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Versturen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}