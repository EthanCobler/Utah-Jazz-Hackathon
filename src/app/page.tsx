"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { mockGameRecaps, mockPolls } from "@/data/mock";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

export default function HomePage() {
  const nextGame = {
    opponent: "Los Angeles Lakers",
    opponentAbbr: "LAL",
    date: "Tonight",
    time: "7:00 PM MT",
    record: "32-26",
    opponentRecord: "38-20",
  };

  const lastGame = mockGameRecaps[mockGameRecaps.length - 1];

  return (
    <div className="px-4 pt-4 space-y-4">
      {/* Hero Card */}
      <motion.div
        className="gradient-jazz rounded-2xl p-6 text-white relative overflow-hidden"
        {...fadeInUp}
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-jazz-gold/10 rounded-full -translate-y-10 translate-x-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-jazz-purple/30 rounded-full translate-y-8 -translate-x-8" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-court-green rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-jazz-gold uppercase tracking-wider">
              {nextGame.date}
            </span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-1">
                <span className="text-2xl font-extrabold">UTA</span>
              </div>
              <span className="text-xs text-white/70">{nextGame.record}</span>
            </div>

            <div className="text-center">
              <div className="text-sm text-white/70 mb-1">vs</div>
              <div className="font-mono text-2xl font-bold text-jazz-gold">
                {nextGame.time}
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-1">
                <span className="text-2xl font-extrabold">{nextGame.opponentAbbr}</span>
              </div>
              <span className="text-xs text-white/70">{nextGame.opponentRecord}</span>
            </div>
          </div>

          <Link href="/live">
            <motion.button
              className="w-full bg-jazz-gold text-jazz-navy font-bold py-3 rounded-xl text-sm"
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.01 }}
            >
              Lock In Your Prediction
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Streak & Challenge Module */}
      <motion.div
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🔥</div>
            <div>
              <div className="font-bold text-lg">7 Game Streak</div>
              <div className="text-xs text-text-secondary">
                Your longest: 12 games
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono font-bold text-jazz-gold text-lg">
              22,850 XP
            </div>
            <div className="text-xs text-text-secondary">Gold Tier</div>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex justify-between text-xs text-text-secondary mb-1">
            <span>Weekly Challenge</span>
            <span>680 / 1,000 XP</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-jazz-gold rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "68%" }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Community Pulse */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-bold text-lg mb-3">Community Pulse</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {/* Trending Poll */}
          <div className="flex-shrink-0 w-64 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-jazz-gold bg-jazz-gold/10 px-2 py-0.5 rounded-full">
                TRENDING
              </span>
            </div>
            <p className="text-sm font-semibold mb-2">{mockPolls[0].question}</p>
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <span>{mockPolls[0].totalVotes.toLocaleString()} votes</span>
              <span>·</span>
              <span>Live now</span>
            </div>
          </div>

          {/* Community Prediction */}
          <div className="flex-shrink-0 w-64 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-court-green bg-court-green/10 px-2 py-0.5 rounded-full">
                PREDICTION
              </span>
            </div>
            <p className="text-sm font-semibold mb-2">
              67% predict Jazz win tonight
            </p>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-court-green rounded-full" style={{ width: "67%" }} />
            </div>
          </div>

          {/* Community Debate */}
          <div className="flex-shrink-0 w-64 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-jazz-purple bg-jazz-purple/10 px-2 py-0.5 rounded-full">
                DEBATE
              </span>
            </div>
            <p className="text-sm font-semibold mb-2">
              Should Keyonte George start over Sexton?
            </p>
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <span>4.2K responses</span>
              <span>·</span>
              <span>54% say yes</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Recap */}
      {lastGame && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-bold text-lg mb-3">Recent Game</h2>
          <Link href="/recaps">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-10 rounded-full ${
                      lastGame.win ? "bg-court-green" : "bg-alert-red"
                    }`}
                  />
                  <div>
                    <div className="text-sm text-text-secondary">
                      {new Date(lastGame.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="font-semibold">
                      vs {lastGame.opponent}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-xl">
                    {lastGame.jazzScore} - {lastGame.opponentScore}
                  </div>
                  <div
                    className={`text-xs font-semibold ${
                      lastGame.win ? "text-court-green" : "text-alert-red"
                    }`}
                  >
                    {lastGame.win ? "WIN" : "LOSS"}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <span>MVP: {lastGame.mvp}</span>
                <span className="text-jazz-gold font-semibold">
                  View Full Recap →
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* News Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="font-bold text-lg mb-3">Jazz News</h2>
        <div className="space-y-3">
          {[
            {
              title: "Markkanen named Western Conference Player of the Week",
              source: "NBA.com",
              time: "2h ago",
            },
            {
              title: "Injury update: Taylor Hendricks probable for tonight",
              source: "UtahJazz.com",
              time: "4h ago",
            },
            {
              title: "Jazz climb to 8th in Western Conference standings",
              source: "ESPN",
              time: "6h ago",
            },
          ].map((article, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-3"
            >
              <div className="w-16 h-16 bg-jazz-navy/5 rounded-lg flex-shrink-0 flex items-center justify-center">
                <span className="text-2xl">📰</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold line-clamp-2">
                  {article.title}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-text-secondary">
                  <span className="font-medium text-jazz-navy">
                    {article.source}
                  </span>
                  <span>·</span>
                  <span>{article.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
