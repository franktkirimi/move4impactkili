"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { givebutterAccount, givingUrl } from "./campaign-data";
import { formatUsd } from "./campaign-math";
import { CampaignStats, useCampaignStats } from "./campaign-stats";
import { saveInterest } from "./supabase";

const nav = [
  ["The Route", "/#route"],
  ["Your Gift", "/#gift"],
  ["The Team", "/#team"],
  ["Challenge", "/#community"],
  ["Partners", "/#partners"],
] as const;

export function Mark({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link className={`mark ${inverse ? "mark--inverse" : ""}`} href="/" aria-label="Move4Impact Climb Kili home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="mark__logo" src={inverse ? "/brand/m4i-logo-white.png" : "/brand/m4i-logo-orange.png"} alt="Move4Impact" width={640} height={240} />
      <span className="mark__copy">CLIMB KILI<br />2027</span>
    </Link>
  );
}

export function SiteHeader({ onSupport, inverse = false }: { onSupport?: () => void; inverse?: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  return (
    <header className={`site-header ${inverse ? "site-header--inverse" : ""}`}>
      <Mark inverse={inverse} />
      <nav className="desktop-nav" aria-label="Primary navigation">
        {nav.map(([label, href]) => <Link href={href} key={label}>{label}</Link>)}
      </nav>
      <div className="header-actions">
        <button className="support-chip" type="button" onClick={onSupport}>
          Support the climb <span aria-hidden="true">↗</span>
        </button>
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span /><span />
        </button>
      </div>
      {open && (
        <div className="mobile-menu">
          <div className="mobile-menu__meta">MOVE4IMPACT · KILIMANJARO 2027</div>
          <nav aria-label="Mobile navigation">
            {nav.map(([label, href], index) => (
              <Link href={href} key={label} onClick={() => setOpen(false)}>
                <span>0{index + 1}</span>{label}<b aria-hidden="true">↗</b>
              </Link>
            ))}
          </nav>
          <button className="button button--orange button--wide" type="button" onClick={() => { setOpen(false); onSupport?.(); }}>
            Support the climb <span aria-hidden="true">↗</span>
          </button>
        </div>
      )}
    </header>
  );
}

export function DonationDrawer({ open, onClose, climber }: { open: boolean; onClose: () => void; climber?: string }) {
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    document.body.classList.add("no-scroll");
    return () => {
      window.removeEventListener("keydown", close);
      document.body.classList.remove("no-scroll");
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="drawer-layer" role="dialog" aria-modal="true" aria-labelledby="donation-title">
      <button className="drawer-scrim" aria-label="Close donation panel" onClick={onClose} />
      <aside className="donation-drawer">
        <button className="drawer-close" type="button" aria-label="Close donation panel" onClick={onClose}>×</button>
        <div className="eyebrow eyebrow--orange">MOVE US HIGHER</div>
        <h2 id="donation-title">TURN A GIFT<br />INTO ALTITUDE.</h2>
        <p>{climber ? `Support ${climber}’s personal climb.` : "Support the team’s US$1 million campaign."}</p>
        <DrawerTotal />
        <div className="donation-widget">
          <givebutter-widget id="jNKVmq" account={givebutterAccount} />
        </div>
        <a className="button button--orange button--wide donation-submit" href={givingUrl} target="_blank" rel="noopener noreferrer">
          Give on Givebutter <span aria-hidden="true">↗</span>
        </a>
        <p className="drawer-note">
          Checkout is handled securely by Givebutter, the campaign’s verified fundraising platform. No payment details are collected by this site.{" "}
          <a href={givingUrl} target="_blank" rel="noopener noreferrer">Open the full campaign page <span aria-hidden="true">↗</span></a>
        </p>
      </aside>
    </div>
  );
}

export function InterestForm({ kind = "campaign kit", cta }: { kind?: string; cta?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    if (typeof email !== "string" || !email) return;
    setStatus("sending");
    try {
      await saveInterest(email, kind);
      setStatus("sent");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return <div className="form-success" role="status"><span>✓</span> You’re on the list. We’ll email you about the {kind}.</div>;
  }
  return (
    <form className="interest-form" onSubmit={submit}>
      <label>
        <span>Email address</span>
        <input type="email" name="email" placeholder="you@example.com" required disabled={status === "sending"} />
      </label>
      <button className="button button--orange" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : <>{cta ?? `Reserve ${kind}`} <span aria-hidden="true">↗</span></>}
      </button>
      {status === "error" && (
        <p className="form-error" role="alert">Something went wrong — please try again in a moment.</p>
      )}
    </form>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <Link href="/" className="footer__logo" aria-label="Move4Impact home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/m4i-logo-white-motion.png" alt="Move4Impact" width={900} height={414} loading="lazy" />
        </Link>
        <div>
          <p>Twenty athletes. One mountain.<br />Twelve new homes.</p>
        </div>
        <div className="footer__links">
          <Link href="/#why">Why we climb</Link>
          <Link href="/#route">The route</Link>
          <Link href="/#gift">Your gift</Link>
          <Link href="/#team">The team</Link>
        </div>
        <div className="footer__links">
          <Link href="/#community">Start a challenge</Link>
          <Link href="/#partners">Partner with us</Link>
          <a href={givingUrl} target="_blank" rel="noopener noreferrer">Give on Givebutter ↗</a>
        </div>
      </div>
      <div className="footer__bottom">
        <span>© 2027 MOVE4IMPACT</span>
        <span>SAFEGUARDING · PRIVACY · TRANSPARENCY</span>
        <span>34.0837° S · 18.4232° E → 5,895 M</span>
      </div>
    </footer>
  );
}

/** Shares a link with the native share sheet, falling back to copying it. */
export function ShareButton({ title, path, className = "text-link text-link--dark", label = "Share" }: { title: string; path: string; className?: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = new URL(path, window.location.origin).toString();
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch (error) {
      if ((error as Error).name !== "AbortError") console.error(error);
    }
  }

  return (
    <button className={className} type="button" onClick={share} aria-label={label ? undefined : copied ? "Link copied" : `Share: ${title}`}>
      {label && (copied ? "Link copied" : label)} <span aria-hidden="true">{copied ? "✓" : "↗"}</span>
    </button>
  );
}

export const partnerTiers = [
  ["TRAIL", "Community movement", "Activate people, places and local challenges."],
  ["ASCENT", "Campaign momentum", "Fuel training, storytelling and fundraising reach."],
  ["SUMMIT", "Expedition platform", "Help carry the team to Kilimanjaro and amplify the mission."],
  ["VILLAGE BUILDER", "The lasting victory", "Help turn approved construction plans into family-style homes."],
] as const;

export function PartnerForm({ tier, onTierChange }: { tier: string; onTierChange: (tier: string) => void }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const organisation = String(data.get("organisation") ?? "").trim();
    if (typeof email !== "string" || !email) return;
    setStatus("sending");
    try {
      await saveInterest(email, `partner: ${tier.toLowerCase()} · ${organisation}`);
      setStatus("sent");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return <div className="form-success" role="status"><span>✓</span> Thank you. The campaign team will be in touch about the {tier.toLowerCase()} partnership.</div>;
  }
  return (
    <form className="partner-form" onSubmit={submit}>
      <div className="partner-form__tiers" role="radiogroup" aria-label="Partnership level">
        {partnerTiers.map(([title]) => (
          <button type="button" role="radio" aria-checked={tier === title} className={tier === title ? "active" : ""} key={title} onClick={() => onTierChange(title)}>{title}</button>
        ))}
      </div>
      <label><span>Organisation</span><input name="organisation" placeholder="Company, church, school or club" required maxLength={40} disabled={status === "sending"} /></label>
      <label><span>Work email</span><input type="email" name="email" placeholder="you@organisation.org" required disabled={status === "sending"} /></label>
      <button className="button button--dark" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : <>Start a {tier.toLowerCase()} partnership <span aria-hidden="true">↗</span></>}
      </button>
      {status === "error" && <p className="form-error" role="alert">Something went wrong — please try again in a moment.</p>}
    </form>
  );
}

