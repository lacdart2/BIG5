# BIG5 Football App — Project Context

## Latest session — 2026-09-20: Week and Live visual uplift

Implemented for local review; user validation is pending.

- Week reuses `LeagueTabs` with API emblems, `UpcomingList`, and the new controlled `src/components/ui/DateNav.tsx`, matching Today's existing date-control appearance and seven-day bounds.
- Live reuses `FeaturedMatch` with an optional compact variant, grouped in the existing five-league order, plus emblem filters. The default hero variant remains unchanged for Today.
- `UpcomingList` accepts an optional live-section heading: Week uses "In play" while Today retains "Also live".
- Both pages have loading/error/retry states and local filtering. Live's empty state reads "No live matches right now" and links to Today and Week. No polling, endpoint, dependency, timezone, scorer, or notification changes were added.
- Scope clarification pending: the request both prohibits edits to Today.tsx and asks both pages to import DateNav. Today remains untouched in this session until the user approves the minimal extraction-only edit.
- Production build, targeted ESLint, and diff checks passed. Real data rendered on Week and Live. Browser checks covered Live league filtering without extra requests, a simulated zero-live state and its navigation links, Week date-navigation bounds, and narrow-screen overflow. Manual user validation remains pending.

## Latest session — 2026-09-20: Today visual uplift

User reviewed the Today uplift positively and requested the Week/Live follow-up. Manual commit/push remains user-controlled.

- Today now composes a CSS floodlight hero, emblem league filters, bounded seven-day date controls, derived match counts, a featured live/next fixture, remaining fixtures and results, top-five standings, a week summary, and a static brand panel.
- One `fetchWeekFixtures()` response powers Today's date/league filtering and week preview. The standings preview requests PL initially, then other competitions on selection. Pending requests are reused during StrictMode effect replay.
- Current data source is football-data.org through `/api/schedule?endpoint=…`. The earlier API-Football roadmap below is historical and does not describe the current integration.
- Verification of the authenticated matches response returned 20 matches: all had `competition.emblem` and `matchday`; none had a minute or goal/event fields. Optional emblem/minute/matchday fields are mapped without inventing missing values. No scorers or event detail added.
- Reused the locked dark design tokens and existing shared UI. No dependencies, other page restructures, timezone-display changes, or share/notification/favorites features added.
- Validation: production build and targeted ESLint; browser checks with real fixtures/standings, 320px/375px mobile and desktop layouts, date boundaries, local league filtering, top-five table switching, and reduced-motion pulse suppression. Isolated browser simulations covered loading, API errors, retry, upcoming fallback, and missing emblems; simulated cache data was restored afterward.
- User review and manual commit/push remain pending.

## Project Goal

BIG5 is a modern football app focused on Europe’s top five domestic football leagues:

- Premier League — England
- La Liga — Spain
- Serie A — Italy
- Bundesliga — Germany
- Ligue 1 — France

The app will eventually provide:

- Today’s matches
- Weekly fixtures
- Live scores
- League standings
- Match details
- Favorite teams
- Favorite leagues
- Push notifications
- PWA installation
- Android application

The first major goal is a polished production-quality PWA.

Later, the same application may be packaged with Capacitor and published on Google Play.

The working brand name is:

**BIG5**

The final public name may change later if needed.

---

# Development & Learning Workflow

The goal is both to build BIG5 efficiently and refresh the user’s React/frontend knowledge through hands-on use of real code.

Claude and ChatGPT SHOULD write code.

The preferred workflow is:

1. AI briefly explains what is being built.
2. AI provides exact terminal commands when needed.
3. AI provides exact filenames.
4. AI clearly says whether a file should be CREATED, REPLACED, or EDITED.
5. User copies/pastes the code into VS Code.
6. User runs and tests the application locally.
7. User reads through the implementation.
8. User asks questions about anything unclear.
9. AI explains React, TypeScript, APIs, architecture, bugs, or other concepts when needed.
10. Once working, user commits and pushes to GitHub.

