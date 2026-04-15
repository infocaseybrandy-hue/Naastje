'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function UpgradePage() {
  const router = useRouter();
  const { currentUser, upgradeToPremium } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<'ideal' | 'incasso'>('ideal');
  const [selectedBank, setSelectedBank] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBankSelect, setShowBankSelect] = useState(false);

  const banks = [
    { id: 'abn', name: 'ABN AMRO', logo: '🏦' },
    { id: 'ing', name: 'ING', logo: '🏦' },
    { id: 'rabo', name: 'Rabobank', logo: '🏦' },
    { id: 'sns', name: 'SNS Bank', logo: '🏦' },
    { id: 'asn', name: 'ASN Bank', logo: '🏦' },
    { id: 'bunq', name: 'Bunq', logo: '🏦' },
    { id: 'knab', name: 'Knab', logo: '🏦' },
    { id: 'triodos', name: 'Triodos Bank', logo: '🏦' },
  ];

  const handlePayment = () => {
    if (paymentMethod === 'ideal' && !selectedBank) {
      setShowBankSelect(true);
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      upgradeToPremium();
      setIsProcessing(false);
      alert('Betaling geslaagd! Welkom bij Premium. Je kunt nu chatten en contactgegevens delen.');
      router.push('/app/matches');
    }, 2000);
  };

  if (!currentUser) return null;

  if (currentUser.isPremium) {
    return (
      <div style={{ padding: '24px', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>⭐</div>
        <h1 style={{ color: '#c2410c', marginBottom: '16px' }}>Je bent al Premium!</h1>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Je hebt al toegang tot onbeperkt chatten en contactgegevens delen.
        </p>
        <button 
          onClick={() => router.push('/app/matches')}
          style={{
            padding: '14px 32px',
            backgroundColor: '#1B8C82',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Naar mijn matches
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '500px', margin: '0 auto', paddingBottom: '80px' }}>
      <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', marginBottom: '16px' }}>
        ←
      </button>

      <h1 style={{ textAlign: 'center', marginBottom: '8px', color: '#c2410c', fontSize: '24px' }}>
        Upgrade naar Premium
      </h1>
      <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '32px' }}>
        Chat onbeperkt en deel contactgegevens
      </p>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: '18px', marginBottom: '8px', fontWeight: 600 }}>Premium lidmaatschap</div>
        <div style={{ fontSize: '32px', fontWeight: 700, color: '#c2410c' }}>€19,95<span style={{ fontSize: '16px', fontWeight: 400 }}>/maand</span></div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>Betaalmethode</h3>
        
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          padding: '16px', 
          border: paymentMethod === 'ideal' ? '2px solid #1B8C82' : '2px solid #e5e7eb',
          borderRadius: '12px',
          marginBottom: '12px',
          cursor: 'pointer',
          backgroundColor: paymentMethod === 'ideal' ? '#fff7ed' : 'white',
        }}>
          <input 
            type="radio" 
            name="payment" 
            checked={paymentMethod === 'ideal'}
            onChange={() => { setPaymentMethod('ideal'); setSelectedBank(''); }}
            style={{ accentColor: '#1B8C82' }}
          />
          <span style={{ fontSize: '24px' }}>🏦</span>
          <div>
            <strong>iDEAL</strong>
            <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Direct betalen via je bank</p>
          </div>
        </label>

        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          padding: '16px', 
          border: paymentMethod === 'incasso' ? '2px solid #1B8C82' : '2px solid #e5e7eb',
          borderRadius: '12px',
          cursor: 'pointer',
          backgroundColor: paymentMethod === 'incasso' ? '#fff7ed' : 'white',
        }}>
          <input 
            type="radio" 
            name="payment" 
            checked={paymentMethod === 'incasso'}
            onChange={() => { setPaymentMethod('incasso'); setSelectedBank(''); }}
            style={{ accentColor: '#1B8C82' }}
          />
          <span style={{ fontSize: '24px' }}>📝</span>
          <div>
            <strong>Automatische incasso</strong>
            <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Maandelijks automatisch</p>
          </div>
        </label>
      </div>

      {showBankSelect && (
        <div style={{ marginBottom: '24px', backgroundColor: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>Selecteer je bank</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {banks.map(bank => (
              <button
                key={bank.id}
                onClick={() => { setSelectedBank(bank.id); setShowBankSelect(false); }}
                style={{
                  padding: '12px',
                  border: selectedBank === bank.id ? '2px solid #1B8C82' : '2px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: selectedBank === bank.id ? '#fff7ed' : 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14px',
                }}
              >
                {bank.logo} {bank.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <button 
        onClick={handlePayment}
        style={{ 
          width: '100%', 
          padding: '16px', 
          fontSize: '18px',
          backgroundColor: isProcessing ? '#9ca3af' : '#1B8C82',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontWeight: 600,
          cursor: isProcessing ? 'not-allowed' : 'pointer',
        }}
        disabled={isProcessing}
      >
        {isProcessing ? 'Verwerken...' : paymentMethod === 'ideal' ? 'Betaal met iDEAL' : 'Door naar betalen'}
      </button>

      <p style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280', marginTop: '16px' }}>
        🔒 Veilig betalen. Je betaalt €19,95 per maand.
      </p>

      <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', marginTop: '24px' }}>
        Door te beteren ga je akkoord met onze algemene voorwaarden. 
        Je kunt op elk moment opzeggen.
      </p>
    </div>
  );
}