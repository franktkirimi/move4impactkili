import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const description = "A digital ascent turning every step, donation, story and purchase into visible progress toward twelve new family-style homes in Zimbabwe.";

  return {
    metadataBase: new URL(origin),
    title: {
      default: "Move4Impact · Climb Kili 2027",
      template: "%s · Move4Impact",
    },
    description,
    keywords: ["Move4Impact", "Climb Kili 2027", "Kilimanjaro", "Zimbabwe", "family-style homes", "fundraising"],
    icons: {
      icon: "/campaign-icon.png",
      shortcut: "/campaign-icon.png",
    },
    openGraph: {
      title: "Climb a Mountain. Build a Home.",
      description,
      type: "website",
      url: origin,
      images: [{ url: `${origin}/og.png`, width: 1536, height: 1024, alt: "Move4Impact Climb Kili 2027 campaign" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Climb a Mountain. Build a Home.",
      description,
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script src="https://widgets.givebutter.com/latest.umd.cjs?acct=226906&p=other" strategy="lazyOnload" />
      </body>
    </html>
  );
}