Do NOT avoid writing code just to force the user to implement everything manually.

However:

- Keep code understandable and educational.
- Avoid unnecessary complexity.
- Explain important architectural decisions.
- Briefly point out important React/TypeScript concepts when they naturally appear.
- Prefer incremental changes rather than generating the entire application at once.
- Avoid dumping huge amounts of unrelated code.
- Avoid replacing working code without a clear reason.

The learning flow is:

**code → paste → run → test → read → ask questions → understand → commit**

---

# Planned Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS v4
- React Router
- lucide-react

## Data Provider

- API-Football / API-Sports

## Backend

Planned for later MVP stages:

- Supabase
- PostgreSQL
- Supabase Edge Functions
- Supabase Cron

## Push Notifications

Planned:

- Firebase Cloud Messaging

## PWA

Planned:

- vite-plugin-pwa

## Hosting

- Vercel

## Android Later

- Capacitor
- Google Play

---

# Architecture Principle

The final production architecture should NOT allow every client to repeatedly call the football API directly.

Preferred architecture:

```text
API-Football
↓
Supabase Edge Function / scheduled worker
↓
Supabase database/cache
↓
React app
```

Notifications:

```text
Supabase Cron
↓
Notification worker
↓
Firebase Cloud Messaging
↓
User device
```

This reduces football API usage and makes notifications significantly more reliable.

During MVP 0.2 we may initially consume API data more simply while developing, but secrets must never be exposed publicly.

---

# Supported Leagues

BIG5 initially supports exactly five domestic competitions:

## England

Premier League

## Spain

La Liga

## Italy

Serie A

## Germany

Bundesliga

## France

Ligue 1

Possible future competitions:

- UEFA Champions League
- UEFA Europa League
- UEFA Conference League
- Algerian competitions
- Other European leagues

---

# 🎨 Design System v1 — LOCKED

## Direction

**Broadcast energy · Cool indigo accent · True-black OLED base**

## Intent

BIG5 should feel like a premium modern matchday broadcast product.

It must NOT feel like:

- a generic AI-generated dashboard
- a generic SaaS product
- a SofaScore clone
- a Flashscore clone
- a FotMob clone
- a OneFootball clone

The interface should feel:

- football-first
- editorial
- broadcast-inspired
- dark
- premium
- fast
- compact
- highly readable
- mobile-first
- information-dense without becoming cluttered

Full visual reference may also live in:

```text
BIG5-visual-brief.md
```

Both Claude and ChatGPT should follow this design system when creating or modifying BIG5 UI.

---

## Design DNA — Five Non-Negotiables

### 1. Huge tabular scores + tiny uppercase metadata

Extreme typography hierarchy is one of BIG5’s main visual signals.

Scores should immediately dominate the visual hierarchy.

Supporting information should be compact and deliberate.

---

### 2. One signature accent + one status color

Primary brand accent:

```text
Indigo
```

Live / urgent status:

```text
Red
```

Do not introduce many competing interface colors.

---

### 3. Depth comes from surfaces and borders

Because the app uses a true-black base:

**DO use:**

- surface-tone steps
- subtle 1px borders
- layered dark surfaces

**DO NOT rely on:**

- large drop shadows
- exaggerated floating-card shadows

Shadows disappear or look artificial against true black.

---

### 4. Motion is fast and purposeful

Motion should feel responsive and broadcast-like.

Typical duration:

```text
120–200ms
```

Avoid:

- slow fades
- decorative looping animation
- excessive movement

---

### 5. Real team crests whenever possible

Preferred:

```text
real team crest
```

Fallback:

```text
team-color monogram chip
```

Do NOT use:

- emoji team placeholders
- generic image icons
- ugly empty boxes

---

# Color Tokens

