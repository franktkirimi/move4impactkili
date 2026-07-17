"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import type { ImpactHotspot } from "./eden-impact-scene";

const EdenImpactScene = dynamic(() => import("./eden-impact-scene"), {
  ssr: false,
  loading: () => (
    <div className="impact-3d-loader" role="status">
      <span />
      <b>Preparing the Eden site</b>
      <small>Loading the architectural experience…</small>
    </div>
  ),
});

const stages = [
  {
    amount: 50,
    title: "The future is marked out.",
    detail: "The ground is prepared as survey pegs and the home’s full footprint take shape on the land.",
    label: "Site prepared",
  },
  {
    amount: 100,
    title: "Your gift breaks new ground.",
    detail: "Foundation trenches open and concrete footings are poured to carry everything that follows.",
    label: "Footings poured",
  },
  {
    amount: 250,
    title: "Your gift lays the foundation.",
    detail: "Foundation walls rise from the earth, creating a strong and permanent base for the home.",
    label: "Foundations rising",
  },
  {
    amount: 500,
    title: "A place to stand, grow and belong.",
    detail: "The reinforced floor slab settles across the footprint. A drawing is becoming a real place.",
    label: "Floor slab complete",
  },
  {
    amount: 1000,
    title: "Hope rises course by course.",
    detail: "Exterior walls build upward in sequence until the scale and shelter of the home can be felt.",
    label: "Walls taking shape",
  },
  {
    amount: 2500,
    title: "Light finds its way inside.",
    detail: "Door and window openings are formed and precisely framed for the life that will happen within.",
    label: "Openings formed",
  },
  {
    amount: 5000,
    title: "The home is sheltered.",
    detail: "Timber trusses lift into position before the roof sheets settle over the growing structure.",
    label: "Roof installed",
  },
  {
    amount: 10000,
    title: "Shelter becomes security.",
    detail: "Windows glide into their frames and the front door closes the home safely from the elements.",
    label: "Windows and doors fitted",
  },
  {
    amount: 15000,
    title: "A house becomes a home.",
    detail: "Interior rooms, ceilings, finished floors and warm lighting create spaces for everyday family life.",
    label: "Interiors finished",
  },
  {
    amount: 25000,
    title: "Comfort arrives with dignity.",
    detail: "Beds, mattresses, cupboards, a kitchen and a dining space are carefully placed inside.",
    label: "Home furnished",
  },
  {
    amount: 35000,
    title: "Belonging grows beyond the walls.",
    detail: "Grass takes root, trees grow, footpaths connect the site and shaded benches invite community.",
    label: "Landscape coming alive",
  },
  {
    amount: 50000,
    title: "You’ve built a safe place to belong.",
    detail: "The completed home glows in the Zimbabwean evening as children play safely in the garden.",
    label: "The Eden home is complete",
  },
] as const;

const hotspotCopy: Record<ImpactHotspot, { label: string; title: string; detail: string; minimumStage: number }> = {
  bedroom: {
    label: "BEDROOM",
    title: "A safe place where four children will sleep.",
    detail: "A calm, personal room designed for rest, privacy and the feeling of being securely at home.",
    minimumStage: 7,
  },
  kitchen: {
    label: "KITCHEN + DINING",
    title: "Meals are prepared here every day.",
    detail: "The centre of daily family life—where nourishing food is prepared and shared around one table.",
    minimumStage: 7,
  },
  solar: {
    label: "SOLAR POWER",
    title: "Reliable electricity for the home.",
    detail: "Roof-mounted solar generation keeps essential lighting and services running dependably.",
    minimumStage: 9,
  },
  water: {
    label: "WATER SYSTEM",
    title: "Clean water for the family.",
    detail: "A dedicated storage system strengthens daily access to safe, reliable water at the home.",
    minimumStage: 10,
  },
};

const formatAmount = (amount: number) => `$${amount.toLocaleString("en-US")}`;

