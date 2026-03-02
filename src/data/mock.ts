import type { Player, Shot, PlayByPlayEvent, Poll, KeyMoment, Badge, GameRecap, LeaderboardEntry, PlayerStat } from "@/lib/types";

// Jazz Players (2025-26 roster)
export const jazzPlayers: Player[] = [
  { id: 1, name: "Lauri Markkanen", number: "23", position: "PF", ppg: 26.7, rpg: 6.9, apg: 2.1, image: "LM" },
  { id: 2, name: "Ace Bailey", number: "19", position: "F", ppg: 11.9, rpg: 4.1, apg: 1.7, image: "AB" },
  { id: 3, name: "Isaiah Collier", number: "8", position: "G", ppg: 11.0, rpg: 2.5, apg: 7.3, image: "IC" },
  { id: 4, name: "Walker Kessler", number: "24", position: "C", ppg: 14.4, rpg: 10.8, apg: 3.0, image: "WK" },
  { id: 5, name: "Cody Williams", number: "5", position: "F", ppg: 5.8, rpg: 2.4, apg: 1.0, image: "CW" },
  { id: 6, name: "Keyonte George", number: "3", position: "PG", ppg: 23.6, rpg: 3.9, apg: 6.5, image: "KG" },
  { id: 7, name: "Blake Hinson", number: "2", position: "F", ppg: 8.5, rpg: 2.5, apg: 0.3, image: "BH" },
  { id: 8, name: "Brice Sensabaugh", number: "28", position: "SF", ppg: 12.8, rpg: 3.0, apg: 1.5, image: "BS" },
];

// Opponent Players (Nuggets)
export const opponentPlayers: Player[] = [
  { id: 101, name: "Nikola Jokic", number: "15", position: "C", ppg: 24.8, rpg: 7.1, apg: 8.2, image: "NJ" },
  { id: 102, name: "Jamal Murray", number: "27", position: "G", ppg: 26.1, rpg: 11.5, apg: 3.1, image: "JM" },
  { id: 103, name: "Aaron Gordon", number: "32", position: "F", ppg: 17.4, rpg: 4.3, apg: 5.6, image: "AG" },
  { id: 104, name: "Bruce Brown", number: "11", position: "G", ppg: 14.2, rpg: 3.1, apg: 6.3, image: "BB" },
  { id: 105, name: "Christian Braun", number: "00", position: "G", ppg: 12.8, rpg: 5.2, apg: 1.4, image: "CB" },
];

// Generate shot chart data
export function generateShots(): Shot[] {
  const shots: Shot[] = [];
  const jazzShooters = jazzPlayers.slice(0, 6);
  const shotTypes: ("2PT" | "3PT")[] = ["2PT", "3PT"];

  for (let q = 1; q <= 4; q++) {
    const numShots = 18 + Math.floor(Math.random() * 8);
    for (let i = 0; i < numShots; i++) {
      const player = jazzShooters[Math.floor(Math.random() * jazzShooters.length)];
      const is3pt = Math.random() > 0.55;
      let x: number, y: number;

      if (is3pt) {
        // Three-point arc positions
        const angle = Math.random() * Math.PI;
        const radius = 38 + Math.random() * 8;
        x = 50 + radius * Math.cos(angle) * (Math.random() > 0.5 ? 1 : -1) * 0.6;
        y = 10 + radius * Math.sin(angle) * 0.5;
      } else {
        // Inside the arc
        x = 30 + Math.random() * 40;
        y = 55 + Math.random() * 35;
      }

      x = Math.max(5, Math.min(95, x));
      y = Math.max(5, Math.min(95, y));

      const made = is3pt ? Math.random() > 0.63 : Math.random() > 0.48;
      const min = Math.floor(Math.random() * 12);
      const sec = Math.floor(Math.random() * 60);

      shots.push({
        id: `shot-${q}-${i}`,
        playerId: player.id,
        playerName: player.name,
        x,
        y,
        made,
        shotType: is3pt ? "3PT" : "2PT",
        quarter: q,
        time: `${min}:${sec.toString().padStart(2, "0")}`,
        description: `${player.name} ${made ? "makes" : "misses"} ${is3pt ? "3PT" : "2PT"} jumper`,
      });
    }
  }
  return shots;
}