| Token             | Value                   | Use                      |
| ----------------- | ----------------------- | ------------------------ |
| `--bg`            | `#000000`               | Application background   |
| `--surface-1`     | `#0B0B0D`               | Cards                    |
| `--surface-2`     | `#141418`               | Elevated sheets/modals   |
| `--surface-3`     | `#1E1E24`               | Inputs / pressed / hover |
| `--border`        | `#262630`               | Hairline dividers        |
| `--border-strong` | `#363642`               | Emphasized edges         |
| `--text`          | `#F4F5F7`               | Primary text             |
| `--text-2`        | `#9CA0AB`               | Secondary text           |
| `--text-3`        | `#636772`               | Muted/meta               |
| `--accent`        | `#6366F1`               | Main BIG5 brand color    |
| `--accent-text`   | `#818CF8`               | Small accent text        |
| `--accent-hover`  | `#7C82FF`               | Hover/active accent      |
| `--accent-soft`   | `rgba(99,102,241,0.14)` | Accent badges/pills      |
| `--accent-ring`   | `rgba(129,140,248,0.5)` | Focus rings              |
| `--live`          | `#FF3B3B`               | Live / urgent only       |
| `--live-soft`     | `rgba(255,59,59,0.14)`  | Live badge background    |
| `--form-w`        | `#22C55E`               | Win                      |
| `--form-d`        | `#64748B`               | Draw                     |
| `--form-l`        | `#EF4444`               | Loss                     |
| `--card-yellow`   | `#FBBF24`               | Yellow card              |
| `--card-red`      | `#EF4444`               | Red card                 |

## Contrast Rule

`#6366F1` against black is appropriate for large or bold text.

For small accent-colored text use:

```text
--accent-text: #818CF8
```

Never communicate meaning using color alone.

---

# Typography

## Display / Scores / Headings

```text
Archivo
```

Preferred weights:

```text
700–800
```

Characteristics:

- tight tracking
- bold presence
- broadcast feel

## UI / Body

```text
Inter
```

Used for:

- navigation
- metadata
- body text
- labels
- controls

## Numeric Rule

All changing numeric values must use:

```css
font-variant-numeric: tabular-nums;
```

Examples:

- scores
- match times
- match minutes
- statistics
- table points

## Approximate Mobile Type Scale

```text
Score:          34–40px
Team name:      15px
Status:         12px uppercase
Section header: 13px uppercase muted
Body:           14–15px
Meta:           12px
Bottom nav:     11px
```

---

# Match Card — Core UI Unit

The MatchCard is one of BIG5’s most important reusable UI components.

Preferred structure:

```text
[ status / kickoff ]

[ home crest + name ] [ SCORE BLOCK ] [ away crest + name ]
```

Container:

```text
background: --surface-1
border: 1px solid --border
border-radius: 16px
padding: 16px
minimum interaction height: 44px
```

---

## Upcoming Match

Show:

- scheduled kickoff time
- subdued/muted visual treatment
- team names
- team crests

Score should not dominate because there is no score yet.

---

## Live Match

Show:

- pulsing red live dot
- `LIVE` label
- match minute
- strongly emphasized score
- optionally later: match progress bar

Example:

```text
● LIVE 67'
```

---

## Finished Match

Show:

```text
FT
```

Winner:

- slightly stronger/brighter

Loser:

- muted

Avoid excessive celebration styling unless there is a real product reason.

---

# Live Indicator — Brand Signal

Live red:

```text
#FF3B3B
```

is RESERVED for live/urgent match states.

BIG5 live state uses three visual cues:

```text
pulsing dot
+
LIVE label
+
match minute
```

Example:

```text
● LIVE 67'
```

Pulse:

```text
2s ease-in-out infinite
```

Respect:

```text
prefers-reduced-motion
```

---

# Navigation Design

## Bottom Navigation

Primary mobile navigation:

```text
Today
Week
Live
Standings
Favorites
```

Approximate height:

```text
64px + safe-area inset
```

Icons:

```text
lucide-react
```

Active state:

```text
--accent
```

---

## League Tabs

Horizontal scroll row.

Current leagues:

```text
All
Premier League
La Liga
Serie A
Bundesliga
Ligue 1
```

Active styling:

```text
background: --accent-soft
text: --accent-text
```

League tabs currently use local UI state only.

