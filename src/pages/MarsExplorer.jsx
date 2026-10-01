import React from "react";
import artifacts from "../data/mars_artifacts.json";
import orbits from "../data/mars_orbits.json";
import regions from "../data/mars_regions.json";
import PlanetExplorer from "./PlanetExplorer";

export default function MarsExplorer() {
  return <PlanetExplorer
    planet="Mars"
    texturePath="/models/2k_mars.jpeg"
    artifacts={artifacts}
    regions={regions}
    orbits={orbits}
    programs={["All", "Mapping", "Modern Missions"]}
    equipmentHeading="NASA MARS EQUIPMENT"
  />;
}
