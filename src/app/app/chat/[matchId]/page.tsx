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
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p>Chat niet gevonden</p>
        <button onClick={() => router.push('/app/matches')} className="btn-primary" style={{ marginTop: '16px' }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', maxHeight: 'calc(100vh - 80px)' }}>
      <div style={{ 
        padding: '16px 24px', 
        borderBottom: '1px solid #e5e7eb', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        backgroundColor: 'white',
        position: 'sticky',
        top: 0,
      }}>
        <button onClick={() => router.push('/app/matches')} className="btn-ghost" style={{ padding: '8px' }}>
          ←
        </button>
        <img src={otherUser.photo} alt={otherUser.name} className="avatar-sm" />
        <div>
          <h3 style={{ margin: 0 }}>{otherUser.name}</h3>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
            {otherUser.location}
          </p>
        </div>
      </div>

      {!canChat && (
        <div style={{ 
          padding: '16px 24px', 
          backgroundColor: '#fef3c7', 
          borderBottom: '1px solid #f59e0b',
          textAlign: 'center',
        }}>
          <p style={{ margin: 0, color: '#92400e' }}>
            ⚠️ Upgrade naar Premium om te chatten en contactgegevens te delen!
          </p>
          <button 
            onClick={() => router.push('/app/upgrade')}
            className="btn-primary"
            style={{ marginTop: '12px', backgroundColor: '#f59e0b' }}
          >
            Upgrade nu voor €19,95/maand
          </button>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
        <div className="empty-state" style={{ padding: '24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>💬</div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Jullie hebben een match! Begin een gesprek.
          </p>
        </div>

        {messages.map(msg => {
          const isSent = msg.fromUserId === currentUser.id;
          const messageText = isSent 
            ? msg.content 
            : filterContactInfo(msg.content, isPremium, false);
          
          const showBlurred = !isSent && !isPremium && containsContactInfo(msg.content);

          return (
            <div key={msg.id} className={`chat-message ${isSent ? 'chat-message-sent' : showBlurred ? 'chat-message-blurred' : 'chat-message-received'}`}>
              {messageText}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={canChat ? 'Typ een bericht...' : 'Upgrade nodig om te chatten'}
          className="input-field"
          style={{ flex: 1 }}
          disabled={!canChat}
        />
        <button 
          type="submit" 
          className="btn-primary"
          disabled={!canChat || !message.trim()}
          style={{ padding: '12px 20px' }}
        >
          Verzenden
        </button>
      </form>
    </div>
  );
}