Actual data filtering is planned for MVP 0.2.

---

# Spacing

Base spacing system:

```text
4
8
12
16
20
24
32
```

Primary app shell:

```text
max-width: approximately 480–640px
```

Centered on larger displays.

Respect:

```css
env(safe-area-inset-top)
env(safe-area-inset-bottom)
```

when appropriate.

---

# Motion

Preferred durations:

```text
120–200ms
```

Preferred easing:

```text
cubic-bezier(0.2, 0, 0, 1)
```

Possible interaction behaviors:

```text
score change → number pop
button press → scale(0.98)
nav/tab transitions → 120–200ms
```

Respect:

```text
prefers-reduced-motion
```

---

# Accessibility

Every interactive view should eventually include:

- loading state
- empty state
- error state
- focus-visible rings
- keyboard usability where applicable
- accessible labels
- adequate contrast
- minimum 44×44px touch targets

Never communicate important match state using only color.

---

# MVP Roadmap

## MVP 0.1 — Foundation ✅ COMPLETE

Goal:

Create the application foundation and establish the visual system.

Completed:

- React
- TypeScript
- Vite
- Tailwind CSS v4
- React Router
- Responsive layout
- Mobile-first structure
- Dark broadcast-style BIG5 design
- Persistent app shell
- Header
- Bottom navigation
- League tabs
- Reusable match card
- Mock football data
- Placeholder route pages
- Initial folder structure
- Full design token system

---

# MVP 0.2 — Football Data ← CURRENT PRIORITY

Goal:

Replace mock data with real football information.

Planned features:

- API-Football / API-Sports integration
- Premier League fixtures
- La Liga fixtures
- Serie A fixtures
- Bundesliga fixtures
- Ligue 1 fixtures
- Today matches
- Week matches
- Live matches
- Fixture cards populated from real API data
- Kickoff times
- Live scores
- Finished scores
- Match status
- League filtering
- Loading states
- Error states
- Empty states
- Real team crests where available

Initial development may use direct API access carefully.

Production architecture must eventually move secrets/server-side access away from the public frontend.

---

# MVP 0.3 — Better UX

Features:

- Improved league filters
- Match details page
- League standings
- More complete team crest handling
- Better responsive behavior
- Improved navigation
- Skeleton loaders
- Error-state refinement
- Empty-state refinement
- Match metadata

---

# MVP 0.4 — Personalization

Features:

- Favorite teams
- Favorite leagues
- Saved preferences
- User-specific match filtering
- Personalized Today experience

---

# MVP 0.5 — PWA

Features:

- Installable PWA
- Web app manifest
- App icons
- Service worker
- Offline shell
- Install prompt
- Mobile home-screen experience

---

# MVP 0.6 — Backend

Goal:

Move away from direct client-side football API calls.

Planned:

- Supabase database
- Cached fixtures
- Cached leagues
- Cached standings
- Centralized football API requests
- Supabase Edge Functions
- Scheduled updates
- API key protection

Possible tables:

```text
leagues
teams
fixtures
standings
favorite_teams
favorite_leagues
devices
notification_preferences
notification_log
```

Exact schema may change.

---

# MVP 0.7 — Push Notifications

Initial notification events:

```text
TODAY_MATCHES
ONE_HOUR_BEFORE
MATCH_STARTED
```

Example:

```text
Arsenal vs Chelsea starts in 1 hour ⚽
```

Example:

```text
🔴 Arsenal vs Chelsea has started
```

Later notification events:

```text
GOAL
HALF_TIME
FULL_TIME
RED_CARD
LINEUP
```

Every notification event must be recorded to avoid duplicates.

Potential table:

```text
notification_log
```

---

# MVP 0.8 — Polish

Features:

- Better animations
- Accessibility improvements
- Performance improvements
- Image optimization
- Responsive cleanup
- Better error handling
- Skeleton loading states
- Hover states
- Press/tap states
- UI consistency
- Final visual refinement

---

# MVP 1.0 — Public MVP

Goal:

Stable production-ready public BIG5 PWA.

Requirements:

- Stable Vercel deployment
- Real football data
- Reliable live scores
- Working favorites
- Working notifications
- Tested responsive layout
- Production-safe environment variables
- Error monitoring
- Basic analytics if useful
- Performance testing
- Accessibility review
- Production-ready PWA

---

# Future Roadmap

Potential future features:

- UEFA Champions League
- UEFA Europa League
- UEFA Conference League
- Additional leagues
- Goal notifications
- Red-card notifications
- Starting lineups
- Match statistics
- Possession
- Shots
- Player statistics
- Football news
- Team pages
- Player pages
- Search
- Match calendar
- Custom notification settings
- Dark/light themes
- Multiple languages
- Arabic support
- Norwegian support
- French support

---

# Android Roadmap

Only after the PWA is stable:

```text
React PWA
↓
Capacitor
↓
Android project
↓
Google Play
```

Potential Android improvements:

- Native push notifications
- Background notification handling
- Native splash screen
- Native app icon
- Android-specific permissions
- Deep links
- Native sharing

Do NOT begin Android development until the PWA is working properly.

---

# Git Workflow

GitHub is the source of truth.

Current preferred development workflow:

```text
Claude / ChatGPT writes code
↓
User copies code into VS Code
↓
npm run dev
↓
User tests locally
↓
User reads/understands implementation
↓
Fix problems if needed
↓
git add
↓
git commit
↓
git push
```

The user currently prefers to perform Git commits/pushes manually.

Later, Claude may be allowed to perform small targeted repo edits/commits when explicitly requested.

Do not automatically push changes without permission.

---

# Claude + ChatGPT Collaboration

Claude and ChatGPT may both work on BIG5.

The GitHub repository is the source of truth.

This file is the shared project memory.

Before making meaningful changes:

1. Inspect the latest repository state.
2. Read `BIG5-PROJECT.md`.
3. Understand what has already been implemented.
4. Avoid duplicating completed work.
5. Avoid replacing working code unnecessarily.
6. Continue from the latest confirmed working state.

Claude and ChatGPT should behave like two developers working on the same product.

Do not compete or restart architecture without a reason.

---

# Shared Project Memory

Primary shared memory file:

```text
BIG5-PROJECT.md
```

Visual design reference:

```text
BIG5-visual-brief.md
```

GitHub:

```text
source of truth
```

`BIG5-PROJECT.md`:

```text
shared development memory
```

Update this document after every meaningful development session.

Do NOT mark functionality complete until the user has successfully tested it locally.

---

# Current Status

## Current Version

```text
MVP 0.2 — Football Data
```

MVP 0.1 is complete.

---

# ✅ Done

- Vite + React + TypeScript project scaffolded
- Tailwind CSS v4 installed
- Tailwind configured using CSS-first `@theme` configuration
- No `tailwind.config.js` required for current Tailwind setup
- Full BIG5 design token system implemented
- True-black / indigo broadcast theme implemented
- Archivo + Inter fonts loaded via Google Fonts
- React Router configured
- Nested layout pattern implemented using `<Outlet />`
- Persistent application shell implemented
- Sticky `Header` implemented
- BIG5 wordmark implemented
- `BottomNav` implemented
- Mobile navigation includes:
     - Today
     - Week
     - Live
     - Standings
     - Favorites
- Active bottom-navigation state implemented using React Router `NavLink`
- `LeagueTabs` component implemented
- Horizontal league-pill navigation implemented
- All + five league tabs implemented
- League tab local active-state implemented
- League tabs not yet connected to real filtering
- `MatchCard` component implemented
- MatchCard supports:
     - upcoming
     - live
     - finished
- Tabular score block implemented
- Live pulse treatment implemented
- `TeamCrest` component implemented
- Real image support implemented
- Colored monogram fallback implemented
- `LiveIndicator` implemented
- Pulsing live dot implemented
- LIVE label implemented
- Match-minute display implemented
- Today page implemented
- Week page implemented
- Live page implemented
- Standings page implemented
- Favorites page implemented
- All five routes working
- Mock match data implemented
- Mock match data verifies all three MatchCard states
- Initial project folder architecture established
- Reserved folders created for MVP 0.2+
- MVP 0.1 tested successfully in browser

