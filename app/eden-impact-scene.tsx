"use client";

import { Detailed, Environment, Line, OrbitControls, PerformanceMonitor, useGLTF } from "@react-three/drei";
import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { Bloom, DepthOfField, EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  ACESFilmicToneMapping,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PCFShadowMap,
  PlaneGeometry,
  PointLight,
  Points,
  PointsMaterial,
  SRGBColorSpace,
  Vector3,
} from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { ReactNode, RefObject, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

export type ImpactHotspot = "bedroom" | "kitchen" | "solar" | "water";

type SceneProps = {
  onHotspot: (hotspot: ImpactHotspot) => void;
  reduceMotion: boolean;
  selectedHotspot: ImpactHotspot | null;
  stageIndex: number;
};

type VectorTuple = [number, number, number];

const EARTH = new Color("#8c6748");
const GRASS = new Color("#6e7954");
const HOUSE_WIDTH = 10;
const HOUSE_DEPTH = 7;

function BuildPart({
  children,
  delay = 0,
  from = [0, -0.55, 0],
  position = [0, 0, 0],
  reduceMotion,
  scaleFrom = [0.02, 0.02, 0.02],
  stageStartedAt,
  visible,
}: {
  children: ReactNode;
  delay?: number;
  from?: VectorTuple;
  position?: VectorTuple;
  reduceMotion: boolean;
  scaleFrom?: VectorTuple;
  stageStartedAt: RefObject<number>;
  visible: boolean;
}) {
  const group = useRef<Group>(null);

  useLayoutEffect(() => {
    if (!group.current) return;
    const elapsed = performance.now() / 1000 - stageStartedAt.current;
    if (!visible || elapsed < delay + 0.18) {
      group.current.position.set(position[0] + from[0], position[1] + from[1], position[2] + from[2]);
      group.current.scale.set(...scaleFrom);
    }
  }, [delay, from, position, scaleFrom, stageStartedAt, visible]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const elapsed = performance.now() / 1000 - stageStartedAt.current;
    const revealed = visible && elapsed >= delay;
    const targetPosition = revealed
      ? position
      : ([position[0] + from[0], position[1] + from[1], position[2] + from[2]] as VectorTuple);
    const targetScale = revealed ? ([1, 1, 1] as VectorTuple) : scaleFrom;
    const speed = reduceMotion ? 1000 : 5.2;

    group.current.position.x = MathUtils.damp(group.current.position.x, targetPosition[0], speed, delta);
    group.current.position.y = MathUtils.damp(group.current.position.y, targetPosition[1], speed, delta);
    group.current.position.z = MathUtils.damp(group.current.position.z, targetPosition[2], speed, delta);
    group.current.scale.x = MathUtils.damp(group.current.scale.x, targetScale[0], speed, delta);
    group.current.scale.y = MathUtils.damp(group.current.scale.y, targetScale[1], speed, delta);
    group.current.scale.z = MathUtils.damp(group.current.scale.z, targetScale[2], speed, delta);
    group.current.visible = group.current.scale.lengthSq() > 0.00004;
  });

  return <group ref={group}>{children}</group>;
}

function Terrain({ stageIndex }: { stageIndex: number }) {
  const material = useRef<MeshStandardMaterial>(null);
  const geometry = useMemo(() => {
    const plane = new PlaneGeometry(38, 32, 70, 60);
    const positions = plane.attributes.position as BufferAttribute;
    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      const y = positions.getY(index);
      const height = Math.sin(x * 0.34) * 0.055 + Math.cos(y * 0.27) * 0.045;
      positions.setZ(index, height);
    }
    plane.computeVertexNormals();
    return plane;
  }, []);

  useFrame((_, delta) => {
    if (!material.current) return;
    const target = stageIndex >= 10 ? GRASS : EARTH;
    material.current.color.lerp(target, 1 - Math.exp(-delta * 1.35));
  });

  return (
    <mesh geometry={geometry} rotation-x={-Math.PI / 2} receiveShadow>
      <meshStandardMaterial ref={material} color={EARTH} roughness={0.96} metalness={0} />
    </mesh>
  );
}

function SurveyAndFootprint({
  reduceMotion,
  stageIndex,
  stageStartedAt,
}: Pick<SceneProps, "reduceMotion" | "stageIndex"> & { stageStartedAt: RefObject<number> }) {
  const lineColor = stageIndex === 0 ? "#f2d6a0" : "#d3bd91";
  const outline: VectorTuple[] = [
    [-5, 0.08, -3.5], [5, 0.08, -3.5], [5, 0.08, 3.5], [-5, 0.08, 3.5], [-5, 0.08, -3.5],
  ];

  return (
    <BuildPart
      visible={stageIndex <= 2}
      stageStartedAt={stageStartedAt}
      reduceMotion={reduceMotion}
      scaleFrom={[0.1, 1, 0.1]}
      from={[0, 0.02, 0]}
    >
      <Line points={outline} color={lineColor} lineWidth={1.25} transparent opacity={0.9} />
      {outline.slice(0, 4).map((position, index) => (
        <group key={index} position={position}>
          <mesh position-y={0.42} castShadow>
            <cylinderGeometry args={[0.045, 0.055, 0.85, 12]} />
            <meshStandardMaterial color="#a7794b" roughness={0.85} />
          </mesh>
          <mesh position={[0.18, 0.58, 0]} rotation-z={Math.PI / 2.5} castShadow>
            <boxGeometry args={[0.48, 0.07, 0.1]} />
            <meshStandardMaterial color="#eee0c6" roughness={0.78} />
          </mesh>
        </group>
      ))}
    </BuildPart>
  );
}

