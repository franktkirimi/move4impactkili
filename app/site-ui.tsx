"use client";

import Link from "next/link";
import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { givebutterAccount, givingUrl } from "./campaign-data";
import { saveInterest } from "./supabase";

export function GivebutterEmbed({ id, fallback }: { id: string; fallback?: ReactNode }) {
  const host = useRef<HTMLSpanElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const started = Date.now();
    const timer = window.setInterval(() => {
      const widget = host.current?.querySelector("givebutter-widget");
      if (widget?.shadowRoot?.textContent?.trim()) {
        window.clearInterval(timer);
      } else if (Date.now() - started > 6000) {
        window.clearInterval(timer);
        setFailed(true);
      }
    }, 800);
    return () => window.clearInterval(timer);
  }, [id]);

  if (failed) {
    return fallback === undefined ? (
      <a className="gb-fallback" href={givingUrl} target="_blank" rel="noopener noreferrer">
        LIVE TOTAL ON GIVEBUTTER <span aria-hidden="true">↗</span>
      </a>
    ) : (
      <>{fallback}</>
    );
  }
  return (
    <span className="gb-slot" ref={host}>
      <givebutter-widget id={id} account={givebutterAccount} />
    </span>
  );
}

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
        <div className="donation-live donation-live--widget">
          <span>CAMPAIGN TOTAL</span>
          <GivebutterEmbed id="gOKyBe" />
        </div>
        <div className="donation-widget">
          <GivebutterEmbed id="jNKVmq" fallback={null} />
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

export function InterestForm({ kind = "campaign kit" }: { kind?: string }) {
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
    return <div className="form-success" role="status"><span>✓</span> You’re on the list. We’ll email you when the {kind} is ready.</div>;
  }
  return (
    <form className="interest-form" onSubmit={submit}>
      <label>
        <span>Email address</span>
        <input type="email" name="email" placeholder="you@example.com" required disabled={status === "sending"} />
      </label>
      <button className="button button--orange" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Reserving…" : <>Reserve {kind} <span aria-hidden="true">↗</span></>}
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
