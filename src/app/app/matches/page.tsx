'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function MatchesPage() {
  const router = useRouter();
  const { currentUser, users, getMatches, messages } = useApp();

  const userMatches = getMatches();

  const getMatchUser = (match: { user1: string; user2: string }) => {
    const otherUserId = match.user1 === currentUser?.id ? match.user2 : match.user1;
    return users.find(u => u.id === otherUserId);
  };

  const getLastMessage = (matchId: string) => {
    const matchMessages = messages.filter(m => m.matchId === matchId);
    return matchMessages[matchMessages.length - 1];
  };

  if (!currentUser) return null;

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px', color: 'var(--primary)' }}>Jouw Matches</h1>

      {userMatches.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💜</div>
          <h3 style={{ marginBottom: '8px' }}>Nog geen matches</h3>
          <p>Swipe naar rechts om matches te maken!</p>
          <button 
            onClick={() => router.push('/app/discover')}
            className="btn-primary"
            style={{ marginTop: '24px' }}
          >
            Ontdekken
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {userMatches.map(match => {
            const matchUser = getMatchUser(match);
            const lastMessage = getLastMessage(match.id);
            
            if (!matchUser) return null;

            return (
              <div 
                key={match.id}
                className="match-card"
                onClick={() => router.push(`/app/chat/${match.id}`)}
                style={{ backgroundColor: 'white' }}
              >
                <img 
                  src={matchUser.photo} 
                  alt={matchUser.name}
                  className="avatar-md"
                  style={{ border: '3px solid var(--primary)' }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: '4px' }}>{matchUser.name}</h3>
                  <p className="message-preview">
                    {lastMessage ? lastMessage.content : 'Nog geen berichten'}
                  </p>
                </div>
                <span style={{ color: 'var(--text-secondary)' }}>→</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
