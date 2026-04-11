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

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (!currentUser) return null;

  if (userMatches.length === 0) {
    return (
      <div style={{ 
        paddingTop: '24px', 
        paddingRight: '24px', 
        paddingBottom: '80px', 
        paddingLeft: '24px',
        textAlign: 'center', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 160px)',
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>💛</div>
        <h2 style={{ marginBottom: '12px', color: '#c2410c', fontSize: '20px' }}>Nog geen matches</h2>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
          Blijf swipen om matches te maken!
        </p>
        <button 
          onClick={() => router.push('/app/discover')}
          style={{
            padding: '14px 32px',
            backgroundColor: '#f97316',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Profielen ontdekken
        </button>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '16px', paddingRight: '16px', paddingBottom: '80px', paddingLeft: '16px' }}>
      <h1 style={{ marginBottom: '20px', color: '#c2410c', fontSize: '20px' }}>Jouw Matches</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {userMatches.map(match => {
          const matchUser = getMatchUser(match);
          const lastMessage = getLastMessage(match.id);
          
          if (!matchUser) return null;

          const hasPhoto = matchUser.photo && matchUser.photo.length > 0;

          return (
            <div 
              key={match.id}
              onClick={() => router.push(`/app/chat/${match.id}`)}
              style={{ 
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                cursor: 'pointer',
              }}
            >
              {hasPhoto ? (
                <img 
                  src={matchUser.photo} 
                  alt={matchUser.name}
                  style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: '50%', 
                    objectFit: 'cover',
                    border: '3px solid #fed7aa',
                  }}
                />
              ) : (
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#fed7aa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid #fed7aa',
                }}>
                  <span style={{ color: '#c2410c', fontWeight: 600, fontSize: '18px' }}>
                    {getInitials(matchUser.name)}
                  </span>
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#1f2937' }}>{matchUser.name}</h3>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>📍 {matchUser.location}</p>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: lastMessage ? '#4b5563' : '#9ca3af', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {lastMessage ? lastMessage.content : 'Nog geen berichten'}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/app/chat/${match.id}`);
                }}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#f97316',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Bericht
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}