// Generate play-by-play events
export function generatePlayByPlay(): PlayByPlayEvent[] {
  const events: PlayByPlayEvent[] = [];
  let jazzScore = 0;
  let oppScore = 0;

  const eventTemplates = [
    { type: "basket" as const, isScoring: true },
    { type: "foul" as const, isScoring: false },
    { type: "turnover" as const, isScoring: false },
    { type: "rebound" as const, isScoring: false },
    { type: "steal" as const, isScoring: false },
    { type: "block" as const, isScoring: false },
  ];

  for (let q = 1; q <= 4; q++) {
    for (let i = 0; i < 25; i++) {
      const isJazz = Math.random() > 0.48;
      const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
      const player = isJazz
        ? jazzPlayers[Math.floor(Math.random() * 5)]
        : opponentPlayers[Math.floor(Math.random() * 5)];
      const min = 12 - Math.floor((i / 25) * 12);
      const sec = Math.floor(Math.random() * 60);

      if (template.type === "basket") {
        const pts = Math.random() > 0.65 ? 3 : 2;
        if (isJazz) jazzScore += pts;
        else oppScore += pts;

        events.push({
          id: `pbp-${q}-${i}`,
          time: `${min}:${sec.toString().padStart(2, "0")}`,
          quarter: q,
          type: "basket",
          team: isJazz ? "jazz" : "opponent",
          description: `${player.name} makes ${pts === 3 ? "3PT" : "2PT"} shot`,
          score: { jazz: jazzScore, opponent: oppScore },
          isScoring: true,
        });
      } else {
        const descriptions: Record<string, string> = {
          foul: `${player.name} personal foul`,
          turnover: `${player.name} turnover (lost ball)`,
          rebound: `${player.name} defensive rebound`,
          steal: `${player.name} steals the ball`,
          block: `${player.name} blocks the shot`,
        };

        events.push({
          id: `pbp-${q}-${i}`,
          time: `${min}:${sec.toString().padStart(2, "0")}`,
          quarter: q,
          type: template.type,
          team: isJazz ? "jazz" : "opponent",
          description: descriptions[template.type],
          score: { jazz: jazzScore, opponent: oppScore },
          isScoring: false,
        });
      }
    }
  }

  return events.reverse();
}

// Generate polls
export const mockPolls: Poll[] = [
  {
    id: "poll-1",
    question: "Who scores the next bucket?",
    options: [
      { id: "o1", label: "Lauri Markkanen", votes: 1247 },
      { id: "o2", label: "Keyonte George", votes: 892 },
      { id: "o3", label: "Ace Bailey", votes: 634 },
      { id: "o4", label: "Someone else", votes: 423 },
    ],
    status: "active",
    expiresIn: 45,
    totalVotes: 3196,
    xpReward: 15,
    context: "Jazz trail by 3 in the 3rd quarter",
  },
  {
    id: "poll-2",
    question: "Will the Jazz hold their lead at halftime?",
    options: [
      { id: "o1", label: "Yes, Jazz hold", votes: 2134 },
      { id: "o2", label: "No, Nuggets take it", votes: 1567 },
    ],
    status: "completed",
    correctOptionId: "o1",
    totalVotes: 3701,
    xpReward: 15,
    context: "Jazz lead by 5 with 2:30 left in Q2",
  },
  {
    id: "poll-3",
    question: "What's Markkanen's final point total?",
    options: [
      { id: "o1", label: "Under 25", votes: 567 },
      { id: "o2", label: "25-30", votes: 1423 },
      { id: "o3", label: "31-35", votes: 890 },
      { id: "o4", label: "Over 35", votes: 345 },
    ],
    status: "active",
    expiresIn: 120,
    totalVotes: 3225,
    xpReward: 15,
    context: "Markkanen has 18 pts through 3 quarters",
  },
  {
    id: "poll-4",
    question: "Player of the Half?",
    options: [
      { id: "o1", label: "Lauri Markkanen", votes: 3245 },
      { id: "o2", label: "Nikola Jokic", votes: 2890 },
      { id: "o3", label: "Keyonte George", votes: 1234 },
    ],
    status: "completed",
    correctOptionId: "o1",
    totalVotes: 7369,
    xpReward: 15,
    context: "Halftime poll",
  },
];

