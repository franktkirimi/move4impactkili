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
  profileUrl: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
};

export const climbers: Climber[] = [
  {
    slug: "ian-fry",
    name: "Ian Fry",
    location: "Move4Impact athlete",
    reason: "Climbing to help turn a demanding summit into lasting places of care and belonging.",
    target: "US$50,000",
    raised: "Live on Givebutter",
    trained: "Training underway",
    elevation: "Building toward 5,895 m",
    update: "Follow Ian’s verified campaign for the latest updates.",
    accent: "orange",
    profileUrl: "https://givebutter.com/kilimanjaro2027/ianfry",
    image: "/images/ian-fry.jpg",
    imageAlt: "Ian Fry wearing an Eden Ministries training shirt outdoors",
    imagePosition: "50% 42%",
  },
  {
    slug: "skylar-fingerle",
    name: "Skylar Fingerle",
    location: "Move4Impact athlete",
    reason: "Climbing to help turn a demanding summit into lasting places of care and belonging.",
    target: "US$50,000",
    raised: "Live on Givebutter",
    trained: "Training underway",
    elevation: "Building toward 5,895 m",
    update: "Follow Skylar’s verified campaign for the latest updates.",
    accent: "blue",
    profileUrl: "https://givebutter.com/kilimanjaro2027/skylarfingerle1",
    image: "/images/skylar-fingerle.jpg",
    imageAlt: "Skylar Fingerle training with trekking poles and a backpack",
    imagePosition: "50% 42%",
  },
  {
    slug: "frank-kirimi",
    name: "Frank Kirimi",
    location: "Harare, Zimbabwe",
    reason: "I’m climbing so that a hard-won summit can become an everyday place of safety and belonging.",
    target: "US$50,000",
    raised: "Live on Givebutter",
    trained: "Training underway",
    elevation: "Building toward 5,895 m",
    update: "Follow Frank’s verified campaign for the latest updates.",
    accent: "grey",
    profileUrl: "https://givebutter.com/kilimanjaro2027/frankkirimi",
    image: "/images/frank-kirimi.jpg",
    imageAlt: "Frank Kirimi smiling during trail training in Zimbabwe",
    imagePosition: "50% 50%",
  },
  {
    slug: "noah-chaplin",
    name: "Noah Chaplin",
    location: "Move4Impact athlete",
    reason: "Taking on Kilimanjaro to help turn collective movement into lasting homes.",
    target: "US$50,000",
    raised: "Live on Givebutter",
    trained: "Training underway",
    elevation: "Building toward 5,895 m",
    update: "Follow Noah’s verified campaign for the latest updates.",
    accent: "lime",
    profileUrl: "https://givebutter.com/kilimanjaro2027/noahchaplin1",
    image: "/images/kilimanjaro-team-ascent.png",
    imageAlt: "An anonymous expedition team hiking toward Kilimanjaro at sunrise",
  },
  {
    slug: "noah-hodges",
    name: "Noah Hodges",
    location: "Move4Impact athlete",
    reason: "Taking on Kilimanjaro to help turn collective movement into lasting homes.",
    target: "US$50,000", raised: "Live on Givebutter", trained: "Training underway", elevation: "Building toward 5,895 m", update: "Follow Noah’s verified campaign for the latest updates.", accent: "blue",
    profileUrl: "https://givebutter.com/kilimanjaro2027/noahhodges", image: "/images/kilimanjaro-team-ascent.png", imageAlt: "An anonymous expedition team hiking toward Kilimanjaro at sunrise",
  },
  {
    slug: "trenton-alaya",
    name: "Trenton & Alaya",
    location: "Move4Impact athletes",
    reason: "Climbing together to help build a future rooted in home, care and belonging.",
    target: "US$50,000", raised: "Live on Givebutter", trained: "Training underway", elevation: "Building toward 5,895 m", update: "Follow their verified campaign for the latest updates.", accent: "orange",
    profileUrl: "https://givebutter.com/kilimanjaro2027/trentonmetzger", image: "/images/kilimanjaro-team-ascent.png", imageAlt: "An anonymous expedition team hiking toward Kilimanjaro at sunrise",
  },
  {
    slug: "jamison-deacons",
    name: "Jamison Deacons",
    location: "Move4Impact athlete",
    reason: "Climbing Kilimanjaro to help move the vision for twelve family-style homes forward.",
    target: "US$50,000", raised: "Live on Givebutter", trained: "Training underway", elevation: "Building toward 5,895 m", update: "Follow Jamison’s verified campaign for the latest updates.", accent: "grey",
    profileUrl: "https://givebutter.com/kilimanjaro2027/jamisondeacons", image: "/images/kilimanjaro-team-ascent.png", imageAlt: "An anonymous expedition team hiking toward Kilimanjaro at sunrise",
  },
];

export const altitudeStages = [
  ["0 m", "The commitment"],
  ["1,800 m", "The journey begins"],
  ["3,000 m", "Building momentum"],
  ["4,600 m", "The challenge intensifies"],
  ["5,895 m", "The summit"],
] as const;

/** Verified Givebutter campaign for Move4Impact · Kilimanjaro 2027 (Eden Ministries Inc). */
export const givingUrl = "https://givebutter.com/kilimanjaro2027";
export const givebutterAccount = "226906";