function TrenchesAndFootings({
  reduceMotion,
  stageIndex,
  stageStartedAt,
}: Pick<SceneProps, "reduceMotion" | "stageIndex"> & { stageStartedAt: RefObject<number> }) {
  const pieces: Array<{ position: VectorTuple; size: VectorTuple }> = [
    { position: [0, 0.03, -3.5], size: [10.4, 0.18, 0.5] },
    { position: [0, 0.03, 3.5], size: [10.4, 0.18, 0.5] },
    { position: [-5, 0.03, 0], size: [0.5, 0.18, 7] },
    { position: [5, 0.03, 0], size: [0.5, 0.18, 7] },
  ];

  return (
    <group>
      {pieces.map((piece, index) => (
        <BuildPart
          key={`trench-${index}`}
          visible={stageIndex >= 1 && stageIndex < 3}
          stageStartedAt={stageStartedAt}
          reduceMotion={reduceMotion}
          position={piece.position}
          from={[0, -0.16, 0]}
          scaleFrom={piece.size[0] > piece.size[2] ? [0.02, 1, 1] : [1, 1, 0.02]}
          delay={index * 0.1}
        >
          <mesh receiveShadow>
            <boxGeometry args={piece.size} />
            <meshStandardMaterial color="#594536" roughness={1} />
          </mesh>
        </BuildPart>
      ))}
      {pieces.map((piece, index) => (
        <BuildPart
          key={`footing-${index}`}
          visible={stageIndex >= 1}
          stageStartedAt={stageStartedAt}
          reduceMotion={reduceMotion}
          position={[piece.position[0], 0.08, piece.position[2]]}
          from={[0, -0.28, 0]}
          scaleFrom={piece.size[0] > piece.size[2] ? [0.02, 0.1, 1] : [1, 0.1, 0.02]}
          delay={0.34 + index * 0.12}
        >
          <mesh castShadow receiveShadow>
            <boxGeometry args={[piece.size[0], 0.32, piece.size[2]]} />
            <meshStandardMaterial color="#aaa69b" roughness={0.92} />
          </mesh>
        </BuildPart>
      ))}
      <ConcretePour active={stageIndex === 1} reduceMotion={reduceMotion} />
    </group>
  );
}

function ConcretePour({ active, reduceMotion }: { active: boolean; reduceMotion: boolean }) {
  const stream = useRef<Group>(null);
  useFrame(({ clock }, delta) => {
    if (!stream.current) return;
    const target = active ? 1 : 0;
    stream.current.scale.y = MathUtils.damp(stream.current.scale.y, target, reduceMotion ? 1000 : 5, delta);
    if (active && !reduceMotion) {
      stream.current.position.x = Math.sin(clock.elapsedTime * 0.72) * 4.15;
    }
  });

  return (
    <group ref={stream} position={[0, 1.25, 3.5]} scale={[1, 0, 1]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.08, 0.11, 2.2, 16]} />
        <meshStandardMaterial color="#b6b2a9" roughness={0.9} />
      </mesh>
      <mesh position-y={1.16} rotation-z={Math.PI / 2.6} castShadow>
        <cylinderGeometry args={[0.11, 0.11, 1.45, 18]} />
        <meshStandardMaterial color="#5a5a56" metalness={0.5} roughness={0.48} />
      </mesh>
    </group>
  );
}

function FoundationAndSlab({
  reduceMotion,
  stageIndex,
  stageStartedAt,
}: Pick<SceneProps, "reduceMotion" | "stageIndex"> & { stageStartedAt: RefObject<number> }) {
  const foundations: Array<{ position: VectorTuple; size: VectorTuple }> = [
    { position: [0, 0.38, -3.5], size: [10.2, 0.72, 0.38] },
    { position: [0, 0.38, 3.5], size: [10.2, 0.72, 0.38] },
    { position: [-5, 0.38, 0], size: [0.38, 0.72, 6.65] },
    { position: [5, 0.38, 0], size: [0.38, 0.72, 6.65] },
  ];

  return (
    <group>
      {foundations.map((piece, index) => (
        <BuildPart
          key={index}
          visible={stageIndex >= 2}
          stageStartedAt={stageStartedAt}
          reduceMotion={reduceMotion}
          position={piece.position}
          from={[0, -0.72, 0]}
          scaleFrom={[1, 0.03, 1]}
          delay={index * 0.13}
        >
          <mesh castShadow receiveShadow>
            <boxGeometry args={piece.size} />
            <meshStandardMaterial color="#765c48" roughness={0.94} />
          </mesh>
        </BuildPart>
      ))}
      <BuildPart
        visible={stageIndex >= 3}
        stageStartedAt={stageStartedAt}
        reduceMotion={reduceMotion}
        position={[0, 0.55, 0]}
        from={[0, -0.6, 0]}
        scaleFrom={[0.02, 0.08, 0.02]}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[9.72, 0.28, 6.72]} />
          <meshStandardMaterial color="#b7b0a2" roughness={0.78} />
        </mesh>
      </BuildPart>
    </group>
  );
}

type Opening = { end: number; fromCourse: number; start: number; toCourse: number };

function splitWall(length: number, course: number, openings: Opening[]) {
  const half = length / 2;
  const active = openings
    .filter((opening) => course >= opening.fromCourse && course <= opening.toCourse)
    .sort((a, b) => a.start - b.start);
  const segments: Array<[number, number]> = [];
  let cursor = -half;
  active.forEach((opening) => {
    if (opening.start > cursor) segments.push([(cursor + opening.start) / 2, opening.start - cursor]);
    cursor = Math.max(cursor, opening.end);
  });
  if (cursor < half) segments.push([(cursor + half) / 2, half - cursor]);
  return segments;
}

