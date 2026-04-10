# Active Context: ZorgMatch

## Current State

**Project Status**: ✅ Complete

A Dutch mobile webapp called "ZorgMatch" - a matching platform for PGB-houders (personal budget holders) and zorgverleners (care providers - ZZP'ers and students) in Netherlands. Works like a dating app but for healthcare.

## Recently Completed

- [x] Created SPEC.md specification document
- [x] Built Next.js 16 app with TypeScript
- [x] Implemented two user types (PGB-houder and zorgverlener)
- [x] Registration flow with profile creation
- [x] Swipe matching logic (left=skip, right=like)
- [x] Match notification when both swipe right
- [x] Chat system with Premium upgrade for zorgverleners
- [x] Mollie payment integration (simulated - €19,95/month)
- [x] Contact info filter (phone, email, social handles blocked for non-premium)
- [x] Responsive design (mobile + desktop)
- [x] Purple primary color theme (#7C3AED)
- [x] All UI in Dutch

## Current Structure

| File/Directory | Purpose |
|----------------|---------|
| `src/app/page.tsx` | Landing/login page |
| `src/app/register/` | Registration flow |
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
- **PGB-houder**: Free, can chat immediately after match
- **Zorgverlener**: Free profile creation, must pay €19,95/month to chat

### Matching
- Swipe right to like, left to skip
- Mutual right swipe = match
- Notification when match occurs

### Chat
- PGB-houders can chat freely
- Non-premium zorgverleners see blurred messages
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
- Tailwind CSS 4
- LocalStorage for demo persistence

## Session History

| Date | Changes |
|------|---------|
| 2026-04-10 | Created ZorgMatch app with all features |
