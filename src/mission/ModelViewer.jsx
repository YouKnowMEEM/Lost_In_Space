import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { CameraControls, ContactShadows, useGLTF } from "@react-three/drei";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const DRACO_PATH = "/draco/";
const FOV = 30;
const DEFAULT_POLAR = Math.PI * 0.4;
const TAU = Math.PI * 2;

/** Soft studio reflections without downloading an HDR file. */
function StudioLight() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.6;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return (
    <>
      <hemisphereLight args={["#e6eeff", "#2a2420", 0.55]} />
      <directionalLight position={[-4, 6, 6]} intensity={2.6} color="#fff0dc" />
      <directionalLight position={[5, 3, -6]} intensity={1.8} color="#9fd0ff" />
    </>
  );
}

/** A copy of a material that hides everything below world y = 0. */
function clipped(material, plane) {
  const m = material.clone();
  m.clippingPlanes = [plane];
  return m;
}

/**
 * The NASA model, centred on the origin and standing on y = 0.
 * clipBelow (model units) hides anything under that height, such as a display stand.
 */
function Model({ src, fit, clipBelow, onReady }) {
  const { scene } = useGLTF(src, DRACO_PATH);
  const layout = useMemo(() => {
    const object = scene.clone(true);
    const box = new THREE.Box3().setFromObject(object);
    if (typeof clipBelow === "number" && clipBelow > box.min.y) {
      // After the layout below, model height clipBelow sits exactly at world y = 0.
      box.min.y = clipBelow;
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      object.traverse((o) => {
        if (!o.isMesh) return;
        o.material = Array.isArray(o.material) ? o.material.map((m) => clipped(m, plane)) : clipped(o.material, plane);
      });
    }
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = fit / Math.max(size.x, size.y, size.z);
    return { object, scale, offset: [-center.x, -box.min.y, -center.z], size: size.multiplyScalar(scale) };
  }, [scene, fit]);

  useEffect(() => {
    onReady(layout);
  }, [layout, onReady]);

  return (
    <group scale={layout.scale}>
      <group position={layout.offset}>
        <primitive object={layout.object} />
      </group>
    </group>
  );
}

/** Where a point given in model units ends up in the scene. */
function toWorld(at, layout, yaw, out) {
  const x = (at[0] + layout.offset[0]) * layout.scale;
  const y = (at[1] + layout.offset[1]) * layout.scale;
  const z = (at[2] + layout.offset[2]) * layout.scale;
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  return out.set(x * c + z * s, y, -x * s + z * c);
}

/**
 * Frames the model, turns it slowly until the reader takes over, turns it to face a chosen
 * part, and keeps the numbered hotspots (plain DOM buttons) pinned to the model.
 */