---

# 🚧 In Progress

Nothing currently in progress.

MVP 0.1 is closed.

Next development starts with MVP 0.2.

---

# ⏳ Next — MVP 0.2 Football Data

Immediate next steps:

1. Create / obtain API-Football API key
2. Review current API-Football documentation
3. Identify correct league IDs
4. Identify current season handling
5. Create:

```text
src/services/footballApi.ts
```

6. Centralize football API request logic
7. Create typed API-response interfaces
8. Fetch real fixtures
9. Replace or phase out:

```text
src/data/mockMatches.ts
```

10. Load real matches for all five leagues
11. Connect `LeagueTabs` to actual match filtering
12. Add loading state
13. Add error state
14. Add empty state
15. Use real team crests returned by the API where available
16. Verify:

- upcoming
- live
- finished

17. Verify date/time-zone handling

Do not begin Supabase/backend architecture yet unless direct API development demonstrates that server-side handling is immediately necessary.

---

# 🐛 Known Bugs

None currently.

Minor deferred cosmetic item:

- nav/tab hover states are not yet implemented

This is NOT considered a bug.

Hover/interaction polish is currently deferred to:

```text
MVP 0.8
```

Mobile tap interactions remain the priority.

---

# 🧠 Decisions Made

- Working product name is **BIG5**
- BIG5 initially covers exactly the traditional European Big Five leagues
- React selected for frontend
- TypeScript selected
- Vite selected
- Tailwind CSS selected
- Tailwind CSS **v4** is used
- Tailwind uses CSS-first configuration
- Design tokens live in the `@theme` block in `src/index.css`
- No `tailwind.config.js` currently required
- No legacy Tailwind v3 setup should be introduced
- React Router selected for navigation
- Nested `<Route>` + `<Outlet />` architecture used
- One shared `Layout` wraps route pages
- `lucide-react` selected for UI icons
- Fonts:
     - Archivo for display/scores
     - Inter for interface/body
- Fonts loaded through Google Fonts `<link>` in `index.html`
- Visual direction is **Broadcast Energy**
- Main accent is indigo:
     - `#6366F1`
- Application base is true black:
     - `#000000`
- Red:
     - `#FF3B3B`
       is reserved for live/urgent status only
- Visual depth comes primarily from dark surface steps + 1px borders
- Drop shadows are intentionally avoided as the primary depth mechanism
- Tabular numerals are required for changing scores/times
- MatchCard is a core reusable UI unit
- Real crests are preferred
- Crest fallback is a team-color monogram
- API-Football / API-Sports remains the planned initial football provider
- Supabase remains the planned backend/cache layer
- Firebase Cloud Messaging remains the planned push-notification system
- Vercel remains the planned hosting provider
- Capacitor remains the planned Android bridge
- Local manual testing happens before Git commits
- User currently performs Git commits/pushes manually
- `BIG5-PROJECT.md` is shared project memory
- `BIG5-visual-brief.md` contains the detailed visual direction

---

# 🔌 API Decisions

Current provider:

```text
API-Football / API-Sports
```

Current state:

```text
Not connected yet.
```

MVP 0.2 must determine and record:

- API base URL
- authentication method
- current API version
- league IDs
- season handling
- fixtures endpoint
- live fixtures endpoint
- standings endpoint
- team logos/crest source
- rate limits
- polling requirements
- cache strategy
- timezone behavior
- API limitations

Security rule:

Never expose private API secrets in public production frontend code.

If a key must remain secret, move requests behind server-side infrastructure before production deployment.

---

# 🗄 Database Decisions

Database/backend is not yet implemented.

Planned provider:

```text
Supabase
```

Planned future tables may include:

```text
leagues
teams
fixtures
standings
favorite_teams
favorite_leagues
devices
notification_preferences
notification_log
```

