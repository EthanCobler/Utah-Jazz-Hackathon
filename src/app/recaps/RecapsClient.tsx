"use client";

import { motion, AnimatePresence } from "framer-motion";
import { mockKeyMoments } from "@/data/mock";
import { useState } from "react";
import type { GameRecap } from "@/lib/types";

export default function RecapsClient({ recaps }: {recaps: GameRecap[]}) {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const selectedRecap = recaps.find((r) => r.id === selectedGame);

  // Group by month
  const months = ["February 2026"];

  // Stats
  const wins = recaps.filter((r) => r.win).length;
  const losses = recaps.filter((r) => !r.win).length;

  return (
    <div className="px-4 pt-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-extrabold">Game Recaps</h1>
        <p className="text-sm text-text-secondary">2025-26 Season</p>
      </div>

      {/* Season Record */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-text-secondary">Season Record</div>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-2xl font-bold">{wins}</span>
              <span className="text-text-secondary">-</span>
              <span className="font-mono text-2xl font-bold">{losses}</span>
            </div>
          </div>
          <div className="flex gap-1">
            {recaps.slice(-10).map((g) => (
              <div
                key={g.id}
                className={`w-3 h-3 rounded-full ${
                  g.win ? "bg-court-green" : "bg-alert-red"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Calendar-style game list */}
      <div className="mb-4">
        <h2 className="font-bold text-sm text-text-secondary uppercase tracking-wider mb-3">
          {months[0]}
        </h2>
        <div className="space-y-2">
          {recaps.map((game, i) => (
            <motion.div
              key={game.id}
              onClick={() =>
                setSelectedGame(selectedGame === game.id ? null : game.id)
              }
              className="w-full text-left cursor-pointer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <div
                className={`bg-white rounded-xl p-4 shadow-sm border transition-all ${
                  selectedGame === game.id
                    ? "border-jazz-gold"
                    : "border-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-1.5 h-10 rounded-full ${
                        game.win ? "bg-court-green" : "bg-alert-red"
                      }`}
                    />
                    <div>
                      <div className="text-xs text-text-secondary">
                        {new Date(game.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="font-semibold text-sm">
                        vs {game.opponent}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold">
                      {game.jazzScore} - {game.opponentScore}
                    </div>
                    <div
                      className={`text-xs font-bold ${
                        game.win ? "text-court-green" : "text-alert-red"
                      }`}
                    >
                      {game.win ? "W" : "L"}
                    </div>
                  </div>
                </div>

                {/* Expanded recap */}
                <AnimatePresence>
                  {selectedGame === game.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div className="text-center">
                            <div className="text-xs text-text-secondary">
                              MVP
                            </div>
                            <div className="text-sm font-semibold">
                              {game.mvp}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-text-secondary">
                              Margin
                            </div>
                            <div
                              className={`text-sm font-mono font-bold ${
                                game.win
                                  ? "text-court-green"
                                  : "text-alert-red"
                              }`}
                            >
                              {game.win ? "+" : ""}
                              {game.jazzScore - game.opponentScore}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-text-secondary">
                              Attendance
                            </div>
                            <div className="text-sm font-semibold">
                              {game.attendance.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        {/* Key moments preview */}
                        <div className="space-y-2">
                          {mockKeyMoments.slice(0, 3).map((moment) => (
                            <div
                              key={moment.id}
                              className="bg-bg rounded-lg p-2.5"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                                    moment.significance >= 9
                                      ? "bg-jazz-gold"
                                      : "bg-jazz-navy"
                                  }`}
                                >
                                  {moment.significance}
                                </div>
                                <div>
                                  <div className="text-xs font-semibold">
                                    {moment.title}
                                  </div>
                                  <div className="text-[10px] text-text-secondary">
                                    Q{moment.quarter} · {moment.time}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Share button */}
                        <button className="w-full mt-3 py-2.5 bg-jazz-navy text-white rounded-xl text-xs font-semibold">
                          Share Game Card
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
