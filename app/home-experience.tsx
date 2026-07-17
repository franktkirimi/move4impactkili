"use client";

import Image from "next/image";
import Link from "next/link";
import { CSSProperties, useEffect, useState } from "react";
import { altitudeStages, climbers, impactProjects, products, trailUpdates } from "./campaign-data";
import { DonationDrawer, Footer, InterestForm, SiteHeader } from "./site-ui";

export default function HomeExperience() {
  const [donationOpen, setDonationOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [impactId, setImpactId] = useState<(typeof impactProjects)[number]["id"]>("homes");
  const [challenge, setChallenge] = useState("59 KM WALK");
  const impact = impactProjects.find((item) => item.id === impactId) ?? impactProjects[0];

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
          src="/climb-kili-hero.png"
          alt="A team of climbers ascending a volcanic trail toward Mount Kilimanjaro before sunrise"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero__veil" />
        <div className="topo topo--hero" aria-hidden="true" />
        <div className="hero__content">
          <p className="eyebrow eyebrow--orange">MOVE4IMPACT · KILIMANJARO 2027</p>
          <h1>CLIMB A<br />MOUNTAIN.<br /><em>BUILD A HOME.</em></h1>
          <p className="hero__copy">In 2027, a team of athletes will run, climb and raise US$1 million to help build 12 family-style homes for children in Zimbabwe.</p>
          <div className="hero__actions">
            <button className="button button--orange" type="button" onClick={() => setDonationOpen(true)}>Support the climb <span aria-hidden="true">↗</span></button>
            <a className="button button--ghost" href="#team">Meet the team <span aria-hidden="true">↓</span></a>
            <Link className="text-link" href="/apparel">Wear the movement <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <div className="hero__metrics" aria-label="Campaign statistics">
          <div><span>RAISED</span><strong>[Current amount]</strong><small>OF US$1M</small></div>
          <div><span>CHAMPIONS</span><strong>[Supporters]</strong><small>LIVE COUNT</small></div>
          <div><span>DEPARTURE</span><strong>[Date]</strong><small>CONFIRMED DATE</small></div>
        </div>
        <div className="hero__caption"><span>ORIGINAL CAMPAIGN VISUAL</span><span>5895 M · TANZANIA</span></div>
        <a className="scroll-cue" href="#commitment" aria-label="Begin the digital ascent"><span />SCROLL TO ASCEND</a>
      </section>

      <section className="kinetic" id="commitment" aria-label="Campaign values">
        <div className="kinetic__line"><span>CLIMB</span><i>·</i><span>ENDURE</span><i>·</i><span>BUILD</span><i>·</i><span>BELIEVE</span><i>·</i><span>MOVE</span><i>·</i></div>
        <div className="kinetic__statement">
          <span>0 M · THE COMMITMENT</span>
          <p>TWENTY ATHLETES. ONE MOUNTAIN. TWELVE NEW HOMES. ONE MILLION DOLLARS FOR CHILDREN IN ZIMBABWE.</p>
        </div>
      </section>

      <section className="challenge section-dark" id="challenge">
        <div className="section-index">01 / THE CHALLENGE</div>
        <div className="challenge__number">5,895<span>M</span></div>
        <div className="challenge__body">
          <p className="eyebrow eyebrow--blue">MOUNT KILIMANJARO · TANZANIA</p>
          <h2>HIGHER THAN<br />THE BODY WANTS<br />TO GO.</h2>
          <p>Months of endurance work. Thin air. Long days. A physical, mental and spiritual commitment carried by a team that understands the climb is only a symbol.</p>
        </div>
        <div className="challenge__data">
          <div><span>ROUTE</span><strong>[Confirmed route]</strong></div>
          <div><span>TRAINING</span><strong>Endurance · strength · ascent</strong></div>
          <div><span>EXPEDITION</span><strong>[Confirmed campaign date]</strong></div>
        </div>
        <div className="challenge__line">5,895 METRES ABOVE SEA LEVEL. <em>TWELVE HOMES CLOSER TO REALITY.</em></div>
      </section>

      <section className="why section-light" id="why">
        <div className="section-index">02 / WHY WE CLIMB</div>
        <div className="why__heading">
          <p className="eyebrow">THE TRUE DESTINATION</p>
          <h2>THE SUMMIT IS NOT<br />THE DESTINATION.<br /><em>HOME IS.</em></h2>
        </div>
        <div className="parallel-stories">
          <article className="parallel-card parallel-card--athlete">
            <div className="parallel-card__visual"><span>CAMPAIGN FILM PLACEHOLDER</span><b>STRAP IN.</b></div>
            <p><span>THE ATHLETE</span>Fastens a pack. Takes the next uphill step. Learns to keep moving when the easy answer is to stop.</p>
          </article>
          <div className="parallel-link" aria-hidden="true"><span /><b>ONE<br />MOVEMENT</b><span /></div>
          <article className="parallel-card parallel-card--home">
            <div className="parallel-card__visual"><span>APPROVED IMPACT MEDIA</span><b>BUILD OUT.</b></div>
            <p><span>THE HOME</span>A caregiver opens a door. A child begins a school day. Another brick becomes part of a stable future.</p>
          </article>
        </div>
        <div className="why__manifesto">
          <p>Every gift helps move the campaign toward family-style care, education, health, belonging and long-term opportunity—communicated with dignity, hope and respect.</p>
          <button className="text-link text-link--dark" type="button" onClick={() => setDonationOpen(true)}>Build a home <span aria-hidden="true">↗</span></button>
        </div>
      </section>

      <section className="impact section-glacier" id="impact">
        <div className="section-index">03 / THE US$1 MILLION PLAN</div>
        <div className="impact__intro">
          <div>
            <p className="eyebrow">TRANSPARENCY, BUILT IN</p>
            <h2>ONE TARGET.<br /><em>A VILLAGE OF PROGRESS.</em></h2>
          </div>
          <p>Explore the planned campus structure. Final budgets, drawings and construction stages connect here only after approval.</p>
        </div>
        <div className="campus">
          <div className="campus__plan">
            <div className="topo topo--campus" aria-hidden="true" />
            <span className="campus__north">N ↑</span>
            <span className="campus__coordinate">EDEN CAMPUS · ZIMBABWE<br />[CONFIRMED COORDINATES]</span>
            {impactProjects.map((project, index) => (
              <button
                key={project.id}
                type="button"
                className={`campus-node campus-node--${index + 1} ${impactId === project.id ? "active" : ""}`}
                onClick={() => setImpactId(project.id)}
                aria-pressed={impactId === project.id}
              >
                <span>{project.number}</span><b>{project.title}</b>
              </button>
            ))}
            <div className="home-cluster" aria-hidden="true">
              {Array.from({ length: 12 }, (_, index) => <i key={index} style={{ "--i": index } as CSSProperties} />)}
            </div>
          </div>
          <aside className="campus__detail" aria-live="polite">
            <span className="campus__detail-number">{impact.number}</span>
            <p className="eyebrow eyebrow--orange">SELECTED PROJECT</p>
            <h3>{impact.title}</h3>
            <p>{impact.purpose}</p>
            <dl>
              <div><dt>Allocation</dt><dd>{impact.allocation}</dd></div>
              <div><dt>Funding status</dt><dd>{impact.status}</dd></div>
              <div><dt>Current stage</dt><dd>{impact.stage}</dd></div>
              <div><dt>Intended impact</dt><dd>{impact.impact}</dd></div>
            </dl>
            <Link className="text-link text-link--dark" href="/impact">See the full impact plan <span aria-hidden="true">↗</span></Link>
          </aside>
        </div>
      </section>

      <section className="ascent section-dark" id="ascent">
        <div className="section-index">04 / FUNDRAISING ASCENT</div>
        <div className="ascent__copy">
          <p className="eyebrow eyebrow--orange">LIVE CAMPAIGN MOMENTUM</p>
          <h2>EVERY GIFT<br /><em>MOVES US HIGHER.</em></h2>
          <p>Fundraising progress becomes altitude, construction progress and visible momentum. This preview waits for the verified campaign feed.</p>
          <button className="button button--orange" type="button" onClick={() => setDonationOpen(true)}>Move us higher <span aria-hidden="true">↗</span></button>
        </div>
        <div className="ascent__route">
          <div className="route-axis">
            <span className="route-axis__fill" />
            {altitudeStages.map(([height, label], index) => (
              <div className="route-stage" key={height} style={{ bottom: `${index * 24}%` }}>
                <i /><b>{height}</b><span>{label}</span>
              </div>
            ))}
            <div className="route-marker"><span>LIVE FEED<br />CONNECTS HERE</span></div>
          </div>
          <div className="ascent__total">
            <span>TOTAL RAISED</span>
            <strong>[Current amount]</strong>
            <small>OF US$1,000,000</small>
            <div className="ascent__next"><b>NEXT MILESTONE</b><span>[Confirmed funding milestone]</span></div>
          </div>
        </div>
      </section>

      <section className="team section-light" id="team">
        <div className="section-index">05 / MEET THE CLIMBERS</div>
        <div className="team__intro">
          <div><p className="eyebrow">THE EXPEDITION TEAM</p><h2>TWENTY REASONS<br />TO <em>KEEP MOVING.</em></h2></div>
          <p>Every climber carries a personal story, training commitment and fundraising target. Athlete data remains visibly pending until the roster is approved.</p>
        </div>
        <div className="climber-grid">
          {climbers.map((climber, index) => (
            <article className={`climber-card climber-card--${climber.accent}`} key={climber.slug}>
              <Link href={index === 0 ? `/team/${climber.slug}` : "#team"} className="climber-card__visual" aria-label={`View ${climber.name} profile`}>
                <span className="climber-card__index">0{index + 1} / 20</span>
                <span className="climber-card__placeholder">APPROVED<br />ATHLETE<br />PORTRAIT</span>
                <b>{climber.name}</b>
              </Link>
              <div className="climber-card__content">
                <span>{climber.location}</span>
                <p>{climber.reason}</p>
                <div className="climber-card__metrics">
                  <div><small>RAISED</small><b>{climber.raised}</b></div>
                  <div><small>TRAINED</small><b>{climber.trained}</b></div>
                </div>
                {index === 0 ? <Link className="text-link text-link--dark" href={`/team/${climber.slug}`}>Support {climber.name.split(" ")[0]}’s climb <span aria-hidden="true">↗</span></Link> : <span className="text-link text-link--muted">Profile publishing soon</span>}
              </div>
            </article>
          ))}
        </div>
        <div className="team__footer"><span>01—04 / 20</span><div className="team__rule" /><button type="button" disabled>Full roster pending</button></div>
      </section>

      <section className="trail section-blue" id="updates">
        <div className="section-index">06 / FROM THE TRAIL</div>
        <div className="trail__headline">
          <div><p className="eyebrow">CAMPAIGN JOURNAL</p><h2>A MOVEMENT,<br /><em>STILL IN MOTION.</em></h2></div>
          <span className="live-pill"><i /> LIVE FEED READY</span>
        </div>
        <div className="update-grid">
          {trailUpdates.map((update, index) => (
            <article className={`update-card update-card--${index + 1}`} key={update.tag}>
              <div className="update-card__media"><span>{update.marker}</span><b>{index === 0 ? "15.0" : index === 1 ? "$" : "12"}</b><small>{index === 0 ? "KM" : index === 1 ? "MOMENTUM" : "HOMES"}</small></div>
              <div className="update-card__copy"><span>{update.tag}</span><h3>{update.title}</h3><p>{update.copy}</p><button className="text-link text-link--dark" type="button">Open field note <span aria-hidden="true">↗</span></button></div>
            </article>
          ))}
        </div>
      </section>

      <section className="wear section-dark" id="wear">
        <div className="section-index">07 / WEAR THE MOVEMENT</div>
        <div className="wear__intro">
          <div><p className="eyebrow eyebrow--orange">THE CLIMB KILI KIT</p><h2>BUILT TO MOVE.<br /><em>WORN WITH PURPOSE.</em></h2></div>
          <p>Campaign identity made physical. Every final product will show its verified contribution to the campaign before orders open.</p>
        </div>
        <div className="product-grid">
          {products.map((product, index) => (
            <article className={`product-card product-card--${index + 1}`} key={product.code}>
              <div className="product-card__visual">
                <span>{product.code}</span>
                <div className="garment-shape" aria-hidden="true"><i /></div>
                <small>CAMPAIGN PRODUCT VISUAL PLACEHOLDER</small>
              </div>
              <div className="product-card__copy">
                <span>{product.type}</span><h3>{product.name}</h3>
                <dl><div><dt>Colours</dt><dd>{product.colours}</dd></div><div><dt>Sizes</dt><dd>{product.sizes}</dd></div></dl>
                <div className="product-card__bottom"><b>{product.price}</b><span>{product.status}</span></div>
              </div>
            </article>
          ))}
        </div>
        <div className="wear__form"><div><span>EARLY ACCESS</span><p>Be first to know when the verified kit, pricing and contribution details are ready.</p></div><InterestForm /></div>
        <Link className="button button--ghost" href="/apparel">Enter the lookbook <span aria-hidden="true">↗</span></Link>
      </section>

      <section className="pathways section-orange">
        <div className="section-index">08 / CHOOSE YOUR CLIMB</div>
        <h2>HOW WILL YOU<br /><em>MOVE THE MOUNTAIN?</em></h2>
        <div className="pathway-list">
          {[
            ["01", "Give", "Make a one-time or recurring contribution.", "Support the climb"],
            ["02", "Champion a climber", "Back a team member or fundraise alongside them.", "Meet the team"],
            ["03", "Wear the movement", "Reserve campaign kit built for motion.", "Enter the lookbook"],
            ["04", "Partner", "Join as a corporate, church, school or community partner.", "Start a partnership"],
          ].map(([number, title, copy, action], index) => (
            <button className="pathway" key={number} type="button" onClick={() => index === 0 ? setDonationOpen(true) : document.getElementById(index === 1 ? "team" : index === 2 ? "wear" : "partners")?.scrollIntoView({ behavior: "smooth" })}>
              <span>{number}</span><h3>{title}</h3><p>{copy}</p><b>{action} ↗</b>
            </button>
          ))}
        </div>
      </section>

      <section className="community section-light" id="community">
        <div className="section-index">09 / MOVE YOUR MOUNTAIN</div>
        <div className="community__intro">
          <div><p className="eyebrow">YOUR CHALLENGE. SHARED PURPOSE.</p><h2>NOT EVERY CLIMB<br />NEEDS A <em>SUMMIT.</em></h2></div>
          <p>Choose a challenge that asks something real of you. Track the distance, share the story and turn your movement into support.</p>
        </div>
        <div className="challenge-builder">
          <div className="challenge-builder__choices">
            <span>01 · CHOOSE YOUR MOVEMENT</span>
            {["59 KM WALK", "100 KM RUN", "LOCAL CLIMB", "CYCLE 589 KM"].map((item) => <button type="button" className={challenge === item ? "active" : ""} key={item} onClick={() => setChallenge(item)}><i />{item}<b>↗</b></button>)}
          </div>
          <div className="challenge-preview">
            <span className="challenge-preview__tag">MOVE4IMPACT · COMMUNITY CHALLENGE</span>
            <strong>{challenge.split(" ")[0]}</strong><b>{challenge.split(" ").slice(1).join(" ")}</b>
            <p>MY MOUNTAIN.<br />OUR MOVEMENT.</p>
            <div className="fake-qr" aria-label="QR code placeholder">M4I<br />QR</div>
            <small>PERSONAL PAGE · TRACKER · BADGE · SHARE IMAGE</small>
          </div>
          <div className="challenge-builder__action">
            <span>02 · SET YOUR TARGET</span><p>[Fundraising target]</p><button className="button button--dark" type="button">Create your challenge <span aria-hidden="true">↗</span></button><small>Interface preview. Account and fundraising setup will connect before launch.</small>
          </div>
        </div>
      </section>

      <section className="partners section-glacier" id="partners">
        <div className="section-index">10 / PARTNERS</div>
        <div className="partners__intro"><div><p className="eyebrow">BUILD WITH US</p><h2>THE MOUNTAIN<br />TAKES A <em>TEAM.</em></h2></div><p>Corporate sponsors, churches, schools, fitness communities, brands and builders can each move a different part of the campaign forward.</p></div>
        <div className="partner-tiers">
          {[
            ["TRAIL", "Community movement", "Activate people, places and local challenges."],
            ["ASCENT", "Campaign momentum", "Fuel training, storytelling and fundraising reach."],
            ["SUMMIT", "Expedition platform", "Help carry the team to Kilimanjaro and amplify the mission."],
            ["VILLAGE BUILDER", "The lasting victory", "Help turn approved construction plans into family-style homes."],
          ].map(([title, label, copy], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><b>{label}</b><p>{copy}</p><small>[Partner level details]</small></article>)}
        </div>
        <div className="partner-proof"><span>PARTNER IDENTITIES WILL APPEAR HERE WITH RESTRAINT</span><div /><div /><div /><button className="button button--dark" type="button">Become a campaign partner <span aria-hidden="true">↗</span></button></div>
      </section>

      <section className="finale">
        <div className="finale__mountain" aria-hidden="true" />
        <div className="finale__homes" aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <i key={index} />)}</div>
        <p className="eyebrow eyebrow--orange">5,895 M → HOME</p>
        <h2>THE SUMMIT IS<br />A MILESTONE.<br /><em>THE HOMES ARE<br />THE VICTORY.</em></h2>
        <p>Every step, gift, kilometre and shared story moves the campaign closer to twelve new homes.</p>
        <div><button className="button button--orange" type="button" onClick={() => setDonationOpen(true)}>Support the climb <span aria-hidden="true">↗</span></button><a className="button button--ghost" href="#partners">Become a campaign partner <span aria-hidden="true">↑</span></a></div>
      </section>

      <Footer />
      <DonationDrawer open={donationOpen} onClose={() => setDonationOpen(false)} />
    </main>
  );
}
