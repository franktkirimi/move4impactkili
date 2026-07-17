import type { Metadata } from "next";
import HomeExperience from "./home-experience";

export const metadata: Metadata = {
  title: "Climb a Mountain. Build a Home.",
  description: "Twenty athletes. One mountain. Twelve new homes. One million dollars for children in Zimbabwe.",
};

export default function Home() {
  return <HomeExperience />;
}