function WallCourses({
  reduceMotion,
  stageIndex,
  stageStartedAt,
}: Pick<SceneProps, "reduceMotion" | "stageIndex"> & { stageStartedAt: RefObject<number> }) {
  const frontOpenings: Opening[] = [
    { start: -0.82, end: 0.82, fromCourse: 0, toCourse: 6 },
    { start: 1.65, end: 3.3, fromCourse: 2, toCourse: 6 },
  ];
  const backOpenings: Opening[] = [
    { start: -3.55, end: -1.95, fromCourse: 2, toCourse: 6 },
    { start: 1.85, end: 3.45, fromCourse: 2, toCourse: 6 },
  ];
  const sideOpenings: Opening[] = [{ start: -1.05, end: 0.7, fromCourse: 2, toCourse: 6 }];

  return (
    <group>
      {Array.from({ length: 10 }, (_, course) => {
        const y = 0.82 + course * 0.29;
        return (
          <BuildPart
            key={course}
            visible={stageIndex >= 4}
            stageStartedAt={stageStartedAt}
            reduceMotion={reduceMotion}
            from={[0, -0.72, 0]}
            scaleFrom={[0.98, 0.015, 0.98]}
            delay={course * 0.105}
          >
            {splitWall(HOUSE_WIDTH, course, frontOpenings).map(([x, width], index) => (
              <WallMesh key={`front-${index}`} position={[x, y, 3.5]} size={[width - 0.035, 0.255, 0.3]} />
            ))}
            {splitWall(HOUSE_WIDTH, course, backOpenings).map(([x, width], index) => (
              <WallMesh key={`back-${index}`} position={[x, y, -3.5]} size={[width - 0.035, 0.255, 0.3]} />
            ))}
            {splitWall(HOUSE_DEPTH, course, sideOpenings).map(([z, depth], index) => (
              <WallMesh key={`left-${index}`} position={[-5, y, z]} size={[0.3, 0.255, depth - 0.035]} />
            ))}
            {splitWall(HOUSE_DEPTH, course, sideOpenings).map(([z, depth], index) => (
              <WallMesh key={`right-${index}`} position={[5, y, z]} size={[0.3, 0.255, depth - 0.035]} />
            ))}
          </BuildPart>
        );
      })}
      <OpeningInfill stageIndex={stageIndex} stageStartedAt={stageStartedAt} reduceMotion={reduceMotion} />
    </group>
  );
}

function WallMesh({ position, size }: { position: VectorTuple; size: VectorTuple }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#bd8057" roughness={0.83} metalness={0.01} />
    </mesh>
  );
}

function OpeningInfill({
  reduceMotion,
  stageIndex,
  stageStartedAt,
}: Pick<SceneProps, "reduceMotion" | "stageIndex"> & { stageStartedAt: RefObject<number> }) {
  const fillVisible = stageIndex === 4;
  const fills: Array<{ position: VectorTuple; size: VectorTuple }> = [
    { position: [0, 1.68, 3.5], size: [1.6, 1.98, 0.29] },
    { position: [2.48, 2.08, 3.5], size: [1.62, 1.42, 0.29] },
    { position: [-2.75, 2.08, -3.5], size: [1.57, 1.42, 0.29] },
    { position: [2.65, 2.08, -3.5], size: [1.57, 1.42, 0.29] },
    { position: [-5, 2.08, -0.18], size: [0.29, 1.42, 1.7] },
    { position: [5, 2.08, -0.18], size: [0.29, 1.42, 1.7] },
  ];

  return (
    <group>
      {fills.map((fill, index) => (
        <BuildPart
          key={index}
          visible={fillVisible}
          stageStartedAt={stageStartedAt}
          reduceMotion={reduceMotion}
          position={fill.position}
          from={[0, -1.5, 0]}
          scaleFrom={[0.04, 0.04, 0.04]}
          delay={index * 0.04}
        >
          <mesh castShadow receiveShadow>
            <boxGeometry args={fill.size} />
            <meshStandardMaterial color="#b47751" roughness={0.9} />
          </mesh>
        </BuildPart>
      ))}
    </group>
  );
}

function OpeningFrames({
  onHotspot,
  reduceMotion,
  selectedHotspot,
  stageIndex,
  stageStartedAt,
}: SceneProps & { stageStartedAt: RefObject<number> }) {
  return (
    <group>
      <BuildPart visible={stageIndex >= 5} stageStartedAt={stageStartedAt} reduceMotion={reduceMotion} from={[0, 1.6, 0]} scaleFrom={[0.1, 0.1, 0.1]}>
        <DoorFrame position={[0, 1.67, 3.34]} />
        <WindowFrame position={[2.48, 2.08, 3.34]} />
        <WindowFrame position={[-2.75, 2.08, -3.34]} rotationY={Math.PI} />
        <WindowFrame position={[2.65, 2.08, -3.34]} rotationY={Math.PI} />
        <WindowFrame position={[-4.84, 2.08, -0.18]} rotationY={Math.PI / 2} />
        <WindowFrame position={[4.84, 2.08, -0.18]} rotationY={-Math.PI / 2} />
      </BuildPart>

      <BuildPart visible={stageIndex >= 7} stageStartedAt={stageStartedAt} reduceMotion={reduceMotion} from={[0, 0, 2.2]} scaleFrom={[0.8, 0.8, 0.08]}>
        <Door position={[0, 1.67, 3.31]} />
        <WindowPane position={[2.48, 2.08, 3.31]} onClick={() => onHotspot("kitchen")} selected={selectedHotspot === "kitchen"} />
      </BuildPart>
      <BuildPart visible={stageIndex >= 7} stageStartedAt={stageStartedAt} reduceMotion={reduceMotion} from={[0, 1.8, 0]} scaleFrom={[0.1, 0.1, 0.1]} delay={0.14}>
        <WindowPane position={[-2.75, 2.08, -3.31]} rotationY={Math.PI} onClick={() => onHotspot("bedroom")} selected={selectedHotspot === "bedroom"} />
        <WindowPane position={[2.65, 2.08, -3.31]} rotationY={Math.PI} onClick={() => onHotspot("kitchen")} selected={selectedHotspot === "kitchen"} />
        <WindowPane position={[-4.81, 2.08, -0.18]} rotationY={Math.PI / 2} onClick={() => onHotspot("bedroom")} selected={selectedHotspot === "bedroom"} />
        <WindowPane position={[4.81, 2.08, -0.18]} rotationY={-Math.PI / 2} onClick={() => onHotspot("kitchen")} selected={selectedHotspot === "kitchen"} />
      </BuildPart>
    </group>
  );
}

