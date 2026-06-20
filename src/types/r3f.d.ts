/**
 * Extends React.JSX.IntrinsicElements with React Three Fiber (Three.js) elements.
 *
 * @types/react uses `export as namespace React` (UMD pattern), making React
 * a global namespace. We merge into React.JSX.IntrinsicElements here as a
 * pure ambient script (no imports/exports = global scope).
 *
 * The R3F package's own `declare global { namespace JSX {} }` targets the old
 * global JSX namespace (TypeScript 4.x style) and is ignored by TS 5+ / @types/react 19.
 */

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace React {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      // ── Objects ────────────────────────────────────────────────────────────
      mesh: { [key: string]: unknown; children?: React.ReactNode; ref?: React.Ref<unknown> };
      instancedMesh: { [key: string]: unknown; count?: number; children?: React.ReactNode; ref?: React.Ref<unknown> };
      group: { [key: string]: unknown; children?: React.ReactNode; ref?: React.Ref<unknown> };
      points: { [key: string]: unknown; children?: React.ReactNode; ref?: React.Ref<unknown> };
      line: { [key: string]: unknown; children?: React.ReactNode; ref?: React.Ref<unknown> };
      lineSegments: { [key: string]: unknown; children?: React.ReactNode; ref?: React.Ref<unknown> };
      lineLoop: { [key: string]: unknown; children?: React.ReactNode; ref?: React.Ref<unknown> };
      sprite: { [key: string]: unknown; children?: React.ReactNode; ref?: React.Ref<unknown> };
      skinnedMesh: { [key: string]: unknown; children?: React.ReactNode; ref?: React.Ref<unknown> };

      // ── Geometry ───────────────────────────────────────────────────────────
      bufferGeometry: { [key: string]: unknown; children?: React.ReactNode };
      sphereGeometry: { args?: [radius?: number, widthSegments?: number, heightSegments?: number]; [key: string]: unknown };
      boxGeometry: { args?: [width?: number, height?: number, depth?: number]; [key: string]: unknown };
      planeGeometry: { args?: [width?: number, height?: number, widthSegments?: number, heightSegments?: number]; [key: string]: unknown };
      cylinderGeometry: { [key: string]: unknown };
      coneGeometry: { [key: string]: unknown };
      torusGeometry: { [key: string]: unknown };
      torusKnotGeometry: { [key: string]: unknown };
      ringGeometry: { [key: string]: unknown };
      circleGeometry: { [key: string]: unknown };
      edgesGeometry: { [key: string]: unknown };
      tubeGeometry: { [key: string]: unknown };
      instancedBufferGeometry: { [key: string]: unknown };

      // ── Material ───────────────────────────────────────────────────────────
      meshStandardMaterial: { [key: string]: unknown };
      meshBasicMaterial: { [key: string]: unknown };
      meshPhongMaterial: { [key: string]: unknown };
      meshLambertMaterial: { [key: string]: unknown };
      meshDepthMaterial: { [key: string]: unknown };
      meshNormalMaterial: { [key: string]: unknown };
      meshToonMaterial: { [key: string]: unknown };
      meshMatcapMaterial: { [key: string]: unknown };
      lineBasicMaterial: { [key: string]: unknown };
      lineDashedMaterial: { [key: string]: unknown };
      pointsMaterial: { [key: string]: unknown };
      spriteMaterial: { [key: string]: unknown };
      shaderMaterial: { [key: string]: unknown };
      rawShaderMaterial: { [key: string]: unknown };

      // ── Light ──────────────────────────────────────────────────────────────
      ambientLight: { [key: string]: unknown; children?: React.ReactNode };
      directionalLight: { [key: string]: unknown; children?: React.ReactNode };
      pointLight: { [key: string]: unknown; children?: React.ReactNode };
      spotLight: { [key: string]: unknown; children?: React.ReactNode };
      hemisphereLight: { [key: string]: unknown; children?: React.ReactNode };
      rectAreaLight: { [key: string]: unknown; children?: React.ReactNode };

      // ── Camera ─────────────────────────────────────────────────────────────
      perspectiveCamera: { [key: string]: unknown; children?: React.ReactNode };
      orthographicCamera: { [key: string]: unknown; children?: React.ReactNode };

      // ── Buffer attributes ──────────────────────────────────────────────────
      bufferAttribute: { [key: string]: unknown };
      float32BufferAttribute: { [key: string]: unknown };
      instancedBufferAttribute: { [key: string]: unknown };

      // ── Misc ───────────────────────────────────────────────────────────────
      fog: { [key: string]: unknown };
      color: { [key: string]: unknown };
      texture: { [key: string]: unknown };
      axesHelper: { [key: string]: unknown };
      gridHelper: { [key: string]: unknown };
    }
  }
}
