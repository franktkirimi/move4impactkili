/** Campaign constants and the metaphors that turn dollars into altitude. */
export const CAMPAIGN_GOAL = 1_000_000;
export const SUMMIT_METRES = 5895;
export const DOLLARS_PER_METRE = CAMPAIGN_GOAL / SUMMIT_METRES;

export const metresForGift = (amount: number) => amount / DOLLARS_PER_METRE;
export const dollarsForAltitude = (metres: number) => metres * DOLLARS_PER_METRE;

/** Share of sea-level air pressure (and so oxygen per breath), standard atmosphere. */
export const oxygenShare = (metres: number) => Math.pow(1 - 2.25577e-5 * metres, 5.25588);

/** Temperature drop from sea level at the standard lapse rate of 6.5 °C per km. */
export const temperatureDrop = (metres: number) => (metres / 1000) * 6.5;

export const formatUsd = (amount: number) =>
  `US$${Math.round(amount).toLocaleString("en-US")}`;

/** Kilimanjaro's ecological zones, bottom to top, with their campaign meaning. */
export const kiliZones = [
  {
    id: "cultivation",
    from: 0,
    to: 1800,
    name: "Cultivation",
    terrain: "Farmland and villages on the lower slopes. The start of every expedition — and of every commitment.",
    campaign: "The commitment",
  },
  {
    id: "rainforest",
    from: 1800,
    to: 2800,
    name: "Rainforest",
    terrain: "Humid montane forest, mud underfoot and a canopy that hides the summit. The journey begins.",
    campaign: "The journey begins",
  },
  {
    id: "moorland",
    from: 2800,
    to: 4000,
    name: "Heath & moorland",
    terrain: "Giant groundsels, open skies and the first real cold. Momentum has to be built step by step.",
    campaign: "Building momentum",
  },
  {
    id: "alpine",
    from: 4000,
    to: 5000,
    name: "Alpine desert",
    terrain: "Bare rock and scree, scorching days and freezing nights. The challenge intensifies.",
    campaign: "The challenge intensifies",
  },
  {
    id: "arctic",
    from: 5000,
    to: SUMMIT_METRES,
    name: "Arctic summit",
    terrain: "Glaciers, ice fields and the crater rim. Uhuru Peak — the roof of Africa at 5,895 m.",
    campaign: "The summit",
  },
] as const;

export const zoneForAltitude = (metres: number) =>
  kiliZones.find((zone) => metres < zone.to) ?? kiliZones[kiliZones.length - 1];