function DoorFrame({ position }: { position: VectorTuple }) {
  return (
    <group position={position}>
      <FrameBar position={[-0.82, 0, 0]} size={[0.12, 2.12, 0.18]} />
      <FrameBar position={[0.82, 0, 0]} size={[0.12, 2.12, 0.18]} />
      <FrameBar position={[0, 1.02, 0]} size={[1.76, 0.12, 0.18]} />
    </group>
  );
}

function WindowFrame({ position, rotationY = 0 }: { position: VectorTuple; rotationY?: number }) {
  return (
    <group position={position} rotation-y={rotationY}>
      <FrameBar position={[-0.82, 0, 0]} size={[0.1, 1.52, 0.15]} />
      <FrameBar position={[0.82, 0, 0]} size={[0.1, 1.52, 0.15]} />
      <FrameBar position={[0, 0.74, 0]} size={[1.72, 0.1, 0.15]} />
      <FrameBar position={[0, -0.74, 0]} size={[1.72, 0.1, 0.15]} />
      <FrameBar position={[0, 0, 0]} size={[0.075, 1.42, 0.14]} />
    </group>
  );
}

function FrameBar({ position, size }: { position: VectorTuple; size: VectorTuple }) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#41362e" roughness={0.52} metalness={0.17} />
    </mesh>
  );
}

function Door({ position }: { position: VectorTuple }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[1.47, 1.95, 0.11]} />
      <meshStandardMaterial color="#6f4932" roughness={0.65} metalness={0.02} />
    </mesh>
  );
}

function WindowPane({
  onClick,
  position,
  rotationY = 0,
  selected,
}: {
  onClick: () => void;
  position: VectorTuple;
  rotationY?: number;
  selected: boolean;
}) {
  const pointer = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    document.body.style.cursor = "pointer";
  };
  return (
    <group position={position} rotation-y={rotationY}>
      <mesh
        onClick={(event) => { event.stopPropagation(); onClick(); }}
        onPointerOver={pointer}
        onPointerOut={() => { document.body.style.cursor = "auto"; }}
      >
        <boxGeometry args={[1.52, 1.34, 0.055]} />
        <meshPhysicalMaterial
          color={selected ? "#ffe3a7" : "#9cb6b4"}
          transparent
          opacity={0.48}
          roughness={0.12}
          metalness={0.1}
          clearcoat={0.9}
          transmission={0.22}
        />
      </mesh>
    </group>
  );
}

function RoofStructure({
  reduceMotion,
  stageIndex,
  stageStartedAt,
}: Pick<SceneProps, "reduceMotion" | "stageIndex"> & { stageStartedAt: RefObject<number> }) {
  return (
    <group>
      {Array.from({ length: 7 }, (_, index) => (
        <BuildPart
          key={index}
          visible={stageIndex >= 6}
          stageStartedAt={stageStartedAt}
          reduceMotion={reduceMotion}
          position={[0, 0, -3 + index]}
          from={[0, 5.8, 0]}
          scaleFrom={[0.08, 0.08, 0.08]}
          delay={index * 0.115}
        >
          <Truss />
        </BuildPart>
      ))}
      <BuildPart visible={stageIndex >= 6} stageStartedAt={stageStartedAt} reduceMotion={reduceMotion} from={[-7, 4, 0]} scaleFrom={[0.15, 0.15, 0.7]} delay={0.84}>
        <RoofSheet side="left" />
      </BuildPart>
      <BuildPart visible={stageIndex >= 6} stageStartedAt={stageStartedAt} reduceMotion={reduceMotion} from={[7, 4, 0]} scaleFrom={[0.15, 0.15, 0.7]} delay={1.04}>
        <RoofSheet side="right" />
      </BuildPart>
    </group>
  );
}

function Truss() {
  return (
    <group>
      <TimberBeam position={[0, 3.48, 0]} size={[10.3, 0.12, 0.12]} />
      <TimberBeam position={[-2.5, 4.28, 0]} size={[5.28, 0.13, 0.13]} rotationZ={0.31} />
      <TimberBeam position={[2.5, 4.28, 0]} size={[5.28, 0.13, 0.13]} rotationZ={-0.31} />
      <TimberBeam position={[0, 4.25, 0]} size={[0.11, 1.55, 0.11]} />
    </group>
  );
}

function TimberBeam({ position, rotationZ = 0, size }: { position: VectorTuple; rotationZ?: number; size: VectorTuple }) {
  return (
    <mesh position={position} rotation-z={rotationZ} castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#76543d" roughness={0.74} />
    </mesh>
  );
}

function RoofSheet({ side }: { side: "left" | "right" }) {
  const direction = side === "left" ? -1 : 1;
  return (
    <mesh position={[direction * 2.52, 4.31, 0]} rotation-z={direction * -0.31} castShadow receiveShadow>
      <boxGeometry args={[5.36, 0.12, 7.55, 14, 1, 14]} />
      <meshStandardMaterial color="#6f6254" roughness={0.42} metalness={0.38} />
    </mesh>
  );
}

