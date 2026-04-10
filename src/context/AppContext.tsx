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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [matches, setMatches] = useState<Match[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [swipes, setSwipes] = useState<Swipe[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('zorgvank_user');
      const savedMatches = localStorage.getItem('zorgvank_matches');
      const savedMessages = localStorage.getItem('zorgvank_messages');
      const savedSwipes = localStorage.getItem('zorgvank_swipes');
      
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      if (savedMatches) {
        setMatches(JSON.parse(savedMatches));
      }
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
      if (savedSwipes) {
        setSwipes(JSON.parse(savedSwipes));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && currentUser) {
      localStorage.setItem('zorgvank_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('zorgvank_matches', JSON.stringify(matches));
      localStorage.setItem('zorgvank_messages', JSON.stringify(messages));
      localStorage.setItem('zorgvank_swipes', JSON.stringify(swipes));
    }
  }, [matches, messages, swipes]);

  const login = (user: User) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('zorgvank_user');
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
      religion: userData.religion,
      interests: userData.interests || [],
      availability: userData.availability || 0,
      education: userData.education || [],
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