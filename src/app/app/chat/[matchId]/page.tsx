'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';

const PHONE_REGEX = /(\+31|0)[1-9][0-9]{8}/g;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const SOCIAL_REGEX = /@[a-zA-Z0-9_]+/g;

function filterContactInfo(message: string, isPremium: boolean, isSender: boolean): string {
  if (isPremium || isSender) {
    return message;
  }
  
  let filtered = message;
  filtered = filtered.replace(PHONE_REGEX, '[telefoonnummer verborgen]');
  filtered = filtered.replace(EMAIL_REGEX, '[e-mailadres verborgen]');
  filtered = filtered.replace(SOCIAL_REGEX, '[social media verborgen]');
  
  if (filtered !== message) {
    filtered += '\n\n⚠️ Contactgegevens zijn verborgen. Upgrade naar Premium om deze te delen.';
  }
  
  return filtered;
}

function containsContactInfo(message: string): boolean {
  return PHONE_REGEX.test(message) || EMAIL_REGEX.test(message) || SOCIAL_REGEX.test(message);
}

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const matchId = params.matchId as string;
  const { currentUser, users, matches, getMatchMessages, sendMessage } = useApp();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const match = matches.find(m => m.id === matchId);
  const messages = getMatchMessages(matchId);

  const otherUserId = match ? (match.user1 === currentUser?.id ? match.user2 : match.user1) : undefined;
  const otherUser = users.find(u => u.id === otherUserId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!match || !currentUser || !otherUser) {
    return (
      <div style={{ paddingTop: '24px', paddingRight: '24px', paddingBottom: '80px', paddingLeft: '24px', textAlign: 'center' }}>
        <p>Chat niet gevonden</p>
        <button 
          onClick={() => router.push('/app/matches')} 
          style={{
            marginTop: '16px',
            padding: '12px 24px',
            backgroundColor: '#1B8C82',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
          }}
        >
          Terug naar matches
        </button>
      </div>
    );
  }

  const isZorgaanbieder = currentUser.type === 'zorgaanbieder';
  const isPremium = currentUser.isPremium;

  const canChat = currentUser.type === 'zorgzoeker' || isPremium;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    sendMessage(matchId, message);
    setMessage('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', paddingBottom: '80px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      <div style={{ 
        padding: '16px 20px', 
        borderBottom: '1px solid #e5e7eb', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        backgroundColor: 'white',
        position: 'sticky',
        top: 0,
      }}>
        <button 
          onClick={() => router.push('/app/matches')} 
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '8px',
            color: '#c2410c',
          }}
        >
          ←
        </button>
        {otherUser.photo && otherUser.photo.length > 0 ? (
          <img 
            src={otherUser.photo} 
            alt={otherUser.name}
            style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '50%', 
              objectFit: 'cover',
              border: '2px solid #fed7aa',
            }} 
          />
        ) : (
          <div style={{ 
            width: '44px', 
            height: '44px', 
            borderRadius: '50%', 
            backgroundColor: '#E8763A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #fed7aa',
            fontSize: '18px',
            fontWeight: '500',
            color: 'white',
          }}>
            {otherUser.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
        )}
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', color: '#1f2937' }}>{otherUser.name}</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
            {otherUser.location}
          </p>
        </div>
      </div>

      {!canChat && (
        <div style={{ 
          padding: '16px 20px', 
          backgroundColor: '#fef3c7', 
          borderBottom: '1px solid #f59e0b',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔒</div>
          <p style={{ margin: '0 0 12px', color: '#92400e', fontSize: '14px' }}>
            Word lid om te reageren — €19,95/maand
          </p>
          <button 
            onClick={() => router.push('/app/upgrade')}
            style={{
              padding: '10px 24px',
              backgroundColor: '#1B8C82',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Upgrade nu
          </button>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>💛</div>
            <p style={{ margin: 0, marginBottom: '16px' }}>
              Jullie hebben een match! Begin een gesprek.
            </p>
            <div style={{ 
              backgroundColor: '#f3f4f6', 
              padding: '16px', 
              borderRadius: '16px', 
              textAlign: 'left',
              maxWidth: '80%',
              margin: '0 auto',
            }}>
              <p style={{ margin: 0, color: '#374151', fontSize: '14px' }}>
                👋 Hoi! Ik zag je profiel en zou graag kennismaken. Laten we even kennismaken?
              </p>
            </div>
          </div>
        ) : (
          messages.map(msg => {
            const isSent = msg.fromUserId === currentUser.id;
            const messageText = isSent 
              ? msg.content 
              : filterContactInfo(msg.content, isPremium, false);
            
            const showBlurred = !isSent && !isPremium && containsContactInfo(msg.content);

            return (
              <div 
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: isSent ? 'flex-end' : 'flex-start',
                  marginBottom: '12px',
                }}
              >
                <div 
                  style={{
                    maxWidth: '75%',
                    padding: '12px 16px',
                    borderRadius: '18px',
                    backgroundColor: isSent ? '#1B8C82' : 'white',
                    color: isSent ? 'white' : '#1f2937',
                    boxShadow: isSent ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
                    fontSize: '14px',
                    lineHeight: 1.4,
                    wordBreak: 'break-word',
                  }}
                >
                  {messageText}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form 
        onSubmit={handleSendMessage} 
        style={{
          padding: '12px 20px',
          backgroundColor: 'white',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          gap: '12px',
        }}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={canChat ? 'Typ een bericht...' : 'Premium nodig om te chatten'}
          style={{
            flex: 1,
            padding: '12px 16px',
            border: '2px solid #e5e7eb',
            borderRadius: '24px',
            fontSize: '14px',
            outline: 'none',
          }}
          disabled={!canChat}
        />
        <button 
          type="submit" 
          disabled={!canChat || !message.trim()}
          style={{
            padding: '12px 20px',
            backgroundColor: canChat ? '#1B8C82' : '#9ca3af',
            color: 'white',
            border: 'none',
            borderRadius: '24px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: canChat ? 'pointer' : 'not-allowed',
          }}
        >
          ➤
        </button>
      </form>
    </div>
  );
}