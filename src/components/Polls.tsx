"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store";
import { useState } from "react";

export default function Polls() {
  const { polls, userVotes, voteOnPoll } = useGameStore();
  const [justVoted, setJustVoted] = useState<string | null>(null);

  const handleVote = (pollId: string, optionId: string) => {
    if (userVotes[pollId]) return;
    voteOnPoll(pollId, optionId);
    setJustVoted(pollId);
    setTimeout(() => setJustVoted(null), 1500);
  };

  const activePolls = polls.filter((p) => p.status === "active");
  const completedPolls = polls.filter((p) => p.status === "completed");

  return (
    <div className="px-4 py-3 space-y-4">
      {/* Active Polls */}
      {activePolls.map((poll) => {
        const hasVoted = !!userVotes[poll.id];
        const maxVotes = Math.max(...poll.options.map((o) => o.votes));

        return (
          <motion.div
            key={poll.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            layout
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-jazz-gold bg-jazz-gold/10 px-2 py-0.5 rounded-full">
                LIVE POLL
              </span>
              {poll.expiresIn && !hasVoted && (
                <span className="text-xs text-text-secondary font-mono">
                  {poll.expiresIn}s
                </span>
              )}
            </div>

            <p className="text-xs text-text-secondary mb-2">{poll.context}</p>
            <p className="font-semibold mb-3">{poll.question}</p>

            <div className="space-y-2">
              {poll.options.map((option) => {
                const pct =
                  poll.totalVotes > 0
                    ? Math.round((option.votes / poll.totalVotes) * 100)
                    : 0;
                const isSelected = userVotes[poll.id] === option.id;
                const isWinner = option.votes === maxVotes && hasVoted;

                return (
                  <motion.button
                    key={option.id}
                    onClick={() => handleVote(poll.id, option.id)}
                    disabled={hasVoted}
                    className={`w-full relative overflow-hidden rounded-xl p-3 text-left transition-all ${
                      hasVoted
                        ? isSelected
                          ? "border-2 border-jazz-gold bg-jazz-gold/5"
                          : "border border-gray-200 bg-gray-50"
                        : "border-2 border-gray-200 hover:border-jazz-gold active:scale-[0.98]"
                    }`}
                    whileTap={!hasVoted ? { scale: 0.97 } : undefined}
                  >
                    {/* Background bar */}
                    {hasVoted && (
                      <motion.div
                        className={`absolute inset-0 ${
                          isSelected ? "bg-jazz-gold/10" : "bg-gray-100"
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    )}

                    <div className="relative flex items-center justify-between">
                      <span
                        className={`text-sm font-medium ${
                          isSelected ? "text-jazz-navy" : ""
                        }`}
                      >
                        {option.label}
                      </span>
                      {hasVoted && (
                        <motion.span
                          className="font-mono text-sm font-bold"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {pct}%
                        </motion.span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-3 text-xs text-text-secondary">
              <span>{poll.totalVotes.toLocaleString()} votes</span>
              {hasVoted && (
                <motion.span
                  className="text-jazz-gold font-semibold"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  +5 XP earned!
                </motion.span>
              )}
            </div>

            {/* Vote confirmation animation */}
            <AnimatePresence>
              {justVoted === poll.id && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-jazz-gold text-jazz-navy font-bold px-4 py-2 rounded-full text-sm shadow-lg">
                    Vote Recorded!
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Completed Polls */}
      {completedPolls.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-secondary mb-3">
            Completed Polls
          </h3>
          {completedPolls.map((poll) => (
            <div
              key={poll.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-text-secondary bg-gray-100 px-2 py-0.5 rounded-full">
                  COMPLETED
                </span>
              </div>
              <p className="font-semibold text-sm mb-3">{poll.question}</p>

              <div className="space-y-2">
                {poll.options.map((option) => {
                  const pct =
                    poll.totalVotes > 0
                      ? Math.round((option.votes / poll.totalVotes) * 100)
                      : 0;
                  const isCorrect = poll.correctOptionId === option.id;

                  return (
                    <div
                      key={option.id}
                      className={`relative overflow-hidden rounded-lg p-2.5 ${
                        isCorrect
                          ? "border-2 border-court-green bg-court-green/5"
                          : "border border-gray-200"
                      }`}
                    >
                      <div
                        className={`absolute inset-0 ${
                          isCorrect ? "bg-court-green/10" : "bg-gray-50"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                      <div className="relative flex items-center justify-between">
                        <span className="text-sm font-medium flex items-center gap-1.5">
                          {isCorrect && <span className="text-court-green">✓</span>}
                          {option.label}
                        </span>
                        <span className="font-mono text-xs font-bold">
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-xs text-text-secondary mt-2">
                {poll.totalVotes.toLocaleString()} total votes
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
