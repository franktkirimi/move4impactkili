export type Climber = {
  slug: string;
  name: string;
  location: string;
  reason: string;
  target: string;
  raised: string;
  trained: string;
  elevation: string;
  update: string;
  accent: string;
};

export const climbers: Climber[] = [
  {
    slug: "frank-kirimi",
    name: "Frank Kirimi",
    location: "Harare, Zimbabwe",
    reason: "I’m climbing so that a hard-won summit can become an everyday place of safety and belonging.",
    target: "[Personal target]",
    raised: "[Amount raised]",
    trained: "[KM trained]",
    elevation: "[Elevation gained]",
    update: "[Latest verified training update]",
    accent: "orange",
  },
  {
    slug: "climber-02",
    name: "[Climber 02]",
    location: "[City, country]",
    reason: "[Approved personal reason for climbing]",
    target: "[Personal target]",
    raised: "[Amount raised]",
    trained: "[KM trained]",
    elevation: "[Elevation gained]",
    update: "[Latest verified training update]",
    accent: "blue",
  },
  {
    slug: "climber-03",
    name: "[Climber 03]",
    location: "[City, country]",
    reason: "[Approved personal reason for climbing]",
    target: "[Personal target]",
    raised: "[Amount raised]",
    trained: "[KM trained]",
    elevation: "[Elevation gained]",
    update: "[Latest verified training update]",
    accent: "grey",
  },
  {
    slug: "climber-04",
    name: "[Climber 04]",
    location: "[City, country]",
    reason: "[Approved personal reason for climbing]",
    target: "[Personal target]",
    raised: "[Amount raised]",
    trained: "[KM trained]",
    elevation: "[Elevation gained]",
    update: "[Latest verified training update]",
    accent: "lime",
  },
];

export const impactProjects = [
  {
    id: "homes",
    number: "12",
    title: "Family-style homes",
    purpose: "Warm, stable homes designed around belonging, consistent care and everyday family life.",
    allocation: "[Approved construction allocation]",
    status: "Funding plan pending approval",
    stage: "Architectural planning",
    impact: "Safe, long-term family-style care for children in Zimbabwe.",
  },
  {
    id: "shared",
    number: "02",
    title: "Shared spaces",
    purpose: "Paths and shared places that make community, play and connection part of the campus.",
    allocation: "[Approved shared-space allocation]",
    status: "Scope to be confirmed",
    stage: "Concept planning",
    impact: "Places where children, caregivers and the wider community can grow together.",
  },
  {
    id: "operations",
    number: "03",
    title: "Essential operations",
    purpose: "Administration and maintenance facilities that support safe, accountable daily care.",
    allocation: "[Approved operations allocation]",
    status: "Scope to be confirmed",
    stage: "Requirements planning",
    impact: "Reliable systems behind the long-term care model.",
  },
] as const;

export const trailUpdates = [
  {
    tag: "Training update · Harare",
    title: "Another early start. Another step toward the mountain.",
    copy: "[Climber name] completed [distance] of endurance training. Add the verified route, reflection and media here.",
    marker: "01 / FIELD NOTE",
  },
  {
    tag: "Campaign milestone",
    title: "Momentum becomes visible here.",
    copy: "Connect the verified live total to announce each funding milestone without manufacturing progress.",
    marker: "02 / LIVE TOTAL",
  },
  {
    tag: "From Eden",
    title: "The village begins long before the summit.",
    copy: "Add approved campus updates, architectural progress and dignified stories from the care community.",
    marker: "03 / IMPACT",
  },
] as const;

export const products = [
  {
    name: "Ascent performance tee",
    type: "Training layer / unisex",
    price: "[Product price]",
    colours: "Obsidian · Glacier",
    sizes: "[Confirmed size range]",
    status: "Reserve interest",
    code: "KIT–01",
  },
  {
    name: "5895 expedition shell",
    type: "Lightweight outer layer",
    price: "[Product price]",
    colours: "Summit Orange · Obsidian",
    sizes: "[Confirmed size range]",
    status: "Coming soon",
    code: "KIT–02",
  },
  {
    name: "Home is the victory cap",
    type: "Campaign supporter cap",
    price: "[Product price]",
    colours: "Volcanic Grey",
    sizes: "Adjustable",
    status: "Reserve interest",
    code: "KIT–03",
  },
] as const;

export const altitudeStages = [
  ["0 m", "The commitment"],
  ["1,800 m", "The journey begins"],
  ["3,000 m", "Building momentum"],
  ["4,600 m", "The challenge intensifies"],
  ["5,895 m", "The summit"],
] as const;
