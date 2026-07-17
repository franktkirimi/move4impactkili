import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { climbers } from "../../campaign-data";
import RouteShell from "../../route-shell";

export function generateStaticParams() {
  return climbers.map((climber) => ({ slug: climber.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const climber = climbers.find((item) => item.slug === slug);
  return { title: climber ? `${climber.name} · Climber Profile` : "Climber Profile" };
}

export default async function ClimberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const climber = climbers.find((item) => item.slug === slug);
  if (!climber) notFound();
  const climberIndex = climbers.findIndex((item) => item.slug === slug);
  const nextClimber = climbers.slice(climberIndex + 1).find((item) => item.image) ?? climbers.find((item) => item.image && item.slug !== slug);

  return (
    <RouteShell climber={climber.name}>
      <header className="athlete-hero">
        <div className="athlete-hero__portrait">
          {climber.image ? <Image className="athlete-hero__image" src={climber.image} alt={climber.imageAlt ?? `${climber.name} athlete portrait`} fill priority sizes="(max-width: 760px) 100vw, 55vw" style={{ objectPosition: climber.imagePosition }} /> : <span>ATHLETE<br />ANNOUNCEMENT<br />PENDING</span>}
          <b>0{climberIndex + 1} / 20</b>
        </div>
        <div className="athlete-hero__copy"><p className="eyebrow eyebrow--orange">CLIMBER · KILIMANJARO 2027</p><h1>{climber.name.toUpperCase()}</h1><span>{climber.location}</span><blockquote>“{climber.reason}”</blockquote><a className="button button--orange" href={`#support-${climber.slug}`}>Support {climber.name.split(" ")[0]}’s climb <span aria-hidden="true">↓</span></a></div>
        <div className="athlete-hero__data"><span>PERSONAL CAMPAIGN</span><strong>{climber.raised}</strong><small>OF {climber.target}</small><div className="placeholder-progress"><i /></div><em>Verified personal feed connects here</em></div>
      </header>

      <section className="athlete-stats">
        <div><span>KILOMETRES TRAINED</span><strong>{climber.trained}</strong></div><div><span>ELEVATION GAINED</span><strong>{climber.elevation}</strong></div><div><span>LATEST UPDATE</span><strong>{climber.update}</strong></div><div><span>DAYS TO CLIMB</span><strong>[Days]</strong></div>
      </section>

      <section className="route-section athlete-story">
        <div className="section-index">01 / WHY I CLIMB</div>
        <div className="route-grid route-grid--intro"><div><p className="eyebrow">A PERSONAL COMMITMENT</p><h2>THE REASON<br /><em>BEHIND EACH STEP.</em></h2></div><div><p>[Approved personal story for {climber.name}. Include their connection to Move4Impact, the physical commitment ahead and what twelve new homes means to them.]</p><p>The final story should feel human and specific without overstating the athlete’s experience or speaking on behalf of children.</p></div></div>
      </section>

      <section className="route-section route-section--dark athlete-journal"><div className="section-index">02 / FIELD JOURNAL</div><div className="route-grid route-grid--intro"><div><p className="eyebrow eyebrow--orange">LATEST FROM THE TRAIL</p><h2>TRAINING THE BODY.<br /><em>BUILDING THE WHY.</em></h2></div><p>{climber.update}</p></div><div className="journal-strip">{["ENDURANCE", "ELEVATION", "REFLECTION"].map((tag, index) => <article key={tag}><span>0{index + 1} · {tag}</span><strong>[Verified update]</strong><p>Connect {climber.name.split(" ")[0]}’s approved photo, video or reflection here.</p></article>)}</div></section>

      <section className="route-section supporters"><div className="section-index">03 / SUPPORTER MESSAGES</div><h2>THE TEAM<br /><em>BEHIND THE CLIMBER.</em></h2><div className="supporter-grid"><blockquote>“[Approved supporter message]”<cite>— [Supporter name]</cite></blockquote><blockquote>“[Approved supporter message]”<cite>— [Supporter name]</cite></blockquote><div className="fake-qr fake-qr--dark">M4I<br />QR</div></div></section>

      <section className="route-section route-section--orange athlete-support" id={`support-${climber.slug}`}><div><p className="eyebrow">PERSONAL CAMPAIGN</p><h2>MOVE {climber.name.split(" ")[0].toUpperCase()}<br /><em>HIGHER.</em></h2><p>Choose the personal campaign on the verified donation panel once the fundraising link is live.</p></div><div><span>SHARE THIS CLIMB</span><p>[Personal campaign URL]</p><button className="button button--dark" type="button" disabled>Donation link pending</button></div></section>

      <nav className="next-athlete" aria-label="Team navigation"><Link href="/#team">← Back to the team</Link><span>NEXT CLIMBER</span>{nextClimber ? <Link href={`/team/${nextClimber.slug}`}>{nextClimber.name} →</Link> : <b>Roster publishing soon</b>}</nav>
    </RouteShell>
  );
}
