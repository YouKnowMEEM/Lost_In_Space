import React, { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { CameraControls, Html, Stars, useTexture } from "@react-three/drei";

// Apollo 11 landed at 0.67409° N, 23.47298° E (Tranquility Base).
// The marker is positioned using the standard latitude/longitude sphere mapping.
export function latLngToVector3(lat, lng, radius = 1.29) {
  const latitude = THREE.MathUtils.degToRad(lat);
  const longitude = THREE.MathUtils.degToRad(lng);
  return new THREE.Vector3(
      radius * Math.cos(latitude) * Math.cos(longitude),
      radius * Math.sin(latitude),
      -radius * Math.cos(latitude) * Math.sin(longitude)
  );
}

function MoonModel() {
  const spin = useRef();
  const texture = useTexture("/models/2k_moon.jpeg");
  useFrame((_, delta) => {
    if (spin.current) spin.current.rotation.y += delta * 0.025;
  });
  return (
      <group ref={spin}>
        <mesh>
          <sphereGeometry args={[3.65, 64, 32]} />
          <meshStandardMaterial map={texture} roughness={1} />
        </mesh>
      </group>
  );
}

function EagleMarker({ onOpen }) {
  const marker = useMemo(() => latLngToVector3(0.67409, 23.47298, 3.70), []);
  return (
      <group position={marker}>
        <Html center distanceFactor={8} zIndexRange={[30, 10]}>
          <button
              className="eagle-location-marker"
              type="button"
              aria-label="Open Apollo 11 Eagle landing site"
              title="Apollo 11 · Tranquility Base"
              onClick={(event) => {
                event.stopPropagation();
                onOpen?.();
              }}
          >
            <span className="eagle-marker-pulse" />
            <span className="eagle-marker-core" />
          </button>
        </Html>
      </group>
  );
}

function ArchiveStarfield() {
  const far = useRef();
  const near = useRef();
  useFrame((_, delta) => {
    if (far.current) far.current.rotation.y += delta * 0.0025;
    if (near.current) near.current.rotation.y -= delta * 0.006;
  });
  return <>
    <group ref={far}><Stars radius={100} depth={70} count={4200} factor={2.1} saturation={0.08} fade speed={0.18}/></group>
    <group ref={near}><Stars radius={55} depth={35} count={900} factor={3.1} saturation={0.18} fade speed={0.35}/></group>
  </>;
}

function MoonScene({ onOpen }) {
  const controls = useRef(null);
  useEffect(() => {
    controls.current?.setLookAt(0, 0.25, 12.4, 0, 0, 0, false);
  }, []);

  return (
      <Canvas
          camera={{ position: [0, 0.25, 12.4], fov: 38, near: 0.1, far: 100 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#050912"]} />
        {/* Uniform illumination keeps the entire Moon visible; no day/night terminator. */}
        <ambientLight intensity={1.35} />
        <ArchiveStarfield/>
        <Suspense fallback={null}>
          <MoonModel />
          <EagleMarker onOpen={onOpen} />
        </Suspense>
        <CameraControls
            ref={controls}
            makeDefault
            minDistance={4.3}
            maxDistance={22}
            smoothTime={1.25}
            draggingSmoothTime={0.2}
            dollyToCursor={false}
            azimuthRotateSpeed={0.55}
            polarRotateSpeed={0.55}
        />
      </Canvas>
  );
}

export default function MoonMap({ onDecrypt }) {
  return (
      <main className="moon-clean-page" aria-label="Interactive 3D Moon">
        <div className="moon-clean-canvas">
          <MoonScene onOpen={() => onDecrypt?.("apollo-11")} />
        </div>
      </main>
  );
}

// Viking 1 lander site: 22.48° N, 47.97° W (Chryse Planitia).
function MarsModel() {
  const spin = useRef();
  const texture = useTexture("/models/2k_mars.jpeg");
  useFrame((_, delta) => {
    if (spin.current) spin.current.rotation.y += delta * 0.024;
  });
  return (
      <group ref={spin}>
        <mesh>
          <sphereGeometry args={[3.65, 64, 32]} />
          <meshStandardMaterial map={texture} roughness={1} />
        </mesh>
      </group>
  );
}
function VikingMarker() {
  const marker = useMemo(() => latLngToVector3(22.48,-47.97,3.70), []);
  return <group position={marker}><Html center distanceFactor={8} zIndexRange={[30,10]}><div className="mars-location-marker" title="Viking 1 · Chryse Planitia"><span/><b>VIKING 1</b></div></Html></group>;
}
function MarsScene() {
  const controls = useRef(null);
  useEffect(() => { controls.current?.setLookAt(0,.25,12.4,0,0,0,false); }, []);
  return <Canvas camera={{position:[0,.25,12.4],fov:38,near:.1,far:100}} dpr={[1,1.75]} gl={{antialias:true,alpha:false}}>
    <color attach="background" args={["#030712"]}/><ArchiveStarfield/>
    {/* Uniform illumination keeps the entire Mars globe visible; no day/night terminator. */}
    <ambientLight intensity={1.35}/>
    <Suspense fallback={null}><MarsModel/><VikingMarker/></Suspense>
    <CameraControls ref={controls} makeDefault minDistance={4.3} maxDistance={22} smoothTime={1.25} draggingSmoothTime={.2} dollyToCursor={false} azimuthRotateSpeed={.55} polarRotateSpeed={.55}/>
  </Canvas>;
}
export function MarsMap(){return <main className="moon-clean-page mars-clean-page" aria-label="Interactive 3D Mars"><div className="moon-clean-canvas"><MarsScene/></div></main>;}
