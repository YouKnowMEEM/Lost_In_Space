import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import EquipmentSidebar from "../components/planet/EquipmentSidebar";
import FilterBar from "../components/planet/FilterBar";
import PlanetGlobe from "../components/planet/PlanetGlobe";
import Timeline from "../components/planet/Timeline";

export default function PlanetExplorer({ planet, texturePath, artifacts, regions, orbits, programs, equipmentHeading, signalHunter }) {
  const [program, setProgram] = useState("All");
  const [status, setStatus] = useState("all");
  const [year, setYear] = useState(2030);
  const [selected, setSelected] = useState(null);
  const [clickOrigin, setClickOrigin] = useState(null);
  const [selectedOrbit, setSelectedOrbit] = useState(null);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [focusedRegion, setFocusedRegion] = useState(null);
  const [focusedEquipment, setFocusedEquipment] = useState(null);
  const [globeReady, setGlobeReady] = useState(false);
  const [notice, setNotice] = useState(false);
  const visible = useMemo(() => artifacts.filter((item) =>
    (program === "All" || item.program === program) &&
    (status === "all" || item.statusCategory === status) && Number(item.year) <= year
  ), [artifacts, program, status, year]);
  const visibleOrbits = useMemo(() => orbits.filter((orbit) =>
    (program === "All" || !orbit.program || orbit.program === program) &&
    (status === "all" || !orbit.statusCategory || orbit.statusCategory === status) &&
    (!Number.isFinite(Number(orbit.year)) || Number(orbit.year) <= year)
  ), [orbits, program, status, year]);
  const searchResults = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return [];
    const equipmentMatches = artifacts
      .filter((item) => item.name.toLocaleLowerCase().includes(query))
      .map((item) => ({ kind: "equipment", id: item.id, name: item.name, item }));
    const regionMatches = regions
      .filter((item) => item.name.toLocaleLowerCase().includes(query))
      .map((item) => ({ kind: "region", id: item.id, name: item.name, item }));
    const orbitMatches = orbits
      .filter((item) => item.name.toLocaleLowerCase().includes(query))
      .map((item) => ({ kind: "orbit", id: item.id, name: item.name, item }));
    return [...equipmentMatches, ...regionMatches, ...orbitMatches].slice(0, 8);
  }, [artifacts, regions, orbits, search]);

  useEffect(() => {
    if (!controlsOpen) return undefined;
    const closeOnEscape = (event) => { if (event.key === "Escape") setControlsOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [controlsOpen]);

  useEffect(() => {
    if (!signalHunter?.active) return;
    setSelected(null);
    setClickOrigin(null);
    setFocusedEquipment(null);
    setFocusedRegion(null);
    setSelectedOrbit(null);
    setControlsOpen(false);
  }, [signalHunter?.active]);

  const selectArtifact = (artifact, origin) => {
    setControlsOpen(false);
    setClickOrigin(origin || null);
    setFocusedEquipment(null);
    setSelected(artifact);
    window.dispatchEvent(new CustomEvent("sb:tutorial-artifact-selected", { detail: { id: artifact.id, name: artifact.name } }));
  };
  const markGlobeReady = useCallback(() => setGlobeReady(true), []);

  const chooseSearchResult = (result) => {
    setSearch("");
    if (result.kind === "equipment") {
      setProgram("All");
      setStatus("all");
      setYear(2030);
      setFocusedRegion(null);
      setSelected(null);
      setClickOrigin(null);
      setSelectedOrbit(null);
      setFocusedEquipment({ ...result.item, focusDistance: 8.4 });
      return;
    }
    if (result.kind === "orbit") {
      setProgram("All");
      setStatus("all");
      setYear(2030);
      setSelected(null);
      setFocusedRegion(null);
      setFocusedEquipment(null);
      setSelectedOrbit(result.id);
      return;
    }
    setSelected(null);
    setSelectedOrbit(null);
    setFocusedEquipment(null);
    setFocusedRegion(result.item);
  };

  return <main id="main-content" className="moon-explorer" tabIndex="-1">
    <section className={`moon-atlas${controlsOpen ? " has-controls" : ""}`} data-globe-ready={globeReady ? "true" : "false"} aria-label={`Interactive 3D ${planet} globe`}>
      <PlanetGlobe texturePath={texturePath} artifacts={visible} regions={regions} orbits={visibleOrbits} selected={selected || focusedEquipment} onSelect={selectArtifact} selectedOrbit={selectedOrbit} onOrbitSelect={setSelectedOrbit} focusedRegion={focusedRegion} focusPoint={focusedEquipment || focusedRegion} onReady={markGlobeReady} signalHunter={signalHunter}/>
      <div className="moon-map-title"><span>{planet.toUpperCase()} ARCHIVE</span><h1>{planet} explorer</h1><p>Equipment and missions across the {planet.toLowerCase()} surface.</p><div className="moon-search-wrap"><label className="moon-search"><Search size={15} aria-hidden="true"/><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search equipment, region, or orbit" aria-label={`Search ${planet} equipment, regions, or orbits`} aria-expanded={Boolean(search.trim())} aria-controls="moon-search-results"/><button type="button" aria-label="Clear search" onClick={() => setSearch("")} hidden={!search}><X size={14}/></button></label>{search.trim() && <div className="moon-search-results" id="moon-search-results" role="listbox">{searchResults.length ? searchResults.map((result) => <button type="button" role="option" key={`${result.kind}-${result.id}`} onClick={() => chooseSearchResult(result)}><span>{result.name}</span><small>{result.kind === "equipment" ? "Equipment" : result.kind === "region" ? "Region" : "Orbit"}</small></button>) : <p>No matching equipment, regions, or orbits.</p>}</div>}</div><button type="button" className="moon-control-toggle" aria-expanded={controlsOpen} aria-controls="planet-control-sidebar" onClick={() => setControlsOpen(true)}><SlidersHorizontal size={15}/> Filters &amp; timeline</button></div>
      <div className="moon-map-footer"><span>Total =</span><span>{visible.length + visibleOrbits.length} {visible.length + visibleOrbits.length === 1 ? "object" : "objects"}</span></div>
      {controlsOpen && <>
        <aside className="moon-control-sidebar" id="planet-control-sidebar" aria-label={`${planet} explorer controls`}>
          <div className="moon-control-sidebar-head"><div><span>EXPLORE</span><h2>{planet} controls</h2></div><button type="button" className="moon-sidebar-close" aria-label="Close controls" onClick={() => setControlsOpen(false)}><X size={18}/></button></div>
          <FilterBar program={program} status={status} setProgram={setProgram} setStatus={setStatus} programs={programs}/>
          <div className="moon-control-legend"><span>MARKER STATUS</span><div><i className="key-active"/>Active</div><div><i className="key-impact"/>Impact / crashed</div><div><i className="key-intact"/>Intact</div><div><i className="key-future"/>Future (speculative)</div></div>
          <Timeline year={year} setYear={setYear}/>
          <p className="moon-control-hint">Choose a marker on the surface to view equipment details. Select an orbiting object to highlight its path.</p>
        </aside>
      </>}
    </section>
    <div className="planet-sr-only" aria-label={`${planet} markers and orbit controls`}>
      {visible.map((artifact) => <button type="button" key={artifact.id} aria-pressed={selected?.id === artifact.id} onClick={() => selectArtifact(artifact)}>{artifact.name}</button>)}
      {visibleOrbits.map((orbit) => <button type="button" key={orbit.id} aria-pressed={selectedOrbit === orbit.id} onClick={() => setSelectedOrbit(selectedOrbit === orbit.id ? null : orbit.id)}>Highlight {orbit.name} orbit</button>)}
    </div>
    <EquipmentSidebar artifact={selected} origin={clickOrigin} equipmentHeading={equipmentHeading} onClose={() => { setSelected(null); setClickOrigin(null); }} onSurfaceMode={() => { setNotice(true); window.setTimeout(() => setNotice(false), 2600); }}/>
    {notice && <div className="moon-mode-notice" role="status">3D Surface Mode is planned for a future update.</div>}
  </main>;
}
