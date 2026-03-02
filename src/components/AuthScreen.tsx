"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthProvider";
import ThemeToggle from "@/components/ThemeToggle";

type Mode = "login" | "signup";

export default function AuthScreen() {
  const { login, signup } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Brief delay for realism
    await new Promise((r) => setTimeout(r, 400));

    if (mode === "login") {
      const success = login(username, password);
      if (success) {
        router.push("/");
      } else {
        setError("Invalid username or password");
        setIsLoading(false);
      }
    } else {
      if (username.length < 3) {
        setError("Username must be at least 3 characters");
        setIsLoading(false);
        return;
      }
      if (password.length < 4) {
        setError("Password must be at least 4 characters");
        setIsLoading(false);
        return;
      }
      if (displayName.length < 2) {
        setError("Display name must be at least 2 characters");
        setIsLoading(false);
        return;
      }
      const success = signup(username, displayName, password);
      if (success) {
        router.push("/");
      } else {
        setError("Could not create account. Check your inputs.");
        setIsLoading(false);
      }
    }
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setError("");
    setUsername("");
    setPassword("");
    setDisplayName("");
  };

  return (
    <div className="px-4 pt-4">
      {/* Header */}
      <div className="gradient-jazz rounded-2xl p-6 text-white mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-jazz-gold/10 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-6 -translate-x-6" />

        {/* Theme Toggle */}
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle />
        </div>

        <div className="relative z-10 text-center pt-4 pb-2">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M4.93 4.93c4.08 2.38 8.07 7.02 10.14 14.14" />
              <path d="M19.07 4.93c-4.08 2.38-8.07 7.02-10.14 14.14" />
              <path d="M2 12h20" />
            </svg>
          </div>
          <h1 className="text-xl font-extrabold">Jazz Game-Day Hub</h1>
          <p className="text-sm text-white/70 mt-1">Your fan engagement platform</p>
        </div>
      </div>

      {/* Login / Sign Up Toggle */}
      <div className="flex gap-1 bg-gray-100 dark:bg-dark-border rounded-xl p-1 mb-4">
        {(["login", "signup"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => switchMode(tab)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              mode === tab
                ? "bg-white dark:bg-dark-surface text-jazz-navy dark:text-jazz-gold shadow-sm"
                : "text-text-secondary dark:text-dark-text-secondary"
            }`}
          >
            {tab === "login" ? "Log In" : "Sign Up"}
          </button>
        ))}
      </div>

      {/* Form */}
      <AnimatePresence mode="wait">
        <motion.form
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          onSubmit={handleSubmit}
          className="bg-white dark:bg-dark-surface rounded-xl p-5 shadow-sm border border-gray-100 dark:border-dark-border space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-text-secondary dark:text-dark-text-secondary mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-bg dark:bg-dark-bg text-text-primary dark:text-dark-text-primary placeholder:text-text-secondary/50 dark:placeholder:text-dark-text-secondary/50 focus:ring-2 focus:ring-jazz-gold focus:border-jazz-gold outline-none transition-colors text-sm"
              autoComplete="username"
              required
            />
          </div>

          {mode === "signup" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="block text-xs font-semibold text-text-secondary dark:text-dark-text-secondary mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How others will see you"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-bg dark:bg-dark-bg text-text-primary dark:text-dark-text-primary placeholder:text-text-secondary/50 dark:placeholder:text-dark-text-secondary/50 focus:ring-2 focus:ring-jazz-gold focus:border-jazz-gold outline-none transition-colors text-sm"
                required
              />
            </motion.div>
          )}

          <div>
            <label className="block text-xs font-semibold text-text-secondary dark:text-dark-text-secondary mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-bg dark:bg-dark-bg text-text-primary dark:text-dark-text-primary placeholder:text-text-secondary/50 dark:placeholder:text-dark-text-secondary/50 focus:ring-2 focus:ring-jazz-gold focus:border-jazz-gold outline-none transition-colors text-sm"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
            />
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-alert-red text-xs font-medium bg-alert-red/10 rounded-lg px-3 py-2"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-xl bg-jazz-gold text-jazz-navy font-bold text-sm shadow-sm disabled:opacity-60 transition-opacity"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {mode === "login" ? "Logging in..." : "Creating account..."}
              </span>
            ) : mode === "login" ? (
              "Log In"
            ) : (
              "Create Account"
            )}
          </motion.button>
        </motion.form>
      </AnimatePresence>
    </div>
  );
}