function Interior({
  reduceMotion,
  stageIndex,
  stageStartedAt,
}: Pick<SceneProps, "reduceMotion" | "stageIndex"> & { stageStartedAt: RefObject<number> }) {
  const lightIntensity = useRef(0);
  const leftLight = useRef<PointLight>(null);
  const rightLight = useRef<PointLight>(null);

  useFrame((_, delta) => {
    const target = stageIndex >= 11 ? 16 : stageIndex >= 8 ? 8 : 0;
    lightIntensity.current = MathUtils.damp(lightIntensity.current, target, 3.2, delta);
    if (leftLight.current) leftLight.current.intensity = lightIntensity.current;
    if (rightLight.current) rightLight.current.intensity = lightIntensity.current;
  });

  return (
    <group>
      <BuildPart visible={stageIndex >= 8} stageStartedAt={stageStartedAt} reduceMotion={reduceMotion} from={[0, -0.35, 0]} scaleFrom={[0.02, 0.03, 0.02]}>
        <mesh position={[0, 0.73, 0]} receiveShadow>
          <boxGeometry args={[9.55, 0.08, 6.55]} />
          <meshStandardMaterial color="#b89168" roughness={0.72} />
        </mesh>
      </BuildPart>
      <BuildPart visible={stageIndex >= 8} stageStartedAt={stageStartedAt} reduceMotion={reduceMotion} from={[0, -2.7, 0]} scaleFrom={[1, 0.02, 1]} delay={0.18}>
        <mesh position={[-0.75, 2.05, -0.45]} castShadow receiveShadow>
          <boxGeometry args={[0.18, 2.55, 5.8]} />
          <meshStandardMaterial color="#d2b59a" roughness={0.82} />
        </mesh>
        <mesh position={[2.1, 2.05, 0.5]} castShadow receiveShadow>
          <boxGeometry args={[5.4, 2.55, 0.16]} />
          <meshStandardMaterial color="#d2b59a" roughness={0.82} />
        </mesh>
      </BuildPart>
      <BuildPart visible={stageIndex >= 8} stageStartedAt={stageStartedAt} reduceMotion={reduceMotion} from={[0, 3.2, 0]} scaleFrom={[0.02, 0.02, 0.02]} delay={0.36}>
        <mesh position={[0, 3.42, 0]} receiveShadow>
          <boxGeometry args={[9.55, 0.08, 6.55]} />
          <meshStandardMaterial color="#ded2bf" roughness={0.9} />
        </mesh>
      </BuildPart>
      <pointLight ref={leftLight} position={[-2.8, 2.7, -1.4]} color="#ffd39a" distance={7} decay={2} />
      <pointLight ref={rightLight} position={[2.8, 2.7, 1.2]} color="#ffd39a" distance={7} decay={2} />
    </group>
  );
}

function useArchitecturalParts() {
  const gltf = useGLTF("/models/eden-architectural-assets.glb");
  return useMemo(() => {
    const clonePart = (name: string) => {
      const source = gltf.scene.getObjectByName(name);
      if (!source) return null;
      const clone = source.clone(true);
      clone.traverse((object) => {
        if (object instanceof Mesh) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });
      return clone;
    };
    return {
      bedroom: clonePart("Bedroom"),
      dining: clonePart("Dining"),
      kitchen: clonePart("Kitchen"),
      landscape: clonePart("LandscapeFurniture"),
      solar: clonePart("SolarPanels"),
      water: clonePart("WaterTank"),
    };
  }, [gltf.scene]);
}

function ArchitecturalAssets({
  onHotspot,
  reduceMotion,
  selectedHotspot,
  stageIndex,
  stageStartedAt,
}: SceneProps & { stageStartedAt: RefObject<number> }) {
  const parts = useArchitecturalParts();
  return (
    <group>
      <AssetPart hotspot="bedroom" object={parts.bedroom} onHotspot={onHotspot} visible={stageIndex >= 9} stageStartedAt={stageStartedAt} reduceMotion={reduceMotion} from={[0, -0.85, 0]} />
      <AssetPart hotspot="kitchen" object={parts.kitchen} onHotspot={onHotspot} visible={stageIndex >= 9} stageStartedAt={stageStartedAt} reduceMotion={reduceMotion} from={[0, -0.85, 0]} delay={0.15} />
      <AssetPart hotspot="kitchen" object={parts.dining} onHotspot={onHotspot} visible={stageIndex >= 9} stageStartedAt={stageStartedAt} reduceMotion={reduceMotion} from={[0, -0.85, 0]} delay={0.3} />
      <AssetPart hotspot="solar" object={parts.solar} onHotspot={onHotspot} visible={stageIndex >= 9} stageStartedAt={stageStartedAt} reduceMotion={reduceMotion} from={[0, 5, 0]} delay={0.42} />
      <AssetPart hotspot="water" object={parts.water} onHotspot={onHotspot} visible={stageIndex >= 10} stageStartedAt={stageStartedAt} reduceMotion={reduceMotion} from={[0, -2.5, 0]} delay={0.42} />
      {parts.landscape && (
        <BuildPart visible={stageIndex >= 10} stageStartedAt={stageStartedAt} reduceMotion={reduceMotion} from={[0, -0.8, 0]} scaleFrom={[0.05, 0.05, 0.05]} delay={0.25}>
          <primitive object={parts.landscape} />
        </BuildPart>
      )}
      {selectedHotspot && <HotspotHalo hotspot={selectedHotspot} />}
    </group>
  );
}

function AssetPart({
  delay = 0,
  from,
  hotspot,
  object,
  onHotspot,
  reduceMotion,
  stageStartedAt,
  visible,
}: {
  delay?: number;
  from: VectorTuple;
  hotspot: ImpactHotspot;
  object: Object3D | null;
  onHotspot: (hotspot: ImpactHotspot) => void;
  reduceMotion: boolean;
  stageStartedAt: RefObject<number>;
  visible: boolean;
}) {
  if (!object) return null;
  return (
    <BuildPart visible={visible} stageStartedAt={stageStartedAt} reduceMotion={reduceMotion} from={from} scaleFrom={[0.08, 0.08, 0.08]} delay={delay}>
      <group
        onClick={(event) => { event.stopPropagation(); onHotspot(hotspot); }}
        onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { document.body.style.cursor = "auto"; }}
      >
        <primitive object={object} />
      </group>
    </BuildPart>
  );
}

