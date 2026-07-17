"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

const nav = [
  ["Why We Climb", "/#why"],
  ["The Team", "/#team"],
  ["Impact", "/impact"],
  ["Wear the Movement", "/apparel"],
  ["Updates", "/#updates"],
  ["Partners", "/#partners"],
] as const;

export function Mark({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link className={`mark ${inverse ? "mark--inverse" : ""}`} href="/" aria-label="Move4Impact Climb Kili home">
      <span className="mark__m">M4I</span>
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
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [amount, setAmount] = useState("100");

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
        <div className="donation-live">
          <span>CAMPAIGN TOTAL</span>
          <strong>[Current amount raised]</strong>
          <small>Verified live total will connect here.</small>
        </div>
        <div className="segmented" aria-label="Donation frequency">
          <button className={frequency === "once" ? "active" : ""} onClick={() => setFrequency("once")}>One time</button>
          <button className={frequency === "monthly" ? "active" : ""} onClick={() => setFrequency("monthly")}>Monthly</button>
        </div>
        <div className="amounts" aria-label="Choose an amount">
          {["50", "100", "250"].map((value) => (
            <button className={amount === value ? "active" : ""} key={value} onClick={() => setAmount(value)}>US${value}</button>
          ))}
          <button className={amount === "custom" ? "active" : ""} onClick={() => setAmount("custom")}>Other</button>
        </div>
        <button className="button button--orange button--wide donation-submit" type="button" disabled>
          Verified checkout link pending
        </button>
        <p className="drawer-note">Payment processing will open on the campaign’s verified fundraising platform. No payment details are collected by this preview.</p>
      </aside>
    </div>
  );
}

export function InterestForm({ kind = "campaign kit" }: { kind?: string }) {
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  if (sent) {
    return <div className="form-success" role="status"><span>✓</span> Interest noted in this prototype. Connect the final form endpoint before launch.</div>;
  }
  return (
    <form className="interest-form" onSubmit={submit}>
      <label>
        <span>Email address</span>
        <input type="email" name="email" placeholder="you@example.com" required />
      </label>
      <button className="button button--orange" type="submit">Reserve {kind} <span aria-hidden="true">↗</span></button>
    </form>
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
          <Link href="/#why">Why we climb</Link>
          <Link href="/#team">The team</Link>
          <Link href="/impact">Impact</Link>
          <Link href="/apparel">Campaign kit</Link>
        </div>
        <div className="footer__links">
          <a href="mailto:[campaign-email]">[Campaign email]</a>
          <span>[Instagram]</span>
          <span>[YouTube]</span>
          <span>[LinkedIn]</span>
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
