import type { Metadata } from "next";
import { products } from "../campaign-data";
import RouteShell from "../route-shell";
import { InterestForm } from "../site-ui";

export const metadata: Metadata = {
  title: "Wear the Movement",
  description: "The Climb Kili Kit—a premium campaign activewear lookbook built for movement and purpose.",
};

export default function ApparelPage() {
  return (
    <RouteShell>
      <header className="route-hero route-hero--apparel">
        <div className="apparel-figure" aria-hidden="true"><span>5895</span><i /></div>
        <p className="eyebrow eyebrow--orange">THE CLIMB KILI KIT</p>
        <h1>WEAR THE<br /><em>MOVEMENT.</em></h1>
        <p>Performance-minded campaign clothing designed to be desirable on its own—and meaningful because of what it helps move forward.</p>
        <a className="button button--ghost" href="#collection">View the collection <span aria-hidden="true">↓</span></a>
      </header>

      <section className="route-section apparel-manifesto">
        <div className="section-index">01 / FIELD IDENTITY</div>
        <p className="apparel-manifesto__line">TRAIN IN IT. CLIMB IN IT. <em>BUILD IN IT.</em></p>
        <div className="route-grid route-grid--intro"><h2>NOT MERCH.<br /><em>A SHARED SIGNAL.</em></h2><p>The kit is conceived as an activewear capsule: strong enough for training, distinctive enough for the street, and transparent about how each purchase supports the campaign.</p></div>
      </section>

      <section className="route-section route-section--dark collection" id="collection">
        <div className="section-index">02 / COLLECTION 01</div>
        <div className="collection__heading"><div><p className="eyebrow eyebrow--orange">KILI 2027 · FIRST RELEASE</p><h2>MADE FOR<br /><em>THE LONG WAY UP.</em></h2></div><p>Final product photography, specifications, pricing and stock connect here after approval. Every placeholder is intentionally visible.</p></div>
        <div className="collection-list">
          {products.map((product, index) => <article key={product.code} className={`collection-item collection-item--${index + 1}`}><div className="collection-item__visual"><span>{product.code}</span><div className="garment-shape garment-shape--large"><i /></div><small>PRODUCT PHOTOGRAPHY PLACEHOLDER</small></div><div className="collection-item__details"><span>{product.type}</span><h3>{product.name}</h3><p>Designed for campaign training, travel and everyday movement. Final fabric, fit and impact contribution copy to be approved.</p><dl><div><dt>Colours</dt><dd>{product.colours}</dd></div><div><dt>Sizes</dt><dd>{product.sizes}</dd></div><div><dt>Price</dt><dd>{product.price}</dd></div><div><dt>Status</dt><dd>{product.status}</dd></div></dl></div></article>)}
        </div>
      </section>

      <section className="route-section kit-impact">
        <div className="section-index">03 / WHAT IT MOVES</div>
        <div className="kit-impact__grid"><div><span>100%</span><small>TRACEABLE CONTRIBUTION</small></div><div><h2>SHOW THE<br /><em>REAL IMPACT.</em></h2><p>Before checkout opens, every product should state the verified amount or percentage that supports the campaign. Until then, this page makes no implied financial promise.</p><p className="placeholder-note">[Approved product contribution model]</p></div></div>
      </section>

      <section className="route-section route-section--orange reserve"><div><p className="eyebrow">EARLY ACCESS</p><h2>RESERVE YOUR<br /><em>CAMPAIGN KIT.</em></h2><p>Join the list for verified product details, release dates and preorder access.</p></div><InterestForm kind="campaign kit" /></section>
    </RouteShell>
  );
}
