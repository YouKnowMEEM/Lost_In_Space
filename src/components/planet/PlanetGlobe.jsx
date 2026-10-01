import React, { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraControls, Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";
import EquipmentMarker from "./EquipmentMarker";
import RegionLabels from "./RegionLabels";
import PlanetOrbits from "./PlanetOrbits";

function TexturedPlanet({ texturePath, radius, artifacts, regions, orbits, selected, onSelect, selectedOrbit, onOrbitSelect }) {
  const texture = useTexture(texturePath);
  useEffect(() => { texture.colorSpace = THREE.SRGBColorSpace; texture.needsUpdate = true; }, [texture]);
  return <group rotation={[0, -Math.PI / 2, 0]}>
    <mesh onClick={(event) => event.stopPropagation()}>
      <sphereGeometry args={[radius, 96, 64]}/>
      <meshStandardMaterial map={texture} roughness={1} metalness={0}/>
    </mesh>
    <PlanetOrbits orbits={orbits} selectedOrbit={selectedOrbit} onSelect={onOrbitSelect}/>
    <RegionLabels regions={regions} surfaceRadius={radius}/>
    {artifacts.map((artifact) => <EquipmentMarker key={artifact.id} artifact={artifact} surfaceRadius={radius + 0.025} selected={selected?.id === artifact.id} onSelect={onSelect}/>) }
  </group>;
}

export default function PlanetGlobe({ texturePath, radius = 3.2, artifacts, regions, orbits, selected, onSelect, selectedOrbit, onOrbitSelect }) {
  const controls = useRef(null);
  useEffect(() => { controls.current?.setLookAt(0, 0.12, 8.3, 0, 0, 0, false); }, []);
  return <Canvas className="moon-globe-canvas" camera={{ position: [0, 0.12, 8.3], fov: 39, near: 0.1, far: 100 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: false }}>
    <color attach="background" args={["#02050a"]}/>
    <ambientLight intensity={0.42}/>
    <directionalLight position={[0, 2, 8]} intensity={2.3}/>
    <Stars radius={70} depth={45} count={1800} factor={2.2} saturation={0.12} fade speed={0.12}/>
    <Suspense fallback={null}><TexturedPlanet texturePath={texturePath} radius={radius} artifacts={artifacts} regions={regions} orbits={orbits} selected={selected} onSelect={onSelect} selectedOrbit={selectedOrbit} onOrbitSelect={onOrbitSelect}/></Suspense>
    <CameraControls ref={controls} makeDefault minDistance={5.4} maxDistance={26} smoothTime={0.65} draggingSmoothTime={0.16} dollyToCursor={false} azimuthRotateSpeed={0.55} polarRotateSpeed={0.55} truckSpeed={0}/>
  </Canvas>;
}
