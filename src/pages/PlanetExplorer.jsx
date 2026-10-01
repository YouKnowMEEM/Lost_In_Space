import React, { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import EquipmentSidebar from "../components/planet/EquipmentSidebar";
import FilterBar from "../components/planet/FilterBar";
import PlanetGlobe from "../components/planet/PlanetGlobe";
import Timeline from "../components/planet/Timeline";

export default function PlanetExplorer({ planet, texturePath, artifacts, regions, orbits, programs, equipmentHeading }) {
  const [program, setProgram] = useState("All");
  const [status, setStatus] = useState("all");
  const [year, setYear] = useState(2030);
  const [selected, setSelected] = useState(null);
  const [selectedOrbit, setSelectedOrbit] = useState(null);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [notice, setNotice] = useState(false);
  const visible = useMemo(() => artifacts.filter((item) =>
    (program === "All" || item.program === program) &&
    (status === "all" || item.statusCategory === status) && Number(item.year) <= year
  ), [artifacts, program, status, year]);

  useEffect(() => {
    if (!controlsOpen) return undefined;
    const closeOnEscape = (event) => { if (event.key === "Escape") setControlsOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [controlsOpen]);

  const selectArtifact = (artifact) => {
    setControlsOpen(false);
    setSelected(artifact);
  };

  return <main id="main-content" className="moon-explorer" tabIndex="-1">
    <section className="moon-atlas" aria-label={`Interactive 3D ${planet} globe`}>
      <PlanetGlobe texturePath={texturePath} artifacts={visible} regions={regions} orbits={orbits} selected={selected} onSelect={selectArtifact} selectedOrbit={selectedOrbit} onOrbitSelect={setSelectedOrbit}/>
      <div className="moon-map-title"><span>{planet.toUpperCase()} ARCHIVE</span><h1>{planet} explorer</h1><p>Equipment and missions across the {planet.toLowerCase()} surface.</p><button type="button" className="moon-control-toggle" aria-expanded={controlsOpen} aria-controls="planet-control-sidebar" onClick={() => setControlsOpen(true)}><SlidersHorizontal size={15}/> Filters &amp; timeline</button></div>
      <div className="moon-map-footer"><span>Total =</span><span>{visible.length} {visible.length === 1 ? "record" : "records"}</span></div>
      {controlsOpen && <>
        <button type="button" className="moon-controls-scrim" aria-label="Close filters and timeline" onClick={() => setControlsOpen(false)}/>
        <aside className="moon-control-sidebar" id="planet-control-sidebar" aria-label={`${planet} explorer controls`}>
          <div className="moon-control-sidebar-head"><div><span>EXPLORE</span><h2>{planet} controls</h2></div><button type="button" className="moon-sidebar-close" aria-label="Close controls" onClick={() => setControlsOpen(false)}><X size={18}/></button></div>
          <FilterBar program={program} status={status} setProgram={setProgram} setStatus={setStatus} programs={programs}/>
          <div className="moon-control-legend"><span>MARKER STATUS</span><div><i className="key-active"/>Active</div><div><i className="key-impact"/>Impact / crashed</div><div><i className="key-intact"/>Intact</div></div>
          <Timeline year={year} setYear={setYear}/>
          <p className="moon-control-hint">Choose a marker on the surface to view equipment details. Select an orbiting object to highlight its path.</p>
        </aside>
      </>}
    </section>
    <div className="planet-sr-only" aria-label={`${planet} markers and orbit controls`}>
      {visible.map((artifact) => <button type="button" key={artifact.id} aria-pressed={selected?.id === artifact.id} onClick={() => selectArtifact(artifact)}>{artifact.name}</button>)}
      {orbits.map((orbit) => <button type="button" key={orbit.id} aria-pressed={selectedOrbit === orbit.id} onClick={() => setSelectedOrbit(selectedOrbit === orbit.id ? null : orbit.id)}>Highlight {orbit.name} orbit</button>)}
    </div>
    <EquipmentSidebar artifact={selected} equipmentHeading={equipmentHeading} onClose={() => setSelected(null)} onSurfaceMode={() => { setNotice(true); window.setTimeout(() => setNotice(false), 2600); }}/>
    {notice && <div className="moon-mode-notice" role="status">3D Surface Mode is planned for a future update.</div>}
  </main>;
}
