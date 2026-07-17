"use client";

import { ReactNode, useState } from "react";
import { DonationDrawer, Footer, SiteHeader } from "./site-ui";

export default function RouteShell({ children, climber }: { children: ReactNode; climber?: string }) {
  const [donationOpen, setDonationOpen] = useState(false);
  return (
    <main className="campaign-site route-site">
      <SiteHeader inverse onSupport={() => setDonationOpen(true)} />
      {children}
      <Footer />
      <DonationDrawer open={donationOpen} onClose={() => setDonationOpen(false)} climber={climber} />
    </main>
  );
}
