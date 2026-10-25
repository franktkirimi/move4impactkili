"use client";

import { PointerEvent, useCallback, useEffect, useRef, useState } from "react";
import { altitudeStages } from "./campaign-data";
import { SUMMIT_METRES, metresForGift, dollarsForAltitude, formatUsd, kiliZones, oxygenShare, temperatureDrop, zoneForAltitude } from "./campaign-math";

const WIDTH = 1200;
const BASE = 440;
const PEAK_Y = 60;
const SUMMIT_X = 1110;
const PLAY_MS = 7000;

// Ascent profile as [x, altitude]. Illustrative shape; altitudes and zones are real.
const ascent: [number, number][] = [
  [0, 0], [90, 350], [160, 900], [230, 1800], [300, 2150], [380, 2600], [440, 2800], [520, 3300],
  [600, 3700], [660, 4000], [720, 4250], [780, 4600], [850, 4750], [920, 5000], [1000, 5400], [1060, 5700], [SUMMIT_X, SUMMIT_METRES],
];
const descent: [number, number][] = [[1150, 5720], [1200, 5480]];

const yFor = (metres: number) => BASE - (metres / SUMMIT_METRES) * (BASE - PEAK_Y);

const altitudeAtX = (x: number) => {
  if (x <= 0) return 0;
  if (x >= SUMMIT_X) return SUMMIT_METRES;
  const index = ascent.findIndex(([px]) => px >= x);
  const [x0, a0] = ascent[index - 1];
  const [x1, a1] = ascent[index];
  return a0 + ((x - x0) / (x1 - x0)) * (a1 - a0);
};

const xAtAltitude = (metres: number) => {
  if (metres <= 0) return 0;
  if (metres >= SUMMIT_METRES) return SUMMIT_X;
  const index = ascent.findIndex(([, pa]) => pa >= metres);
  const [x0, a0] = ascent[index - 1];
  const [x1, a1] = ascent[index];
  return x0 + ((metres - a0) / (a1 - a0)) * (x1 - x0);
};

const toPoints = (points: [number, number][]) => points.map(([x, a]) => `${x},${yFor(a).toFixed(1)}`).join(" ");
const ridge = toPoints([...ascent, ...descent]);
const area = `0,${BASE} ${ridge} ${WIDTH},${BASE}`;
const zoneFills = ["#6b6440", "#2f7048", "#8a8248", "#9a6c4c", "#eef3f5"];