function Rig({ controlsRef, layout, yaw, parts, focus, idle, buttons, target, span }) {
  const size = useThree((s) => s.size);
  const framed = useRef(false);
  const v = useMemo(() => new THREE.Vector3(), []);
  // The point the camera orbits, in world units (only its x and z matter for hiding hotspots).
  const pivot = useMemo(
    () => (layout && target ? toWorld(target, layout, yaw, new THREE.Vector3()) : new THREE.Vector3()),
    [layout, target, yaw]
  );

  useEffect(() => {
    const c = controlsRef.current;
    if (!c || !layout) return;
    // Frame the whole model, or just the part of it given by span (model units: [width, height]).
    const s = span ? { x: span[0] * layout.scale, y: span[1] * layout.scale, z: span[0] * layout.scale } : layout.size;
    const half = THREE.MathUtils.degToRad(FOV) / 2;
    const aspect = size.width / Math.max(1, size.height);
    const hHalf = Math.atan(Math.tan(half) * aspect);
    const wide = Math.max(s.x, s.z);
    const dist = Math.max(s.y / 0.64 / (2 * Math.tan(half)), wide / 0.86 / (2 * Math.tan(hHalf))) + wide * 0.22;
    const t = target ? toWorld(target, layout, yaw, new THREE.Vector3()) : new THREE.Vector3(0, s.y * 0.46, 0);
    c.minDistance = dist * 0.5;
    c.maxDistance = dist * 1.7;
    if (!framed.current) {
      framed.current = true;
      const az = Math.PI / 4;
      const pol = Math.PI * 0.39;
      c.setLookAt(
        t.x + dist * Math.sin(pol) * Math.sin(az),
        t.y + dist * Math.cos(pol),
        t.z + dist * Math.sin(pol) * Math.cos(az),
        t.x,
        t.y,
        t.z,
        false
      );
    } else {
      c.dollyTo(dist, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlsRef, layout, size.width, size.height]);

  useEffect(() => {
    const c = controlsRef.current;
    if (!c || !focus) return;
    const current = c.azimuthAngle;
    const delta = ((((focus.azimuth - current) % TAU) + TAU * 1.5) % TAU) - Math.PI;
    c.rotateTo(current + delta, focus.polar, true);
  }, [controlsRef, focus]);

  useFrame(({ camera }, delta) => {
    const c = controlsRef.current;
    if (c && idle.current) c.azimuthAngle += delta * 0.14;
    if (!layout) return;
    const cx = camera.position.x - pivot.x;
    const cz = camera.position.z - pivot.z;
    const cl = Math.hypot(cx, cz) || 1;
    const reach = Math.max(layout.size.x, layout.size.z) * 0.08;
    parts.forEach((p, i) => {
      const el = buttons.current[i];
      if (!el) return;
      toWorld(p.at, layout, yaw, v);
      const dx = v.x - pivot.x;
      const dz = v.z - pivot.z;
      const r = Math.hypot(dx, dz);
      const behind = r > reach && (dx * cx + dz * cz) / (r * cl) < -0.28;
      v.project(camera);
      const x = (v.x * 0.5 + 0.5) * size.width;
      const y = (-v.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
      el.classList.toggle("is-behind", behind);
    });
  });
  return null;
}

/** Keeps the rest of the mission file working if the model cannot be downloaded or drawn. */
class ModelBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    console.warn("3D model unavailable:", error?.message || error);
  }
  render() {
    if (this.state.failed) {
      return (
        <div className="mf-model-loading mf-model-failed" role="status">
          <span>The 3D model could not be loaded.</span>
          <button type="button" className="mf-btn mf-btn-ghost" onClick={this.props.onRetry}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Interactive 3D model with numbered hotspots.
 * model: { src, fit, yaw, parts: [{ id, name, at: [x, y, z] (model units), view?: { azimuth, polar } }],
 *          floating?, clipBelow?, target?: [x, y, z], span?: [width, height] }
 */
export default function ModelViewer(props) {
  const [attempt, setAttempt] = useState(0);
  return (
    <ModelBoundary
      key={attempt}
      onRetry={() => {
        useGLTF.clear(props.model.src);
        setAttempt((n) => n + 1);
      }}
    >
      <ModelScene {...props} />
    </ModelBoundary>
  );
}

function ModelScene({ model, active, pickCount = 0, onPick }) {
  const wrapRef = useRef(null);
  const controlsRef = useRef(null);
  const buttons = useRef([]);
  const idle = useRef(true);
  const [layout, setLayout] = useState(null);
  const [visible, setVisible] = useState(false);
  const [touched, setTouched] = useState(false);
  const [focus, setFocus] = useState(null);
  const yaw = model.yaw || 0;

  const stopIdle = useCallback(() => {
    idle.current = false;
    setTouched(true);
  }, []);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) idle.current = false;
    const el = wrapRef.current;
    if (!el || !("IntersectionObserver" in window)) {
      setVisible(true);
      return undefined;
    }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "160px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Turn the model so the chosen part faces the reader (only once the reader picks one).
  useEffect(() => {
    if (!layout || !pickCount) return;
    const part = model.parts.find((p) => p.id === active);
    if (!part) return;
    stopIdle();
    if (part.view) {
      setFocus({ azimuth: part.view.azimuth + yaw, polar: part.view.polar ?? DEFAULT_POLAR });
    } else {
      const w = toWorld(part.at, layout, yaw, new THREE.Vector3());
      const t = model.target ? toWorld(model.target, layout, yaw, new THREE.Vector3()) : new THREE.Vector3();
      setFocus({ azimuth: Math.atan2(w.x - t.x, w.z - t.z), polar: part.polar ?? DEFAULT_POLAR });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickCount, layout]);

  const fit = model.fit || 3;
  const floating = Boolean(model.floating);
  const frameloop = !visible ? "never" : touched ? "demand" : "always";

  return (
    <div className="mf-model-canvas" ref={wrapRef} onPointerDown={stopIdle} onWheel={stopIdle}>
      <Canvas
        frameloop={frameloop}
        dpr={[1, 1.75]}
        camera={{ position: [6, 3, 6], fov: FOV, near: 0.05, far: 100 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
        onCreated={({ gl }) => {
          gl.localClippingEnabled = true;
        }}
      >
        <StudioLight />
        <Suspense fallback={null}>
          <group rotation={[0, yaw, 0]}>
            <Model src={model.src} fit={fit} clipBelow={model.clipBelow} onReady={setLayout} />
          </group>
          {/* A spacecraft in flight floats; landers get a soft shadow on the ground. */}
          {!floating && (
            <ContactShadows frames={1} position={[0, 0, 0]} opacity={0.55} scale={fit * 2.6} blur={2.4} far={fit} resolution={512} color="#000000" />
          )}
        </Suspense>
        <CameraControls
          ref={controlsRef}
          makeDefault
          minPolarAngle={floating ? 0.12 : 0.2}
          maxPolarAngle={floating ? Math.PI * 0.82 : Math.PI * 0.53}
          smoothTime={0.55}
          draggingSmoothTime={0.12}
        />
        <Rig
          controlsRef={controlsRef}
          layout={layout}
          yaw={yaw}
          parts={model.parts}
          focus={focus}
          idle={idle}
          buttons={buttons}
          target={model.target}
          span={model.span}
        />
      </Canvas>

      <div className="mf-hotspots" hidden={!layout} aria-hidden="true">
        {model.parts.map((p, i) => (
          <button
            key={p.id}
            ref={(el) => {
              buttons.current[i] = el;
            }}
            type="button"
            className={`mf-hotspot${active === p.id ? " is-active" : ""}`}
            onClick={() => onPick(p.id)}
            aria-label={`${i + 1}. ${p.name}`}
            aria-pressed={active === p.id}
            tabIndex={-1}
          >
            {i + 1}
          </button>
        ))}
      </div>
      {!layout && (
        <div className="mf-model-loading" role="status">
          Loading the 3D model…
        </div>
      )}
    </div>
  );
}
