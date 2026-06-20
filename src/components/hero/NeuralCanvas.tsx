"use client";

/**
 * NeuralCanvas
 * Thin wrapper that mounts the R3F Canvas + NeuralScene.
 * Kept in a separate file so it can be dynamically imported (no SSR).
 */

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import NeuralScene from "./NeuralScene";

export default function NeuralCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.8], fov: 58, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
      style={{ background: "transparent" }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <NeuralScene />
      </Suspense>
    </Canvas>
  );
}
