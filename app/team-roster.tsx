"use client";

import Image from "next/image";
import { useState } from "react";
import { climbers, givingUrl } from "./campaign-data";
import type { CampaignStats } from "./campaign-stats";
import { formatUsd } from "./campaign-math";
import { InterestForm, ShareButton } from "./site-ui";

type Card = {
  key: string;
  name: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
  picture?: string | null;
  location: string;
  reason: string;
  raised: number | null;
  donors: number | null;
  goal: number | null;
  giveUrl: string;
};

const accents = ["orange", "blue", "grey", "lime"];
const VISIBLE = 8;
const isPlaceholder = (text: string) => text.startsWith("[") || /publishing soon/i.test(text);
const initials = (name: string) => name.split(/\s+/).filter((word) => /^[A-Za-z]/.test(word) && word !== "and").slice(0, 2).map((word) => word[0]).join("").toUpperCase();

function buildCards(stats: CampaignStats | null): Card[] {
  if (!stats?.members.length) {
    return climbers.map((climber) => ({
      key: climber.slug,
      name: climber.name,
      image: climber.image,
      imageAlt: climber.imageAlt,
      imagePosition: climber.imagePosition,
      location: climber.location,
      reason: climber.reason,
      raised: null,
      donors: null,
      goal: null,
      giveUrl: givingUrl,
    }));
  }
  return stats.members.map((member) => {
    const local = climbers.find((climber) => climber.givebutterId === member.id);
    const reason = local && !isPlaceholder(local.reason)
      ? local.reason
      : member.goal
        ? `Fundraising toward a ${formatUsd(member.goal)} goal for twelve family-style homes in Zimbabwe.`
        : "Fundraising for twelve family-style homes in Zimbabwe.";
    return {
      key: member.id,
      name: member.name,
      image: local?.image,
      imageAlt: local?.imageAlt,
      imagePosition: local?.imagePosition,
      picture: member.picture,
      location: local && !isPlaceholder(local.location) && local.location !== "Move4Impact athlete" ? local.location : "Move4Impact climber",
      reason,
      raised: member.raised,
      donors: member.donors,
      goal: member.goal,
      giveUrl: member.url,
    };
  });
}

export default function TeamRoster({ stats }: { stats: CampaignStats | null }) {
  const [showAll, setShowAll] = useState(false);
  const [rosterOpen, setRosterOpen] = useState(false);
  const live = Boolean(stats?.members.length);
  const cards = buildCards(stats);
  const visible = showAll ? cards : cards.slice(0, VISIBLE);
  const teamRaised = stats?.members.reduce((sum, member) => sum + member.raised, 0) ?? 0;

  return (
    <section className="team section-light" id="team">
      <div className="section-index">04 / MEET THE CLIMBERS</div>
      <div className="team__intro" data-reveal>
        <div><p className="eyebrow">THE EXPEDITION TEAM</p><h2>TWENTY REASONS<br />TO <em>KEEP MOVING.</em></h2></div>
        {live ? (
          <p>
            <span className="live-dot" aria-hidden="true" /> Live from Givebutter: {cards.length} climbers have raised <b>{formatUsd(teamRaised)}</b> through their personal pages. Back one directly — every gift counts toward the US$1M.
          </p>
        ) : (
          <p>Every climber carries a personal story, training commitment and fundraising target. Live fundraising totals appear here as soon as they load.</p>
        )}
      </div>

      <div className="climber-grid">
        {visible.map((card, index) => {
          const visual = card.image ? (
            <Image className="climber-card__image" src={card.image} alt={card.imageAlt ?? `${card.name} portrait`} fill sizes="(max-width: 760px) 82vw, (max-width: 1100px) 50vw, 25vw" style={{ objectPosition: card.imagePosition }} />
          ) : card.picture ? (
            // Givebutter-hosted profile photo; served as-is rather than through the image optimiser.
            // eslint-disable-next-line @next/next/no-img-element
            <img className="climber-card__image climber-card__image--remote" src={card.picture} alt={`${card.name} portrait`} loading="lazy" />
          ) : live ? (
            <span className="climber-card__initials" aria-hidden="true">{initials(card.name)}</span>
          ) : (
            <span className="climber-card__placeholder">ATHLETE<br />ANNOUNCEMENT<br />PENDING</span>
          );
          const progress = card.raised !== null && card.goal ? Math.min(100, (card.raised / card.goal) * 100) : null;

          return (
            <article className={`climber-card climber-card--${accents[index % accents.length]}`} key={card.key}>
              <a href={card.giveUrl} target="_blank" rel="noopener noreferrer" className="climber-card__visual" aria-label={`Support ${card.name} on Givebutter`}>
                {visual}<span className="climber-card__index">{String(index + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}</span><b>{card.name}</b>
              </a>
              {live && index < 3 && card.raised ? <span className="climber-card__rank">#{index + 1} fundraiser</span> : null}
              <div className="climber-card__content">
                <span>{card.location}</span>
                <p>{card.reason}</p>
                <div className="climber-card__metrics">
                  <div>
                    <small>Raised</small>
                    {card.raised === null ? <b className="is-pending">—<em>Soon</em></b> : <b>{formatUsd(card.raised).replace("US", "")}</b>}
                  </div>
                  <div>
                    <small>Supporters</small>
                    {card.donors === null ? <b className="is-pending">—<em>Soon</em></b> : <b>{card.donors}</b>}
                  </div>
                </div>
                {progress !== null && (
                  <div className="climber-card__progress" aria-label={`${Math.round(progress)}% of ${formatUsd(card.goal ?? 0)} goal`}>
                    <i style={{ width: `${Math.max(progress, 1.5)}%` }} />
                    <small>{progress < 1 && progress > 0 ? "<1" : Math.round(progress)}% of {formatUsd(card.goal ?? 0)}</small>
                  </div>
                )}
                <div className="climber-card__actions">
                  <a className="climber-card__view" href={card.giveUrl} target="_blank" rel="noopener noreferrer" aria-label={live ? `Back ${card.name} on Givebutter` : "Back the team on Givebutter"}>{live ? "Back this climb" : "Back the team"} <span aria-hidden="true">↗</span></a>
                  <ShareButton className="climber-card__share" label="" title={`Back ${card.name} on the climb to Kilimanjaro`} path={card.giveUrl} />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="team__footer">
        <span>{live ? `${cards.length} CLIMBERS FUNDRAISING` : `01—${String(cards.length).padStart(2, "0")} / 20`}</span>
        <div className="team__rule" />
        {cards.length > VISIBLE && (
          <button type="button" onClick={() => setShowAll((value) => !value)}>{showAll ? "Show fewer" : `Show all ${cards.length} climbers`} {showAll ? "−" : "+"}</button>
        )}
        <button type="button" aria-expanded={rosterOpen} onClick={() => setRosterOpen((value) => !value)}>Want to climb with us? {rosterOpen ? "−" : "+"}</button>
      </div>
      {rosterOpen && (
        <div className="team__join">
          <p>Places on the expedition team are still being finalised. Leave your email to hear about joining the climb.</p>
          <InterestForm kind="expedition team" cta="Register interest" />
        </div>
      )}
    </section>
  );
}
