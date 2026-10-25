"use client";

import { useEffect, useState } from "react";

/** Public, browser-safe shape served by /api/campaign. No emails or phone numbers. */
export type LiveMember = {
  id: string;
  name: string;
  picture: string | null;
  raised: number;
  goal: number | null;
  donors: number;
  url: string;
};

export type CampaignStats = {
  raised: number;
  goal: number;
  donors: number;
  members: LiveMember[];
  updatedAt: string;
};

/** Live campaign totals and fundraiser leaderboard; null until loaded or if unavailable. */
export function useCampaignStats() {
  const [stats, setStats] = useState<CampaignStats | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/campaign")
      .then((response) => (response.ok ? (response.json() as Promise<CampaignStats>) : null))
      .then((data) => { if (!cancelled && data) setStats(data); })
      .catch((error) => console.error("Live campaign stats unavailable", error));
    return () => { cancelled = true; };
  }, []);

  return stats;
}
