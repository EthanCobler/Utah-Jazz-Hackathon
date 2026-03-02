"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface AuthUser {
  username: string;
  displayName: string;
  avatarInitials: string;
  tier: string;
  xp: number;
  rank: number;
  streak: number;
  accuracy: number;
  correctPredictions: number;
  totalPredictions: number;
  pollsVoted: number;
  gamesEngaged: number;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  login: (username: string, password: string) => boolean;
  signup: (username: string, displayName: string, password: string) => boolean;
  logout: () => void;
}

const TEST_ACCOUNT: AuthUser = {
  username: "jazzfan67",
  displayName: "JazzFan67",
  avatarInitials: "JF",
  tier: "Gold",
  xp: 22850,
  rank: 7,
  streak: 7,
  accuracy: 66,
  correctPredictions: 103,
  totalPredictions: 156,
  pollsVoted: 312,
  gamesEngaged: 48,
};

const STORAGE_KEY = "jazz-hub-auth";

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  hydrated: false,
  login: () => false,
  signup: () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
    setHydrated(true);
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    if (username.toLowerCase() === "jazzfan67" && password === "jazz2026") {
      setUser(TEST_ACCOUNT);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(TEST_ACCOUNT));
      return true;
    }
    return false;
  }, []);

  const signup = useCallback((username: string, displayName: string, password: string): boolean => {
    if (username.length < 3 || password.length < 4 || displayName.length < 2) {
      return false;
    }
    const initials = displayName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || displayName.slice(0, 2).toUpperCase();

    const newUser: AuthUser = {
      username: username.toLowerCase(),
      displayName,
      avatarInitials: initials,
      tier: "Bronze",
      xp: 0,
      rank: 0,
      streak: 0,
      accuracy: 0,
      correctPredictions: 0,
      totalPredictions: 0,
      pollsVoted: 0,
      gamesEngaged: 0,
    };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, hydrated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
