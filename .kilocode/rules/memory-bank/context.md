# Active Context: Naastje

## Current State

**Project Status**: ✅ Complete

A Dutch mobile webapp called "Naastje" - a matching platform for PGB-houders (personal budget holders) and zorgverleners (care providers - ZZP'ers and students) in Netherlands. Works like a dating app but for healthcare. Originally called "ZorgMatch" then "ZorgVonk", renamed to "Naastje".

## Recently Completed

- [x] Created SPEC.md specification document
- [x] Built Next.js 16 app with TypeScript
- [x] Implemented two user types (zorgzoeker and zorgaanbieder)
- [x] Registration flow with 4-step profile creation
- [x] Swipe matching logic (left=skip, right=like)
- [x] Match notification when both swipe right
- [x] Chat system with Premium upgrade for zorgaanbieders
- [x] Mollie payment integration (simulated - €19,95/month)
- [x] Contact info filter (phone, email, social handles blocked for non-premium)
- [x] Responsive design (mobile + desktop)
- [x] Orange/amber warm color theme (#f97316)
- [x] All UI in Dutch
- [x] Detailed availability grid (days × time slots + 24-uur)
- [x] Zorgzoeker tasks (24 different help types)
- [x] User subtypes (pgb_houder, zorgvrager, ouder, mantelzorger / zzp, student, huishoudelijke_hulp, vrijwilliger)
- [x] 21 zorg categories with icons

## Current Structure

| File/Directory | Purpose |
|----------------|---------|
| `src/app/page.tsx` | Landing/login page |
| `src/app/register/` | Registration flow (4 steps) |
| `src/app/app/` | Main app with nav |
| `src/app/app/discover/` | Swipe interface |
| `src/app/app/matches/` | Matches list |
| `src/app/app/chat/[matchId]/` | Chat system |
| `src/app/app/profile/` | User profile |
| `src/app/app/upgrade/` | Premium payment |
| `src/types/` | TypeScript types |
| `src/data/mockUsers.ts` | Demo data |
| `src/context/AppContext.tsx` | State management |

## Features Implemented

### User Types
- **Zorgzoeker**: (PGB-houder, zorgvrager, ouder, mantelzorger) - Free, can chat immediately after match
- **Zorgaanbieder**: (ZZP'er, student, huishoudelijke hulp, vrijwilliger) - Free profile, must pay €19,95/month to chat

### Matching
- Swipe right to like, left to skip
- Mutual right swipe = match
- Notification when match occurs

### Chat
- Zorgzoekers can chat freely
- Non-premium zorgaanbieders see blurred messages
- Premium required to read/reply to messages

### Payment (Mollie)
- iDEAL and automatic incasso options
- Simulated payment flow
- Upgrades account to Premium instantly

### Contact Filter
- Blocks phone numbers, emails, social handles for non-premium users
- Shows warning message to upgrade

## Tech Stack

- Next.js 16 with App Router
- TypeScript
- CSS with CSS variables (warm orange theme)
- LocalStorage for demo persistence

## Session History

| Date | Changes |
|------|---------|
| 2026-04-10 | Created Naastje app (originally ZorgMatch, renamed to ZorgVonk, then Naastje). Added detailed availability grid, 24 zorgzoeker tasks, user subtypes, 21 zorg categories. Updated to orange/amber color scheme. |