// Key moments
export const mockKeyMoments: KeyMoment[] = [
  {
    id: "km-1",
    quarter: 1,
    time: "3:42",
    significance: 8,
    title: "Markkanen Ignites the Crowd",
    description: "Lauri Markkanen drains a contested step-back three from the right wing, capping an 8-0 Jazz run that turns a 4-point deficit into a 4-point lead. The Delta Center erupts as Markkanen flexes toward the Jazz bench.",
    playerName: "Lauri Markkanen",
  },
  {
    id: "km-2",
    quarter: 1,
    time: "0:45",
    significance: 7,
    title: "Kessler Swats Murray",
    description: "Walker Kessler emphatically blocks Jamal Murray at the rim on a fast break, sending the ball into the third row. The Jazz transition immediately and George finishes with a floater in the lane.",
    playerName: "Walker Kessler",
  },
  {
    id: "km-3",
    quarter: 2,
    time: "8:15",
    significance: 9,
    title: "George's Explosive Run",
    description: "Keyonte George scores 8 consecutive points in a two-minute span, including back-to-back pull-up threes that push the Jazz lead to 12. The Nuggets call a timeout to stop the bleeding.",
    playerName: "Keyonte George",
  },
  {
    id: "km-4",
    quarter: 2,
    time: "1:03",
    significance: 7,
    title: "Buzzer-Beater Attempt",
    description: "Ace Bailey launches a halfcourt heave at the halftime buzzer that rattles in and out. The near-miss sends the crowd into a frenzy as the Jazz head to the locker room up 8.",
    playerName: "Ace Bailey",
  },
  {
    id: "km-5",
    quarter: 3,
    time: "5:22",
    significance: 8,
    title: "Nuggets Storm Back",
    description: "Nikola Jokic finds Aaron Gordon for a thunderous alley-oop, completing a 10-2 Nuggets run that cuts the lead to just 2 points. The momentum has completely shifted.",
    playerName: "NIkola Jokic",
  },
  {
    id: "km-6",
    quarter: 3,
    time: "0:15",
    significance: 9,
    title: "Clutch Markkanen Three",
    description: "With the shot clock winding down, Markkanen rises over Christian Braun and buries a deep three-pointer to beat the third-quarter buzzer, pushing the lead back to 7.",
    playerName: "Lauri Markkanen",
  },
  {
    id: "km-7",
    quarter: 4,
    time: "2:15",
    significance: 10,
    title: "Dagger by Keyonte George",
    description: "Keyonte George crosses over Nikola Jokic, steps into a pull-up three from 28 feet, and splashes it to put the Jazz up 9 with 2:15 remaining. The Delta Center crowd is on their feet—the game is all but sealed.",
    playerName: "Keyonte George",
  },
];

