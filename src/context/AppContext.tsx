'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Match, Message, Swipe, UserType } from '@/types';
import { mockUsers, generateId } from '@/data/mockUsers';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  matches: Match[];
  messages: Message[];
  swipes: Swipe[];
  login: (user: User) => void;
  logout: () => void;
  register: (userData: Partial<User>, type: UserType) => User;
  swipe: (toUserId: string, direction: 'left' | 'right') => void;
  getMatches: () => Match[];
  getMatchMessages: (matchId: string) => Message[];
  sendMessage: (matchId: string, content: string) => void;
  updateProfile: (updates: Partial<User>) => void;
  upgradeToPremium: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('naastje_user');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [matches, setMatches] = useState<Match[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('naastje_matches');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('naastje_messages');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [swipes, setSwipes] = useState<Swipe[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('naastje_swipes');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('naastje_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('naastje_matches', JSON.stringify(matches));
      localStorage.setItem('naastje_messages', JSON.stringify(messages));
      localStorage.setItem('naastje_swipes', JSON.stringify(swipes));
    }
  }, [matches, messages, swipes]);

  const login = (user: User) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('naastje_user');
    }
  };

  const register = (userData: Partial<User>, type: UserType): User => {
    const newUser: User = {
      id: generateId(),
      email: userData.email || '',
      type,
      subtype: userData.subtype,
      name: userData.name || '',
      photo: userData.photo || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop`,
      description: userData.description || '',
      location: userData.location || '',
      gender: userData.gender,
      religion: userData.religion,
      interests: userData.interests || [],
      availabilityHours: userData.availabilityHours || 0,
      availabilityTimes: userData.availabilityTimes || [],
      education: userData.education || [],
      diplomas: userData.diplomas || [],
      categories: userData.categories || [],
      isPremium: type === 'zorgzoeker',
      createdAt: new Date(),
      hasPets: userData.hasPets,
      petType: userData.petType,
      cleaningProducts: userData.cleaningProducts,
      otherNotes: userData.otherNotes,
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  const swipe = (toUserId: string, direction: 'left' | 'right') => {
    if (!currentUser) return;

    const newSwipe: Swipe = {
      id: generateId(),
      fromUserId: currentUser.id,
      toUserId,
      direction,
    };
    setSwipes(prev => [...prev, newSwipe]);

    if (direction === 'right') {
      const otherUserSwipedRight = swipes.find(
        s => s.toUserId === currentUser.id && s.fromUserId === toUserId && s.direction === 'right'
      );

      if (otherUserSwipedRight) {
        const newMatch: Match = {
          id: generateId(),
          user1: currentUser.id,
          user2: toUserId,
          matchedAt: new Date(),
        };
        setMatches(prev => [...prev, newMatch]);
      }
    }
  };

  const getMatches = (): Match[] => {
    if (!currentUser) return [];
    return matches.filter(m => m.user1 === currentUser.id || m.user2 === currentUser.id);
  };

  const getMatchMessages = (matchId: string): Message[] => {
    return messages.filter(m => m.matchId === matchId);
  };

  const sendMessage = (matchId: string, content: string) => {
    if (!currentUser) return;
    
    const newMessage: Message = {
      id: generateId(),
      matchId,
      fromUserId: currentUser.id,
      content,
      sentAt: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const upgradeToPremium = () => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, isPremium: true };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      matches,
      messages,
      swipes,
      login,
      logout,
      register,
      swipe,
      getMatches,
      getMatchMessages,
      sendMessage,
      updateProfile,
      upgradeToPremium,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}