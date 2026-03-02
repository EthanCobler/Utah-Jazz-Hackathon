// No "use client" here — this is a server component
// It runs on the server, fetches real data, then passes it to the UI

import { fetchJazzPlayerStats } from "@/lib/balldontlie";
import { mockPlayerStats } from "@/data/mock";
import StatsClient from "./StatsClient";

export default async function StatsPage() {
  // Try to get real data from the API
  // If it fails or returns empty, fall back to mock data
  let playerStats = await fetchJazzPlayerStats();
  
  if (playerStats.length === 0) {
    playerStats = mockPlayerStats;
  }

  // Pass the data down to the client component as a prop
  return <StatsClient playerStats={playerStats} />;
}