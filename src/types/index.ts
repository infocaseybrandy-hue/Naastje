export type UserType = 'zorgzoeker' | 'zorgaanbieder';

export type ZorgzoekerType = 
  | 'pgb_houder' 
  | 'zorgvrager' 
  | 'ouder' 
  | 'mantelzorger';

export type ZorgaanbiederType = 
  | 'zzp_zorgverlener' 
  | 'student' 
  | 'huishoudelijke_hulp' 
  | 'vrijwilliger';

export type Gender = 'man' | 'vrouw' | 'anders';

export type AvailabilityTime = 
  | 'maandagochtend' 
  | 'maandagmiddag'
  | 'maandagavond'
  | 'dinsdagochtend'
  | 'dinsdagmiddag'
  | 'dinsdagavond'
  | 'woensdagochtend'
  | 'woensdagmiddag'
  | 'woensdagavond'
  | 'donderdagochtend'
  | 'donderdagmiddag'
  | 'donderdagavond'
  | 'vrijdagochtend'
  | 'vrijdagmiddag'
  | 'vrijdagavond'
  | 'zaterdagochtend'
  | 'zaterdagmiddag'
  | 'zaterdagavond'
  | 'zondagochtend'
  | 'zondagmiddag'
  | 'zondagavond'
  | '24_uur';

export const ZORG_CATEGORIES = [
  { id: 'persoonlijke_verzorging', label: 'Persoonlijke verzorging', icon: '🧴' },
  { id: 'verpleegkundige_zorg', label: 'Verpleegkundige zorg', icon: '💉' },
  { id: 'ouderenzorg', label: 'Ouderenzorg', icon: '👴' },
  { id: 'begeleiding_volwassenen', label: 'Begeleiding (volwassenen)', icon: '👤' },
  { id: 'begeleiding_kinderen', label: 'Begeleiding (kinderen/jongeren)', icon: '👶' },
  { id: 'gehandicaptenzorg', label: 'Gehandicaptenzorg', icon: '♿' },
  { id: 'palliatieve_zorg', label: 'Palliatieve zorg', icon: '🏥' },
  { id: '24uurs_zorg', label: '24-uurs zorg', icon: '🕐' },
  { id: 'huishoudelijke_hulp', label: 'Huishoudelijke hulp', icon: '🧹' },
  { id: 'koken_maaltijden', label: 'Koken en maaltijden', icon: '🍳' },
  { id: 'boodschappen', label: 'Boodschappen hulp', icon: '🛒' },
  { id: 'administratie', label: 'Hulp bij administratie', icon: '📋' },
  { id: 'oppas', label: 'Oppas / kinderoppas', icon: '👶' },
  { id: 'gastouder', label: 'Gastouder', icon: '🏠' },
  { id: 'naschoolse_opvang', label: 'Naschoolse opvang', icon: '🎒' },
  { id: 'maatje', label: 'Gewoon een maatje', icon: '💕' },
  { id: 'hovenier', label: 'Hovenier / tuinhulp', icon: '🌱' },
  { id: 'zorgboerderij', label: 'Zorgboerderij', icon: '🐄' },
  { id: 'dagbesteding', label: 'Dagbesteding', icon: '🎨' },
  { id: 'logeerhuis', label: 'Logeerhuis', icon: '🛏️' },
  { id: 'begeleid_wonen', label: 'Begeleid wonen', icon: '🏡' },
  { id: 'vrijwilliger', label: 'Vrijwilliger / maatje', icon: '❤️' },
] as const;

export const ZORGZOEKER_TASKS = [
  { id: 'wassen', label: 'Wassen/douchen' },
  { id: 'aankleden', label: 'Aankleden' },
  { id: 'eten', label: 'Eten en drinken' },
  { id: 'medicatie', label: 'Medicatie toedienen' },
  { id: 'verbanden', label: 'Verbanden wisselen' },
  { id: 'injecties', label: 'Injecties geven' },
  { id: 'katheter', label: 'Katheter zorg' },
  { id: 'stoma', label: 'Stoma verzorging' },
  { id: 'schoonmaken', label: 'Schoonmaak' },
  { id: 'wasmachine', label: 'Wassen en strijken' },
  { id: 'koken', label: 'Koken' },
  { id: 'boodschappen', label: 'Boodschappen doen' },
  { id: 'tuin', label: 'Tuinonderhoud' },
  { id: 'vervoer', label: 'Vervoer naar afspraken' },
  { id: 'administratie', label: 'Administratie helpen' },
  { id: 'gezelschap', label: 'Gezelschap houden' },
  { id: 'wandelen', label: 'Uit wandelen gaan' },
  { id: 'voorlezen', label: 'Voorlezen' },
  { id: 'spelletjes', label: 'Spelletjes doen' },
  { id: 'bellen', label: 'Met iemand bellen' },
  { id: 'kinderen', label: 'Kinderen opvangen' },
  { id: 'huiswerk', label: 'Huiswerk helpen' },
  { id: 'ander', label: 'Iets anders' },
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
  cleaningProducts?: 'mee' | 'zelf' | 'geen_voorkeur';
  needCleaningSupplies?: boolean;
  searchTasks?: string[];
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