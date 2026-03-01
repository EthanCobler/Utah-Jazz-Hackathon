"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/lib/store";
import { useEffect } from "react";

const eventIcons: Record<string, string> = {
  basket: "🏀",
  foul: "⚠️",
  turnover: "🔄",
  substitution: "🔁",
  timeout: "⏸️",
  rebound: "📥",
  steal: "🫳",
  block: "🚫",
};

export default function PlayByPlay() {
  const { playByPlay, initializeGame } = useGameStore();

  useEffect(() => {
    if (playByPlay.length === 0) {
      initializeGame();
    }
  }, [playByPlay.length, initializeGame]);

  return (
    <div className="px-4 py-3 space-y-2">
      {playByPlay.slice(0, 30).map((event, i) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: event.team === "jazz" ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.02, duration: 0.2 }}
          className={`flex items-start gap-3 p-3 rounded-lg ${
            event.isScoring
              ? event.team === "jazz"
                ? "bg-jazz-gold/5 border-l-3 border-jazz-gold"
                : "bg-gray-50 border-r-3 border-gray-300"
              : "bg-white"
          } ${event.team === "opponent" ? "flex-row-reverse text-right" : ""}`}
        >
          <div className="flex-shrink-0 text-lg mt-0.5">
            {eventIcons[event.type] || "📋"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{event.description}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-text-secondary">
                Q{event.quarter} · {event.time}
              </span>
              {event.isScoring && (
                <span className="font-mono text-xs font-bold text-jazz-navy">
                  {event.score.jazz} - {event.score.opponent}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