function HotspotHalo({ hotspot }: { hotspot: ImpactHotspot }) {
  const ring = useRef<Mesh>(null);
  const positions: Record<ImpactHotspot, VectorTuple> = {
    bedroom: [-2.4, 0.78, -1.8],
    kitchen: [2.5, 0.78, -2.4],
    solar: [-0.7, 4.45, 0],
    water: [-6.3, 0.18, -2.8],
  };
  useFrame(({ clock }) => {
    if (!ring.current) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 2.2) * 0.09;
    ring.current.scale.setScalar(pulse);
  });
  return (
    <mesh ref={ring} position={positions[hotspot]} rotation-x={-Math.PI / 2}>
      <ringGeometry args={[0.68, 0.76, 64]} />
      <meshBasicMaterial color="#efb56e" transparent opacity={0.82} toneMapped={false} />
    </mesh>
  );
}

function Landscape({
  reduceMotion,
  stageIndex,
  stageStartedAt,
}: Pick<SceneProps, "reduceMotion" | "stageIndex"> & { stageStartedAt: RefObject<number> }) {
  const trees: VectorTuple[] = [
    [-9.2, 0, -4.2], [-7.4, 0, 5.4], [8.2, 0, -5.2], [9.6, 0, 3.4], [-10.4, 0, 2.1], [6.7, 0, 6.2],
  ];
  return (
    <group>
      <BuildPart visible={stageIndex >= 10} stageStartedAt={stageStartedAt} reduceMotion={reduceMotion} from={[0, -0.15, 0]} scaleFrom={[0.02, 0.1, 0.02]}>
        <mesh position={[0, 0.1, 7.2]} rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[2.4, 8.8, 1, 16]} />
          <meshStandardMaterial color="#c3ad88" roughness={0.96} />
        </mesh>
        <mesh position={[-7.8, 0.1, 1.4]} rotation-x={-Math.PI / 2} rotation-z={-0.4} receiveShadow>
          <planeGeometry args={[1.4, 7, 1, 12]} />
          <meshStandardMaterial color="#bda780" roughness={0.96} />
        </mesh>
      </BuildPart>
      {trees.map((position, index) => (
        <BuildPart
          key={index}
          visible={stageIndex >= 10}
          stageStartedAt={stageStartedAt}
          reduceMotion={reduceMotion}
          position={position}
          from={[0, -0.2, 0]}
          scaleFrom={[0.015, 0.015, 0.015]}
          delay={0.16 + index * 0.13}
        >
          <Tree />
        </BuildPart>
      ))}
      <BuildPart visible={stageIndex >= 10} stageStartedAt={stageStartedAt} reduceMotion={reduceMotion} scaleFrom={[0.02, 0.02, 0.02]} delay={0.58}>
        {Array.from({ length: 18 }, (_, index) => {
          const angle = (index / 18) * Math.PI * 2;
          const radius = 7.5 + (index % 3) * 0.9;
          return (
            <mesh key={index} position={[Math.cos(angle) * radius, 0.28, Math.sin(angle) * radius]} castShadow>
              <sphereGeometry args={[0.22 + (index % 2) * 0.08, 16, 12]} />
              <meshStandardMaterial color={index % 2 ? "#798257" : "#596946"} roughness={0.92} />
            </mesh>
          );
        })}
      </BuildPart>
    </group>
  );
}

function Tree() {
  return (
    <Detailed distances={[0, 14, 27]}>
      <TreeHigh />
      <TreeMedium />
      <TreeLow />
    </Detailed>
  );
}

function TreeHigh() {
  return (
    <group>
      <mesh position-y={1.75} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.38, 3.5, 20]} />
        <meshStandardMaterial color="#654834" roughness={0.94} />
      </mesh>
      {[[-0.55, 3.55, 0], [0.5, 3.8, 0.2], [0, 4.35, -0.25]].map((position, index) => (
        <mesh key={index} position={position as VectorTuple} scale={[1.25, 0.9, 1.15]} castShadow>
          <sphereGeometry args={[1.25, 24, 18]} />
          <meshStandardMaterial color={index === 1 ? "#596845" : "#66734d"} roughness={0.96} />
        </mesh>
      ))}
    </group>
  );
}

function TreeMedium() {
  return (
    <group>
      <mesh position-y={1.7} castShadow><cylinderGeometry args={[0.24, 0.36, 3.4, 12]} /><meshStandardMaterial color="#654834" roughness={0.95} /></mesh>
      <mesh position-y={3.85} scale={[1.45, 1.1, 1.35]} castShadow><sphereGeometry args={[1.4, 12, 10]} /><meshStandardMaterial color="#607049" roughness={0.97} /></mesh>
    </group>
  );
}

function TreeLow() {
  return (
    <group>
      <mesh position-y={1.6}><cylinderGeometry args={[0.28, 0.4, 3.2, 8]} /><meshStandardMaterial color="#654834" roughness={1} /></mesh>
      <mesh position-y={3.7}><sphereGeometry args={[1.55, 8, 6]} /><meshStandardMaterial color="#607049" roughness={1} /></mesh>
    </group>
  );
}

function Dust({ stageIndex }: { stageIndex: number }) {
  const points = useRef<Points>(null);
  const geometry = useMemo(() => {
    const positions = new Float32Array(90 * 3);
    for (let index = 0; index < 90; index += 1) {
      const x = Math.sin(index * 12.9898 + 1.7) * 43758.5453;
      const y = Math.sin(index * 29.233 + 8.1) * 21758.1127;
      const z = Math.sin(index * 7.113 + 4.4) * 33758.981;
      positions[index * 3] = (x - Math.floor(x) - 0.5) * 13;
      positions[index * 3 + 1] = (y - Math.floor(y)) * 2.5 + 0.1;
      positions[index * 3 + 2] = (z - Math.floor(z) - 0.5) * 10;
    }
    const built = new BufferGeometry();
    built.setAttribute("position", new BufferAttribute(positions, 3));
    return built;
  }, []);
  useFrame(({ clock }, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * 0.025;
    const material = points.current.material as PointsMaterial;
    const active = stageIndex >= 1 && stageIndex <= 7;
    material.opacity = MathUtils.damp(material.opacity, active ? 0.18 + Math.sin(clock.elapsedTime) * 0.04 : 0, 2.5, delta);
  });
  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial color="#d6b783" size={0.055} transparent opacity={0} depthWrite={false} />
    </points>
  );
}

