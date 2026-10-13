import React, { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import TextSprite from "./TextSprite";

export function latLngToVector3(lat, lon, radius = 3.22) {
  const latitude = THREE.MathUtils.degToRad(Number(lat));
  const longitude = THREE.MathUtils.degToRad(Number(lon));
  return new THREE.Vector3(
    radius * Math.cos(latitude) * Math.cos(longitude),
    radius * Math.sin(latitude),
    -radius * Math.cos(latitude) * Math.sin(longitude)
  );
}

export default function EquipmentMarker({ artifact, selected, onSelect, surfaceRadius = 3.205 }) {
  const [hovered, setHovered] = useState(false);
  const haloRef = useRef(null);

  const position = useMemo(() => latLngToVector3(artifact.lat, artifact.lon, surfaceRadius), [artifact.lat, artifact.lon, surfaceRadius]);

  // Calculate orientation quaternion so the marker aligns smoothly to the surface normal
  const orientation = useMemo(() => {
    const normal = position.clone().normalize();
    const up = new THREE.Vector3(0, 1, 0);
    return new THREE.Quaternion().setFromUnitVectors(up, normal);
  }, [position]);

  const color = artifact.statusCategory === "active" ? "#4cd7ff" : artifact.statusCategory === "impact" ? "#ff7c59" : "#e0eeff";
  const pulseOffset = (Number(artifact.lat) * 0.13 + Number(artifact.lon) * 0.07) % (Math.PI * 2);

  useFrame(({ clock }) => {
    const halo = haloRef.current;
    if (!halo) return;
    const pulse = (Math.sin(clock.elapsedTime * 2.2 + pulseOffset) + 1) / 2;
    halo.scale.setScalar(0.92 + pulse * 0.2);
    halo.material.opacity = (hovered || selected ? 0.28 : 0.12) + pulse * (hovered || selected ? 0.18 : 0.11);
  });

  const handleClick = (event) => {
    event.stopPropagation();
    const clickOrigin = {
      x: event.clientX || window.innerWidth * 0.5,
      y: event.clientY || window.innerHeight * 0.5
    };
    onSelect(artifact, clickOrigin);
  };

  return <group position={position} quaternion={orientation}>
    {/* Large invisible hit area sphere to ensure super reliable mouse hover/click without flickering */}
    <mesh
      position={[0, 0.02, 0]}
      onPointerDown={(event) => event.stopPropagation()}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "";
      }}
      onClick={handleClick}
    >
      <sphereGeometry args={[0.075, 12, 12]}/>
      <meshBasicMaterial transparent opacity={0} depthWrite={false}/>
    </mesh>

    {/* Soft ground halo */}
    <mesh ref={haloRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
      <ringGeometry args={[hovered || selected ? 0.064 : 0.052, hovered || selected ? 0.076 : 0.062, 32]}/>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={hovered || selected ? 0.42 : 0.24}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>

    {/* Raised beacon pin */}
    <mesh position={[0, 0.047, 0]}>
      <cylinderGeometry args={[0.004, 0.009, 0.075, 8]}/>
      <meshBasicMaterial color={color} toneMapped={false}/>
    </mesh>
    <mesh position={[0, 0.094, 0]} scale={hovered || selected ? 1.2 : 1}>
      <octahedronGeometry args={[0.026, 0]}/>
      <meshBasicMaterial color={selected ? "#ffffff" : color} toneMapped={false}/>
    </mesh>
    <mesh position={[0, 0.094, 0]}>
      <sphereGeometry args={[0.008, 12, 12]}/>
      <meshBasicMaterial color="#ffffff" toneMapped={false}/>
    </mesh>

    {/* Floating HUD Name Tooltip: shows ONLY the name, disappears when sidebar is opened (selected) */}
    {hovered && !selected && <Html position={[0, 0.08, 0]} center distanceFactor={8} occlude={false} style={{ pointerEvents: "none" }}>
      <div className="equipment-marker-label">
        <strong>{artifact.name}</strong>
      </div>
    </Html>}
  </group>;
}
