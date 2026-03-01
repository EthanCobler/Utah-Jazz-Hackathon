"use client";

import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/lib/store";
import { jazzPlayers } from "@/data/mock";
import { motion } from "framer-motion";

export default function ShotChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const {
    shots,
    shotFilterPlayer,
    shotFilterQuarter,
    shotFilterType,
    setShotFilterPlayer,
    setShotFilterQuarter,
    setShotFilterType,
    initializeGame,
  } = useGameStore();

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);

  useEffect(() => {
    if (shots.length === 0) initializeGame();
  }, [shots.length, initializeGame]);

  const filteredShots = shots.filter((s) => {
    if (shotFilterPlayer && s.playerId !== shotFilterPlayer) return false;
    if (shotFilterQuarter && s.quarter !== shotFilterQuarter) return false;
    if (shotFilterType !== "ALL" && s.shotType !== shotFilterType) return false;
    return true;
  });

  const madeShots = filteredShots.filter((s) => s.made).length;
  const totalShots = filteredShots.length;
  const fgPct = totalShots > 0 ? ((madeShots / totalShots) * 100).toFixed(1) : "0.0";

  return (
    <div className="px-4 py-3">
      {/* Filters */}
      <div className="space-y-3 mb-4">
        {/* Player filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setShotFilterPlayer(null)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              !shotFilterPlayer
                ? "bg-jazz-navy text-white"
                : "bg-gray-100 text-text-secondary"
            }`}
          >
            All Players
          </button>
          {jazzPlayers.slice(0, 6).map((p) => (
            <button
              key={p.id}
              onClick={() =>
                setShotFilterPlayer(shotFilterPlayer === p.id ? null : p.id)
              }
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                shotFilterPlayer === p.id
                  ? "bg-jazz-navy text-white"
                  : "bg-gray-100 text-text-secondary"
              }`}
            >
              {p.name.split(" ").pop()}
            </button>
          ))}
        </div>

        {/* Quarter + type filters */}
        <div className="flex gap-2">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
            {[null, 1, 2, 3, 4].map((q) => (
              <button
                key={q ?? "all"}
                onClick={() => setShotFilterQuarter(q)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                  shotFilterQuarter === q
                    ? "bg-white text-jazz-navy shadow-sm"
                    : "text-text-secondary"
                }`}
              >
                {q ? `Q${q}` : "All"}
              </button>
            ))}
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
            {(["ALL", "2PT", "3PT"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setShotFilterType(t)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                  shotFilterType === t
                    ? "bg-white text-jazz-navy shadow-sm"
                    : "text-text-secondary"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="text-sm">
          <span className="font-bold">{madeShots}</span>
          <span className="text-text-secondary">/{totalShots} shots</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-court-green rounded-full inline-block" />
            Made
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 border-2 border-alert-red rounded-full inline-block" />
            Missed
          </span>
          <span className="font-mono font-bold">{fgPct}%</span>
        </div>
      </div>

      {/* Court SVG */}
      <div className="relative bg-jazz-navy/5 rounded-xl overflow-hidden">
        <svg
          ref={svgRef}
          viewBox="0 0 500 470"
          className="w-full"
          style={{ maxHeight: "400px" }}
        >
          {/* Court outline */}
          <rect
            x="10"
            y="10"
            width="480"
            height="450"
            fill="#F7F8FA"
            stroke="#CBD5E0"
            strokeWidth="2"
            rx="4"
          />

          {/* Paint / Key */}
          <rect
            x="170"
            y="10"
            width="160"
            height="190"
            fill="none"
            stroke="#CBD5E0"
            strokeWidth="1.5"
          />

          {/* Free throw circle */}
          <circle
            cx="250"
            cy="200"
            r="60"
            fill="none"
            stroke="#CBD5E0"
            strokeWidth="1.5"
            strokeDasharray="5,5"
          />

          {/* Basket */}
          <circle
            cx="250"
            cy="52"
            r="8"
            fill="none"
            stroke="#F9A01B"
            strokeWidth="2"
          />
          <rect
            x="230"
            y="10"
            width="40"
            height="4"
            fill="#F9A01B"
            rx="2"
          />

          {/* Three-point arc */}
          <path
            d="M 60 10 L 60 100 Q 60 320 250 350 Q 440 320 440 100 L 440 10"
            fill="none"
            stroke="#CBD5E0"
            strokeWidth="1.5"
          />

          {/* Restricted area */}
          <path
            d="M 210 10 Q 210 90 250 90 Q 290 90 290 10"
            fill="none"
            stroke="#CBD5E0"
            strokeWidth="1"
          />

          {/* Half court line - optional visual at bottom */}
          <line
            x1="10"
            y1="460"
            x2="490"
            y2="460"
            stroke="#CBD5E0"
            strokeWidth="1"
          />

          {/* Shot markers */}
          {filteredShots.map((shot, i) => {
            const cx = 10 + (shot.x / 100) * 480;
            const cy = 10 + (shot.y / 100) * 450;
            const radius = shot.shotType === "3PT" ? 7 : 5;

            return (
              <g key={shot.id}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill={shot.made ? "#00875A" : "transparent"}
                  stroke={shot.made ? "#00875A" : "#E53E3E"}
                  strokeWidth={shot.made ? 0 : 2}
                  opacity={0.8}
                  className="cursor-pointer transition-all hover:opacity-100"
                  onMouseEnter={(e) => {
                    const rect = svgRef.current?.getBoundingClientRect();
                    if (rect) {
                      setTooltip({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top - 30,
                        text: `${shot.playerName} · ${shot.shotType} · Q${shot.quarter} ${shot.time} · ${shot.made ? "MADE" : "MISSED"}`,
                      });
                    }
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
                {!shot.made && (
                  <>
                    <line
                      x1={cx - 3}
                      y1={cy - 3}
                      x2={cx + 3}
                      y2={cy + 3}
                      stroke="#E53E3E"
                      strokeWidth="1.5"
                      pointerEvents="none"
                    />
                    <line
                      x1={cx + 3}
                      y1={cy - 3}
                      x2={cx - 3}
                      y2={cy + 3}
                      stroke="#E53E3E"
                      strokeWidth="1.5"
                      pointerEvents="none"
                    />
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="shot-tooltip"
            style={{ left: tooltip.x, top: tooltip.y, transform: "translateX(-50%)" }}
          >
            {tooltip.text}
          </div>
        )}
      </div>
    </div>
  );
}
