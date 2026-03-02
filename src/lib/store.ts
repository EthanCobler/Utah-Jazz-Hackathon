"use client";

import { create } from "zustand";
import type { Shot, PlayByPlayEvent, Poll, KeyMoment } from "@/lib/types";
import { generateShots, generatePlayByPlay, mockPolls, mockKeyMoments } from "@/data/mock";

interface GameState {
  // Live score
  jazzScore: number;
  opponentScore: number;
  quarter: number;
  gameClock: string;
  possession: "jazz" | "opponent";
  isLive: boolean;

  // Data
  shots: Shot[];
  playByPlay: PlayByPlayEvent[];
  polls: Poll[];
  keyMoments: KeyMoment[];

  // Filters
  activeTab: "play-by-play" | "shot-chart" | "polls";
  shotFilterPlayer: number | null;
  shotFilterQuarter: number | null;
  shotFilterType: "ALL" | "2PT" | "3PT";

  // User state
  userVotes: Record<string, string>;
  xp: number;
  predictionStreak: number;
  tier: string;

  // Actions
  setActiveTab: (tab: "play-by-play" | "shot-chart" | "polls") => void;
  setShotFilterPlayer: (id: number | null) => void;
  setShotFilterQuarter: (q: number | null) => void;
  setShotFilterType: (type: "ALL" | "2PT" | "3PT") => void;
  voteOnPoll: (pollId: string, optionId: string) => void;
  addXP: (amount: number) => void;
  initializeGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  jazzScore: 108,
  opponentScore: 101,
  quarter: 4,
  gameClock: "2:15",
  possession: "jazz",
  isLive: true,

  shots: [],
  playByPlay: [],
  polls: mockPolls,
  keyMoments: mockKeyMoments,

  activeTab: "play-by-play",
  shotFilterPlayer: null,
  shotFilterQuarter: null,
  shotFilterType: "ALL",

  userVotes: {},
  xp: 22850,
  predictionStreak: 7,
  tier: "Gold",

  setActiveTab: (tab) => set({ activeTab: tab }),
  setShotFilterPlayer: (id) => set({ shotFilterPlayer: id }),
  setShotFilterQuarter: (q) => set({ shotFilterQuarter: q }),
  setShotFilterType: (type) => set({ shotFilterType: type }),

  voteOnPoll: (pollId, optionId) => {
    const state = get();
    if (state.userVotes[pollId]) return;

    set((s) => ({
      userVotes: { ...s.userVotes, [pollId]: optionId },
      polls: s.polls.map((p) =>
        p.id === pollId
          ? {
              ...p,
              options: p.options.map((o) =>
                o.id === optionId ? { ...o, votes: o.votes + 1 } : o
              ),
              totalVotes: p.totalVotes + 1,
            }
          : p
      ),
      xp: s.xp + 5,
    }));
  },

  addXP: (amount) => set((s) => ({ xp: s.xp + amount })),

  initializeGame: () => {
    set({
      shots: generateShots(),
      playByPlay: generatePlayByPlay(),
    });
  },
}));
