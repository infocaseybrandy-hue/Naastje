'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function UpgradePage() {
  const router = useRouter();
  const { currentUser, upgradeToPremium } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'ideal' | 'incasso'>('ideal');

  if (!currentUser) {
    router.push('/');
    return null;
  }

  if (currentUser.isPremium) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>⭐</div>
        <h1 style={{ marginBottom: '16px' }}>Je hebt al Premium!</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Geniet van onbeperkt chatten en contactgegevens delen.
        </p>
        <button onClick={() => router.push('/app/profile')} className="btn-primary">
          Terug naar profiel
        </button>
      </div>
    );
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      upgradeToPremium();
      setIsProcessing(false);
      alert('Betaling geslaagd! Welkom bij Premium. Je kunt nu chatten en contactgegevens delen.');
      router.push('/app/matches');
    }, 2000);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '500px', margin: '0 auto' }}>
      <button onClick={() => router.back()} className="btn-ghost" style={{ marginBottom: '16px' }}>
        ← Terug
      </button>

      <h1 style={{ textAlign: 'center', marginBottom: '8px', color: 'var(--primary)' }}>
        Upgrade naar Premium
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px' }}>
        Chat onbeperkt en deel contactgegevens
      </p>

      <div className="payment-card" style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '18px', marginBottom: '8px' }}>Premium lidmaatschap</div>
        <div className="payment-price">€19,95<span>/maand</span></div>
        <p style={{ opacity: 0.9, marginTop: '8px' }}>Maandelijks opzegbaar</p>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>Wat krijg je:</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '12px 0', borderBottom: '1px solid #e5e7eb' }}>
            💬 <strong>Onbeperkt chatten</strong> - Met al je matches
          </li>
          <li style={{ padding: '12px 0', borderBottom: '1px solid #e5e7eb' }}>
            📞 <strong>Contactgegevens delen</strong> - Telefoon en e-mail
          </li>
          <li style={{ padding: '12px 0', borderBottom: '1px solid #e5e7eb' }}>
            🔔 <strong>Berichtnotificaties</strong> - Direct zien wie er belt
          </li>
          <li style={{ padding: '12px 0' }}>
            ✨ <strong>Prioriteit</strong> - Boven in de zoekresultaten
          </li>
        </ul>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>Kies betaalmethode:</h3>
        
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          padding: '16px', 
          border: paymentMethod === 'ideal' ? '2px solid var(--primary)' : '2px solid #e5e7eb',
          borderRadius: '12px',
          marginBottom: '12px',
          cursor: 'pointer',
        }}>
          <input 
            type="radio" 
            name="payment" 
            checked={paymentMethod === 'ideal'}
            onChange={() => setPaymentMethod('ideal')}
          />
          <span style={{ fontSize: '24px' }}>🏦</span>
          <div>
            <strong>iDEAL</strong>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>Direct betalen via je bank</p>
          </div>
        </label>

        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          padding: '16px', 
          border: paymentMethod === 'incasso' ? '2px solid var(--primary)' : '2px solid #e5e7eb',
          borderRadius: '12px',
          cursor: 'pointer',
        }}>
          <input 
            type="radio" 
            name="payment" 
            checked={paymentMethod === 'incasso'}
            onChange={() => setPaymentMethod('incasso')}
          />
          <span style={{ fontSize: '24px' }}>📝</span>
          <div>
            <strong>Automatische incasso</strong>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>Maandelijks automatisch</p>
          </div>
        </label>
      </div>

      <button 
        onClick={handlePayment}
        className="btn-primary"
        style={{ width: '100%', padding: '16px', fontSize: '18px' }}
        disabled={isProcessing}
      >
        {isProcessing ? 'Verwerken...' : 'Nu betalen met Mollie'}
      </button>

      <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '16px' }}>
        🔒 Veilig betalen via Mollie. Je betaalt €19,95 per maand.
      </p>
    </div>
  );
}
