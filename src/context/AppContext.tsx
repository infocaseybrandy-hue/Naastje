'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { User, Match, Message, Swipe, UserType, Post, Comment } from '@/types';
import { supabase } from '@/lib/supabase';
import { mockUsers, generateId } from '@/data/mockUsers';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  matches: Match[];
  messages: Message[];
  swipes: Swipe[];
  posts: Post[];
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: Partial<User>, type: UserType, password?: string) => Promise<User | null>;
  swipe: (toUserId: string, direction: 'left' | 'right') => Promise<void>;
  getMatches: () => Match[];
  getMatchMessages: (matchId: string) => Message[];
  sendMessage: (matchId: string, content: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  upgradeToPremium: () => Promise<void>;
  createPost: (content: string, image?: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  getPostComments: (postId: string) => Promise<Comment[]>;
  addComment: (postId: string, content: string) => Promise<void>;
  loadPosts: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const mountedRef = useRef(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [matches, setMatches] = useState<Match[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [swipes, setSwipes] = useState<Swipe[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mountedRef.current = true;
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Session check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (profile) {
        const user: User = {
          id: profile.id,
          email: profile.email,
          type: profile.type as UserType,
          subtype: profile.subtype,
          name: profile.name,
          photo: profile.photo || '',
          description: profile.description || '',
          location: profile.location || '',
          gender: profile.gender as any,
          religion: profile.religion,
          birthDate: profile.birth_date,
          interests: profile.interests || [],
          availabilityHours: profile.availability_hours,
          availabilityTimes: (profile.availability_times || []) as any,
          education: profile.education || [],
          diplomas: profile.diplomas || [],
          categories: profile.categories || [],
          isPremium: profile.is_premium,
          hasPets: profile.has_pets,
          petType: profile.pet_type,
          cleaningProducts: profile.cleaning_products as any,
          needCleaningSupplies: profile.need_cleaning_supplies,
          searchTasks: profile.search_tasks || [],
          otherNotes: profile.other_notes,
          createdAt: new Date(profile.created_at),
        };
        setCurrentUser(user);
        await loadUserData(userId);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const loadUserData = async (userId: string) => {
    try {
      const { data: matchesData } = await supabase
        .from('matches')
        .select('*')
        .or(`user1.eq.${userId},user2.eq.${userId}`);

      if (matchesData) {
        setMatches(matchesData.map(m => ({
          id: m.id,
          user1: m.user1,
          user2: m.user2,
          matchedAt: new Date(m.matched_at),
        })));
      }

      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .order('sent_at', { ascending: true });

      if (messagesData) {
        setMessages(messagesData.map(m => ({
          id: m.id,
          matchId: m.match_id,
          fromUserId: m.from_user_id,
          content: m.content,
          sentAt: new Date(m.sent_at),
        })));
      }

      const { data: swipesData } = await supabase
        .from('likes')
        .select('*')
        .eq('from_user_id', userId);

      if (swipesData) {
        setSwipes(swipesData.map(s => ({
          id: s.id,
          fromUserId: s.from_user_id,
          toUserId: s.to_user_id,
          direction: s.direction as 'left' | 'right',
        })));
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await loadUserProfile(data.user.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setMatches([]);
      setMessages([]);
      setSwipes([]);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const register = async (userData: Partial<User>, type: UserType, password?: string): Promise<User | null> => {
    try {
      setLoading(true);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email || '',
        password: password || '',
        options: {
          data: {
            name: userData.name,
          },
        },
      });

      if (authError) throw authError;

      if (!authData.user) return null;

      const newUser: User = {
        id: authData.user.id,
        email: userData.email || '',
        type,
        subtype: userData.subtype,
        name: userData.name || '',
        photo: userData.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'U')}&background=f97316&color=fff&size=200`,
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

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: newUser.id,
          email: newUser.email,
          type: newUser.type,
          subtype: newUser.subtype,
          name: newUser.name,
          photo: newUser.photo,
          description: newUser.description,
          location: newUser.location,
          gender: newUser.gender,
          religion: newUser.religion,
          birth_date: newUser.birthDate,
          interests: newUser.interests,
          availability_hours: newUser.availabilityHours,
          availability_times: newUser.availabilityTimes,
          education: newUser.education,
          diplomas: newUser.diplomas,
          categories: newUser.categories,
          is_premium: newUser.isPremium,
          has_pets: newUser.hasPets,
          pet_type: newUser.petType,
          cleaning_products: newUser.cleaningProducts,
          need_cleaning_supplies: newUser.needCleaningSupplies,
          search_tasks: newUser.searchTasks,
          other_notes: newUser.otherNotes,
        });

      if (profileError) throw profileError;

      setCurrentUser(newUser);
      return newUser;
    } catch (error) {
      console.error('Registration failed:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const swipe = async (toUserId: string, direction: 'left' | 'right') => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('likes')
        .insert({
          from_user_id: currentUser.id,
          to_user_id: toUserId,
          direction,
        });

      if (error) throw error;

      setSwipes(prev => [...prev, {
        id: generateId(),
        fromUserId: currentUser.id,
        toUserId,
        direction,
      }]);

      if (direction === 'right') {
        const { data: mutualLike } = await supabase
          .from('likes')
          .select('*')
          .eq('from_user_id', toUserId)
          .eq('to_user_id', currentUser.id)
          .eq('direction', 'right')
          .single();

        if (mutualLike) {
          const { data: existingMatch } = await supabase
            .from('matches')
            .select('*')
            .or(`and(user1.eq.${currentUser.id},user2.eq.${toUserId}),and(user1.eq.${toUserId},user2.eq.${currentUser.id})`)
            .single();

          if (!existingMatch) {
            const { data: newMatch } = await supabase
              .from('matches')
              .insert({
                user1: currentUser.id,
                user2: toUserId,
              })
              .select()
              .single();

            if (newMatch) {
              setMatches(prev => [...prev, {
                id: newMatch.id,
                user1: newMatch.user1,
                user2: newMatch.user2,
                matchedAt: new Date(newMatch.matched_at),
              }]);
            }
          }
        }
      }
    } catch (error) {
      console.error('Swipe failed:', error);
    }
  };

  const getMatches = (): Match[] => {
    if (!currentUser) return [];
    return matches.filter(m => m.user1 === currentUser.id || m.user2 === currentUser.id);
  };

  const getMatchMessages = (matchId: string): Message[] => {
    return messages.filter(m => m.matchId === matchId);
  };

  const sendMessage = async (matchId: string, content: string) => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          match_id: matchId,
          from_user_id: currentUser.id,
          content,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setMessages(prev => [...prev, {
          id: data.id,
          matchId: data.match_id,
          fromUserId: data.from_user_id,
          content: data.content,
          sentAt: new Date(data.sent_at),
        }]);
      }
    } catch (error) {
      console.error('Send message failed:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          photo: updates.photo,
          description: updates.description,
          location: updates.location,
          gender: updates.gender,
          religion: updates.religion,
          birth_date: updates.birthDate,
          interests: updates.interests,
          availability_hours: updates.availabilityHours,
          availability_times: updates.availabilityTimes,
          education: updates.education,
          diplomas: updates.diplomas,
          categories: updates.categories,
          has_pets: updates.hasPets,
          pet_type: updates.petType,
          cleaning_products: updates.cleaningProducts,
          need_cleaning_supplies: updates.needCleaningSupplies,
          search_tasks: updates.searchTasks,
          other_notes: updates.otherNotes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentUser.id);

      if (error) throw error;

      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    } catch (error) {
      console.error('Update profile failed:', error);
    }
  };

  const upgradeToPremium = async () => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_premium: true })
        .eq('id', currentUser.id);

      if (error) throw error;

      const updatedUser = { ...currentUser, isPremium: true };
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    } catch (error) {
      console.error('Upgrade to premium failed:', error);
    }
  };

  const loadPosts = async () => {
    try {
      const { data: postsData, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (postsData && currentUser) {
        const { data: likesData } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', currentUser.id);

        const likedPosts = new Set(likesData?.map(l => l.post_id) || []);

        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, name, photo');

        const profileMap = new Map(profilesData?.map(p => [p.id, p]) || []);

        setPosts(postsData.map(p => ({
          id: p.id,
          userId: p.user_id,
          userName: profileMap.get(p.user_id)?.name || 'Onbekend',
          userPhoto: profileMap.get(p.user_id)?.photo || '',
          content: p.content,
          image: p.image,
          likesCount: p.likes_count,
          commentsCount: p.comments_count,
          createdAt: new Date(p.created_at),
          liked: likedPosts.has(p.id),
        })));
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  };

  const createPost = async (content: string, image?: string) => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: currentUser.id,
          content,
          image,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setPosts(prev => [{
          id: data.id,
          userId: data.user_id,
          userName: currentUser.name,
          userPhoto: currentUser.photo,
          content: data.content,
          image: data.image,
          likesCount: 0,
          commentsCount: 0,
          createdAt: new Date(data.created_at),
          liked: false,
        }, ...prev]);
      }
    } catch (error) {
      console.error('Create post failed:', error);
    }
  };

  const likePost = async (postId: string) => {
    if (!currentUser) return;

    try {
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', currentUser.id)
        .single();

      if (existingLike) {
        await supabase
          .from('post_likes')
          .delete()
          .eq('id', existingLike.id);

        await supabase.rpc('decrement_likes', { post_id: postId });

        setPosts(prev => prev.map(p => 
          p.id === postId 
            ? { ...p, liked: false, likesCount: Math.max(0, p.likesCount - 1) }
            : p
        ));
      } else {
        await supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: currentUser.id });

        await supabase.rpc('increment_likes', { post_id: postId });

        setPosts(prev => prev.map(p => 
          p.id === postId 
            ? { ...p, liked: true, likesCount: p.likesCount + 1 }
            : p
        ));
      }
    } catch (error) {
      console.error('Like post failed:', error);
    }
  };

  const getPostComments = async (postId: string): Promise<Comment[]> => {
    try {
      const { data: commentsData, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (commentsData) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, name, photo');

        const profileMap = new Map(profilesData?.map(p => [p.id, p]) || []);

        return commentsData.map(c => ({
          id: c.id,
          postId: c.post_id,
          userId: c.user_id,
          userName: profileMap.get(c.user_id)?.name || 'Onbekend',
          userPhoto: profileMap.get(c.user_id)?.photo || '',
          content: c.content,
          createdAt: new Date(c.created_at),
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to get comments:', error);
      return [];
    }
  };

  const addComment = async (postId: string, content: string) => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: currentUser.id,
          content,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setPosts(prev => prev.map(p => 
          p.id === postId 
            ? { ...p, commentsCount: p.commentsCount + 1 }
            : p
        ));
      }
    } catch (error) {
      console.error('Add comment failed:', error);
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      matches,
      messages,
      swipes,
      posts,
      loading,
      login,
      logout,
      register,
      swipe,
      getMatches,
      getMatchMessages,
      sendMessage,
      updateProfile,
      upgradeToPremium,
      createPost,
      likePost,
      getPostComments,
      addComment,
      loadPosts,
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