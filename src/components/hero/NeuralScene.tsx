"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── Constants ───────────────────────────────────────────────────────────────
const NODE_COUNT = 32;
const CONNECTION_THRESHOLD = 1.65;
const MAX_CONNECTIONS_PER_NODE = 3;
const SIGNAL_COUNT = 14;
const ROTATION_SPEED = 0.05;
const SPHERE_RADIUS = 2.1;

// Vibrant palette - saturated, not washed-out
// Indigo:  #6366f1 (base) / emissive #4f46e5 (deeper indigo-600)
// Sky:     #38bdf8 (base) / emissive #0ea5e9 (sky-500)
// Violet:  #c084fc (base) / emissive #9333ea (purple-600)

// ─── Data generators ─────────────────────────────────────────────────────────

function fibonacciSphere(count: number, radius: number): THREE.Vector3[] {
  const phi = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    return new THREE.Vector3(
      Math.cos(theta) * r * radius + (Math.random() - 0.5) * 0.35,
      y * radius + (Math.random() - 0.5) * 0.35,
      Math.sin(theta) * r * radius + (Math.random() - 0.5) * 0.35
    );
  });
}

function buildEdges(positions: THREE.Vector3[]): [number, number][] {
  const edges: [number, number][] = [];
  for (let i = 0; i < positions.length; i++) {
    const sorted = positions
      .map((p, j) => ({ j, d: j !== i ? positions[i].distanceTo(p) : Infinity }))
      .sort((a, b) => a.d - b.d);
    let added = 0;
    for (const { j, d } of sorted) {
      if (added >= MAX_CONNECTIONS_PER_NODE || d > CONNECTION_THRESHOLD) break;
      const dup = edges.some(
        ([a, b]) => (a === i && b === j) || (a === j && b === i)
      );
      if (!dup) { edges.push([i, j]); added++; }
    }
  }
  return edges;
}

// ─── Camera rig ───────────────────────────────────────────────────────────────

function CameraRig() {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 1.6,
        y: -(e.clientY / window.innerHeight - 0.5) * 1.1,
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_, delta) => {
    const k = 1 - Math.pow(0.035, delta);
    current.current.x += (target.current.x - current.current.x) * k;
    current.current.y += (target.current.y - current.current.y) * k;
    camera.position.set(current.current.x, current.current.y, 5.8);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Indigo nodes (primary) ───────────────────────────────────────────────────

interface NodesProps {
  positions: THREE.Vector3[];
  phases: Float32Array;
  excludeIndices: Set<number>;
}

function Nodes({ positions, phases, excludeIndices }: NodesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const mat = useRef(new THREE.Matrix4());
  const quat = useRef(new THREE.Quaternion());
  const scale = useRef(new THREE.Vector3());

  // Build filtered index list once
  const indices = useMemo(
    () => positions.map((_, i) => i).filter((i) => !excludeIndices.has(i)),
    [positions, excludeIndices]
  );

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.getElapsedTime();
    indices.forEach((nodeIdx, slot) => {
      const s = 0.044 * (1 + Math.sin(t * 0.85 + phases[nodeIdx]) * 0.28);
      scale.current.set(s, s, s);
      mat.current.compose(positions[nodeIdx], quat.current, scale.current);
      mesh.setMatrixAt(slot, mat.current);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, indices.length]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 14, 14]} />
      {/* Saturated indigo - emissive uses deeper indigo-600 so ACES doesn't wash it */}
      <meshStandardMaterial
        color="#818cf8"
        emissive="#4f46e5"
        emissiveIntensity={1.8}
        roughness={0.1}
        metalness={0.8}
      />
    </instancedMesh>
  );
}

// ─── Sky-blue hub nodes ───────────────────────────────────────────────────────

interface AccentSkyProps {
  positions: THREE.Vector3[];
  phases: Float32Array;
  indices: number[];
}