function LivingDetails({ reduceMotion, stageIndex }: Pick<SceneProps, "reduceMotion" | "stageIndex">) {
  const group = useRef<Group>(null);
  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const target = stageIndex >= 11 ? 1 : 0.001;
    const scale = MathUtils.damp(group.current.scale.x, target, reduceMotion ? 1000 : 3.6, delta);
    group.current.scale.setScalar(scale);
    if (!reduceMotion && stageIndex >= 11) group.current.position.x = Math.sin(clock.elapsedTime * 0.45) * 0.45;
  });
  return (
    <group ref={group} scale={0.001}>
      <HumanSilhouette position={[-1.2, 0.1, 6.2]} color="#b46e43" />
      <HumanSilhouette position={[0.1, 0.1, 6.6]} color="#d3a36b" scale={0.9} />
      <HumanSilhouette position={[1.25, 0.1, 6.05]} color="#7f8b62" scale={0.83} />
      <BirdFlock reduceMotion={reduceMotion} />
    </group>
  );
}

function HumanSilhouette({ color, position, scale = 1 }: { color: string; position: VectorTuple; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position-y={1.25} castShadow><capsuleGeometry args={[0.19, 0.62, 8, 18]} /><meshStandardMaterial color={color} roughness={0.88} /></mesh>
      <mesh position-y={1.92} castShadow><sphereGeometry args={[0.23, 20, 16]} /><meshStandardMaterial color="#754c36" roughness={0.93} /></mesh>
      <mesh position={[-0.13, 0.45, 0]} castShadow><capsuleGeometry args={[0.07, 0.65, 6, 12]} /><meshStandardMaterial color="#4d443b" roughness={0.9} /></mesh>
      <mesh position={[0.13, 0.45, 0]} castShadow><capsuleGeometry args={[0.07, 0.65, 6, 12]} /><meshStandardMaterial color="#4d443b" roughness={0.9} /></mesh>
    </group>
  );
}

function BirdFlock({ reduceMotion }: { reduceMotion: boolean }) {
  const flock = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!flock.current || reduceMotion) return;
    const time = clock.elapsedTime * 0.16;
    flock.current.position.set(Math.cos(time) * 9, 8.8 + Math.sin(time * 2) * 0.5, Math.sin(time) * 7);
    flock.current.rotation.y = -time;
  });
  return (
    <group ref={flock} position={[6, 8.5, -5]}>
      {[0, 1, 2, 3].map((index) => (
        <group key={index} position={[index * 0.45, Math.sin(index) * 0.18, (index % 2) * 0.4]} scale={0.7 + index * 0.08}>
          <mesh position-x={-0.08} rotation-z={0.25}><sphereGeometry args={[0.16, 10, 8]} /><meshStandardMaterial color="#3e3b36" roughness={0.9} /></mesh>
          <mesh position-x={0.08} rotation-z={-0.25}><sphereGeometry args={[0.16, 10, 8]} /><meshStandardMaterial color="#3e3b36" roughness={0.9} /></mesh>
        </group>
      ))}
    </group>
  );
}

function SceneLighting({ stageIndex, lowQuality }: { lowQuality: boolean; stageIndex: number }) {
  const sun = useRef<DirectionalLight>(null);
  useFrame((_, delta) => {
    if (!sun.current) return;
    const target = stageIndex >= 11 ? 2.6 : 3.6;
    sun.current.intensity = MathUtils.damp(sun.current.intensity, target, 1.8, delta);
  });
  return (
    <>
      <hemisphereLight color="#ffd9a8" groundColor="#4e4c3a" intensity={1.35} />
      <directionalLight
        ref={sun}
        position={[-10, 16, 9]}
        color="#ffd19a"
        intensity={3.6}
        castShadow
        shadow-mapSize-width={lowQuality ? 1024 : 2048}
        shadow-mapSize-height={lowQuality ? 1024 : 2048}
        shadow-camera-near={1}
        shadow-camera-far={42}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-bias={-0.00018}
      />
    </>
  );
}

function SunsetEnvironment() {
  const [file, setFile] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    import("@pmndrs/assets/hdri/sunset.exr.js").then((module) => {
      if (active) setFile(module.default);
    });
    return () => { active = false; };
  }, []);
  if (!file) return null;
  return <Environment files={file} background={false} />;
}

const cameraFrames = [
  { position: [13.5, 8.5, 14] as VectorTuple, target: [0, 0.65, 0] as VectorTuple },
  { position: [12.6, 7.5, 13.5] as VectorTuple, target: [0, 0.5, 0] as VectorTuple },
  { position: [11.8, 6.8, 12.8] as VectorTuple, target: [0, 0.85, 0] as VectorTuple },
  { position: [11.4, 6.6, 12.2] as VectorTuple, target: [0, 0.9, 0] as VectorTuple },
  { position: [12.3, 7.8, 12.8] as VectorTuple, target: [0, 1.8, 0] as VectorTuple },
  { position: [10.8, 6.8, 11.6] as VectorTuple, target: [1.2, 1.9, 1.8] as VectorTuple },
  { position: [13.2, 9.2, 12.8] as VectorTuple, target: [0, 3, 0] as VectorTuple },
  { position: [10.8, 6.3, 11.2] as VectorTuple, target: [1.4, 2, 1.5] as VectorTuple },
  { position: [10.2, 6, 10.8] as VectorTuple, target: [0, 1.9, 0] as VectorTuple },
  { position: [9.9, 5.8, 10.5] as VectorTuple, target: [0, 1.4, 0] as VectorTuple },
  { position: [14.2, 8.8, 14.8] as VectorTuple, target: [0, 1.6, 0] as VectorTuple },
  { position: [15.4, 9.2, 15.8] as VectorTuple, target: [0, 1.8, 0] as VectorTuple },
];