// Badges
export const mockBadges: Badge[] = [
  { id: "b1", name: "First Bucket", description: "Submit your first prediction", icon: "🏀", rarity: "Common", earned: true, earnedDate: "Oct 22, 2025" },
  { id: "b2", name: "Sharpshooter", description: "5 correct game predictions in a row", icon: "🎯", rarity: "Uncommon", earned: true, earnedDate: "Nov 15, 2025" },
  { id: "b3", name: "Oracle", description: "Predict exact final score margin (±2 pts)", icon: "🔮", rarity: "Rare", earned: true, earnedDate: "Dec 3, 2025" },
  { id: "b4", name: "Iron Fan", description: "Engage with 41+ home games", icon: "⚒️", rarity: "Rare", earned: false },
  { id: "b5", name: "Triple Threat", description: "Correct on outcome, MVP, and spread", icon: "👑", rarity: "Epic", earned: true, earnedDate: "Jan 18, 2026" },
  { id: "b6", name: "All-Star Voter", description: "Vote in 200+ polls in a season", icon: "⭐", rarity: "Epic", earned: false },
  { id: "b7", name: "Diamond Mind", description: "Reach Diamond tier", icon: "💎", rarity: "Legendary", earned: false },
  { id: "b8", name: "Playoff Prophet", description: "Correct series prediction", icon: "🏆", rarity: "Legendary", earned: false },
  { id: "b9", name: "Hot Streak", description: "7 consecutive days of predictions", icon: "🔥", rarity: "Uncommon", earned: true, earnedDate: "Feb 1, 2026" },
  { id: "b10", name: "Community Voice", description: "Vote in 50 polls", icon: "📢", rarity: "Common", earned: true, earnedDate: "Nov 28, 2025" },
];

// Game recaps for calendar
export const mockGameRecaps: GameRecap[] = [
  { id: "g1", date: "2026-02-01", opponent: "Sacramento Kings", opponentAbbr: "SAC", jazzScore: 118, opponentScore: 109, win: true, mvp: "Lauri Markkanen", keyMoments: [], attendance: 18306 },
  { id: "g2", date: "2026-02-03", opponent: "Portland Trail Blazers", opponentAbbr: "POR", jazzScore: 105, opponentScore: 112, win: false, mvp: "Keyonte George", keyMoments: [], attendance: 18306 },
  { id: "g3", date: "2026-02-05", opponent: "Denver Nuggets", opponentAbbr: "DEN", jazzScore: 121, opponentScore: 115, win: true, mvp: "Lauri Markkanen", keyMoments: [], attendance: 18306 },
  { id: "g4", date: "2026-02-08", opponent: "Phoenix Suns", opponentAbbr: "PHX", jazzScore: 99, opponentScore: 108, win: false, mvp: "Ace Bailey", keyMoments: [], attendance: 18306 },
  { id: "g5", date: "2026-02-10", opponent: "Golden State Warriors", opponentAbbr: "GSW", jazzScore: 127, opponentScore: 119, win: true, mvp: "Keyonte George", keyMoments: [], attendance: 18306 },
  { id: "g6", date: "2026-02-12", opponent: "Memphis Grizzlies", opponentAbbr: "MEM", jazzScore: 115, opponentScore: 110, win: true, mvp: "Lauri Markkanen", keyMoments: [], attendance: 18306 },
  { id: "g7", date: "2026-02-15", opponent: "Oklahoma City Thunder", opponentAbbr: "OKC", jazzScore: 102, opponentScore: 118, win: false, mvp: "Kyle Filipowski", keyMoments: [], attendance: 18306 },
  { id: "g8", date: "2026-02-17", opponent: "Minnesota Timberwolves", opponentAbbr: "MIN", jazzScore: 113, opponentScore: 107, win: true, mvp: "Walker Kessler", keyMoments: [], attendance: 18306 },
  { id: "g9", date: "2026-02-20", opponent: "San Antonio Spurs", opponentAbbr: "SAS", jazzScore: 124, opponentScore: 116, win: true, mvp: "Lauri Markkanen", keyMoments: [], attendance: 18306 },
  { id: "g10", date: "2026-02-22", opponent: "Dallas Mavericks", opponentAbbr: "DAL", jazzScore: 108, opponentScore: 114, win: false, mvp: "Keyonte George", keyMoments: [], attendance: 18306 },
  { id: "g11", date: "2026-02-25", opponent: "Houston Rockets", opponentAbbr: "HOU", jazzScore: 119, opponentScore: 105, win: true, mvp: "Cody Williams", keyMoments: [], attendance: 18306 },
  { id: "g12", date: "2026-02-27", opponent: "New Orleans Pelicans", opponentAbbr: "NOP", jazzScore: 116, opponentScore: 108, win: true, mvp: "Lauri Markkanen", keyMoments: [], attendance: 18306 },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "JazzFanatic801", xp: 38420, tier: "Diamond", accuracy: 72, streak: 14 },
  { rank: 2, name: "NoteWorthy23", xp: 36115, tier: "Diamond", accuracy: 69, streak: 11 },
  { rank: 3, name: "SLCHoops", xp: 34890, tier: "Platinum", accuracy: 71, streak: 8 },
  { rank: 4, name: "MarkkAttack", xp: 31200, tier: "Platinum", accuracy: 67, streak: 5 },
  { rank: 5, name: "DeltaCenterDan", xp: 28750, tier: "Platinum", accuracy: 65, streak: 12 },
  { rank: 6, name: "JazzNote44", xp: 25430, tier: "Platinum", accuracy: 63, streak: 3 },
  { rank: 7, name: "You", xp: 22850, tier: "Gold", accuracy: 66, streak: 7 },
  { rank: 8, name: "UtahBaller", xp: 21340, tier: "Gold", accuracy: 61, streak: 4 },
  { rank: 9, name: "BearLakeFan", xp: 19870, tier: "Gold", accuracy: 59, streak: 9 },
  { rank: 10, name: "WasatchHoops", xp: 18650, tier: "Gold", accuracy: 58, streak: 2 },
];

