# Utah Jazz Hackathon 2026

A real-time Utah Jazz fan engagement platform built for the Seagate hackathon. Features live game tracking, interactive shot charts, community polls, AI-generated recaps, and a full gamification system.

## Features

- **Live Scoreboard** — Real-time score updates with animated flip transitions and possession indicator
- **Play-by-Play Feed** — Chronological event feed with scoring highlights, fouls, steals, and more
- **Interactive Shot Chart** — SVG half-court with make/miss markers, filterable by player, quarter, and shot type
- **Live Polls** — In-game polls with instant voting, animated results, and XP rewards
- **Quarter Recaps** — AI-style key moment breakdowns with significance scores (1-10)
- **Game Recaps** — Season calendar with expandable game cards showing MVP, margin, and key moments
- **Player Stats** — Sortable stats (PPG, RPG, APG, FG%, 3PT%, PER, TS%) with expandable detail cards
- **Conference Standings** — Western Conference table with Jazz highlighted
- **Gamification** — XP system, prediction streaks, badge collection (Common through Legendary), tier progression (Bronze to Diamond)
- **Leaderboard** — Ranked fan leaderboard with accuracy and streak tracking
- **Live Simulation** — Clock countdown with randomly generated game events for demo purposes

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Charts:** SVG (D3-style shot chart rendering)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher
- npm

### Clone and Run

```bash
git clone <repo-url>
cd Utah-Jazz-Hackathon
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```
