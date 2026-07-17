import type { Metadata } from "next";
import Link from "next/link";
import { impactProjects } from "../campaign-data";
import RouteShell from "../route-shell";

export const metadata: Metadata = {
  title: "Impact · The Homes Are the Victory",
  description: "Explore the planned family-style homes, essential infrastructure, transparency and dignity commitments behind Climb Kili 2027.",
};

export default function ImpactPage() {
  return (
    <RouteShell>
      <header className="route-hero route-hero--impact">
        <div className="topo topo--hero" aria-hidden="true" />
        <p className="eyebrow eyebrow--orange">IMPACT · EDEN · ZIMBABWE</p>
        <h1>THE HOMES<br />ARE THE <em>VICTORY.</em></h1>
        <p>Climb Kili exists to help expand family-style care—creating places of safety, belonging and long-term opportunity with transparency built into every stage.</p>
        <div className="route-hero__meta"><span>US$1M CAMPAIGN TARGET</span><span>12 PLANNED HOMES</span><span>VERIFIED FIGURES ONLY</span></div>
      </header>

      <section className="route-section impact-model">
        <div className="section-index">01 / THE CARE MODEL</div>
        <div className="route-grid route-grid--intro">
          <div><p className="eyebrow">EDEN’S MISSION</p><h2>FAMILY-STYLE CARE,<br /><em>BUILT AROUND BELONGING.</em></h2></div>
          <div><p>Eden’s approved mission language and programme description will live here. The page is deliberately structured for verified information, clear sources and dignified storytelling—not unsupported claims.</p><p>Family-style homes are presented as places of ordinary daily life: consistent caregivers, school mornings, health, play, shared meals and the confidence that comes with stability.</p></div>
        </div>
        <div className="principle-grid">
          {[["CARE", "Consistent relationships and daily rhythms."], ["EDUCATION", "Space and support for children to learn."], ["HEALTH", "Safe systems that protect wellbeing."], ["BELONGING", "A home designed around identity and connection."]].map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="route-section route-section--dark infrastructure">
        <div className="section-index">02 / PLANNED INFRASTRUCTURE</div>
        <div className="route-grid route-grid--intro"><div><p className="eyebrow eyebrow--orange">THE US$1M PLAN</p><h2>A CAMPUS THAT<br /><em>WORKS LIKE HOME.</em></h2></div><p>Every allocation remains a visible placeholder until it is approved. Connect this section to architectural drawings, budgets, construction photography and funding status in the campaign CMS.</p></div>
        <div className="infrastructure-list">
          {impactProjects.map((project) => <article key={project.id}><span>{project.number}</span><div><h3>{project.title}</h3><p>{project.purpose}</p></div><dl><div><dt>Allocation</dt><dd>{project.allocation}</dd></div><div><dt>Stage</dt><dd>{project.stage}</dd></div></dl></article>)}
        </div>
      </section>

      <section className="route-section transparency">
        <div className="section-index">03 / TRANSPARENCY</div>
        <div className="transparency__grid">
          <div><p className="eyebrow">FOLLOW THE MONEY</p><h2>PROGRESS YOU CAN<br /><em>TRACE.</em></h2><p>Verified campaign total, approved allocation, construction stage and intended impact should be shown together—so supporters can understand not only what was raised, but what moved because of it.</p></div>
          <div className="source-panel">
            <span>REPORTING FRAMEWORK</span>
            {[["Campaign total", "[Fundraising platform feed]"], ["Allocation", "[Approved campaign budget]"], ["Construction", "[Project manager update]"], ["Programme outcomes", "[Approved Eden reporting]"]].map(([title, source]) => <div key={title}><b>{title}</b><em>{source}</em><small>Source label required</small></div>)}
          </div>
        </div>
      </section>

      <section className="route-section safeguarding route-section--orange">
        <div className="section-index">04 / DIGNITY & SAFEGUARDING</div>
        <h2>CHILDREN ARE NOT<br /><em>CAMPAIGN PROPS.</em></h2>
        <div className="safeguarding__copy"><p>Stories and imagery must protect identity, privacy and dignity. The campaign will use approved media, informed consent processes and safeguarding guidance.</p><ul><li>No pity-based fundraising</li><li>No unsupported personal detail</li><li>No photography that compromises dignity</li><li>Clear review and consent workflow</li></ul></div>
      </section>

      <section className="route-cta"><p className="eyebrow eyebrow--orange">THE PLAN IS THE PROMISE</p><h2>HELP TURN<br />THE OUTLINE<br /><em>INTO HOME.</em></h2><p>Every verified milestone will make the village more visible.</p><Link className="button button--orange" href="/#ascent">See the fundraising ascent <span aria-hidden="true">↗</span></Link></section>
    </RouteShell>
  );
}