function SkyNodes({ positions, phases, indices }: AccentSkyProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const mat = useRef(new THREE.Matrix4());
  const quat = useRef(new THREE.Quaternion());
  const scale = useRef(new THREE.Vector3());

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.getElapsedTime();
    indices.forEach((nodeIdx, i) => {
      const s = 0.075 * (1 + Math.sin(t * 0.6 + phases[nodeIdx]) * 0.35);
      scale.current.set(s, s, s);
      mat.current.compose(positions[nodeIdx], quat.current, scale.current);
      mesh.setMatrixAt(i, mat.current);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, indices.length]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 14, 14]} />
      <meshStandardMaterial
        color="#7dd3fc"
        emissive="#0ea5e9"
        emissiveIntensity={2.5}
        roughness={0}
        metalness={1}
      />
    </instancedMesh>
  );
}

// ─── Violet hub nodes ─────────────────────────────────────────────────────────

interface VioletNodesProps {
  positions: THREE.Vector3[];
  phases: Float32Array;
  indices: number[];
}

function VioletNodes({ positions, phases, indices }: VioletNodesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const mat = useRef(new THREE.Matrix4());
  const quat = useRef(new THREE.Quaternion());
  const scale = useRef(new THREE.Vector3());

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.getElapsedTime();
    indices.forEach((nodeIdx, i) => {
      const s = 0.065 * (1 + Math.sin(t * 0.7 + phases[nodeIdx] + 1.2) * 0.3);
      scale.current.set(s, s, s);
      mat.current.compose(positions[nodeIdx], quat.current, scale.current);
      mesh.setMatrixAt(i, mat.current);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, indices.length]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 14, 14]} />
      <meshStandardMaterial
        color="#e879f9"
        emissive="#a21caf"
        emissiveIntensity={2.2}
        roughness={0.05}
        metalness={0.9}
      />
    </instancedMesh>
  );
}

// ─── Edges ────────────────────────────────────────────────────────────────────

interface EdgesProps {
  positions: THREE.Vector3[];
  edges: [number, number][];
}

function Edges({ positions, edges }: EdgesProps) {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const verts: number[] = [];
    for (const [a, b] of edges) {
      verts.push(...positions[a].toArray(), ...positions[b].toArray());
    }
    geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    return geo;
  }, [positions, edges]);

  return (
    <lineSegments geometry={geometry}>
      {/* Much higher opacity - edges should actually be visible */}
      <lineBasicMaterial color="#818cf8" transparent opacity={0.45} />
    </lineSegments>
  );
}

// ─── Signal particles ─────────────────────────────────────────────────────────

// Alternate between sky and violet for visual variety
const SIGNAL_COLORS = [
  { color: "#38bdf8", emissive: "#0ea5e9" },
  { color: "#e879f9", emissive: "#a21caf" },
  { color: "#a5b4fc", emissive: "#6366f1" },
];

interface SignalProps {
  start: THREE.Vector3;
  end: THREE.Vector3;
  initProgress: number;
  speed: number;
  colorIdx: number;
}

