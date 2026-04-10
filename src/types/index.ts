export type UserType = 'zorgzoeker' | 'zorgaanbieder';

export type ZorgzoekerType = 
  | 'pgb_houder' 
  | 'zorgvrager' 
  | 'ouder' 
  | 'hulp_zoekend_ouder';

export type ZorgaanbiederType = 
  | 'zzp_zorgverlener' 
  | 'student' 
  | 'huishoudelijke_hulp' 
  | 'vrijwilliger';

export type Gender = 'man' | 'vrouw' | 'anders';

export type AvailabilityTime = 
  | 'ochtend' 
  | 'middag' 
  | 'avond' 
  | 'nacht'
  | '24_uur';

export const ZORG_CATEGORIES = [
  { id: 'persoonlijke_verzorging', label: 'Persoonlijke verzorging' },
  { id: 'verpleegkundige_zorg', label: 'Verpleegkundige zorg' },
  { id: 'ouderenzorg', label: 'Ouderenzorg' },
  { id: 'begeleiding_volwassenen', label: 'Begeleiding (volwassenen)' },
  { id: 'begeleiding_kinderen', label: 'Begeleiding (kinderen/jongeren)' },
  { id: 'gehandicaptenzorg', label: 'Gehandicaptenzorg' },
  { id: 'palliatieve_zorg', label: 'Palliatieve zorg' },
  { id: '24uurs_zorg', label: '24-uurs zorg' },
  { id: 'huishoudelijke_hulp', label: 'Huishoudelijke hulp' },
  { id: 'koken_maaltijden', label: 'Koken en maaltijden' },
  { id: 'boodschappen', label: 'Boodschappen hulp' },
  { id: 'administratie', label: 'Hulp bij administratie' },
  { id: 'oppas', label: 'Oppas / nanny' },
  { id: 'gastouder', label: 'Gastouder' },
  { id: 'naschoolse_opvang', label: 'Naschoolse opvang' },
  { id: 'maatje', label: 'Gewoon een maatje' },
  { id: 'hovenier', label: 'Hovenier / tuinhulp' },
  { id: 'zorgboerderij', label: 'Zorgboerderij' },
  { id: 'dagbesteding', label: 'Dagbesteding' },
  { id: 'logeerhuis', label: 'Logeerhuis' },
  { id: 'begeleid_wonen', label: 'Begeleid wonen' },
] as const;

export interface User {
  id: string;
  email: string;
  type: UserType;
  subtype?: ZorgzoekerType | ZorgaanbiederType;
  name: string;
  photo: string;
  description: string;
  location: string;
  gender?: Gender;
  religion?: string;
  interests: string[];
  availabilityHours?: number;
  availabilityTimes: AvailabilityTime[];
  education: string[];
  diplomas: string[];
  categories: string[];
  isPremium: boolean;
  createdAt: Date;
  // Zorgzoeker extra velden
  hasPets?: boolean;
  petType?: string;
  cleaningProducts?: string;
  otherNotes?: string;
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