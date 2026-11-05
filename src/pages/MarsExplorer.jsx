import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import artifacts from "../data/mars_artifacts.json";
import orbits from "../data/mars_orbits.json";
import regions from "../data/mars_regions.json";
import PlanetExplorer from "./PlanetExplorer";
import { SignalHUD, useSignalHunter } from "../components/SignalHunter";

export default function MarsExplorer() {
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
      planet="Mars"
      texturePath="/models/2k_mars.jpeg"
      artifacts={artifacts}
      regions={regions}
      orbits={orbits}
      programs={["All", "Mapping", "Modern Missions"]}
      equipmentHeading="NASA MARS EQUIPMENT"
      signalHunter={signalHunterRoute ? game : undefined}
    />
    {signalHunterRoute && <SignalHUD game={game} body="Mars" onOpenStory={(path) => navigate(path)} />}
  </>;
}
