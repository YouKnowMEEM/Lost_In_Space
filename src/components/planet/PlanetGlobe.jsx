import React, { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import EquipmentMarker from "./EquipmentMarker";
import RegionLabels from "./RegionLabels";
import PlanetOrbits from "./PlanetOrbits";
import { latLngToVector3 } from "./EquipmentMarker";
import { SignalLayer } from "../SignalHunter";

function TexturedPlanet({ texturePath, radius, artifacts, regions, orbits, selected, onSelect, selectedOrbit, onOrbitSelect, focusedRegion, onReady, signalHunter }) {
  const texture = useTexture(texturePath);
  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    const frame = window.requestAnimationFrame(onReady);
    return () => window.cancelAnimationFrame(frame);
  }, [texture, onReady]);
  const isMars = texturePath.toLowerCase().includes("mars");
  const atmosphereColor = isMars ? "#f08a5d" : "#6bb8ff";
  const glowUniforms = useMemo(() => ({ glow: { value: new THREE.Color(atmosphereColor) } }), [atmosphereColor]);

  return <group rotation={[0, -Math.PI / 2, 0]}>
    {/* Main planet globe */}
    <mesh onClick={(event) => event.stopPropagation()}>
      <sphereGeometry args={[radius, 96, 64]}/>
      <meshStandardMaterial map={texture} roughness={1} metalness={0}/>
    </mesh>

    {/* Mars's thin atmosphere: a soft glow that fades out from the planet's edge. */}
    {isMars && <mesh raycast={() => null}>
      <sphereGeometry args={[radius * 1.14, 64, 48]}/>
      <shaderMaterial
        transparent
        depthWrite={false}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        uniforms={glowUniforms}
        vertexShader={"varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }"}
        fragmentShader={"uniform vec3 glow; varying vec3 vN; void main(){ float i = pow(max(0.0, 0.64 - dot(vN, vec3(0.0, 0.0, 1.0))), 3.0); gl_FragColor = vec4(glow * i * 1.6, i); }"}
      />
    </mesh>}

    <PlanetOrbits orbits={orbits} selectedOrbit={selectedOrbit} onSelect={onOrbitSelect}/>
    <RegionLabels regions={regions} surfaceRadius={radius} opacity={0.68} selectedRegion={focusedRegion}/>
    {signalHunter?.active
      ? <SignalLayer game={signalHunter} radius={radius + 0.045}/>
      : artifacts.map((artifact) => <EquipmentMarker key={artifact.id} artifact={artifact} surfaceRadius={radius + 0.025} selected={selected?.id === artifact.id} onSelect={onSelect}/>)}
  </group>;
}

export default function PlanetGlobe({ texturePath, radius = 3.2, artifacts, regions, orbits, selected, onSelect, selectedOrbit, onOrbitSelect, focusedRegion, focusPoint, onReady, signalHunter }) {
  const controls = useRef(null);
  useEffect(() => {
    controls.current?.setLookAt(0, 0.12, 11.5, 0, 0, 0, false);
  }, []);
  useEffect(() => {
    if (!focusPoint || !controls.current) return;
    const direction = latLngToVector3(focusPoint.lat, focusPoint.lon, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);
    direction.multiplyScalar(focusPoint.focusDistance || 11.5);
    controls.current.setLookAt(direction.x, direction.y, direction.z, 0, 0, 0, true);
  }, [focusPoint]);
  return <Canvas
      className="moon-globe-canvas"
      camera={{ position: [0, 0.12, 11.5], fov: 42, near: 0.1, far: 100 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
  >
    <ambientLight intensity={0.42}/>
    <directionalLight position={[0, 2, 8]} intensity={2.3}/>
    <Suspense fallback={null}><TexturedPlanet texturePath={texturePath} radius={radius} artifacts={artifacts} regions={regions} orbits={orbits} selected={selected} onSelect={onSelect} selectedOrbit={selectedOrbit} onOrbitSelect={onOrbitSelect} focusedRegion={focusedRegion} onReady={onReady} signalHunter={signalHunter}/></Suspense>
    <CameraControls ref={controls} makeDefault minDistance={5.4} maxDistance={26} smoothTime={0.65} draggingSmoothTime={0.16} dollyToCursor={false} azimuthRotateSpeed={0.55} polarRotateSpeed={0.55} truckSpeed={0}/>
  </Canvas>;
}