export default function KiliRoute({ raised }: { raised?: number }) {
  const [altitude, setAltitude] = useState(0);
  const [playing, setPlaying] = useState(false);
  const svg = useRef<SVGSVGElement>(null);
  const section = useRef<HTMLElement>(null);
  const frame = useRef(0);
  const dragging = useRef(false);
  const zone = zoneForAltitude(altitude);
  const markerX = xAtAltitude(altitude);
  const markerY = yFor(altitude);
  const teamAltitude = raised ? Math.min(SUMMIT_METRES, metresForGift(raised)) : null;
  const travelled = toPoints([...ascent.filter(([x]) => x < markerX), [markerX, altitude]]);

  const stop = useCallback(() => {
    cancelAnimationFrame(frame.current);
    setPlaying(false);
  }, []);

  const play = useCallback(() => {
    cancelAnimationFrame(frame.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAltitude(SUMMIT_METRES);
      return;
    }
    setPlaying(true);
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / PLAY_MS);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setAltitude(altitudeAtX(eased * SUMMIT_X));
      if (t < 1) frame.current = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    frame.current = requestAnimationFrame(tick);
  }, []);

  // Climb once by itself the first time the route scrolls into view.
  useEffect(() => {
    const current = section.current;
    if (!current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        play();
        observer.disconnect();
      }
    }, { threshold: 0.45 });
    observer.observe(current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [play]);

  const scrubTo = (event: PointerEvent<SVGSVGElement>) => {
    const box = svg.current?.getBoundingClientRect();
    if (!box) return;
    const x = ((event.clientX - box.left) / box.width) * WIDTH;
    setAltitude(Math.round(altitudeAtX(x)));
  };

  return (
    <section className="kili section-dark" id="route" ref={section} aria-labelledby="kili-title">
      <div className="section-index">01 / THE ROUTE</div>
      <div className="kili__top">
        <div className="kili__intro" data-reveal>
          <p className="eyebrow eyebrow--blue">MOUNT KILIMANJARO · TANZANIA</p>
          <h2 id="kili-title">FIVE CLIMATES.<br />ONE <em>ASCENT.</em></h2>
          <p>From farmland to glacier in a single expedition. Drag along the mountain to feel what the team carries at every altitude — and what it takes from all of us to get them there.</p>
        </div>
        <div className="kili__readout" aria-live="polite">
          <span className="kili__zone-tag" data-zone={zone.id}>{zone.name.toUpperCase()}</span>
          <strong>{Math.round(altitude).toLocaleString("en-US")}<small>M</small></strong>
          <p>{zone.terrain}</p>
          <dl>
            <div><dt>Oxygen per breath</dt><dd>{Math.round(oxygenShare(altitude) * 100)}%<small> of sea level</small></dd></div>
            <div><dt>Colder than the coast</dt><dd>−{Math.round(temperatureDrop(altitude))}°C<small> approx.</small></dd></div>
            <div><dt>Campaign equivalent</dt><dd>{formatUsd(dollarsForAltitude(altitude))}<small> raised</small></dd></div>
          </dl>
        </div>
      </div>

      <div className="kili__chart">
        <svg
          ref={svg}
          viewBox={`0 0 ${WIDTH} ${BASE + 20}`}
          role="img"
          aria-label="Elevation profile of the climb from 0 to 5,895 metres"
          onPointerDown={(event) => { stop(); dragging.current = true; event.currentTarget.setPointerCapture(event.pointerId); scrubTo(event); }}
          onPointerMove={(event) => { if (dragging.current) scrubTo(event); }}
          onPointerUp={() => { dragging.current = false; }}
          onPointerCancel={() => { dragging.current = false; }}
        >
          <defs>
            <clipPath id="kili-clip"><polygon points={area} /></clipPath>
            <linearGradient id="kili-shade" x1="0" x2="1">
              <stop offset="0" stopColor="#000" stopOpacity="0" />
              <stop offset="1" stopColor="#000" stopOpacity=".35" />
            </linearGradient>
          </defs>
          {altitudeStages.map(([label]) => {
            const metres = Number(label.replace(/[^0-9]/g, ""));
            if (metres === 0) return null;
            return <g key={label} className="kili__grid"><line x1={0} x2={WIDTH} y1={yFor(metres)} y2={yFor(metres)} /><text x={6} y={yFor(metres) - 6}>{label}</text></g>;
          })}
          <g clipPath="url(#kili-clip)">
            {kiliZones.map((band, index) => (
              <rect key={band.id} className={zone.id === band.id ? "kili__band active" : "kili__band"} x={0} width={WIDTH} y={yFor(band.to)} height={yFor(band.from) - yFor(band.to)} fill={zoneFills[index]} />
            ))}
            <rect x={0} y={0} width={WIDTH} height={BASE} fill="url(#kili-shade)" />
          </g>
          <polyline className="kili__ridge" points={ridge} />
          <polyline className="kili__travelled" points={travelled} />
          {altitudeStages.map(([label, name]) => {
            const metres = Number(label.replace(/[^0-9]/g, ""));
            const reached = altitude >= metres;
            return (
              <g key={name} className={reached ? "kili__camp reached" : "kili__camp"} transform={`translate(${xAtAltitude(metres)} ${yFor(metres)})`}>
                <circle r={7} />
                <text x={metres === 0 ? 14 : 0} y={metres > 5000 || metres === 0 ? -16 : 26} textAnchor={metres === 0 ? "start" : "middle"}>{name.toUpperCase()}</text>
              </g>
            );
          })}
          {teamAltitude !== null && (
            <g className="kili__team" transform={`translate(${xAtAltitude(teamAltitude)} ${yFor(teamAltitude)})`}>
              <line y1={0} y2={-78} />
              <path d="M0 -78 L64 -66 L0 -54 Z" />
              <text x={8} y={-92}>WE ARE HERE · {formatUsd(raised ?? 0)}</text>
              <circle r={6} />
            </g>
          )}
          <g className="kili__marker" transform={`translate(${markerX} ${markerY})`}>
            <line y1={0} y2={BASE - markerY} />
            <circle r={13} className="kili__marker-pulse" />
            <circle r={9} />
          </g>
        </svg>
        <div className="kili__controls">
          <button className="button button--orange" type="button" onClick={playing ? stop : play}>
            {playing ? "Pause" : altitude >= SUMMIT_METRES ? "Climb again" : "Play the ascent"} <span aria-hidden="true">{playing ? "❚❚" : "▲"}</span>
          </button>
          <input
            className="kili__range"
            type="range"
            min={0}
            max={SUMMIT_METRES}
            step={5}
            value={Math.round(altitude)}
            onChange={(event) => { stop(); setAltitude(Number(event.target.value)); }}
            aria-label="Altitude on the climb"
            aria-valuetext={`${Math.round(altitude)} metres, ${zone.name}`}
          />
          <span className="kili__legend">
            {teamAltitude !== null
              ? `LIVE: THE CAMPAIGN HAS CLIMBED ${Math.round(teamAltitude).toLocaleString("en-US")} M OF 5,895 M`
              : "MOUNT KILIMANJARO · UHURU PEAK · 5,895 M · TANZANIA"}
          </span>
        </div>
      </div>
    </section>
  );
}