/** Thumb-reach giving bar for phones, shown once the hero has scrolled away. */
export function MobileGiveBar({ onSupport, hidden }: { onSupport: () => void; hidden: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight * 0.85);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className={`mobile-give ${visible && !hidden ? "is-visible" : ""}`} aria-hidden={!visible || hidden}>
      <div><span>CLIMB KILI 2027</span><b>12 homes · US$1M</b></div>
      <button className="button button--orange" type="button" onClick={onSupport} tabIndex={visible && !hidden ? 0 : -1}>Give <span aria-hidden="true">↗</span></button>
    </div>
  );
}

/** Live raised-vs-goal readout; falls back to the Givebutter widget until the API answers. */
export function LiveTotal({ stats, tone = "dark" }: { stats: CampaignStats | null; tone?: "dark" | "light" }) {
  if (!stats) {
    return (
      <div className={`live-total live-total--${tone} live-total--fallback`}>
        <givebutter-widget id="gOKyBe" account={givebutterAccount} />
        <a href={givingUrl} target="_blank" rel="noopener noreferrer">See the live total on Givebutter <span aria-hidden="true">↗</span></a>
      </div>
    );
  }
  const share = Math.min(100, (stats.raised / stats.goal) * 100);
  return (
    <div className={`live-total live-total--${tone}`}>
      <strong>{formatUsd(stats.raised)}</strong>
      <div className="live-total__bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(share)} aria-label="Share of the US$1M goal raised">
        <i style={{ width: `${Math.max(share, 1)}%` }} />
      </div>
      <small>{share.toFixed(1)}% of {formatUsd(stats.goal)}{stats.donors ? ` · ${stats.donors.toLocaleString("en-US")} donors` : ""}</small>
    </div>
  );
}

function DrawerTotal() {
  const stats = useCampaignStats();
  return (
    <div className="donation-live">
      <span>CAMPAIGN TOTAL · LIVE</span>
      <LiveTotal stats={stats} tone="light" />
    </div>
  );
}
