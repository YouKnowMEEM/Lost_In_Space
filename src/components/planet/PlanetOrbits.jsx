import React, { useMemo } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import TextSprite from "./TextSprite";

function orbitPoint(orbit, angle) {
  const eccentricity = orbit.type === "elliptical"
    ? (orbit.apoapsis - orbit.periapsis) / (orbit.apoapsis + orbit.periapsis)
    : 0;
  const radius = orbit.type === "elliptical"
    ? orbit.periapsis * (1 + eccentricity) / (1 + eccentricity * Math.cos(angle))
    : orbit.radius;
  const inclination = orbit.inclination ?? 0;
  const ascendingNode = orbit.ascendingNode ?? 0;
  const argumentOfPeriapsis = orbit.argumentOfPeriapsis ?? 0;
  const orbitalX = radius * Math.cos(angle + argumentOfPeriapsis);
  const orbitalY = radius * Math.sin(angle + argumentOfPeriapsis);
  const inclinedY = orbitalY * Math.cos(inclination);
  return new THREE.Vector3(
    orbitalX * Math.cos(ascendingNode) - inclinedY * Math.sin(ascendingNode),
    orbitalX * Math.sin(ascendingNode) + inclinedY * Math.cos(ascendingNode),
    orbitalY * Math.sin(inclination)
  );
}

function OrbitObject({ orbit, selected, onSelect }) {
  const inactive = orbit.status === "inactive";
  const points = useMemo(() => {
    const result = [];
    const segments = 240;
    for (let i = 0; i <= segments; i += 1) {
      result.push(orbitPoint(orbit, Math.PI * 2 * i / segments));
    }
    return result;
  }, [orbit]);
  const marker = useMemo(() => orbitPoint(orbit, orbit.markerAngle), [orbit]);
  return <group>
    <Line points={points} color={selected ? "#f1fbff" : inactive ? "#7b8794" : "#93a0b0"} lineWidth={selected ? 1.7 : 0.8} transparent opacity={selected ? 0.94 : inactive ? 0.19 : 0.34} depthTest renderOrder={9}/>
    <TextSprite
      text={orbit.name}
      kind="orbit"
      position={marker.toArray()}
      size={0.12}
      markerAnchor
      selected={selected}
      inactive={inactive}
      onPointerOver={() => { document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = ""; }}
      onClick={(event) => { event.stopPropagation(); onSelect(selected ? null : orbit.id); }}
    />
  </group>;
}

export default function PlanetOrbits({ orbits, selectedOrbit, onSelect }) {
  return <group>{orbits.map((orbit) => <OrbitObject key={orbit.id} orbit={orbit} selected={selectedOrbit === orbit.id} onSelect={onSelect}/>)}</group>;
}
