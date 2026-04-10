export type UserType = 'pgb_houder' | 'zorgverlener';

export interface User {
  id: string;
  email: string;
  type: UserType;
  name: string;
  photo: string;
  description: string;
  location: string;
  religion?: string;
  interests: string[];
  availability: number;
  education: string[];
  isPremium: boolean;
  createdAt: Date;
}

export interface Match {
  id: string;
  user1: string;
  user2: string;
  matchedAt: Date;
}

export interface Message {
  id: string;
  matchId: string;
  fromUserId: string;
  content: string;
  sentAt: Date;
}

export interface Swipe {
  id: string;
  fromUserId: string;
  toUserId: string;
  direction: 'left' | 'right';
}
