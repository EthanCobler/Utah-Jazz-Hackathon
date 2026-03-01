"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "./store";
import { jazzPlayers, opponentPlayers } from "@/data/mock";
import type { PlayByPlayEvent, Shot } from "@/data/mock";

export function useGameSimulation() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const clockRef = useRef({ minutes: 2, seconds: 15 });

  useEffect(() => {
    const store = useGameStore.getState();
    if (store.shots.length === 0) store.initializeGame();

    intervalRef.current = setInterval(() => {
      const state = useGameStore.getState();
      if (!state.isLive) return;

      // Decrement clock
      clockRef.current.seconds -= 1;
      if (clockRef.current.seconds < 0) {
        clockRef.current.minutes -= 1;
        clockRef.current.seconds = 59;
      }

      if (clockRef.current.minutes < 0) {
        clockRef.current.minutes = 0;
        clockRef.current.seconds = 0;
        useGameStore.setState({ isLive: false, gameClock: "FINAL" });
        return;
      }

      const newClock = `${clockRef.current.minutes}:${clockRef.current.seconds.toString().padStart(2, "0")}`;

      // Random game events (~20% chance per tick)
      if (Math.random() < 0.2) {
        const isJazz = Math.random() > 0.45;
        const team = isJazz ? "jazz" : "opponent";
        const players = isJazz ? jazzPlayers : opponentPlayers;
        const player = players[Math.floor(Math.random() * Math.min(5, players.length))];

        const eventRoll = Math.random();
        let newEvent: PlayByPlayEvent;
        let scoreUpdate: Partial<{ jazzScore: number; opponentScore: number }> = {};
        let newShot: Shot | null = null;

        if (eventRoll < 0.4) {
          // Scoring play
          const pts = Math.random() > 0.65 ? 3 : 2;
          const newJazz = isJazz ? state.jazzScore + pts : state.jazzScore;
          const newOpp = !isJazz ? state.opponentScore + pts : state.opponentScore;
          scoreUpdate = { jazzScore: newJazz, opponentScore: newOpp };

          newEvent = {
            id: `live-${Date.now()}`,
            time: newClock,
            quarter: state.quarter,
            type: "basket",
            team,
            description: `${player.name} makes ${pts === 3 ? "3PT" : "2PT"} shot`,
            score: { jazz: newJazz, opponent: newOpp },
            isScoring: true,
          };

          // Add corresponding shot
          const is3 = pts === 3;
          let sx: number, sy: number;
          if (is3) {
            const angle = Math.random() * Math.PI;
            sx = 50 + (38 + Math.random() * 8) * Math.cos(angle) * 0.6;
            sy = 10 + (38 + Math.random() * 8) * Math.sin(angle) * 0.5;
          } else {
            sx = 30 + Math.random() * 40;
            sy = 55 + Math.random() * 35;
          }

          newShot = {
            id: `live-shot-${Date.now()}`,
            playerId: player.id,
            playerName: player.name,
            x: Math.max(5, Math.min(95, sx)),
            y: Math.max(5, Math.min(95, sy)),
            made: true,
            shotType: is3 ? "3PT" : "2PT",
            quarter: state.quarter,
            time: newClock,
            description: `${player.name} makes ${is3 ? "3PT" : "2PT"} shot`,
          };
        } else if (eventRoll < 0.55) {
          newEvent = {
            id: `live-${Date.now()}`,
            time: newClock,
            quarter: state.quarter,
            type: "rebound",
            team,
            description: `${player.name} defensive rebound`,
            score: { jazz: state.jazzScore, opponent: state.opponentScore },
            isScoring: false,
          };
        } else if (eventRoll < 0.7) {
          newEvent = {
            id: `live-${Date.now()}`,
            time: newClock,
            quarter: state.quarter,
            type: "foul",
            team,
            description: `${player.name} personal foul`,
            score: { jazz: state.jazzScore, opponent: state.opponentScore },
            isScoring: false,
          };
        } else if (eventRoll < 0.85) {
          newEvent = {
            id: `live-${Date.now()}`,
            time: newClock,
            quarter: state.quarter,
            type: "steal",
            team,
            description: `${player.name} steals the ball`,
            score: { jazz: state.jazzScore, opponent: state.opponentScore },
            isScoring: false,
          };
        } else {
          newEvent = {
            id: `live-${Date.now()}`,
            time: newClock,
            quarter: state.quarter,
            type: "turnover",
            team,
            description: `${player.name} turnover`,
            score: { jazz: state.jazzScore, opponent: state.opponentScore },
            isScoring: false,
          };
        }

        useGameStore.setState({
          ...scoreUpdate,
          gameClock: newClock,
          possession: Math.random() > 0.5 ? "jazz" : "opponent",
          playByPlay: [newEvent, ...state.playByPlay],
          ...(newShot ? { shots: [...state.shots, newShot] } : {}),
        });
      } else {
        useGameStore.setState({
          gameClock: newClock,
          possession: Math.random() > 0.5 ? "jazz" : "opponent",
        });
      }
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
}
