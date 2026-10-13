import React, { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import EquipmentMarker from "./EquipmentMarker";
import RegionLabels from "./RegionLabels";
import PlanetOrbits from "./PlanetOrbits";

function TexturedPlanet({ texturePath, radius, artifacts, regions, orbits, selected, onSelect, selectedOrbit, onOrbitSelect }) {
  const texture = useTexture(texturePath);
  useEffect(() => { texture.colorSpace = THREE.SRGBColorSpace; texture.needsUpdate = true; }, [texture]);
  const isMars = texturePath.toLowerCase().includes("mars");
  const atmosphereColor = isMars ? "#e06c45" : "#6bb8ff";

  return <group rotation={[0, -Math.PI / 2, 0]}>
    {/* Main planet globe */}
    <mesh onClick={(event) => event.stopPropagation()}>
      <sphereGeometry args={[radius, 96, 64]}/>
      <meshStandardMaterial map={texture} roughness={1} metalness={0}/>
    </mesh>

    {isMars && <mesh>
      <sphereGeometry args={[radius * 1.045, 64, 48]}/>
      <meshBasicMaterial
        color={atmosphereColor}
        transparent
        opacity={0.35}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>}

    <PlanetOrbits orbits={orbits} selectedOrbit={selectedOrbit} onSelect={onOrbitSelect}/>
    <RegionLabels regions={regions} surfaceRadius={radius} opacity={0.68}/>
    {artifacts.map((artifact) => <EquipmentMarker key={artifact.id} artifact={artifact} surfaceRadius={radius + 0.025} selected={selected?.id === artifact.id} onSelect={onSelect}/>) }
  </group>;
}

export default function PlanetGlobe({ texturePath, radius = 3.2, artifacts, regions, orbits, selected, onSelect, selectedOrbit, onOrbitSelect }) {
  const controls = useRef(null);
  useEffect(() => { controls.current?.setLookAt(0, 0.12, 8.3, 0, 0, 0, false); }, []);
  return <Canvas className="moon-globe-canvas" camera={{ position: [0, 0.12, 8.3], fov: 39, near: 0.1, far: 100 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
    <ambientLight intensity={0.42}/>
    <directionalLight position={[0, 2, 8]} intensity={2.3}/>
    <Suspense fallback={null}><TexturedPlanet texturePath={texturePath} radius={radius} artifacts={artifacts} regions={regions} orbits={orbits} selected={selected} onSelect={onSelect} selectedOrbit={selectedOrbit} onOrbitSelect={onOrbitSelect}/></Suspense>
    <CameraControls ref={controls} makeDefault minDistance={5.4} maxDistance={26} smoothTime={0.65} draggingSmoothTime={0.16} dollyToCursor={false} azimuthRotateSpeed={0.55} polarRotateSpeed={0.55} truckSpeed={0}/>
  </Canvas>;
}
