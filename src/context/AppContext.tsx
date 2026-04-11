'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
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
  const mountedRef = useRef(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [matches, setMatches] = useState<Match[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [swipes, setSwipes] = useState<Swipe[]>([]);

  useEffect(() => {
    mountedRef.current = true;
    
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('naastje_user');
      const savedMatches = localStorage.getItem('naastje_matches');
      const savedMessages = localStorage.getItem('naastje_messages');
      const savedSwipes = localStorage.getItem('naastje_swipes');
      
      if (mountedRef.current) {
        if (savedUser) {
          try {
            setCurrentUser(JSON.parse(savedUser));
          } catch (e) {
            console.error('Failed to parse user:', e);
          }
        }
        if (savedMatches) {
          try {
            setMatches(JSON.parse(savedMatches));
          } catch (e) {
            console.error('Failed to parse matches:', e);
          }
        } else {
          const demoMatches: Match[] = [
            { id: 'demo-1', user1: 'current', user2: 'demo-1-user', matchedAt: new Date() },
            { id: 'demo-2', user1: 'current', user2: 'demo-2-user', matchedAt: new Date() },
            { id: 'demo-3', user1: 'current', user2: 'demo-3-user', matchedAt: new Date() },
          ];
          setMatches(demoMatches);
        }
        if (savedMessages) {
          try {
            setMessages(JSON.parse(savedMessages));
          } catch (e) {
            console.error('Failed to parse messages:', e);
          }
        } else {
          const demoMessages: Message[] = [
            { id: 'msg-1', matchId: 'demo-1', fromUserId: 'demo-1-user', content: '👋 Hoi! Ik zag je profiel en zou graag kennismaken. Laten we even praten?', sentAt: new Date() },
            { id: 'msg-2', matchId: 'demo-2', fromUserId: 'demo-2-user', content: 'Hey! Wat een leuk profiel. Heb je al lang een PGB?', sentAt: new Date() },
            { id: 'msg-3', matchId: 'demo-3', fromUserId: 'demo-3-user', content: 'Hoi! Ik ben student verpleegkunde en op zoek naar praktijkervaring. Ik help je graag!', sentAt: new Date() },
          ];
          setMessages(demoMessages);
        }
        if (savedSwipes) {
          try {
            setSwipes(JSON.parse(savedSwipes));
          } catch (e) {
            console.error('Failed to parse swipes:', e);
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    if (mountedRef.current && typeof window !== 'undefined') {
      localStorage.setItem('naastje_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    if (mountedRef.current && typeof window !== 'undefined') {
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