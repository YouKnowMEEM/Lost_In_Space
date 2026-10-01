import React, { useEffect, useMemo, useRef, useState } from "react";
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
  const hoverTimer = useRef(null);
  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);
  const position = useMemo(() => latLngToVector3(artifact.lat, artifact.lon, surfaceRadius), [artifact.lat, artifact.lon, surfaceRadius]);
  const color = artifact.statusCategory === "active" ? "#63ddff" : artifact.statusCategory === "impact" ? "#f3a37f" : "#e3f2ff";
  return <group position={position}>
    {selected && <mesh>
      <torusGeometry args={[0.064, 0.007, 5, 24]}/>
      <meshBasicMaterial color="#d9f8ff" transparent opacity={0.9} depthWrite={false}/>
    </mesh>}
    <mesh
      onPointerDown={(event) => event.stopPropagation()}
      onPointerOver={(event) => { event.stopPropagation(); window.clearTimeout(hoverTimer.current); setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={(event) => { event.stopPropagation(); hoverTimer.current = window.setTimeout(() => setHovered(false), 120); document.body.style.cursor = ""; }}
      onClick={(event) => { event.stopPropagation(); onSelect(artifact); }}
    >
      <sphereGeometry args={[hovered || selected ? 0.052 : 0.04, 10, 8]}/>
      <meshBasicMaterial color={color} toneMapped={false}/>
    </mesh>
    {(hovered || selected) && <Html position={[0, 0.12, 0.025]} center distanceFactor={8} occlude>
      <div
        className="equipment-marker-label"
        onPointerEnter={() => { window.clearTimeout(hoverTimer.current); setHovered(true); }}
        onPointerLeave={() => { hoverTimer.current = window.setTimeout(() => setHovered(false), 120); }}
      >
        {artifact.name}
      </div>
    </Html>}
  </group>;
}
