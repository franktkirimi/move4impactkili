"use client";

import Link from "next/link";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { givebutterAccount, givingUrl } from "./campaign-data";

export function GivebutterEmbed({ id = "gOKyBe", fallback }: { id?: string; fallback?: ReactNode }) {
  return fallback === null ? null : (
    <span className="gb-slot">
      <givebutter-widget id={id} account={givebutterAccount} />
    </span>
  );
}

const nav = [
  ["The Expedition", "/#challenge"],
  ["Why We Climb", "/#mission"],
  ["Climbers", "/#team"],
  ["Transparency", "/#transparency"],
] as const;

export function Mark({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link className={`mark ${inverse ? "mark--inverse" : ""}`} href="/" aria-label="Move4Impact Climb Kili home">
      <Image className="mark__logo" src="/images/move4impact-logo-orange.png" alt="Move4Impact" width={146} height={64} priority unoptimized />
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
          Help build a home
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
            Help build a home
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
        <div className="drawer-kicker"><span>MOVE4IMPACT</span><b>5,895 M → HOME</b></div>
        <div className="eyebrow eyebrow--orange">MOVE US HIGHER</div>
        <h2 id="donation-title">YOUR GIFT<br /><em>BUILDS HOME.</em></h2>
        <p>{climber ? `Support ${climber}’s verified personal climb.` : "Back the team’s US$1 million mission for twelve family-style homes."}</p>
        <div className="donation-live donation-live--widget">
          <div className="donation-live__heading"><span>LIVE CAMPAIGN</span><small>GOAL · US$1,000,000</small></div>
          <GivebutterEmbed />
        </div>
        <div className="drawer-proof" aria-label="Donation assurances">
          <div><b>01</b><span>Verified<br />campaign</span></div>
          <div><b>02</b><span>Secure<br />checkout</span></div>
          <div><b>03</b><span>Mission-first<br />giving</span></div>
        </div>
        <a className="button button--orange button--wide donation-submit" href={givingUrl} target="_blank" rel="noopener noreferrer">
          Make your gift
        </a>
        <p className="drawer-note">
          Checkout is securely handled by Givebutter. Athletes cover expedition costs separately, so public peer-to-peer gifts support Eden Ministries.{" "}
          <a href={givingUrl} target="_blank" rel="noopener noreferrer">View campaign details <span aria-hidden="true">↗</span></a>
        </p>
      </aside>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <Mark inverse />
        <div>
          <p>Twenty athletes. One mountain.<br />Twelve new homes.</p>
        </div>
        <div className="footer__links">
          <Link href="/#mission">Why we climb</Link>
          <Link href="/#team">The team</Link>
          <Link href="/#transparency">Transparency</Link>
          <a href={givingUrl} target="_blank" rel="noopener noreferrer">Donate</a>
        </div>
        <div className="footer__links">
          <a href="mailto:news@eden-ministries.org">news@eden-ministries.org</a>
          <a href="https://eden-ministries.org/" target="_blank" rel="noopener noreferrer">Eden Ministries</a>
          <a href="https://www.linkedin.com/company/eden-ministries" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={givingUrl} target="_blank" rel="noopener noreferrer">Givebutter</a>
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
