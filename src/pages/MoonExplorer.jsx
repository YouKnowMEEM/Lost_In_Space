import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import artifacts from "../data/lunar_artifacts.json";
import orbits from "../data/lunar_orbits.json";
import regions from "../data/lunar_regions.json";
import PlanetExplorer from "./PlanetExplorer";
import { SignalHUD, useSignalHunter } from "../components/SignalHunter";

export default function MoonExplorer() {
  const game = useSignalHunter(artifacts);
  const navigate = useNavigate();
  const location = useLocation();
  const signalHunterRoute = new URLSearchParams(location.search).get("game") === "signal-hunter";
  const autoStarted = useRef(false);

  useEffect(() => {
    if (!signalHunterRoute || autoStarted.current) return;
    autoStarted.current = true;
    game.start();
  }, [game.start, signalHunterRoute]);

  return <>
    <PlanetExplorer
      planet="Moon"
      texturePath="/models/2k_moon.jpeg"
      artifacts={artifacts}
      regions={regions}
      orbits={orbits}
      programs={["All", "Apollo", "Mapping", "Modern Missions"]}
      equipmentHeading="NASA LUNAR EQUIPMENT"
      signalHunter={signalHunterRoute ? game : undefined}
    />
    {signalHunterRoute && <SignalHUD game={game} onOpenStory={(path) => navigate(path)} />}
  </>;
}
