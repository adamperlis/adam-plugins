"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as THREE from "three";
import vertexShader from "./atmosphere.vert?raw";
import fragmentShader from "./atmosphere.frag?raw";

class CanvasBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function Field({ reducedMotion }: { reducedMotion: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMotion: { value: reducedMotion ? 0 : 1 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uInk: { value: new THREE.Color("#0d1312") },
      uAccentA: { value: new THREE.Color("#bd7447") },
      uAccentB: { value: new THREE.Color("#dfcda2") },
    }),
    [reducedMotion],
  );

  useFrame(({ clock, pointer }) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = clock.elapsedTime;
    material.current.uniforms.uPointer.value.set(
      pointer.x * 0.5 + 0.5,
      pointer.y * 0.5 + 0.5,
    );
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 64, 64]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

export function AtmosphereCanvas() {
  const [reducedMotion, setReducedMotion] = useState(true);
  const [visible, setVisible] = useState(true);
  const [intersecting, setIntersecting] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    const visibility = () => setVisible(document.visibilityState === "visible");
    update();
    visibility();
    query.addEventListener("change", update);
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver((entries) =>
      setIntersecting(entries[0]?.isIntersecting ?? false),
    );
    if (root.current) observer.observe(root.current);
    const lost = () => setContextLost(true);
    const element = root.current;
    element?.addEventListener("webglcontextlost", lost, true);
    return () => {
      observer.disconnect();
      element?.removeEventListener("webglcontextlost", lost, true);
      query.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  return (
    <div
      ref={root}
      className="relative min-h-[34rem] overflow-hidden bg-[#0d1312]"
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_35%_45%,#795335,#0d1312_65%)]"
        aria-hidden="true"
      />
      {!contextLost && (
        <CanvasBoundary>
          <Canvas
            aria-hidden="true"
            fallback={
              <span className="sr-only">
                Decorative material field unavailable.
              </span>
            }
            className="absolute inset-0"
            dpr={[1, 1.75]}
            frameloop={
              visible && intersecting && !reducedMotion ? "always" : "demand"
            }
            camera={{ position: [0, 0, 1], fov: 50 }}
            gl={{
              antialias: false,
              alpha: true,
              powerPreference: "high-performance",
            }}
          >
            <Field reducedMotion={reducedMotion} />
          </Canvas>
        </CanvasBoundary>
      )}
    </div>
  );
}