function CameraRig({ reduceMotion, stageIndex }: Pick<SceneProps, "reduceMotion" | "stageIndex">) {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const [autoOrbit, setAutoOrbit] = useState(!reduceMotion);
  const reframing = useRef(true);
  const interacting = useRef(false);
  const restartTimer = useRef<number | null>(null);
  const target = useMemo(() => new Vector3(), []);
  const position = useMemo(() => new Vector3(), []);

  useEffect(() => {
    reframing.current = !interacting.current;
  }, [stageIndex]);

  useEffect(() => () => {
    if (restartTimer.current) window.clearTimeout(restartTimer.current);
  }, []);

  useFrame((_, delta) => {
    if (!controls.current || !reframing.current || interacting.current) return;
    const frame = cameraFrames[stageIndex];
    target.set(...frame.target);
    position.set(...frame.position);
    const speed = reduceMotion ? 1000 : 1.7;
    camera.position.lerp(position, 1 - Math.exp(-delta * speed));
    controls.current.target.lerp(target, 1 - Math.exp(-delta * speed));
    controls.current.update();
    if (camera.position.distanceTo(position) < 0.07 && controls.current.target.distanceTo(target) < 0.04) {
      reframing.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.075}
      enablePan
      enableRotate
      enableZoom
      minDistance={7}
      maxDistance={29}
      minPolarAngle={0.35}
      maxPolarAngle={Math.PI / 2.05}
      autoRotate={autoOrbit && !reduceMotion}
      autoRotateSpeed={0.32}
      onStart={() => {
        interacting.current = true;
        reframing.current = false;
        setAutoOrbit(false);
        if (restartTimer.current) window.clearTimeout(restartTimer.current);
      }}
      onEnd={() => {
        interacting.current = false;
        restartTimer.current = window.setTimeout(() => setAutoOrbit(true), 4500);
      }}
    />
  );
}

function SceneContent({
  lowQuality,
  onHotspot,
  reduceMotion,
  selectedHotspot,
  stageIndex,
}: SceneProps & { lowQuality: boolean }) {
  const stageStartedAt = useRef(0);
  useLayoutEffect(() => {
    stageStartedAt.current = performance.now() / 1000;
  }, [stageIndex]);

  return (
    <>
      <color attach="background" args={[stageIndex >= 11 ? "#8c775f" : "#b79775"]} />
      <fog attach="fog" args={[stageIndex >= 11 ? "#8c775f" : "#b79775", 20, 48]} />
      <Suspense fallback={null}><SunsetEnvironment /></Suspense>
      <SceneLighting stageIndex={stageIndex} lowQuality={lowQuality} />
      <Terrain stageIndex={stageIndex} />
      <SurveyAndFootprint stageIndex={stageIndex} reduceMotion={reduceMotion} stageStartedAt={stageStartedAt} />
      <TrenchesAndFootings stageIndex={stageIndex} reduceMotion={reduceMotion} stageStartedAt={stageStartedAt} />
      <FoundationAndSlab stageIndex={stageIndex} reduceMotion={reduceMotion} stageStartedAt={stageStartedAt} />
      <WallCourses stageIndex={stageIndex} reduceMotion={reduceMotion} stageStartedAt={stageStartedAt} />
      <OpeningFrames stageIndex={stageIndex} reduceMotion={reduceMotion} stageStartedAt={stageStartedAt} onHotspot={onHotspot} selectedHotspot={selectedHotspot} />
      <RoofStructure stageIndex={stageIndex} reduceMotion={reduceMotion} stageStartedAt={stageStartedAt} />
      <Interior stageIndex={stageIndex} reduceMotion={reduceMotion} stageStartedAt={stageStartedAt} />
      {stageIndex >= 8 && (
        <Suspense fallback={null}>
          <ArchitecturalAssets stageIndex={stageIndex} reduceMotion={reduceMotion} stageStartedAt={stageStartedAt} onHotspot={onHotspot} selectedHotspot={selectedHotspot} />
        </Suspense>
      )}
      <Landscape stageIndex={stageIndex} reduceMotion={reduceMotion} stageStartedAt={stageStartedAt} />
      <Dust stageIndex={stageIndex} />
      <LivingDetails stageIndex={stageIndex} reduceMotion={reduceMotion} />
      <CameraRig stageIndex={stageIndex} reduceMotion={reduceMotion} />
      {lowQuality ? (
        <EffectComposer multisampling={0} enabled>
          <N8AO aoRadius={2.2} intensity={1.15} quality="performance" halfRes />
          <Bloom intensity={0.22} luminanceThreshold={1.25} mipmapBlur />
        </EffectComposer>
      ) : (
        <EffectComposer multisampling={4} enabled>
          <N8AO aoRadius={2.2} intensity={1.15} quality="medium" halfRes />
          <DepthOfField focusDistance={0.025} focalLength={0.08} bokehScale={0.65} />
          <Bloom intensity={0.22} luminanceThreshold={1.25} mipmapBlur />
        </EffectComposer>
      )}
    </>
  );
}

export default function EdenImpactScene(props: SceneProps) {
  const [lowQuality, setLowQuality] = useState(false);
  return (
    <Canvas
      camera={{ position: [13.5, 8.5, 14], fov: 38, near: 0.1, far: 100 }}
      dpr={lowQuality ? 1 : [1, 1.55]}
      shadows={{ type: PCFShadowMap }}
      gl={{ antialias: !lowQuality, toneMapping: ACESFilmicToneMapping, outputColorSpace: SRGBColorSpace }}
      onCreated={({ gl }) => { gl.toneMappingExposure = 1.03; }}
      onPointerMissed={() => { document.body.style.cursor = "auto"; }}
    >
      <PerformanceMonitor onDecline={() => setLowQuality(true)} />
      <SceneContent {...props} lowQuality={lowQuality} />
    </Canvas>
  );
}
