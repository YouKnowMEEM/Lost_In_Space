import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

/* ------------------------------------------------------------------ */
/* Geometry helper (unchanged API)                                     */
/* ------------------------------------------------------------------ */
export function latLngToVector3(lat, lon, radius = 3.22) {
  const latitude = THREE.MathUtils.degToRad(Number(lat));
  const longitude = THREE.MathUtils.degToRad(Number(lon));
  return new THREE.Vector3(
    radius * Math.cos(latitude) * Math.cos(longitude),
    radius * Math.sin(latitude),
    -radius * Math.cos(latitude) * Math.sin(longitude)
  );
}

/* ------------------------------------------------------------------ */
/* Shared marker textures (drawn once, tinted per marker)              */
/* ------------------------------------------------------------------ */
let textureCache = null;

function getTextures() {
  if (textureCache) return textureCache;

  const make = (draw) => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    draw(canvas.getContext("2d"), size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.anisotropy = 4;
    return texture;
  };

  textureCache = {
    // Soft radial falloff: used for the glow and the contrast shadow
    soft: make((g, s) => {
      const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.25, "rgba(255,255,255,0.55)");
      grad.addColorStop(0.5, "rgba(255,255,255,0.18)");
      grad.addColorStop(0.75, "rgba(255,255,255,0.04)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, s, s);
    }),
    // Solid disc with a hint of shading so it doesn't look flat
    disc: make((g, s) => {
      const grad = g.createRadialGradient(s * 0.42, s * 0.4, 0, s / 2, s / 2, s * 0.46);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(1, "rgba(214,214,214,1)");
      g.fillStyle = grad;
      g.beginPath();
      g.arc(s / 2, s / 2, s * 0.44, 0, Math.PI * 2);
      g.fill();
    }),
    // Thin ring with a slightly soft edge (rim, pulse and selection ring)
    ring: make((g, s) => {
      g.strokeStyle = "rgba(255,255,255,1)";
      g.lineWidth = s * 0.05;
      g.shadowColor = "rgba(255,255,255,0.9)";
      g.shadowBlur = s * 0.035;
      g.beginPath();
      g.arc(s / 2, s / 2, s * 0.42, 0, Math.PI * 2);
      g.stroke();
    })
  };
  return textureCache;
}

/* ------------------------------------------------------------------ */
/* Look & feel                                                         */
/* ------------------------------------------------------------------ */
const COLORS = { active: "#4cd7ff", impact: "#ff7c59", future: "#c084fc", default: "#e0eeff" };

// How lively each status category feels
const PROFILES = {
  active: { speed: 0.5, reach: 0.26, alpha: 0.7, glow: 1 },
  impact: { speed: 0.28, reach: 0.2, alpha: 0.38, glow: 0.8 },
  future: { speed: 0.3, reach: 0.2, alpha: 0.38, glow: 0.75 },
  default: { speed: 0.22, reach: 0.16, alpha: 0.22, glow: 0.55 }
};

const REFERENCE_DISTANCE = 11.5; // default camera distance in PlanetGlobe
const LIFT = 0.012;
const LAYER_ORDER = { shadow: 10, glow: 11, pulse: 12, select: 13, core: 14, rim: 15 };

const _world = new THREE.Vector3();
const _normal = new THREE.Vector3();
const _camDir = new THREE.Vector3();
const _white = new THREE.Color("#ffffff");
const _apolloBlue = new THREE.Color("#3f9fff");

/* ------------------------------------------------------------------ */
/* Hover label with a soft fade in/out                                 */
/* ------------------------------------------------------------------ */
function MarkerLabel({ name, visible }) {
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let raf = 0;
    let timeout = 0;
    if (visible) {
      setMounted(true);
      raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(() => setShown(true));
      });
    } else {
      setShown(false);
      timeout = window.setTimeout(() => setMounted(false), 200);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
    };
  }, [visible]);

  if (!mounted) return null;

  return <Html position={[0, LIFT + 0.04, 0]} center distanceFactor={8} occlude={false} style={{ pointerEvents: "none" }}>
    <div
      className="equipment-marker-label"
      style={{
        opacity: shown ? 1 : 0,
        transform: `translateY(${shown ? -26 : -19}px)`,
        transition: "opacity .18s ease, transform .22s cubic-bezier(.2,.8,.2,1)"
      }}
    >
      <strong>{name}</strong>
    </div>
  </Html>;
}

