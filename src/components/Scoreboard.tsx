"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store";
import { useEffect, useState } from "react";

export default function Scoreboard() {
  const { jazzScore, opponentScore, quarter, gameClock, possession, isLive } =
    useGameStore();
  const [prevJazzScore, setPrevJazzScore] = useState(jazzScore);
  const [prevOppScore, setPrevOppScore] = useState(opponentScore);
  const [jazzScoreGlow, setJazzScoreGlow] = useState(false);
  const [oppScoreGlow, setOppScoreGlow] = useState(false);

  useEffect(() => {
    if (jazzScore !== prevJazzScore) {
      setJazzScoreGlow(true);
      setPrevJazzScore(jazzScore);
      setTimeout(() => setJazzScoreGlow(false), 600);
    }
  }, [jazzScore, prevJazzScore]);

  useEffect(() => {
    if (opponentScore !== prevOppScore) {
      setOppScoreGlow(true);
      setPrevOppScore(opponentScore);
      setTimeout(() => setOppScoreGlow(false), 600);
    }
  }, [opponentScore, prevOppScore]);

  const quarterLabel =
    quarter <= 4 ? `Q${quarter}` : quarter === 5 ? "OT" : `${quarter - 4}OT`;

  return (
    <div className="bg-jazz-navy text-white px-4 py-3">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        {/* Jazz */}
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-xs font-extrabold">UTA</span>
            </div>
          </div>
          <motion.div
            className={`font-mono text-3xl font-bold ${
              jazzScoreGlow ? "animate-score-glow text-jazz-gold" : ""
            }`}
            key={jazzScore}
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={jazzScore}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {jazzScore}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Center */}
        <div className="text-center">
          <div className="flex items-center gap-2 mb-0.5">
            {isLive && (
              <motion.span
                className="w-2 h-2 bg-alert-red rounded-full"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            <span className="text-xs font-semibold text-jazz-gold uppercase">
              {isLive ? "LIVE" : "FINAL"}
            </span>
          </div>
          <div className="font-mono text-sm font-bold">{gameClock}</div>
          <div className="text-[10px] text-white/60 font-semibold">
            {quarterLabel}
          </div>
          {/* Possession indicator */}
          <div className="flex justify-center gap-4 mt-1">
            <div
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                possession === "jazz" ? "bg-jazz-gold" : "bg-white/20"
              }`}
            />
            <div
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                possession === "opponent" ? "bg-jazz-gold" : "bg-white/20"
              }`}
            />
          </div>
        </div>

        {/* Opponent */}
        <div className="flex items-center gap-3">
          <motion.div
            className={`font-mono text-3xl font-bold ${
              oppScoreGlow ? "animate-score-glow text-jazz-gold" : ""
            }`}
            key={opponentScore}
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={opponentScore}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {opponentScore}
              </motion.span>
            </AnimatePresence>
          </motion.div>
          <div className="text-center">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-xs font-extrabold">DEN</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