function Signal({ start, end, initProgress, speed, colorIdx }: SignalProps) {
  const ref = useRef<THREE.Mesh>(null);
  const prog = useRef(initProgress);
  const { color, emissive } = SIGNAL_COLORS[colorIdx % SIGNAL_COLORS.length];

  useFrame((_, delta) => {
    prog.current = (prog.current + delta * speed) % 1;
    if (ref.current) {
      ref.current.position.lerpVectors(start, end, prog.current);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.036, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={4}
        roughness={0}
      />
    </mesh>
  );
}

interface SignalsProps {
  positions: THREE.Vector3[];
  edges: [number, number][];
}

function Signals({ positions, edges }: SignalsProps) {
  const signals = useMemo(() => {
    if (!edges.length) return [];
    return Array.from({ length: SIGNAL_COUNT }, (_, id) => {
      const idx = Math.floor(Math.random() * edges.length);
      const [a, b] = edges[idx];
      const flip = Math.random() > 0.5;
      return {
        id,
        start: flip ? positions[b].clone() : positions[a].clone(),
        end: flip ? positions[a].clone() : positions[b].clone(),
        initProgress: Math.random(),
        speed: 0.25 + Math.random() * 0.4,
        colorIdx: id % SIGNAL_COLORS.length,
      };
    });
  }, [positions, edges]);

  return (
    <>
      {signals.map((s) => (
        <Signal key={s.id} {...s} />
      ))}
    </>
  );
}

// ─── Ambient particles ────────────────────────────────────────────────────────
// Keep these subtle - they add depth without becoming noise

function AmbientParticles() {
  const COUNT = 90;
  const ref = useRef<THREE.Points>(null);

  const posAttr = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi2 = Math.acos(2 * Math.random() - 1);
      const r = 2.0 + Math.random() * 1.4;
      pos[i * 3]     = r * Math.sin(phi2) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi2);
      pos[i * 3 + 2] = r * Math.sin(phi2) * Math.sin(theta);
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.018;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.007) * 0.12;
    }
  });

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(posAttr, 3));
    return g;
  }, [posAttr]);

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color="#818cf8"
        size={0.012}
        sizeAttenuation
        transparent
        opacity={0.22}
      />
    </points>
  );
}

// ─── Main SceneGraph ──────────────────────────────────────────────────────────

function SceneGraph() {
  const groupRef = useRef<THREE.Group>(null);

  const { nodePositions, edges, phases, skyIndices, violetIndices, excludeSet } =
    useMemo(() => {
      const pos = fibonacciSphere(NODE_COUNT, SPHERE_RADIUS);
      const ed = buildEdges(pos);
      const ph = new Float32Array(
        Array.from({ length: NODE_COUNT }, () => Math.random() * Math.PI * 2)
      );
      // 5 sky-blue hub nodes
      const skyIdx = Array.from(new Set(
        Array.from({ length: 5 }, () => Math.floor(Math.random() * NODE_COUNT))
      ));
      // 4 violet nodes - avoid overlap with sky
      const usedSky = new Set(skyIdx);
      const violetIdx: number[] = [];
      while (violetIdx.length < 4) {
        const n = Math.floor(Math.random() * NODE_COUNT);
        if (!usedSky.has(n)) violetIdx.push(n);
      }
      const excludeSet = new Set([...skyIdx, ...violetIdx]);
      return {
        nodePositions: pos,
        edges: ed,
        phases: ph,
        skyIndices: skyIdx,
        violetIndices: violetIdx,
        excludeSet,
      };
    }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * ROTATION_SPEED;
    }
  });

  return (
    <group ref={groupRef}>
      <Edges positions={nodePositions} edges={edges} />
      <Nodes positions={nodePositions} phases={phases} excludeIndices={excludeSet} />
      <SkyNodes positions={nodePositions} phases={phases} indices={skyIndices} />
      <VioletNodes positions={nodePositions} phases={phases} indices={violetIndices} />
      <Signals positions={nodePositions} edges={edges} />
    </group>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function NeuralScene() {
  return (
    <>
      <CameraRig />
      {/* Lifted ambient - less black fill, more color visibility */}
      <ambientLight intensity={0.12} />
      {/* Strong indigo key light */}
      <pointLight position={[4, 6, 4]} intensity={2.0} color="#6366f1" />
      {/* Bright sky-blue fill from lower-left */}
      <pointLight position={[-5, -3, -3]} intensity={1.2} color="#38bdf8" />
      {/* Violet rim from below */}
      <pointLight position={[0, -7, 2]} intensity={0.9} color="#c084fc" />
      {/* Warm-white fill to prevent all-dark areas */}
      <pointLight position={[0, 8, -4]} intensity={0.35} color="#e0e7ff" />
      <SceneGraph />
      <AmbientParticles />
    </>
  );
}
