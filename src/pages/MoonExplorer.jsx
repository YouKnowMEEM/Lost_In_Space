import React from "react";
import artifacts from "../data/lunar_artifacts.json";
import orbits from "../data/lunar_orbits.json";
import regions from "../data/lunar_regions.json";
import PlanetExplorer from "./PlanetExplorer";

export default function MoonExplorer() {
  return <PlanetExplorer
    planet="Moon"
    texturePath="/models/2k_moon.jpeg"
    artifacts={artifacts}
    regions={regions}
    orbits={orbits}
    programs={["All", "Apollo", "Mapping", "Modern Missions"]}
    equipmentHeading="NASA LUNAR EQUIPMENT"
  />;
}