/* ------------------------------------------------------------------ */
/* Marker                                                              */
/* ------------------------------------------------------------------ */
export default function EquipmentMarker({ artifact, selected, onSelect, surfaceRadius = 3.205 }) {
  const [hovered, setHovered] = useState(false);

  const groupRef = useRef(null);
  const innerRef = useRef(null);
  const layers = useRef({});
  const hoverRef = useRef(false);
  const visibilityRef = useRef(0);
  const hoverT = useRef(0);
  const selectT = useRef(0);
  const appearT = useRef(0);

  const textures = useMemo(() => getTextures(), []);

  const position = useMemo(
    () => latLngToVector3(artifact.lat, artifact.lon, surfaceRadius),
    [artifact.lat, artifact.lon, surfaceRadius]
  );

  // Align the marker's local +Y with the surface normal
  const orientation = useMemo(() => {
    const normal = position.clone().normalize();
    return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
  }, [position]);

  const category = artifact.statusCategory === "active" || artifact.statusCategory === "impact" || artifact.statusCategory === "future" ? artifact.statusCategory : "default";
  const profile = PROFILES[category];
  const baseColor = useMemo(() => new THREE.Color(COLORS[category]), [category]);
  const phase = useMemo(() => Math.abs(Number(artifact.lat) * 0.137 + Number(artifact.lon) * 0.071) % 1, [artifact.lat, artifact.lon]);

  // Stable ref setters, one per layer
  const setLayer = useMemo(() => {
    const setters = {};
    Object.keys(LAYER_ORDER).forEach((key) => {
      setters[key] = (node) => { if (node) layers.current[key] = node; };
    });
    return setters;
  }, []);

  const setHover = useCallback((value) => {
    hoverRef.current = value;
    setHovered(value);
    document.body.style.cursor = value ? "pointer" : "";
  }, []);

  useEffect(() => () => {
    if (hoverRef.current) document.body.style.cursor = "";
  }, []);

  useFrame(({ clock, camera }, delta) => {
    const group = groupRef.current;
    const inner = innerRef.current;
    if (!group || !inner) return;

    // --- Smooth fade across the planet's limb (replaces hard pop-out) ---
    group.getWorldPosition(_world);
    _normal.copy(_world).normalize();
    const distance = Math.max(camera.position.length(), surfaceRadius + 0.5);
    _camDir.copy(camera.position).normalize();
    const facing = _normal.dot(_camDir);
    const horizon = surfaceRadius / distance;
    const limb = THREE.MathUtils.smoothstep(facing, horizon, horizon + 0.16);

    appearT.current = THREE.MathUtils.damp(appearT.current, 1, 4, delta);
    const vis = limb * appearT.current;
    visibilityRef.current = limb;
    inner.visible = vis > 0.004;

    if (!inner.visible) {
      if (hoverRef.current) setHover(false);
      return;
    }
    if (hoverRef.current && limb < 0.35) setHover(false);

    // --- Keep a comfortable on-screen size while zooming ---
    const k = THREE.MathUtils.clamp(distance / REFERENCE_DISTANCE, 0.6, 2.1);
    inner.scale.setScalar(k * (0.6 + 0.4 * appearT.current));

    // --- Damped interaction state ---
    hoverT.current = THREE.MathUtils.damp(hoverT.current, hoverRef.current ? 1 : 0, 10, delta);
    selectT.current = THREE.MathUtils.damp(selectT.current, selected ? 1 : 0, 8, delta);
    const hT = hoverT.current;
    const sT = selectT.current;
    const emphasis = Math.max(hT, sT);

    const t = clock.elapsedTime;
    const L = layers.current;
    const put = (layer, size, opacity) => {
      if (!layer) return;
      layer.scale.set(size, size, 1);
      layer.material.opacity = THREE.MathUtils.clamp(opacity, 0, 1) * vis;
    };

    // Contrast shadow keeps the marker readable on bright regolith
    put(L.shadow, 0.2 + 0.05 * emphasis, 0.34);

    // Gentle breathing glow
    const breathe = (Math.sin(t * 1.6 + phase * 6.283) + 1) / 2;
    put(L.glow, 0.27 + 0.12 * emphasis + breathe * 0.02, (0.32 + 0.3 * emphasis) * profile.glow);

    // Expanding pulse ring (ease-out, fades as it grows)
    const p = (t * profile.speed + phase) % 1;
    const eased = 1 - Math.pow(1 - p, 3);
    put(L.pulse, 0.1 + eased * profile.reach, Math.pow(1 - p, 1.4) * profile.alpha * (1 + 0.6 * emphasis));

    // Selection ring settles in from slightly larger
    put(L.select, 0.17 + 0.03 * (1 - sT), 0.9 * sT);

    // Core + rim grow smoothly on hover / select
    const grow = 1 + 0.28 * hT + 0.12 * sT;
    put(L.core, 0.072 * grow, 1);
    put(L.rim, 0.094 * grow, 0.95);
    const isSelectedApollo11 = selected && artifact.id === "apollo-11";
    if (L.pulse) L.pulse.material.color.copy(isSelectedApollo11 ? _apolloBlue : baseColor);
    if (L.select) L.select.material.color.copy(isSelectedApollo11 ? _apolloBlue : _white);
    if (L.rim) L.rim.material.color.copy(isSelectedApollo11 ? _apolloBlue : _white);
    if (L.core) L.core.material.color.copy(baseColor).lerp(_white, sT * 0.6);
  });

  const guardedHandlers = {
    onPointerDown: (event) => {
      if (visibilityRef.current > 0.35) event.stopPropagation();
    },
    onPointerOver: (event) => {
      if (visibilityRef.current < 0.35) return; // ignore markers on the far side
      event.stopPropagation();
      setHover(true);
    },
    onPointerOut: (event) => {
      event.stopPropagation();
      setHover(false);
    },
    onClick: (event) => {
      if (visibilityRef.current < 0.35) return;
      event.stopPropagation();
      const native = event.nativeEvent ?? event;
      onSelect(artifact, {
        x: native.clientX || window.innerWidth * 0.5,
        y: native.clientY || window.innerHeight * 0.5
      });
    }
  };

  const layerProps = (key) => ({
    ref: setLayer[key],
    renderOrder: LAYER_ORDER[key],
    raycast: () => null // sprites are visual only; the hit area below handles input
  });

  const materialProps = (texture, color) => ({
    map: texture,
    color,
    transparent: true,
    opacity: 0,
    depthTest: false,
    depthWrite: false,
    toneMapped: false
  });

  return <group ref={groupRef} position={position} quaternion={orientation}>
    <group ref={innerRef} position={[0, LIFT, 0]}>
      {/* Invisible hit area: generous, so hover never flickers */}
      <mesh {...guardedHandlers}>
        <sphereGeometry args={[0.085, 12, 12]}/>
        <meshBasicMaterial transparent opacity={0} depthWrite={false}/>
      </mesh>

      <sprite {...layerProps("shadow")}><spriteMaterial {...materialProps(textures.soft, "#000000")}/></sprite>
      <sprite {...layerProps("glow")}><spriteMaterial {...materialProps(textures.soft, baseColor)}/></sprite>
      <sprite {...layerProps("pulse")}><spriteMaterial {...materialProps(textures.ring, baseColor)}/></sprite>
      <sprite {...layerProps("select")}><spriteMaterial {...materialProps(textures.ring, "#ffffff")}/></sprite>
      <sprite {...layerProps("core")}><spriteMaterial {...materialProps(textures.disc, baseColor)}/></sprite>
      <sprite {...layerProps("rim")}><spriteMaterial {...materialProps(textures.ring, "#ffffff")}/></sprite>
    </group>

    <MarkerLabel name={artifact.name} visible={hovered && !selected}/>
  </group>;
}
