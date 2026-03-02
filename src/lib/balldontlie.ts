// ============================================================
// balldontlie.ts
// This is your API layer — the only file in the app that talks
// to the balldontlie API. Every other file imports from here.
//
// Key concept: we fetch raw API data, then "map" it into the
// cleaner shapes your UI components already expect. This means
// if the API ever changes, you only fix it in this one file.
// ============================================================

import { BalldontlieAPI, NBAStandings, type NBASeasonAverages } from "@balldontlie/sdk";
import type {
  BDLPlayer,
  BDLGame,
  Player,
  PlayerStat,
  GameRecap,
} from "./types";

// ------------------------------------------------------------
// SDK SETUP
// The SDK handles auth headers, base URLs, and retries for you.
// process.env.NEXT_PUBLIC_BDL_API_KEY reads from your .env.local
// ------------------------------------------------------------
const api = new BalldontlieAPI({
  apiKey: process.env.NEXT_PUBLIC_BDL_API_KEY!,
  // The "!" tells TypeScript "trust me, this won't be undefined"
  // If the key is missing, the API calls will just fail with a 401 error
});

// The Jazz's team ID in the balldontlie database
export const JAZZ_TEAM_ID = 29;

// The current NBA season (2025 = the 2025-26 season)
export const CURRENT_SEASON = 2025;


// ------------------------------------------------------------
// HELPER: mapPlayerToAppShape
// Converts a raw API player into the shape your UI expects.
// This is called "mapping" or "transforming" data.
// ------------------------------------------------------------
function mapPlayer(p: BDLPlayer): Player {
  const initials = `${p.first_name[0]}${p.last_name[0]}`;
  return {
    id: p.id,
    name: `${p.first_name} ${p.last_name}`,
    number: p.jersey_number ?? "??",
    position: p.position || "N/A",
    // These start as 0 — we fill them in when we have season averages
    ppg: 0,
    rpg: 0,
    apg: 0,
    image: initials,
  };
}


// ------------------------------------------------------------
// HELPER: calcTrueShootingPct
// True Shooting % is a stat that measures shooting efficiency.
// Formula: PTS / (2 * (FGA + 0.44 * FTA))
// The API doesn't give us this directly so we calculate it.
// ------------------------------------------------------------
function calcTS(avg:NBASeasonAverages): number {
  const denominator = 2 * (avg.fga + 0.44 * avg.fta);
  if (denominator === 0) return 0;
  return parseFloat(((avg.pts / denominator) * 100).toFixed(1));
}


// ------------------------------------------------------------
// fetchJazzRoster
// Gets all players currently on the Jazz roster.
//
// The API returns players in pages (25 at a time by default).
// We fetch page 1 which is enough for a single team's roster.
// ------------------------------------------------------------
export async function fetchJazzRoster(): Promise<Player[]> {
  try {
    const res = await api.nba.getPlayers({
      team_ids: [JAZZ_TEAM_ID],
      per_page: 50,  // Jazz roster is ~15 players, 50 is plenty
    });

    return res.data.map(mapPlayer);
  } catch (err) {
    console.error("fetchJazzRoster failed:", err);
    return [];  // Return empty array instead of crashing the app
  }
}


