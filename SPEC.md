# Naastje - Specification Document

## 1. Project Overview

**Project Name:** Naastje  
**Type:** Mobile-first webapp (responsive, works on mobile and desktop)  
**Core Functionality:** Een matchingplatform voor PGB-houders en zorgverleners (ZZP'ers en studenten) in Nederland — werkt als een datingapp maar dan voor zorg.  
**Target Users:** PGB-houders (mensen met persoonlijk budget voor zorg) en zorgverleners (ZZP'ers, zorgstudenten).

---

## 2. UI/UX Specification

### Layout Structure

**Pages:**
1. **Home/Landing** - Login/registreren keuze
2. **Registratie** - Account type keuze + profielgegevens
3. **Dashboard/Discover** - Swipe feed met profielen
4. **Profiel Bekijken** - Detailpagina van een profiel
5. **Matches** - Lijst van matches
6. **Chat** - Berichtenuitwisseling
7. **Profiel Bewerken** - Eigen profiel aanpassen
8. **Betaling** - Mollie integratie voor premium

**Navigation:** Bottom tab bar (mobiel) / sidebar (desktop)
- Ontdekken (swipe)
- Matches
- Chat
- Profiel

**Responsive breakpoints:**
- Mobile: < 768px (single column, bottom nav)
- Desktop: >= 768px (sidebar nav)

### Visual Design

**Color Palette:**
- Primary: `#7C3AED` (Paars - purple-600)
- Primary Light: `#A78BFA` (purple-400)
- Primary Dark: `#5B21B6` (purple-800)
- Secondary: `#F59E0B` (Amber - voor accenten)
- Background: `#FEFCFF` (Very light purple tint)
- Surface: `#FFFFFF`
- Text Primary: `#1F2937` (gray-800)
- Text Secondary: `#6B7280` (gray-500)
- Error: `#EF4444` (red-500)
- Success: `#10B981` (green-500)

**Typography:**
- Font Family: "Nunito" (vriendelijk, warm, accessible)
- Headings: 
  - H1: 28px, bold
  - H2: 24px, semibold
  - H3: 20px, semibold
- Body: 16px, regular
- Small: 14px, regular

**Spacing System:**
- Base unit: 4px
- Padding small: 8px
- Padding medium: 16px
- Padding large: 24px
- Section gap: 32px

**Visual Effects:**
- Cards: `box-shadow: 0 2px 8px rgba(124, 58, 237, 0.1)`
- Border radius: 12px (buttons), 16px (cards), full (avatars)
- Hover: subtle scale(1.02) + shadow increase
- Buttons: solid filled with hover darken

### Components

**Buttons:**
- Primary button: paars, volledige breedte of auto, 48px hoogte
- Secondary button: outline paars
- Ghost button: tekst only
- States: default, hover, active, disabled

**Cards:**
- Profile card: 100% width, rounded, shadow
- Match card: compact, avatar + name + preview

**Form Inputs:**
- Text input: 48px hoogte, border gray-300, focus purple
- Textarea: auto height, min 120px
- Select/dropdown: custom styled

**Avatar:**
- Size: 64px (list), 120px (profile), 48px (chat)
- Border: 3px solid purple when matched

---

## 3. Functionality Specification

### User Types

1. **PGB-houder**
   - Gratis gebruik
   - Kan alle profielen zien en swipen
   - Kan direct chatten na match

2. **Zorgverlener (ZZP'er/student)**
   - Gratis profiel aanmaken en swipen
   - Berichten zien maar inhoud is block/vaag
   - Moet €19,95/maand betalen voor chat + contactgegevens

### Registration Flow

**Stap 1:** Kies account type
- "Ik zoek zorg" (PGB-houder)
- "Ik bied zorg aan" (Zorgverlener)

**Stap 2:** Profielgegevens
- **Verplicht:**
  - Profielfoto (upload)
  - Naam
  - Korte beschrijving (over jezelf)
  - Locatie (stad/regio in Nederland)
  - Beschikbaarheid (uren per week)
- **Optioneel:**
  - Godsreligion/geloofsovertuiging
  - Interesses en hobby's
  - Voor zorgverleners: opleidingen en cursussen

**Stap 3:** Account aanmaken
- E-mail + wachtwoord

### Matching Logic

- **Swipe rechts:** Geïnteresseerd
- **Swipe links:** Overslaan
- **Beide rechts = match:** Beide krijgen melding en kunnen chatten

### Chat System

**Gratis gebruiker (PGB-houder):**
- Kan direct berichten sturen
- Kan contactgegevens delen

**Gratis zorgverlener (zonder betaling):**
- Ziet "Je hebt nieuwe berichten" notificatie
- Bericht inhoud is block: "Dit bericht is verborgen. Upgrade naar Premium om te lezen."
- Kan NIET reageren
- Kan GEEN contactgegevens zien

**Premium zorgverlener (betaald):**
- Kan berichten lezen
- Kan reageren
- Kan contactgegevens delen

### Payment (Mollie)

- **Bedrag:** €19,95 per maand
- **Betaalmethoden:** iDEAL, automatische incasso
- **Werkflow:**
  1. Klik "Upgrade naar Premium"
  2. Redirect naar Mollie checkout
  3. Na betaling: webhook ontvangt melding
  4. Account wordt ontgrendeld
  5. Terugkeer naar app

### Contact Filter (Chat)

**Filter blocks voor niet-premium gebruikers:**
- Telefoonnummers: regex voor Nederlandse nummers
- E-mailadressen: regex voor email patronen
- Social media handles: @username patronen

**Blokkeringstoegang:**
- Bericht wordt vervangen door: "Dit bevat contactgegevens. Upgrade naar Premium om te delen."
- Premium gebruikers zien alles vrij

### Profile Visibility

**NOOIT zichtbaar op profiel:**
- Telefoonnummer
- E-mailadres
- Adres

Deze worden alleen gedeeld via chat na matching EN betaling (voor zorgverleners).

---

## 4. Technical Structure

### Data Model (Mock/Simulated)

```
User: {
  id: string
  type: "pgb_houder" | "zorgverlener"
  name: string
  photo: string (URL)
  description: string
  location: string
  religion: string?
  interests: string[]
  availability: number (hours/week)
  education: string[] (zorgverleners only)
  isPremium: boolean
  createdAt: date
}

Match: {
  id: string
  user1: string (user ID)
  user2: string (user ID)
  matchedAt: date
}

Message: {
  id: string
  matchId: string
  fromUserId: string
  content: string
  isBlurred: boolean (for non-premium receivers)
  sentAt: date
}
```

### Page Routes

- `/` - Landing/Login
- `/register` - Registratie
- `/register/profile` - Profielgegevens invullen
- `/app` - Dashboard (swipe feed)
- `/app/discover` - Ontdekken (swipe)
- `/app/matches` - Matches lijst
- `/app/chat/[matchId]` - Chat conversatie
- `/app/profile` - Mijn profiel
- `/app/profile/edit` - Profiel bewerken
- `/app/upgrade` - Premium upgrade (Mollie)

---

## 5. Acceptance Criteria

### Must Have
- [ ] Gebruiker kan kiezen tussen PGB-houder of zorgverlener
- [ ] Profiel aanmaken met alle vereiste velden
- [ ] Swipe interface werkt (links=skip, rechts=like)
- [ ] Match ontstaat bij wederzijdse interesse
- [ ] Chat werkt na match
- [ ] Niet-premium zorgverleners zien vage berichten
- [ ] Mollie payment flow werkt
- [ ] Contact filter blokkeert telefoon/email/social voor niet-premium
- [ ] Alles in het Nederlands

### Visual Checkpoints
- [ ] Paarse hoofdkleur zichtbaar
- [ ] Warm, vriendelijk design
- [ ] Mobiel en desktop werken
- [ ] Eenvoudige, toegankelijke interface

---

## 6. Implementation Notes

This is a frontend demo with mock data. Payment integration connects to Mollie but uses test mode. All data is stored in React state/localStorage for demo purposes.