Future database decisions must record:

- columns
- relationships
- indexes
- RLS policies
- Edge Functions
- Cron jobs
- caching rules

Do not create database complexity before MVP 0.2 validates the actual football data requirements.

---

# 🧩 Important Components

## `Header`

Purpose:

- sticky top navigation
- BIG5 wordmark
- future global actions

---

## `BottomNav`

Purpose:

Primary mobile navigation.

Routes:

```text
Today
Week
Live
Standings
Favorites
```

Uses:

```text
React Router NavLink
```

for active route state.

---

## `LeagueTabs`

Purpose:

Horizontal league filter.

Current state:

```text
UI implemented
local active state implemented
real filtering not yet connected
```

Will be wired to match data during MVP 0.2.

---

## `MatchCard`

Purpose:

Core football fixture display.

Supports:

```text
upcoming
live
finished
```

Includes:

- team names
- crests
- score/time
- status
- broadcast-style hierarchy

---

## `TeamCrest`

Purpose:

Displays team crest.

Behavior:

```text
real image
↓ if unavailable
colored monogram fallback
```

---

## `LiveIndicator`

Purpose:

BIG5 live-status brand signal.

Includes:

```text
pulsing red dot
LIVE label
match minute
```

---

## `Layout`

Purpose:

Persistent application shell.

Contains:

```text
Header
Outlet
BottomNav
```

---

# 📁 Important Files

```text
BIG5-PROJECT.md
BIG5-visual-brief.md

index.html

src/App.tsx
src/main.tsx
src/index.css

src/types/football.ts
src/types/league.ts

src/data/mockMatches.ts

src/components/layout/Header.tsx
src/components/layout/BottomNav.tsx
src/components/layout/LeagueTabs.tsx
src/components/layout/Layout.tsx

src/components/ui/MatchCard.tsx
src/components/ui/TeamCrest.tsx
src/components/ui/LiveIndicator.tsx

src/pages/Today.tsx
src/pages/Week.tsx
src/pages/Live.tsx
src/pages/Standings.tsx
src/pages/Favorites.tsx
```

Reserved folders:

```text
src/services/
src/utils/
src/hooks/
```

Expected next important file:

```text
src/services/footballApi.ts
```

---

# Folder Structure

Current architecture:

```text
src/
├── components/
│   ├── layout/
│   │   ├── BottomNav.tsx
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   └── LeagueTabs.tsx
│   │
│   └── ui/
│       ├── LiveIndicator.tsx
│       ├── MatchCard.tsx
│       └── TeamCrest.tsx
│
├── data/
│   └── mockMatches.ts
│
├── hooks/
│
├── pages/
│   ├── Favorites.tsx
│   ├── Live.tsx
│   ├── Standings.tsx
│   ├── Today.tsx
│   └── Week.tsx
│
├── services/
│
├── types/
│   ├── football.ts
│   └── league.ts
│
├── utils/
│
├── App.tsx
├── index.css
└── main.tsx
```

Do not reorganize this structure without a clear benefit.

---

# 📝 Session Notes

## 2026-09-14

Completed **MVP 0.1 — Foundation**.

Built:

- Vite
- React
- TypeScript
- Tailwind CSS v4
- full design token system
- true-black / indigo broadcast theme
- Archivo + Inter typography
- React Router
- persistent Header + BottomNav shell
- league filter pills
- MatchCard
- TeamCrest
- LiveIndicator
- Today page
- Week page
- Live page
- Standings page
- Favorites page

MatchCard verified using mock data in all three primary states:

```text
upcoming
live
finished
```

Application tested successfully in browser.

MVP 0.1 is considered complete.

Next:

```text
MVP 0.2 — Football Data
```

Primary next task:

Connect API-Football and begin replacing mock data with real fixtures.

---

# AI Coding Rules

Whenever Claude or ChatGPT provides code:

1. Give exact filename.
2. State:
      - CREATE
      - REPLACE
      - EDIT