export default function LivingImpactVisualizer({ onDonate }: { onDonate: () => void }) {
  const [stageIndex, setStageIndex] = useState(4);
  const [settled, setSettled] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState<ImpactHotspot | null>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const section = useRef<HTMLElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const stage = stages[stageIndex];
  const progress = (stageIndex / (stages.length - 1)) * 100;
  const hotspot = selectedHotspot ? hotspotCopy[selectedHotspot] : null;

  useEffect(() => {
    const current = section.current;
    if (!current || sceneReady) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSceneReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "500px 0px" },
    );
    observer.observe(current);
    return () => observer.disconnect();
  }, [sceneReady]);

  useEffect(() => {
    const timer = window.setTimeout(() => setSettled(true), reduceMotion ? 0 : 1450);
    return () => window.clearTimeout(timer);
  }, [stageIndex, reduceMotion]);

  const selectStage = (nextStage: number) => {
    if (nextStage === stageIndex) return;
    if (selectedHotspot && nextStage < hotspotCopy[selectedHotspot].minimumStage) {
      setSelectedHotspot(null);
    }
    setSettled(false);
    setStageIndex(nextStage);
  };

  const sceneDescription = useMemo(
    () => `${formatAmount(stage.amount)} selected. ${stage.label}. ${stage.detail}`,
    [stage],
  );

  const availableHotspots = (Object.keys(hotspotCopy) as ImpactHotspot[]).filter(
    (key) => stageIndex >= hotspotCopy[key].minimumStage,
  );

  return (
    <section ref={section} className="living-impact" id="living-impact" aria-labelledby="living-impact-title">
      <div className="living-impact__heading">
        <div>
          <p className="eyebrow eyebrow--orange">LIVING IMPACT VISUALIZER</p>
          <h2 id="living-impact-title">SEE YOUR IMPACT<br /><em>COME TO LIFE.</em></h2>
        </div>
        <p>Every gift builds something real. Move the slider and watch hope take shape.</p>
      </div>

      <div className="impact-experience impact-experience--3d">
        <div className="impact-controls">
          <div className="impact-controls__amount">
            <span>YOUR POTENTIAL GIFT</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.strong
                key={stage.amount}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
                transition={{ duration: reduceMotion ? 0 : 0.3 }}
              >
                {formatAmount(stage.amount)}
              </motion.strong>
            </AnimatePresence>
            <small>STAGE {String(stageIndex + 1).padStart(2, "0")} / {stages.length}</small>
          </div>

          <label className="impact-range__label" htmlFor="impact-donation-range">
            <span>Move to build</span><b>{stage.label}</b>
          </label>
          <div className="impact-range" style={{ "--impact-progress": `${progress}%` } as CSSProperties}>
            <input
              id="impact-donation-range"
              type="range"
              min="0"
              max={stages.length - 1}
              step="1"
              value={stageIndex}
              aria-valuetext={sceneDescription}
              onChange={(event) => selectStage(Number(event.currentTarget.value))}
            />
            <span aria-hidden="true" />
          </div>

          <div className="impact-presets impact-presets--twelve" aria-label="Choose a donation amount">
            {stages.map((item, index) => (
              <button
                key={item.amount}
                type="button"
                aria-pressed={stageIndex === index}
                onClick={() => selectStage(index)}
              >
                {formatAmount(item.amount)}
              </button>
            ))}
          </div>

          <div className="impact-story" aria-live="polite" aria-atomic="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={stage.amount}
                initial={{ opacity: 0, x: reduceMotion ? 0 : -14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: reduceMotion ? 0 : 14 }}
                transition={{ duration: reduceMotion ? 0 : 0.35 }}
              >
                <span>{stage.label}</span>
                <h3>{stage.title}</h3>
                <p>{stage.detail}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {settled && (
              <motion.div
                className="impact-donate"
                initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.4 }}
              >
                <p>This is the difference your generosity can make.</p>
                <button className="button button--orange" type="button" onClick={onDonate}>
                  Help turn it into reality <span aria-hidden="true">↗</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="impact-visual impact-visual--3d">
          <div className="impact-visual__meta">
            <span>EDEN CAMPUS · ZIMBABWE</span>
            <b>REAL-TIME ARCHITECTURAL MODEL</b>
          </div>

          <div className="impact-3d-shell" role="img" aria-label={sceneDescription}>
            <div className="impact-3d-toolbar" aria-hidden="true">
              <span>DRAG TO ORBIT</span>
              <i />
              <span>SCROLL TO ZOOM</span>
              <i />
              <span>SHIFT + DRAG TO PAN</span>
            </div>

            {sceneReady ? (
              <EdenImpactScene
                stageIndex={stageIndex}
                selectedHotspot={selectedHotspot}
                onHotspot={setSelectedHotspot}
                reduceMotion={reduceMotion}
              />
            ) : (
              <div className="impact-3d-loader" role="status">
                <span />
                <b>Architectural model ready</b>
                <small>Scroll a little further to begin.</small>
              </div>
            )}

            {availableHotspots.length > 0 && (
              <div className="impact-hotspot-menu" aria-label="Explore the home">
                <span>EXPLORE</span>
                {availableHotspots.map((key) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={selectedHotspot === key}
                    onClick={() => setSelectedHotspot(key)}
                  >
                    {hotspotCopy[key].label}
                  </button>
                ))}
              </div>
            )}

            <AnimatePresence>
              {hotspot && (
                <motion.aside
                  className="impact-hotspot-card"
                  aria-live="polite"
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 18, scale: reduceMotion ? 1 : 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                  transition={{ duration: reduceMotion ? 0 : 0.34 }}
                >
                  <button type="button" aria-label="Close detail" onClick={() => setSelectedHotspot(null)}>CLOSE</button>
                  <span>{hotspot.label}</span>
                  <h3>{hotspot.title}</h3>
                  <p>{hotspot.detail}</p>
                </motion.aside>
              )}
            </AnimatePresence>

            <div className="impact-3d-status" aria-hidden="true">
              <span>{String(stageIndex + 1).padStart(2, "0")}</span>
              <div><i style={{ width: `${progress}%` }} /></div>
              <b>{stage.label}</b>
            </div>
          </div>

          <div className="impact-disclaimer">
            <span>INTERACTIVE 3D VISION</span>
            <p>Architectural visualisation of a family-style Eden children’s home. Final design and allocation of funds may vary according to local needs.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
