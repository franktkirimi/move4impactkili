# Move4Impact: Climb Kili 2027 — Experience Blueprint

## 1. Information architecture

- `/` — the complete Digital Ascent: commitment, challenge, purpose, transparent plan, fundraising ascent, climbers, trail journal, apparel, participation, partners, and final village resolution.
- `/team/frank-kirimi` — reusable athlete profile template with story, personal progress, training data, journal, supporter messages, QR placeholder, sharing, and donation actions.
- `/impact` — Eden mission, family-style care, planned infrastructure, allocation placeholders, construction milestones, transparency, and safeguarding commitments.
- `/apparel` — campaign lookbook, product catalogue, reserve flow, supporter context, and contribution explanation.

## 2. Visual system

- Palette: Obsidian `#10110f`, Glacier `#f3f0e8`, Volcanic `#71736f`, Summit Orange `#ff5a1f`, Altitude Blue `#80a9bf`, and Signal Lime `#c8ff3d` only for live state.
- Type: condensed, tightly tracked display faces via a robust system fallback stack; neutral contemporary sans-serif for body and UI; tabular oversized numerals for campaign data.
- Composition: editorial crops, hard grid lines, altitude coordinates, topographic CSS contours, diagonal cuts, construction-line motifs, and decisive rectangular actions. Rounded containers are reserved for pills and progress markers.
- Imagery: one original cinematic campaign panorama, supported by clearly labelled campaign-photography placeholders until approved real photography is available.

## 3. Motion system

- Scroll progress drives a fixed altitude rail from 0 m to 5,895 m.
- Reveal transitions use opacity, short vertical movement, and masked image scaling.
- The campaign verb band moves horizontally at a slow, controlled pace.
- The fundraising route fills vertically; home outlines become solid at milestone intervals.
- Hover and focus motion communicates interactivity through arrow movement, crop shift, and border contrast.
- `prefers-reduced-motion` disables loops, parallax, animated reveals, and smooth scrolling while preserving all information.

## 4. Reusable components

- Site header and mobile navigation
- Editorial media frame
- Campaign statistic
- Altitude rail
- Fundraising ascent
- Impact campus selector
- Climber card and athlete metrics
- Trail update
- Product/lookbook panel
- Participation pathway
- Challenge configurator
- Donation drawer
- Partner tier
- Campaign footer and final village call-to-action

## 5. Data structures

- `CampaignSnapshot`: raised, goal, champions, climb date, altitude, next milestone.
- `Climber`: identity, location, statement, portrait, target, raised, kilometres, elevation, latest update, profile slug.
- `ImpactProject`: title, purpose, allocation placeholder, funding status, construction stage, intended impact.
- `TrailUpdate`: category, place/date label, headline, excerpt, media type.
- `Product`: name, category, colour, price placeholder, sizes, status, proceeds statement.
- `PartnerTier`: title, audience, contribution description, details placeholder.

## 6. Principal user journeys

- Understand → see campaign promise and four proof points → follow the ascent → support the general campaign.
- Connect → understand why the team climbs → choose an athlete → donate or share their page.
- Verify → inspect the US$1M campus plan → read transparency and safeguarding commitments → partner or fund a milestone.
- Belong → browse campaign kit or create a personal challenge → reserve/share → return to live progress.
- Partner → review pathways and partner tiers → submit partnership interest through a clearly labelled placeholder action.

## 7. Responsive behaviour

- Mobile keeps the narrative single-column, moves altitude progress to a compact top rail, uses horizontal team/product scrollers, and keeps CTAs touch-sized.
- Tablet introduces split storytelling and two-column editorial grids.
- Desktop uses asymmetric 12-column compositions, sticky progress storytelling, and wide cinematic media.
- No interaction depends on hover; expandable controls, donation access, and navigation remain keyboard operable.

## 8. CMS/database ownership

Campaign totals, dates, milestones, climbers, personal statistics, journal updates, products, stock/status, impact projects, partner logos, approved allocations, supporter messages, external donation URLs, and media assets should come from a CMS or database. Static brand language, navigation, disclosure copy, and accessibility labels remain version-controlled. All unconfirmed values are displayed as visible placeholders rather than implied facts.
