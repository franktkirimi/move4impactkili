import { givebutterCampaignId } from "../../campaign-data";
import type { CampaignStats, LiveMember } from "../../campaign-stats";

/**
 * Live campaign totals and per-fundraiser progress from the Givebutter API.
 * Runs server-side so GIVEBUTTER_API_KEY never reaches the browser, strips
 * private member fields, and caches for a few minutes to stay within rate limits.
 */
const CACHE_MS = 5 * 60 * 1000;
let cached: { at: number; stats: CampaignStats } | null = null;

type GivebutterMember = {
  id: string | number;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  picture?: string | null;
  raised?: number;
  goal?: number | null;
  donors?: number;
  url?: string;
};

type MemberPage = { data?: GivebutterMember[]; links?: { next?: string | null } };
type GivebutterCampaign = { raised?: number; goal?: number | null; donors?: number };

async function givebutter<T>(url: string, apiKey: string): Promise<T> {
  const response = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" } });
  if (!response.ok) throw new Error(`Givebutter ${response.status} for ${new URL(url).pathname}`);
  return response.json() as Promise<T>;
}

async function loadStats(apiKey: string): Promise<CampaignStats> {
  const base = (process.env.GIVEBUTTER_API_BASE ?? "https://api.givebutter.com").replace(/\/$/, "");
  const campaign = await givebutter<GivebutterCampaign>(`${base}/v1/campaigns/${givebutterCampaignId}`, apiKey);

  const members: LiveMember[] = [];
  let next: string | null | undefined = `${base}/v1/campaigns/${givebutterCampaignId}/members`;
  for (let page = 0; next && page < 20; page += 1) {
    const result: MemberPage = await givebutter<MemberPage>(next, apiKey);
    for (const member of result.data ?? []) {
      members.push({
        id: String(member.id),
        name: member.display_name || [member.first_name, member.last_name].filter(Boolean).join(" ") || "Move4Impact climber",
        // Givebutter's generated letter avatars are skipped so the site's own initials style shows instead.
        picture: member.picture && !member.picture.includes("/assets/avatars/") ? member.picture : null,
        raised: Number(member.raised ?? 0),
        goal: member.goal ?? null,
        donors: Number(member.donors ?? 0),
        url: member.url || `https://givebutter.com/kilimanjaro2027`,
      });
    }
    next = result.links?.next;
  }

  members.sort((a, b) => b.raised - a.raised || b.donors - a.donors);
  return {
    raised: Number(campaign.raised ?? 0),
    goal: Number(campaign.goal ?? 1_000_000),
    donors: Number(campaign.donors ?? 0),
    members,
    updatedAt: new Date().toISOString(),
  };
}

export async function GET() {
  const apiKey = process.env.GIVEBUTTER_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Live stats are not configured yet: set GIVEBUTTER_API_KEY." }, { status: 503 });
  }

  if (!cached || Date.now() - cached.at > CACHE_MS) {
    try {
      cached = { at: Date.now(), stats: await loadStats(apiKey) };
    } catch (error) {
      console.error("Givebutter stats request failed", error);
      // Serve the last good numbers rather than blanking the page.
      if (!cached) return Response.json({ error: "Could not load live campaign stats." }, { status: 502 });
    }
  }

  return Response.json(cached.stats, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
