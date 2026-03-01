"use client";

import { motion } from "framer-motion";
import { mockPlayerStats } from "@/data/mock";
import { useState } from "react";

type SortKey = "ppg" | "rpg" | "apg" | "fgPct" | "threePct" | "per" | "ts";

const sortLabels: Record<SortKey, string> = {
  ppg: "Points",
  rpg: "Rebounds",
  apg: "Assists",
  fgPct: "FG%",
  threePct: "3PT%",
  per: "PER",
  ts: "TS%",
};

export default function StatsPage() {
  const [sortBy, setSortBy] = useState<SortKey>("ppg");
  const [expandedPlayer, setExpandedPlayer] = useState<number | null>(null);

  const sorted = [...mockPlayerStats].sort((a, b) => b[sortBy] - a[sortBy]);

  // Team averages
  const teamAvg = {
    ppg: sorted.reduce((s, p) => s + p.ppg, 0) / sorted.length,
    rpg: sorted.reduce((s, p) => s + p.rpg, 0) / sorted.length,
    apg: sorted.reduce((s, p) => s + p.apg, 0) / sorted.length,
    fgPct: sorted.reduce((s, p) => s + p.fgPct, 0) / sorted.length,
  };

  return (
    <div className="px-4 pt-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-extrabold">Team Stats</h1>
        <p className="text-sm text-text-secondary">2025-26 Regular Season</p>
      </div>

      {/* Team Overview Cards */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: "PPG", value: teamAvg.ppg.toFixed(1) },
          { label: "RPG", value: teamAvg.rpg.toFixed(1) },
          { label: "APG", value: teamAvg.apg.toFixed(1) },
          { label: "FG%", value: teamAvg.fgPct.toFixed(1) },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center"
          >
            <div className="font-mono text-lg font-bold text-jazz-navy">
              {stat.value}
            </div>
            <div className="text-[10px] text-text-secondary font-semibold uppercase">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Sort Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {(Object.keys(sortLabels) as SortKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setSortBy(key)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              sortBy === key
                ? "bg-jazz-navy text-white"
                : "bg-gray-100 text-text-secondary"
            }`}
          >
            {sortLabels[key]}
          </button>
        ))}
      </div>

      {/* Player Cards */}
      <div className="space-y-2">
        {sorted.map((ps, i) => (
          <motion.div
            key={ps.player.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <button
              onClick={() =>
                setExpandedPlayer(
                  expandedPlayer === ps.player.id ? null : ps.player.id
                )
              }
              className="w-full text-left"
            >
              <div
                className={`bg-white rounded-xl p-4 shadow-sm border transition-all ${
                  expandedPlayer === ps.player.id
                    ? "border-jazz-gold"
                    : "border-gray-100"
                }`}
              >
                {/* Main row */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-jazz-navy/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-jazz-navy">
                        {ps.player.image}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">
                        {ps.player.name}
                      </div>
                      <div className="text-xs text-text-secondary">
                        #{ps.player.number} · {ps.player.position} · {ps.gp} GP
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-lg font-bold text-jazz-navy">
                      {ps[sortBy].toFixed(1)}
                    </div>
                    <div className="text-[10px] text-text-secondary uppercase">
                      {sortLabels[sortBy]}
                    </div>
                  </div>
                </div>

                {/* Expanded Stats */}
                {expandedPlayer === ps.player.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="mt-3 pt-3 border-t border-gray-100"
                  >
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { label: "PPG", value: ps.ppg },
                        { label: "RPG", value: ps.rpg },
                        { label: "APG", value: ps.apg },
                        { label: "MPG", value: ps.mpg },
                        { label: "FG%", value: ps.fgPct },
                        { label: "3PT%", value: ps.threePct },
                        { label: "FT%", value: ps.ftPct },
                        { label: "SPG", value: ps.spg },
                        { label: "BPG", value: ps.bpg },
                        { label: "PER", value: ps.per },
                        { label: "TS%", value: ps.ts },
                        { label: "GP", value: ps.gp },
                      ].map((stat) => (
                        <div key={stat.label} className="text-center">
                          <div className="font-mono text-sm font-bold">
                            {typeof stat.value === "number"
                              ? stat.value.toFixed(1)
                              : stat.value}
                          </div>
                          <div className="text-[10px] text-text-secondary">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Mini stat bars */}
                    <div className="mt-3 space-y-2">
                      {[
                        {
                          label: "Scoring",
                          value: ps.ppg,
                          max: 30,
                          color: "bg-jazz-gold",
                        },
                        {
                          label: "Efficiency",
                          value: ps.ts,
                          max: 70,
                          color: "bg-court-green",
                        },
                        {
                          label: "Playmaking",
                          value: ps.apg,
                          max: 10,
                          color: "bg-jazz-purple",
                        },
                      ].map((bar) => (
                        <div key={bar.label}>
                          <div className="flex justify-between text-[10px] text-text-secondary mb-0.5">
                            <span>{bar.label}</span>
                            <span className="font-mono">
                              {bar.value.toFixed(1)}
                            </span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${bar.color}`}
                              initial={{ width: 0 }}
                              animate={{
                                width: `${Math.min(
                                  (bar.value / bar.max) * 100,
                                  100
                                )}%`,
                              }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Western Conference Standings */}
      <div className="mt-6 mb-4">
        <h2 className="font-bold text-lg mb-3">Western Conference</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-jazz-navy/5">
                <th className="text-left py-2.5 px-3 font-semibold">#</th>
                <th className="text-left py-2.5 px-3 font-semibold">Team</th>
                <th className="text-center py-2.5 px-3 font-semibold">W</th>
                <th className="text-center py-2.5 px-3 font-semibold">L</th>
                <th className="text-center py-2.5 px-3 font-semibold">GB</th>
              </tr>
            </thead>
            <tbody>
              {[
                { rank: 1, team: "OKC Thunder", w: 44, l: 14, gb: "-" },
                { rank: 2, team: "HOU Rockets", w: 40, l: 18, gb: "4" },
                { rank: 3, team: "DEN Nuggets", w: 38, l: 20, gb: "6" },
                { rank: 4, team: "LAL Lakers", w: 38, l: 20, gb: "6" },
                { rank: 5, team: "MIN T-Wolves", w: 36, l: 22, gb: "8" },
                { rank: 6, team: "DAL Mavericks", w: 35, l: 23, gb: "9" },
                { rank: 7, team: "PHX Suns", w: 34, l: 24, gb: "10" },
                { rank: 8, team: "UTA Jazz", w: 32, l: 26, gb: "12", highlight: true },
                { rank: 9, team: "SAC Kings", w: 31, l: 27, gb: "13" },
                { rank: 10, team: "GSW Warriors", w: 30, l: 28, gb: "14" },
              ].map((team) => (
                <tr
                  key={team.rank}
                  className={`border-t border-gray-50 ${
                    team.highlight
                      ? "bg-jazz-gold/5 font-bold"
                      : ""
                  }`}
                >
                  <td className="py-2 px-3">{team.rank}</td>
                  <td className={`py-2 px-3 ${team.highlight ? "text-jazz-navy" : ""}`}>
                    {team.team}
                  </td>
                  <td className="py-2 px-3 text-center font-mono">{team.w}</td>
                  <td className="py-2 px-3 text-center font-mono">{team.l}</td>
                  <td className="py-2 px-3 text-center font-mono">{team.gb}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
