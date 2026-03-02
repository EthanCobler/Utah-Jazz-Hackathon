"use client";

import { motion } from "framer-motion";
import { mockBadges, mockLeaderboard, mockGameRecaps } from "@/data/mock";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/lib/AuthProvider";
import AuthScreen from "@/components/AuthScreen";

type Tab = "overview" | "badges" | "leaderboard" | "predictions";

const rarityColors: Record<string, string> = {
  Common: "bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-gray-400 border-gray-200 dark:border-dark-border",
  Uncommon: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  Rare: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  Epic: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  Legendary: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
};

const tierConfig: Record<string, { color: string; bg: string; next: string; xpNeeded: number }> = {
  Bronze: { color: "text-amber-700", bg: "bg-amber-100 dark:bg-amber-900/30", next: "Silver", xpNeeded: 1000 },
  Silver: { color: "text-gray-500 dark:text-gray-300", bg: "bg-gray-200 dark:bg-gray-700", next: "Gold", xpNeeded: 5000 },
  Gold: { color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/30", next: "Platinum", xpNeeded: 15000 },
  Platinum: { color: "text-gray-400 dark:text-gray-300", bg: "bg-gray-100 dark:bg-gray-700", next: "Diamond", xpNeeded: 35000 },
  Diamond: { color: "text-cyan-400", bg: "bg-cyan-50 dark:bg-cyan-900/30", next: "Max", xpNeeded: 50000 },
};

export default function ProfilePage() {
  const { user, isAuthenticated, hydrated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  if (!hydrated) return null;
  if (!isAuthenticated) return <AuthScreen />;

  const userXP = user?.xp ?? 22850;
  const userTier = user?.tier ?? "Gold";
  const streak = user?.streak ?? 7;
  const totalPredictions = user?.totalPredictions ?? 156;
  const correctPredictions = user?.correctPredictions ?? 103;
  const accuracy = totalPredictions > 0 ? Math.round((correctPredictions / totalPredictions) * 100) : 0;
  const pollsVoted = user?.pollsVoted ?? 312;
  const gamesEngaged = user?.gamesEngaged ?? 48;

  const tier = tierConfig[userTier];
  const progress = ((userXP - 5000) / (15000 - 5000)) * 100;

  const earnedBadges = mockBadges.filter((b) => b.earned);
  const lockedBadges = mockBadges.filter((b) => !b.earned);

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "badges", label: `Badges (${earnedBadges.length})` },
    { id: "leaderboard", label: "Leaderboard" },
    { id: "predictions", label: "Predictions" },
  ];

  return (
    <div className="px-4 pt-4">
      {/* Profile Header */}
      <div className="gradient-jazz rounded-2xl p-5 text-white mb-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-jazz-gold/10 rounded-full -translate-y-8 translate-x-8" />

        {/* Theme Toggle & Logout */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <ThemeToggle />
          <motion.button
            onClick={logout}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors touch-manipulation"
            title="Log out"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </motion.button>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl font-extrabold">{user?.avatarInitials ?? "JF"}</span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold">{user?.displayName ?? "JazzFan23"}</h1>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${tier.bg} ${tier.color}`}
                >
                  {userTier}
                </span>
                <span className="text-xs text-white/70">
                  {(user?.rank ?? 7) > 0 ? `Rank #${user?.rank ?? 7}` : "Unranked"}
                </span>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-mono font-bold text-jazz-gold">
                {userXP.toLocaleString()} XP
              </span>
              <span className="text-white/70">
                {(15000).toLocaleString()} XP for {tier.next}
              </span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-jazz-gold rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: "Streak", value: `🔥 ${streak}`, sub: "games" },
          { label: "Accuracy", value: `${accuracy}%`, sub: `${correctPredictions}/${totalPredictions}` },
          { label: "Polls", value: pollsVoted.toString(), sub: "voted" },
          { label: "Games", value: gamesEngaged.toString(), sub: "engaged" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-dark-surface rounded-xl p-3 shadow-sm border border-gray-100 dark:border-dark-border text-center"
          >
            <div className="font-mono text-base font-bold">{stat.value}</div>
            <div className="text-[10px] text-text-secondary dark:text-dark-text-secondary">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-dark-border rounded-xl p-1 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === tab.id
                ? "bg-white dark:bg-dark-surface text-jazz-navy dark:text-jazz-gold shadow-sm"
                : "text-text-secondary dark:text-dark-text-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Recent Activity */}
            <div>
              <h3 className="font-bold text-sm mb-3">Recent Activity</h3>
              <div className="space-y-2">
                {[
                  { icon: "🎯", text: "Predicted Jazz win vs Pelicans", xp: "+50 XP", time: "2d ago", color: "text-court-green" },
                  { icon: "🏀", text: "Voted in 4 polls vs Pelicans", xp: "+20 XP", time: "2d ago", color: "text-jazz-gold" },
                  { icon: "🔥", text: "7-game prediction streak!", xp: "+75 XP", time: "2d ago", color: "text-jazz-gold" },
                  { icon: "🏅", text: "Earned 'Hot Streak' badge", xp: "", time: "5d ago", color: "text-jazz-purple dark:text-jazz-gold" },
                  { icon: "❌", text: "Predicted Jazz win vs Mavericks", xp: "", time: "7d ago", color: "text-alert-red" },
                ].map((activity, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-dark-surface rounded-lg p-3 shadow-sm border border-gray-100 dark:border-dark-border flex items-center gap-3"
                  >
                    <span className="text-lg">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.text}</p>
                      <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
                        {activity.time}
                      </p>
                    </div>
                    {activity.xp && (
                      <span className={`text-xs font-bold font-mono ${activity.color}`}>
                        {activity.xp}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* XP Breakdown */}
            <div>
              <h3 className="font-bold text-sm mb-3">XP Sources</h3>
              <div className="bg-white dark:bg-dark-surface rounded-xl p-4 shadow-sm border border-gray-100 dark:border-dark-border">
                {[
                  { label: "Correct Predictions", value: 8150, pct: 36 },
                  { label: "Poll Participation", value: 5680, pct: 25 },
                  { label: "Streak Bonuses", value: 3750, pct: 16 },
                  { label: "Daily Challenges", value: 2890, pct: 13 },
                  { label: "Other", value: 2380, pct: 10 },
                ].map((source) => (
                  <div key={source.label} className="mb-3 last:mb-0">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{source.label}</span>
                      <span className="font-mono font-bold">
                        {source.value.toLocaleString()} XP
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-dark-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-jazz-navy dark:bg-jazz-gold rounded-full"
                        style={{ width: `${source.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "badges" && (
          <div>
            {/* Earned */}
            <h3 className="font-bold text-sm mb-3">
              Earned ({earnedBadges.length})
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {earnedBadges.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`rounded-xl p-3 border ${
                    rarityColors[badge.rarity]
                  }`}
                >
                  <div className="text-2xl mb-1">{badge.icon}</div>
                  <div className="text-sm font-bold">{badge.name}</div>
                  <div className="text-[10px] opacity-70">
                    {badge.description}
                  </div>
                  <div className="text-[10px] mt-1 font-semibold">
                    {badge.rarity} · {badge.earnedDate}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Locked */}
            <h3 className="font-bold text-sm mb-3">
              Locked ({lockedBadges.length})
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {lockedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="rounded-xl p-3 border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg opacity-60"
                >
                  <div className="text-2xl mb-1 grayscale">{badge.icon}</div>
                  <div className="text-sm font-bold">{badge.name}</div>
                  <div className="text-[10px] text-text-secondary dark:text-dark-text-secondary">
                    {badge.description}
                  </div>
                  <div className="text-[10px] mt-1 font-semibold text-text-secondary dark:text-dark-text-secondary">
                    {badge.rarity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div>
            <div className="space-y-2">
              {mockLeaderboard.map((entry, i) => {
                const isUser = entry.name === "You";
                return (
                  <motion.div
                    key={entry.rank}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`rounded-xl p-3 flex items-center gap-3 ${
                      isUser
                        ? "bg-jazz-gold/10 border-2 border-jazz-gold"
                        : "bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border shadow-sm"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        entry.rank <= 3
                          ? "bg-jazz-gold text-jazz-navy"
                          : "bg-gray-100 dark:bg-dark-border text-text-secondary dark:text-dark-text-secondary"
                      }`}
                    >
                      {entry.rank}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-semibold ${
                            isUser ? "text-jazz-navy dark:text-jazz-gold" : ""
                          }`}
                        >
                          {entry.name}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            tierConfig[entry.tier]?.bg || "bg-gray-100 dark:bg-dark-border"
                          } ${tierConfig[entry.tier]?.color || "text-gray-500"}`}
                        >
                          {entry.tier}
                        </span>
                      </div>
                      <div className="text-xs text-text-secondary dark:text-dark-text-secondary">
                        {entry.accuracy}% accuracy · 🔥 {entry.streak}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-bold">
                        {entry.xp.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-text-secondary dark:text-dark-text-secondary">XP</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "predictions" && (
          <div className="space-y-2">
            {mockGameRecaps.map((game, i) => {
              const predicted = Math.random() > 0.15;
              const predictedWin = Math.random() > 0.4;
              const correct = predicted && predictedWin === game.win;

              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-white dark:bg-dark-surface rounded-xl p-3 shadow-sm border border-gray-100 dark:border-dark-border"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          !predicted
                            ? "bg-gray-100 dark:bg-dark-border text-gray-400"
                            : correct
                            ? "bg-court-green/10 text-court-green"
                            : "bg-alert-red/10 text-alert-red"
                        }`}
                      >
                        {!predicted ? "–" : correct ? "✓" : "✗"}
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          vs {game.opponentAbbr}
                        </div>
                        <div className="text-[10px] text-text-secondary dark:text-dark-text-secondary">
                          {new Date(game.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-bold">
                        {game.jazzScore}-{game.opponentScore}
                      </div>
                      {predicted && correct && (
                        <span className="text-[10px] font-bold text-court-green">
                          +50 XP
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
