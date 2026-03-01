"use client";

import { motion } from "framer-motion";
import Scoreboard from "@/components/Scoreboard";
import PlayByPlay from "@/components/PlayByPlay";
import ShotChart from "@/components/ShotChart";
import Polls from "@/components/Polls";
import QuarterRecap from "@/components/QuarterRecap";
import { useGameStore } from "@/lib/store";
import { useGameSimulation } from "@/lib/useSimulation";
import { useState } from "react";

type Tab = "play-by-play" | "shot-chart" | "polls" | "recaps";

const tabs: { id: Tab; label: string }[] = [
  { id: "play-by-play", label: "Play-by-Play" },
  { id: "shot-chart", label: "Shot Chart" },
  { id: "polls", label: "Polls" },
  { id: "recaps", label: "Recaps" },
];

export default function LivePage() {
  const [activeTab, setActiveTab] = useState<Tab>("play-by-play");
  const { polls } = useGameStore();
  useGameSimulation();
  const activePolls = polls.filter((p) => p.status === "active");

  return (
    <div className="-mx-0">
      {/* Sticky Scoreboard */}
      <div className="sticky top-0 z-30">
        <Scoreboard />

        {/* Tab Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex max-w-lg mx-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-xs font-semibold relative transition-colors ${
                  activeTab === tab.id
                    ? "text-jazz-navy"
                    : "text-text-secondary"
                }`}
              >
                <span className="flex items-center justify-center gap-1">
                  {tab.label}
                  {tab.id === "polls" && activePolls.length > 0 && (
                    <motion.span
                      className="w-2 h-2 bg-jazz-gold rounded-full"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </span>
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-jazz-gold rounded-full"
                    layoutId="tab-indicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        {activeTab === "play-by-play" && <PlayByPlay />}
        {activeTab === "shot-chart" && <ShotChart />}
        {activeTab === "polls" && <Polls />}
        {activeTab === "recaps" && <QuarterRecap />}
      </motion.div>
    </div>
  );
}
