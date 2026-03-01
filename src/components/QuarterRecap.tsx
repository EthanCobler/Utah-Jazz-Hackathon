"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store";
import { useState } from "react";

export default function QuarterRecap() {
  const { keyMoments } = useGameStore();
  const [selectedQuarter, setSelectedQuarter] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const quarters = [1, 2, 3, 4];
  const momentsByQuarter = quarters.map((q) =>
    keyMoments.filter((m) => m.quarter === q)
  );

  return (
    <div className="px-4 py-3">
      {/* Quarter selector */}
      <div className="flex gap-2 mb-4">
        {quarters.map((q) => {
          const hasMoments = momentsByQuarter[q - 1].length > 0;
          return (
            <button
              key={q}
              onClick={() => {
                setSelectedQuarter(q);
                setIsOpen(true);
              }}
              className={`flex-1 py-3 rounded-xl text-center transition-all ${
                hasMoments
                  ? "bg-jazz-navy text-white hover:bg-jazz-purple"
                  : "bg-gray-100 text-text-secondary"
              }`}
            >
              <div className="text-xs font-semibold mb-0.5">Q{q}</div>
              <div className="text-[10px] opacity-70">
                {momentsByQuarter[q - 1].length} moments
              </div>
            </button>
          );
        })}
      </div>

      {/* All moments list */}
      <div className="space-y-3">
        {keyMoments.map((moment, i) => (
          <motion.div
            key={moment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white bg-jazz-navy px-2 py-0.5 rounded-full">
                  Q{moment.quarter}
                </span>
                <span className="text-xs text-text-secondary font-mono">
                  {moment.time}
                </span>
              </div>
              <div
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  moment.significance >= 9
                    ? "bg-jazz-gold/20 text-jazz-gold"
                    : moment.significance >= 7
                    ? "bg-jazz-navy/10 text-jazz-navy"
                    : "bg-gray-100 text-text-secondary"
                }`}
              >
                {moment.significance}/10
              </div>
            </div>
            <h3 className="font-bold text-sm mb-1">{moment.title}</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              {moment.description}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-6 h-6 bg-jazz-navy/10 rounded-full flex items-center justify-center">
                <span className="text-[8px] font-bold text-jazz-navy">
                  {moment.playerName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <span className="text-xs font-medium">{moment.playerName}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Sheet Overlay */}
      <AnimatePresence>
        {isOpen && selectedQuarter && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[60vh] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="p-4">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-1">
                  Quarter {selectedQuarter} Key Moments
                </h3>
                <p className="text-xs text-text-secondary mb-4">
                  AI-generated recap of the top moments
                </p>

                <div className="space-y-3">
                  {momentsByQuarter[selectedQuarter - 1].map((moment, i) => (
                    <motion.div
                      key={moment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="bg-bg rounded-xl p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            moment.significance >= 9
                              ? "bg-jazz-gold"
                              : moment.significance >= 7
                              ? "bg-jazz-navy"
                              : "bg-gray-400"
                          }`}
                        >
                          {moment.significance}
                        </div>
                        <div>
                          <div className="font-bold text-sm">
                            {moment.title}
                          </div>
                          <div className="text-[10px] text-text-secondary">
                            {moment.time} remaining
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {moment.description}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full mt-4 mb-4 py-3 bg-jazz-navy text-white rounded-xl font-semibold text-sm"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
