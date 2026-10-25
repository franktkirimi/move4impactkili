"use client";

import { ChangeEvent, CSSProperties, useState } from "react";
import { givingUrl } from "./campaign-data";
import { CAMPAIGN_GOAL, DOLLARS_PER_METRE, formatUsd, metresForGift } from "./campaign-math";
import type { CampaignStats } from "./campaign-stats";
import { LiveTotal } from "./site-ui";

const presets = [25, 50, 100, 250, 500, 1000, 5000];
const MIN = 10;
const MAX = 50000;
/** Rise of one uphill step on the trail, used to make metres feel physical. */
const STEP_RISE = 0.2;

// The slider is logarithmic so US$10 and US$50,000 are both reachable.
const toSlider = (amount: number) => Math.round((Math.log(amount / MIN) / Math.log(MAX / MIN)) * 1000);
const fromSlider = (position: number) => {
  const raw = MIN * Math.pow(MAX / MIN, position / 1000);
  const step = raw < 100 ? 5 : raw < 1000 ? 25 : raw < 10000 ? 250 : 1000;
  return Math.max(MIN, Math.round(raw / step) * step);
};

export default function GiftCalculator({ stats }: { stats: CampaignStats | null }) {
  const [amount, setAmount] = useState(100);
  const [monthly, setMonthly] = useState(false);
  const yearly = monthly ? amount * 12 : amount;
  const metres = metresForGift(yearly);
  const steps = Math.max(1, Math.round(metres / STEP_RISE));
  const giftsToGoal = Math.ceil(CAMPAIGN_GOAL / yearly);
  const drawnSteps = Math.min(steps, 36);

  const onAmountInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value.replace(/[^0-9]/g, ""));
    if (Number.isFinite(value)) setAmount(Math.min(MAX, Math.max(0, value)));
  };

  return (
    <section className="gift section-dark" id="gift" aria-labelledby="gift-title">
      <div className="section-index">03 / YOUR GIFT, IN ALTITUDE</div>
      <div className="gift__intro" data-reveal>
        <div>
          <p className="eyebrow eyebrow--orange">GIFT IMPACT CALCULATOR</p>
          <h2 id="gift-title">HOW HIGH<br />WILL YOU <em>TAKE US?</em></h2>
        </div>
        <p>
          The whole campaign is one climb: US$1,000,000 carries the team 5,895 metres to the summit — about{" "}
          {formatUsd(DOLLARS_PER_METRE)} for every metre. Choose an amount and see how far it moves the mountain.
        </p>
      </div>

      <div className="gift__panel" data-reveal>
        <div className="gift__controls">
          <div className="gift__mode" role="group" aria-label="Gift frequency">
            <button type="button" aria-pressed={!monthly} className={!monthly ? "active" : ""} onClick={() => setMonthly(false)}>One-time</button>
            <button type="button" aria-pressed={monthly} className={monthly ? "active" : ""} onClick={() => setMonthly(true)}>Monthly</button>
          </div>
          <label className="gift__amount">
            <span>{monthly ? "EACH MONTH" : "YOUR GIFT"}</span>
            <div><b>US$</b><input inputMode="numeric" value={amount ? amount.toLocaleString("en-US") : ""} onChange={onAmountInput} aria-label="Gift amount in US dollars" /></div>
          </label>
          <input
            className="gift__range"
            type="range"
            min={0}
            max={1000}
            value={toSlider(Math.max(MIN, amount))}
            onChange={(event) => setAmount(fromSlider(Number(event.target.value)))}
            aria-label="Adjust gift amount"
            aria-valuetext={formatUsd(amount)}
            style={{ "--fill": `${toSlider(Math.max(MIN, amount)) / 10}%` } as CSSProperties}
          />
          <div className="gift__presets">
            {presets.map((preset) => (
              <button type="button" key={preset} className={amount === preset ? "active" : ""} onClick={() => setAmount(preset)}>
                ${preset.toLocaleString("en-US")}
              </button>
            ))}
          </div>
        </div>

        <div className="gift__result" aria-live="polite">
          <div className="gift__stairs" aria-hidden="true">
            <svg viewBox="0 0 360 200" preserveAspectRatio="xMidYMax meet">
              {Array.from({ length: drawnSteps }, (_, index) => {
                const width = 360 / drawnSteps;
                const height = ((index + 1) / drawnSteps) * 180;
                return <rect key={`${drawnSteps}-${index}`} x={index * width} y={200 - height} width={width + 0.5} height={height} style={{ animationDelay: `${index * 18}ms` }} />;
              })}
            </svg>
            <span className="gift__climber" />
          </div>
          <div className="gift__headline">
            <strong>{metres < 10 ? metres.toFixed(2) : Math.round(metres).toLocaleString("en-US")}<small>M</small></strong>
            <p>of the climb{monthly ? " in a year" : ""} — about <b>{steps.toLocaleString("en-US")}</b> uphill {steps === 1 ? "step" : "steps"} toward Uhuru Peak.</p>
          </div>
          <dl className="gift__stats">
            <div><dt>Share of US$1M</dt><dd>{((yearly / CAMPAIGN_GOAL) * 100).toFixed(yearly >= 10000 ? 1 : 3)}%</dd></div>
            <div><dt>Gifts like yours to the summit</dt><dd>{giftsToGoal.toLocaleString("en-US")}</dd></div>
            <div><dt>{monthly ? "Given over 12 months" : "Total gift"}</dt><dd>{formatUsd(yearly)}</dd></div>
          </dl>
          <div className="gift__actions">
            <a className="button button--orange" href={givingUrl} target="_blank" rel="noopener noreferrer">
              Give {formatUsd(amount)}{monthly ? "/mo" : ""} on Givebutter <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>

      <div className="gift__live" data-reveal>
        <span><i /> LIVE CAMPAIGN TOTAL · GIVEBUTTER</span>
        <div className="gift__live-widget"><LiveTotal stats={stats} tone="light" /></div>
        <small>Choose your amount on the secure Givebutter page. Monthly giving is set up there too.</small>
      </div>
    </section>
  );
}
