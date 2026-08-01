"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { altitudeStages, climbers, givingUrl } from "./campaign-data";
import LivingImpactVisualizer from "./living-impact-visualizer";
import { DonationDrawer, Footer, GivebutterEmbed, SiteHeader } from "./site-ui";

export default function HomeExperience() {
  const [donationOpen, setDonationOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

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
            <span className="altitude-rail__tick" key={height} style={{ bottom: `${index * 25}%` }}><b>{height}</b></span>
          ))}
        </div>
        <strong>{Math.round((scrollProgress / 100) * 5895).toLocaleString()} M</strong>
      </aside>

      <section className="hero" id="top">
        <Image className="hero__image" src="/images/climb-kili-sunrise.png" alt="Three climbers ascending a mountain trail at sunrise" fill priority unoptimized sizes="100vw" />
        <div className="hero__veil" />
        <div className="topo topo--hero" aria-hidden="true" />
        <div className="hero__content">
          <p className="eyebrow eyebrow--orange">MOVE4IMPACT · KILIMANJARO 2027</p>
          <h1>CLIMB A<br />MOUNTAIN.<br /><em>BUILD A HOME.</em></h1>
          <p className="hero__copy">Twenty athletes. A marathon and an eight-day ascent. One US$1 million mission to help build twelve family-style homes in Zimbabwe.</p>
          <div className="hero__actions">
            <button className="button button--orange" type="button" onClick={() => setDonationOpen(true)}>Support the climb <span aria-hidden="true">↗</span></button>
            <a className="button button--ghost" href="#mission">Why we climb <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className="hero__metrics hero__metrics--live" aria-label="Live campaign total">
          <span>RAISED · LIVE FROM GIVEBUTTER</span>
          <GivebutterEmbed id="gOKyBe" />
          <small>OF US$1,000,000 · <a href={givingUrl} target="_blank" rel="noopener noreferrer">VIEW CAMPAIGN ↗</a></small>
        </div>
        <div className="hero__caption"><span>LEMOSHO ROUTE · MARCH 2027</span><span>5,895 M · TANZANIA</span></div>
        <a className="scroll-cue" href="#challenge" aria-label="Begin the digital ascent"><span />SCROLL TO ASCEND</a>
      </section>

      <section className="challenge section-dark" id="challenge">
        <div className="section-index">01 / THE CHALLENGE</div>
        <div className="challenge__number">5,895<span>M</span></div>
        <div className="challenge__body">
          <p className="eyebrow eyebrow--blue">THE ROOF OF AFRICA</p>
          <h2>RUN AT THE BASE.<br />CLIMB TO<br /><em>THE SUMMIT.</em></h2>
          <p>On 21 March 2027, the team takes on the Kilimanjaro Marathon. The next day, the eight-day Lemosho ascent begins—through five climate zones toward an Easter Sunday summit.</p>
        </div>
        <div className="challenge__data">
          <div><span>TEAM</span><strong>20 athletes</strong></div>
          <div><span>ROUTE</span><strong>Lemosho · eight days</strong></div>
          <div><span>SUMMIT</span><strong>28 March 2027</strong></div>
        </div>
        <div className="challenge__line">THE SUMMIT IS A MILESTONE. <em>THE HOMES ARE THE VICTORY.</em></div>
      </section>

      <section className="why section-light" id="mission">
        <div className="section-index">02 / WHY WE CLIMB</div>
        <div className="why__heading">
          <p className="eyebrow">THE TRUE DESTINATION</p>
          <h2>THE SUMMIT IS NOT<br />THE DESTINATION.<br /><em>HOME IS.</em></h2>
        </div>
        <div className="parallel-stories">
          <article className="parallel-card parallel-card--athlete">
            <div className="parallel-card__visual"><Image className="parallel-card__image" src="/images/climb-kili-trail.png" alt="A climber moving uphill on a rocky trail" fill sizes="(max-width: 760px) 100vw, 45vw" /><span>THE EXPEDITION</span><b>ENDURE.</b></div>
            <p><span>THE ATHLETE</span>Trains, climbs and invites a community to move toward something larger than a summit.</p>
          </article>
          <div className="parallel-link" aria-hidden="true"><span /><b>ONE<br />MOVEMENT</b><span /></div>
          <article className="parallel-card parallel-card--home">
            <div className="parallel-card__visual"><Image className="parallel-card__image" src="/images/eden-homes-aerial.jpg" alt="Aerial view of the Eden campus and family-style homes in Zimbabwe" fill sizes="(max-width: 760px) 100vw, 45vw" /><span>EDEN · ZIMBABWE</span><b>BELONG.</b></div>
            <p><span>THE HOME</span>A place for consistent care, school mornings, shared meals and the ordinary confidence of belonging.</p>
          </article>
        </div>
        <div className="why__manifesto">
          <p>Every gift helps move Eden Ministries toward twelve new family-style homes—built around dignity, care and long-term opportunity.</p>
          <button className="text-link text-link--dark" type="button" onClick={() => setDonationOpen(true)}>Help build home ↗</button>
        </div>
      </section>

      <LivingImpactVisualizer onDonate={() => setDonationOpen(true)} />

      <section className="team section-light" id="team">
        <div className="section-index">03 / MEET THE CLIMBERS</div>
        <div className="team__intro">
          <div><p className="eyebrow">THE ANNOUNCED TEAM</p><h2>SEVEN CLIMBERS.<br />ONE <em>SHARED PURPOSE.</em></h2></div>
          <p>Each athlete is working toward a US$50,000 target. Support them directly through their verified Givebutter profiles.</p>
        </div>
        <div className="climber-grid">
          {climbers.map((climber, index) => (
            <article className={`climber-card climber-card--${climber.accent}`} key={climber.slug}>
              <a href={climber.profileUrl} target="_blank" rel="noopener noreferrer" className="climber-card__visual" aria-label={`Support ${climber.name} on Givebutter`}>
                {climber.image ? <Image className="climber-card__image" src={climber.image} alt={climber.imageAlt ?? `${climber.name} athlete portrait`} fill sizes="(max-width: 760px) 82vw, (max-width: 1100px) 50vw, 25vw" style={{ objectPosition: climber.imagePosition }} /> : null}
                <span className="climber-card__index">0{index + 1} / 07</span><b>{climber.name}</b>
              </a>
              <div className="climber-card__content">
                <span>{climber.location}</span><p>{climber.reason}</p>
                <div className="climber-card__metrics"><div><small>PERSONAL TARGET</small><b>{climber.target}</b></div><div><small>STATUS</small><b>LIVE</b></div></div>
                <a className="text-link text-link--dark" href={climber.profileUrl} target="_blank" rel="noopener noreferrer">Support on Givebutter ↗</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="ascent section-dark" id="transparency">
        <div className="section-index">04 / PROGRESS & TRANSPARENCY</div>
        <div className="ascent__copy">
          <p className="eyebrow eyebrow--orange">PUBLIC GIFTS FUND THE MISSION</p>
          <h2>EVERY GIFT.<br /><em>ACCOUNTED FOR.</em></h2>
          <p>Athletes cover direct travel and expedition costs themselves or through separate sponsorships. Public peer-to-peer donations go to Eden Ministries rather than paying for the climb.</p>
          <a className="button button--orange" href={givingUrl} target="_blank" rel="noopener noreferrer">View verified campaign ↗</a>
        </div>
        <div className="ascent__total">
          <span>LIVE CAMPAIGN TOTAL</span>
          <div className="ascent__goal-widget"><GivebutterEmbed id="gOKyBe" /></div>
          <small>OF US$1,000,000</small>
          <div className="ascent__next"><b>CAMPAIGN STRUCTURE</b><span>20 athletes · US$50K target each</span></div>
        </div>
      </section>

      <section className="finale" id="donate">
        <div className="finale__mountain" aria-hidden="true" />
        <div className="finale__homes" aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <i key={index} />)}</div>
        <p className="eyebrow eyebrow--orange">5,895 M → HOME</p>
        <h2>THE SUMMIT IS<br />A MILESTONE.<br /><em>THE HOMES ARE<br />THE VICTORY.</em></h2>
        <p>Help turn twenty individual climbs into one shared movement toward twelve family-style homes.</p>
        <div><button className="button button--orange" type="button" onClick={() => setDonationOpen(true)}>Support the climb ↗</button><a className="button button--ghost" href="mailto:news@eden-ministries.org?subject=Climb%20Kili%202027">Contact the team ↗</a></div>
      </section>

      <Footer />
      <DonationDrawer open={donationOpen} onClose={() => setDonationOpen(false)} />
    </main>
  );
}
