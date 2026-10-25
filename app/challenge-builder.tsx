"use client";

import { FormEvent, useState } from "react";
import { givingUrl } from "./campaign-data";
import { saveInterest } from "./supabase";

const movements = [
  { id: "walk", distance: 59, unit: "KM", verb: "WALK", detail: "1 km for every 100 m of Kilimanjaro." },
  { id: "run", distance: 100, unit: "KM", verb: "RUN", detail: "A month of runs, logged and shared." },
  { id: "climb", distance: 5895, unit: "M", verb: "CLIMB", detail: "Stairs, hills or your local peak — summit-height in total." },
  { id: "cycle", distance: 589, unit: "KM", verb: "CYCLE", detail: "Ten times the walk, on two wheels." },
] as const;

type Movement = (typeof movements)[number];

const targets = [250, 500, 1000, 2500];

const fontStack = '"Arial Narrow", "Roboto Condensed", "Helvetica Neue", Arial, sans-serif';

const loadLogo = () =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = "/brand/m4i-logo-orange.png";
  });

/** Draws the 1080×1350 share card for social feeds and returns it as a PNG blob. */
async function drawShareCard(movement: Movement, name: string, target: number): Promise<Blob | null> {
  const logo = await loadLogo();
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#10110f";
  ctx.fillRect(0, 0, 1080, 1350);
  ctx.strokeStyle = "rgba(128,169,191,.22)";
  ctx.lineWidth = 2;
  for (let radius = 60; radius < 1100; radius += 46) {
    ctx.beginPath();
    ctx.ellipse(820, 520, radius, radius * 0.72, -0.2, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (logo) ctx.drawImage(logo, 80, 70, 240, (240 * logo.height) / logo.width);
  ctx.fillStyle = "#fffdf7";
  ctx.font = `800 26px ${fontStack}`;
  ctx.fillText("CLIMB KILI 2027", logo ? 350 : 80, 126);

  ctx.fillStyle = "#ff5a1f";
  ctx.font = `900 ${movement.distance >= 1000 ? 300 : 380}px ${fontStack}`;
  ctx.fillText(movement.distance.toLocaleString("en-US"), 64, 620);
  ctx.fillStyle = "#fffdf7";
  ctx.font = `900 120px ${fontStack}`;
  ctx.fillText(`${movement.unit} ${movement.verb}`, 76, 760);

  ctx.font = `900 64px ${fontStack}`;
  ctx.fillText(`${(name || "MY").toUpperCase()}${name ? "’S" : ""} MOUNTAIN.`, 80, 900);
  ctx.fillStyle = "#ff5a1f";
  ctx.fillText("OUR MOVEMENT.", 80, 970);

  ctx.fillStyle = "rgba(255,253,247,.7)";
  ctx.font = `600 34px Inter, "Helvetica Neue", Arial, sans-serif`;
  if (target > 0) ctx.fillText(`Raising US$${target.toLocaleString("en-US")} toward 12 family-style homes in Zimbabwe.`, 80, 1060);
  else ctx.fillText("Moving for 12 family-style homes in Zimbabwe.", 80, 1060);

  ctx.fillStyle = "#ff5a1f";
  ctx.fillRect(80, 1170, 920, 100);
  ctx.fillStyle = "#10110f";
  ctx.font = `900 40px ${fontStack}`;
  ctx.fillText(`GIVE AT ${givingUrl.replace("https://", "").toUpperCase()}`, 110, 1235);

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

export default function ChallengeBuilder() {
  const [movementId, setMovementId] = useState<Movement["id"]>("walk");
  const [name, setName] = useState("");
  const [target, setTarget] = useState(500);
  const [shareStatus, setShareStatus] = useState("");
  const [signup, setSignup] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const movement = movements.find((item) => item.id === movementId) ?? movements[0];
  const perUnit = target > 0 ? target / movement.distance : 0;
  const fileName = `move4impact-${movement.id}-challenge.png`;

  async function download() {
    const blob = await drawShareCard(movement, name.trim(), target);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    setShareStatus("Share card saved.");
  }

  async function share() {
    const text = `I’m taking on a ${movement.distance.toLocaleString("en-US")} ${movement.unit.toLowerCase()} ${movement.verb.toLowerCase()} for Move4Impact — helping build 12 family-style homes for children in Zimbabwe. Back me here:`;
    const blob = await drawShareCard(movement, name.trim(), target);
    const file = blob ? new File([blob], fileName, { type: "image/png" }) : null;
    try {
      if (file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ text: `${text} ${givingUrl}`, files: [file] });
      } else if (navigator.share) {
        await navigator.share({ text, url: givingUrl });
      } else {
        await navigator.clipboard.writeText(`${text} ${givingUrl}`);
        setShareStatus("Message copied — paste it anywhere.");
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") setShareStatus("Sharing isn’t available here. Try saving the card instead.");
    }
  }

  async function join(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    if (typeof email !== "string" || !email) return;
    setSignup("sending");
    try {
      await saveInterest(email, `community challenge: ${movement.id} ${movement.distance}${movement.unit.toLowerCase()}`);
      setSignup("sent");
    } catch (error) {
      console.error(error);
      setSignup("error");
    }
  }

  return (
    <section className="community section-light" id="community">
      <div className="section-index">05 / MOVE YOUR MOUNTAIN</div>
      <div className="community__intro" data-reveal>
        <div><p className="eyebrow">YOUR CHALLENGE. SHARED PURPOSE.</p><h2>NOT EVERY CLIMB<br />NEEDS A <em>SUMMIT.</em></h2></div>
        <p>Pick a challenge that asks something real of you, set a target and get a share card for your feed in seconds. Your friends give straight to the campaign.</p>
      </div>

      <div className="studio" data-reveal>
        <div className="studio__controls">
          <fieldset className="studio__step">
            <legend><span>01</span>Choose your movement</legend>
            <div className="studio__moves">
              {movements.map((item) => (
                <button type="button" className={movementId === item.id ? "studio__move active" : "studio__move"} aria-pressed={movementId === item.id} key={item.id} onClick={() => setMovementId(item.id)}>
                  <strong>{item.distance.toLocaleString("en-US")}<small>{item.unit}</small></strong>
                  <b>{item.verb}</b>
                  <span>{item.detail}</span>
                  <i aria-hidden="true">{movementId === item.id ? "✓" : "+"}</i>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="studio__step">
            <legend><span>02</span>Make it yours</legend>
            <div className="studio__fields">
              <label className="studio__field"><small>First name</small><input value={name} maxLength={18} onChange={(event) => setName(event.target.value)} placeholder="e.g. Tendai" /></label>
              <label className="studio__field"><small>Target (US$)</small><input inputMode="numeric" value={target ? target.toLocaleString("en-US") : ""} onChange={(event) => setTarget(Math.min(1_000_000, Number(event.target.value.replace(/[^0-9]/g, "")) || 0))} placeholder="500" /></label>
            </div>
            <div className="studio__chips">
              {targets.map((value) => (
                <button type="button" key={value} className={target === value ? "active" : ""} onClick={() => setTarget(value)}>${value.toLocaleString("en-US")}</button>
              ))}
            </div>
            {perUnit > 0 && <p className="studio__per">That’s about <b>US${perUnit < 1 ? perUnit.toFixed(2) : perUnit.toFixed(perUnit < 10 ? 1 : 0).replace(/\.0$/, "")}</b> per {movement.unit === "KM" ? "kilometre" : "metre"} — an easy ask for friends to sponsor.</p>}
          </fieldset>

          <fieldset className="studio__step">
            <legend><span>03</span>Share it</legend>
            <div className="studio__buttons">
              <button className="button button--orange" type="button" onClick={share}>Share my challenge <span aria-hidden="true">↗</span></button>
              <button className="button button--outline" type="button" onClick={download}>Save card <span aria-hidden="true">↓</span></button>
            </div>
            {shareStatus && <p className="studio__status" role="status">{shareStatus}</p>}
          </fieldset>
        </div>

        <div className="studio__stage">
          <div className="share-card" aria-label="Share card preview">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="share-card__top"><img src="/brand/m4i-logo-orange.png" alt="Move4Impact" width={640} height={242} /><span>CLIMB KILI 2027</span></div>
            <strong key={movement.id}>{movement.distance.toLocaleString("en-US")}</strong>
            <b>{movement.unit} {movement.verb}</b>
            <p>{name.trim() ? `${name.trim().toUpperCase()}’S` : "MY"} MOUNTAIN.<br /><em>OUR MOVEMENT.</em></p>
            <small>{target > 0 ? `Raising US$${target.toLocaleString("en-US")} toward 12 family-style homes in Zimbabwe.` : "Moving for 12 family-style homes in Zimbabwe."}</small>
            <div className="share-card__cta">GIVE AT {givingUrl.replace("https://", "").toUpperCase()}</div>
          </div>
          <p className="studio__caption">Live preview · 1080 × 1350 · ready for Instagram, WhatsApp and LinkedIn</p>
        </div>
      </div>

      <div className="studio__join" data-reveal>
        <div><span>CHALLENGE KIT</span><p>Get training plans, tracking tips and a starter message to send friends.</p></div>
        {signup === "sent" ? (
          <div className="form-success" role="status"><span>✓</span> You’re in. Your challenge kit is on its way.</div>
        ) : (
          <form onSubmit={join}>
            <label><span>Email address</span><input type="email" name="email" placeholder="you@example.com" required disabled={signup === "sending"} /></label>
            <button className="button button--dark" type="submit" disabled={signup === "sending"}>{signup === "sending" ? "Joining…" : "Send me the kit"} <span aria-hidden="true">↗</span></button>
            {signup === "error" && <p className="form-error" role="alert">Something went wrong — please try again in a moment.</p>}
          </form>
        )}
      </div>
    </section>
  );
}
