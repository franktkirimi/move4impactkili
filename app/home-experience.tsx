"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { altitudeStages, givingUrl } from "./campaign-data";
import ChallengeBuilder from "./challenge-builder";
import { useCampaignStats } from "./campaign-stats";
import GiftCalculator from "./gift-calculator";
import KiliRoute from "./kili-route";
import { DonationDrawer, Footer, LiveTotal, MobileGiveBar, PartnerForm, partnerTiers, SiteHeader } from "./site-ui";
import TeamRoster from "./team-roster";

const heroJumps = [
  ["01", "Trace the route", "0 → 5,895 m", "#route"],
  ["02", "Size your gift", "Dollars into altitude", "#gift"],
  ["03", "Meet the climbers", "Live from Givebutter", "#team"],
  ["04", "Start your challenge", "Make a share card", "#community"],
] as const;

/** Fades sections in as they enter the viewport; content stays visible without JS. */
function useReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    root.classList.add("reveal-ready");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px" });
    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);
}

export default function HomeExperience() {
  const [donationOpen, setDonationOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [partnerTier, setPartnerTier] = useState<string>("ASCENT");
  const stats = useCampaignStats();

  useReveal();

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <main className="campaign-site">
      <SiteHeader inverse onSupport={() => setDonationOpen(true)} />
      <aside className="altitude-rail" aria-label={`Page ascent ${Math.round(scrollProgress)} percent complete`}>
        <span className="altitude-rail__label">DIGITAL ASCENT</span>
        <div className="altitude-rail__track">
          <span className="altitude-rail__fill" style={{ height: `${scrollProgress}%` }} />
          {altitudeStages.map(([height], index) => (
            <span className="altitude-rail__tick" key={height} style={{ bottom: `${index * 25}%` }}>
              <b>{height}</b>
            </span>
          ))}
        </div>
        <strong>{Math.round((scrollProgress / 100) * 5895).toLocaleString()} M</strong>
      </aside>

      <section className="hero" id="top">
        <Image
          className="hero__image"
          src="/images/climb-kili-sunrise.png"
          alt="Three climbers ascending a mountain trail at sunrise"
          fill
          priority
          unoptimized
          sizes="100vw"
        />
        <div className="hero__veil" />
        <div className="topo topo--hero" aria-hidden="true" />
        <div className="hero__content">
          <p className="eyebrow eyebrow--orange">MOVE4IMPACT · KILIMANJARO 2027</p>
          <h1 className="hero__title"><span>CLIMB A</span><span>MOUNTAIN.</span><em>BUILD A HOME.</em></h1>
          <p className="hero__copy">In 2027, a team of athletes will run, climb and raise US$1 million to help build 12 family-style homes for children in Zimbabwe.</p>
          <div className="hero__actions">
            <button className="button button--orange" type="button" onClick={() => setDonationOpen(true)}>Support the climb <span aria-hidden="true">↗</span></button>
            <a className="button button--ghost" href="#route">Start the ascent <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className="hero__metrics hero__metrics--live" aria-label="Live campaign total">
          <span>RAISED · LIVE FROM GIVEBUTTER · <a href={givingUrl} target="_blank" rel="noopener noreferrer">VIEW THE CAMPAIGN <span aria-hidden="true">↗</span></a></span>
          <LiveTotal stats={stats} />
        </div>
        <nav className="hero__jumps" aria-label="Explore the campaign">
          {heroJumps.map(([number, title, detail, href]) => (
            <a href={href} key={href}><span>{number}</span><b>{title}</b><small>{detail}</small><i aria-hidden="true">↘</i></a>
          ))}
        </nav>
      </section>

      <section className="kinetic" id="commitment" aria-label="Campaign values">
        <div className="kinetic__line"><span>CLIMB</span><i>·</i><span>ENDURE</span><i>·</i><span>BUILD</span><i>·</i><span>BELIEVE</span><i>·</i><span>MOVE</span><i>·</i></div>
        <div className="kinetic__statement">
          <span>0 M · THE COMMITMENT</span>
          <p>TWENTY ATHLETES. ONE MOUNTAIN. TWELVE NEW HOMES. ONE MILLION DOLLARS FOR CHILDREN IN ZIMBABWE.</p>
        </div>
      </section>

      <KiliRoute raised={stats?.raised} />

      <section className="why section-light" id="why">
        <div className="section-index">02 / WHY WE CLIMB</div>
        <div className="why__heading" data-reveal>
          <p className="eyebrow">THE TRUE DESTINATION</p>
          <h2>THE SUMMIT IS NOT<br />THE DESTINATION.<br /><em>HOME IS.</em></h2>
        </div>
        <div className="parallel-stories" data-reveal>
          <article className="parallel-card parallel-card--athlete">
            <div className="parallel-card__visual">
              <Image className="parallel-card__image" src="/images/climb-kili-trail.png" alt="A climber moving uphill on a rocky trail" fill sizes="(max-width: 760px) 100vw, 45vw" />
              <span>EXPEDITION TRAINING</span><b>STRAP IN.</b>
            </div>
            <p><span>THE ATHLETE</span>Fastens a pack. Takes the next uphill step. Learns to keep moving when the easy answer is to stop.</p>
          </article>
          <div className="parallel-link" aria-hidden="true"><span /><b>ONE<br />MOVEMENT</b><span /></div>
          <article className="parallel-card parallel-card--home">
            <div className="parallel-card__visual">
              <Image className="parallel-card__image" src="/images/eden-homes-aerial.jpg" alt="Aerial view of the Eden campus and family-style homes in Zimbabwe" fill sizes="(max-width: 760px) 100vw, 45vw" />
              <span>EDEN CAMPUS · ZIMBABWE</span><b>BUILD OUT.</b>
            </div>
            <p><span>THE HOME</span>A caregiver opens a door. A child begins a school day. Another brick becomes part of a stable future.</p>
          </article>
        </div>
        <div className="why__manifesto">
          <p>Every gift helps move the campaign toward family-style care, education, health, belonging and long-term opportunity—communicated with dignity, hope and respect.</p>
          <button className="text-link text-link--dark" type="button" onClick={() => setDonationOpen(true)}>Build a home <span aria-hidden="true">↗</span></button>
        </div>
      </section>

      <GiftCalculator stats={stats} />

      <TeamRoster stats={stats} />

      <ChallengeBuilder />

      <section className="partners section-glacier" id="partners">
        <div className="section-index">06 / PARTNERS</div>
        <div className="partners__intro" data-reveal><div><p className="eyebrow">BUILD WITH US</p><h2>THE MOUNTAIN<br />TAKES A <em>TEAM.</em></h2></div><p>Corporate sponsors, churches, schools, fitness communities, brands and builders can each move a different part of the campaign forward.</p></div>
        <div className="partner-tiers">
          {partnerTiers.map(([title, label, copy], index) => (
            <button type="button" className={partnerTier === title ? "partner-tier active" : "partner-tier"} aria-pressed={partnerTier === title} key={title} onClick={() => setPartnerTier(title)}>
              <span>0{index + 1}</span><h3>{title}</h3><b>{label}</b><p>{copy}</p><small>{partnerTier === title ? "Selected ✓" : "Select this level"}</small>
            </button>
          ))}
        </div>
        <div className="partner-enquiry" data-reveal>
          <div><span>PARTNERSHIP ENQUIRY</span><h3>Let’s build<br />something lasting.</h3><p>Tell us who you are and the level you’re considering. Details for each level are shared directly by the campaign team.</p></div>
          <PartnerForm tier={partnerTier} onTierChange={setPartnerTier} />
        </div>
      </section>

      <section className="pathways section-orange">
        <div className="section-index">07 / CHOOSE YOUR CLIMB</div>
        <h2>HOW WILL YOU<br /><em>MOVE THE MOUNTAIN?</em></h2>
        <div className="pathway-list">
          {[
            ["01", "Give", "Make a one-time or recurring contribution.", "Support the climb"],
            ["02", "Champion a climber", "Back a team member or fundraise alongside them.", "Meet the team"],
            ["03", "Start a challenge", "Walk, run, climb or cycle your own mountain.", "Build your challenge"],
            ["04", "Partner", "Join as a corporate, church, school or community partner.", "Start a partnership"],
          ].map(([number, title, copy, action], index) => (
            <button className="pathway" key={number} type="button" onClick={() => index === 0 ? setDonationOpen(true) : document.getElementById(index === 1 ? "team" : index === 2 ? "community" : "partners")?.scrollIntoView({ behavior: "smooth" })}>
              <span>{number}</span><h3>{title}</h3><p>{copy}</p><b>{action} ↗</b>
            </button>
          ))}
        </div>
      </section>


      <section className="finale">
        <div className="finale__mountain" aria-hidden="true" />
        <div className="finale__homes" aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <i key={index} />)}</div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="finale__badge" src="/brand/kilimanjaro-hope-rising.png" alt="Kilimanjaro 2027 · Hope Rising" width={900} height={634} loading="lazy" />
        <p className="eyebrow eyebrow--orange">5,895 M → HOME</p>
        <h2>THE SUMMIT IS<br />A MILESTONE.<br /><em>THE HOMES ARE<br />THE VICTORY.</em></h2>
        <p>Every step, gift, kilometre and shared story moves the campaign closer to twelve new homes.</p>
        <div><button className="button button--orange" type="button" onClick={() => setDonationOpen(true)}>Support the climb <span aria-hidden="true">↗</span></button><a className="button button--ghost" href="#partners">Become a campaign partner <span aria-hidden="true">↑</span></a></div>
      </section>

      <Footer />
      <DonationDrawer open={donationOpen} onClose={() => setDonationOpen(false)} />
      <MobileGiveBar onSupport={() => setDonationOpen(true)} hidden={donationOpen} />
    </main>
  );
}
