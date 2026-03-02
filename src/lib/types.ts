// ============================================================
// types.ts
// This file defines the "shape" of all data in your app.
// TypeScript uses these to catch mistakes before your code runs.
// Think of them like blueprints — they describe what an object
// must look like without containing any actual data.
// ============================================================


// ------------------------------------------------------------
// API TYPES
// These match exactly what the balldontlie API sends back.
// ------------------------------------------------------------

// A single NBA team as returned by the API
export interface BDLTeam {
  id: number;
  abbreviation: string;       // e.g. "UTA"
  city: string;               // e.g. "Utah"
  conference: string;         // "West" or "East"
  division: string;           // e.g. "Northwest"
  full_name: string;          // e.g. "Utah Jazz"
  name: string;               // e.g. "Jazz"
}

// A single NBA player as returned by the API
export interface BDLPlayer {
  id: number;
  first_name: string;
  last_name: string;
  position: string;           // "G", "F", "C", "G-F", etc.
  height: string;             // e.g. "6-8"
  weight: string;             // e.g. "215"
  jersey_number: string;      // e.g. "23"
  college: string;
  country: string;
  draft_year: number | null;
  draft_round: number | null;
  draft_number: number | null;
  team: BDLTeam;              // nested team object
}

// A single NBA game as returned by the API
export interface BDLGame {
  id: number;
  date: string;               // e.g. "2026-02-01"
  season: number;             // e.g. 2024 (means 2024-25 season)
  status: string;             // "Final", "1st Qtr", "2nd Qtr", etc.
  period: number;             // current quarter (0 if not started)
  time: string;               // game clock e.g. "2:15"
  postseason: boolean;
  home_team: BDLTeam;
  home_team_score: number;
  visitor_team: BDLTeam;
  visitor_team_score: number;
}

// The API wraps all list responses in a "data" array with metadata
// This is called a "generic" type — the <T> is a placeholder for
// whatever type of data is inside (players, games, etc.)
export interface BDLResponse<T> {
  data: T[];
  meta: {
    total_count: number;
    next_cursor: number | null;
    per_page: number;
  };
}

// ------------------------------------------------------------
// APP TYPES
// These are the shapes your UI components actually use.
// We map API data into these cleaner shapes in balldontlie.ts
// ------------------------------------------------------------

// The Player shape your existing components already expect
// (matches what was in mock.ts so nothing breaks)
export interface Player {
  id: number;
  name: string;
  number: string;
  position: string;
  ppg: number;
  rpg: number;
  apg: number;
  image: string;              // initials fallback e.g. "LM"
}

// Extended player with full season stats for the stats page
export interface PlayerStat {
  player: Player;
  gp: number;                 // games played
  mpg: number;                // minutes per game
  fgPct: number;
  threePct: number;
  ftPct: number;
  rpg: number;
  apg: number;
  spg: number;                // steals per game
  bpg: number;                // blocks per game
  ppg: number;
  per: number;                // player efficiency rating (not from API, we'll default to 0)
  ts: number;                 // true shooting % (we'll calculate this ourselves)
}

// Game recap shape your existing components expect
export interface GameRecap {
  id: string;
  date: string;
  opponent: string;
  opponentAbbr: string;
  jazzScore: number;
  opponentScore: number;
  win: boolean;
  mvp: string;
  keyMoments: KeyMoment[];
  attendance: number;
}

// These stay as-is from mock.ts since they're not from the API
export interface KeyMoment {
  id: string;
  quarter: number;
  time: string;
  significance: number;
  title: string;
  description: string;
  playerName: string;
}

export interface Shot {
  id: string;
  playerId: number;
  playerName: string;
  x: number;
  y: number;
  made: boolean;
  shotType: "2PT" | "3PT" | "FT";
  quarter: number;
  time: string;
  description: string;
}

export interface PlayByPlayEvent {
  id: string;
  time: string;
  quarter: number;
  type: "basket" | "foul" | "turnover" | "substitution" | "timeout" | "rebound" | "steal" | "block";
  team: "jazz" | "opponent";
  description: string;
  score: { jazz: number; opponent: number };
  isScoring: boolean;
}

export interface Poll {
  id: string;
  question: string;
  options: { id: string; label: string; votes: number; image?: string }[];
  status: "active" | "completed";
  correctOptionId?: string;
  expiresIn?: number;
  totalVotes: number;
  xpReward: number;
  context: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";
  earned: boolean;
  earnedDate?: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  tier: string;
  accuracy: number;
  streak: number;
}