export const mockPlayerStats: PlayerStat[] = [
  { player: jazzPlayers[0], gp: 58, mpg: 34.2, fgPct: 49.8, threePct: 39.2, ftPct: 88.1, rpg: 8.4, apg: 2.1, spg: 0.8, bpg: 0.5, ppg: 25.6, per: 24.1, ts: 62.3 },
  { player: jazzPlayers[1], gp: 60, mpg: 32.1, fgPct: 46.3, threePct: 37.1, ftPct: 82.4, rpg: 2.8, apg: 5.2, spg: 1.1, bpg: 0.2, ppg: 18.3, per: 18.7, ts: 56.8 },
  { player: jazzPlayers[2], gp: 55, mpg: 28.4, fgPct: 44.7, threePct: 35.6, ftPct: 85.9, rpg: 3.4, apg: 4.1, spg: 0.9, bpg: 0.3, ppg: 16.8, per: 16.2, ts: 55.1 },
  { player: jazzPlayers[3], gp: 62, mpg: 26.8, fgPct: 62.1, threePct: 0.0, ftPct: 71.3, rpg: 9.8, apg: 1.1, spg: 0.4, bpg: 2.4, ppg: 10.2, per: 19.8, ts: 64.7 },
  { player: jazzPlayers[4], gp: 57, mpg: 29.5, fgPct: 52.4, threePct: 33.8, ftPct: 79.6, rpg: 6.2, apg: 1.8, spg: 0.6, bpg: 0.7, ppg: 14.5, per: 17.3, ts: 58.9 },
  { player: jazzPlayers[5], gp: 61, mpg: 30.7, fgPct: 42.1, threePct: 36.4, ftPct: 83.2, rpg: 3.1, apg: 5.8, spg: 1.3, bpg: 0.2, ppg: 13.1, per: 15.4, ts: 54.2 },
  { player: jazzPlayers[6], gp: 48, mpg: 22.3, fgPct: 45.6, threePct: 37.8, ftPct: 76.4, rpg: 4.2, apg: 1.3, spg: 0.7, bpg: 0.9, ppg: 8.4, per: 12.1, ts: 56.7 },
  { player: jazzPlayers[7], gp: 54, mpg: 20.1, fgPct: 43.8, threePct: 38.1, ftPct: 81.2, rpg: 2.9, apg: 1.0, spg: 0.5, bpg: 0.2, ppg: 9.7, per: 11.8, ts: 57.3 },
];
