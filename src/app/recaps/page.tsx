import { fetchJazzGames } from "@/lib/balldontlie";
import { mockGameRecaps } from "@/data/mock";
import RecapsClient from "./RecapsClient";

export default async function RecapsPage() {
  let recaps = await fetchJazzGames();

  if (recaps.length === 0) {
    recaps = mockGameRecaps;
  }

  return <RecapsClient recaps={recaps} />;
}