// ------------------------------------------------------------
// fetchJazzPlayerStats
// Gets full season averages for every player on the Jazz.
//
// This requires TWO API calls:
// 1. Get the roster to find all player IDs
// 2. Pass those IDs to the season averages endpoint
// ------------------------------------------------------------
export async function fetchJazzPlayerStats(): Promise<PlayerStat[]> {
  try {
    // Step 1: get the roster
    const rosterRes = await api.nba.getPlayers({
      team_ids: [JAZZ_TEAM_ID],
      per_page: 50,
    });
    const players = rosterRes.data;

    if (players.length === 0) return [];

    // Step 2: fetch season averages for every player at the same time
    // Promise.all means "fire ALL of these requests simultaneously
    // and wait until every single one is done before continuing"
    // This is much faster than doing them one at a time in a loop
    const avgResults = await Promise.all(
      players.map((p) =>
        api.nba.getSeasonAverages({
          season: CURRENT_SEASON,
          player_id: p.id,
        }).catch(() => ({ data: [] }))
        // The .catch here means: if one player's request fails,
        // just return empty data instead of crashing everything
      )
    );

    // Step 3: flatten results into a map just like before
    // avgResults is an array of responses, one per player
    const avgMap = new Map<number, NBASeasonAverages>();
    avgResults.forEach((res) => {
      res.data.forEach((a: NBASeasonAverages) => avgMap.set(a.player_id, a));
    });

    // Step 4: same as before — combine player + averages
    return players
      .map((p): PlayerStat => {
        const avg = avgMap.get(p.id);
        const player = mapPlayer(p);

        if (!avg) {
          return {
            player,
            gp: 0, mpg: 0, fgPct: 0, threePct: 0, ftPct: 0,
            rpg: 0, apg: 0, spg: 0, bpg: 0, ppg: 0, per: 0, ts: 0,
          };
        }

        player.ppg = avg.pts;
        player.rpg = avg.reb;
        player.apg = avg.ast;

        return {
          player,
          gp: avg.games_played,
          mpg: parseFloat(avg.min),
          fgPct: avg.fg_pct ?? 0,
          threePct: avg.fg3_pct ?? 0,
          ftPct: avg.ft_pct ?? 0,
          rpg: avg.reb,
          apg: avg.ast,
          spg: avg.stl,
          bpg: avg.blk,
          ppg: avg.pts,
          per: 0,
          ts: calcTS(avg),
        };
      })
      .filter((s) => s.gp > 0)
      .sort((a, b) => b.ppg - a.ppg);

  } catch (err) {
    console.error("fetchJazzPlayerStats failed:", err);
    return [];
  }
}


// ------------------------------------------------------------
// fetchJazzGames
// Gets the Jazz's recent and upcoming games for the season.
//
// We pass the season and team ID, then sort results newest first.
// ------------------------------------------------------------
export async function fetchJazzGames(season = CURRENT_SEASON): Promise<GameRecap[]> {
  try {
    const res = await api.nba.getGames({
      team_ids: [JAZZ_TEAM_ID],
      seasons: [season],
      per_page: 100,  // get a full season's worth of games
    });

    return res.data
      .filter((g: BDLGame) => g.status === "Final")  // only completed games
      .map((g: BDLGame): GameRecap => {
        // Figure out which team is the Jazz and which is the opponent
        const jazzIsHome = g.home_team.id === JAZZ_TEAM_ID;
        const jazzScore = jazzIsHome ? g.home_team_score : g.visitor_team_score;
        const oppScore = jazzIsHome ? g.visitor_team_score : g.home_team_score;
        const opponent = jazzIsHome ? g.visitor_team : g.home_team;

        return {
          id: String(g.id),
          date: g.date,
          opponent: opponent.full_name,
          opponentAbbr: opponent.abbreviation,
          jazzScore,
          opponentScore: oppScore,
          win: jazzScore > oppScore,
          mvp: "",          // API doesn't provide this, keep blank or fill from mock
          keyMoments: [],   // Same — generated data
          attendance: 18306, // Delta Center capacity, API doesn't provide this
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      // Sorts newest game first
  } catch (err) {
    console.error("fetchJazzGames failed:", err);
    return [];
  }
}


// ------------------------------------------------------------
// fetchStandings
// Gets the full NBA standings for a given season.
// Useful for showing where the Jazz rank in the West.
// ------------------------------------------------------------
export async function fetchStandings(season = CURRENT_SEASON) {
  try {
    const res = await api.nba.getStandings({ season });
    return res.data as NBAStandings[];
  } catch (err) {
    console.error("fetchStandings failed:", err);
    return [];
  }
}

// Convenience function to get just the Jazz's standing
export async function fetchJazzStanding() {
  const standings = await fetchStandings();
  return standings.find((s) => s.team.id === JAZZ_TEAM_ID) ?? null;
}