3. Keep changes incremental.
4. Avoid rewriting unrelated files.
5. Explain major changes briefly.
6. Keep TypeScript types clean.
7. Use reusable components.
8. Do not add dependencies without a reason.
9. Provide required `npm install` command when necessary.
10. Mention required environment variables.
11. Never expose secret keys.
12. Prefer production-quality naming.
13. Keep code understandable enough for the user to explain later.
14. Do not mark tasks complete until user confirms successful local testing.
15. Update `BIG5-PROJECT.md` after meaningful completed work.

---

# Code Quality Rules

Prefer:

- reusable components
- focused components
- clear TypeScript interfaces
- custom hooks where useful
- clear folder structure
- descriptive names
- simple state management
- simple readable logic
- mobile-first styling
- accessible HTML
- consistent formatting
- explicit data types

Avoid:

- giant components
- unnecessary prop drilling
- premature abstraction
- unnecessary state libraries
- unnecessary dependencies
- duplicated logic
- hard-coded secrets
- giant files
- excessive `any`
- rewriting working code without reason

---

# React Learning Notes

When useful, briefly point out concepts such as:

- Props
- State
- `useState`
- `useEffect`
- `useMemo`
- `useCallback`
- Custom hooks
- Conditional rendering
- Lists and keys
- Controlled inputs
- Context
- React Router
- Data fetching
- Error handling
- Component composition

Do not turn every development step into a basic tutorial.

The user already has frontend experience and is refreshing knowledge.

Explain concepts naturally when they appear in actual BIG5 code.

---

# TypeScript Learning Notes

When useful, explain:

- Interfaces
- Type aliases
- Union types
- Optional properties
- Generics
- API response typing
- Function types
- React component props
- Null/undefined handling

Prefer proper typing over:

```ts
any;
```

---

# Security Rules

Never expose:

- API-Football private keys
- Supabase service-role keys
- Firebase server credentials
- database passwords
- other private server secrets

Frontend may only contain keys explicitly intended to be public.

Sensitive operations must eventually move to server-side infrastructure.

---

# Notification Rules

Initial planned push events:

```text
TODAY_MATCHES
ONE_HOUR_BEFORE
MATCH_STARTED
```

Later:

```text
GOAL
HALF_TIME
FULL_TIME
RED_CARD
LINEUP
```

Every notification must be recorded so duplicate notifications cannot be sent.

---

# Performance Rules

Avoid unnecessary polling.

Prefer:

- centralized server-side polling
- caching
- efficient database queries
- API response reuse
- lazy loading
- minimal network requests
- optimized images
- sensible refresh intervals

The production football API should not be called independently by every client.

---

# Current Priority

The immediate priority is:

```text
MVP 0.2 — Football Data
```

Focus on:

```text
API-Football
↓
typed API layer
↓
real fixtures
↓
Today / Week / Live
↓
league filtering
↓
loading/error/empty states
```

Do NOT jump ahead yet to:

- Supabase database implementation
- Firebase push notifications
- PWA installation
- Android
- advanced statistics
- news
- player profiles

unless a dependency genuinely requires earlier implementation.

---

# Definition of Done for Each Development Step

A development step is complete when:

1. Code is added.
2. Application runs locally.
3. No obvious console errors exist.
4. Feature behaves as expected.
5. Responsive behavior is checked when relevant.
6. User understands the main purpose of the implementation.
7. `BIG5-PROJECT.md` is updated.
8. Changes are committed/pushed when ready.

---

# Final Collaboration Rule

Claude and ChatGPT are two developers working on the same BIG5 product.

Always continue from the latest confirmed working state.

Do not restart architecture merely because a different AI is now working on the project.

If an existing implementation appears incorrect:

1. Explain the issue.
2. Explain why changing it is worthwhile.
3. Propose the smallest appropriate fix.
4. Modify only what is necessary.
5. Test.
6. Update `BIG5-PROJECT.md`.

GitHub remains the source of truth.

`BIG5-PROJECT.md` remains the shared development memory.
