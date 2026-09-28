import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { CameraControls, Float, Html, Stars, useGLTF, useTexture } from "@react-three/drei";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowDown, ArrowRight, Box, ChevronDown, ExternalLink, Lock, MapPin, Moon as MoonIcon,
  Orbit, Play, Radio, RadioTower, Rotate3D, Satellite, ScanLine, Sparkles, Timer, Volume2, VolumeX, Weight, Zap
} from "lucide-react";
import eagle from "../data/eagle.json";
import { getArtifact } from "../services/archiveApi";
import MoonMap, { MarsMap } from "../components/MoonMap";

const SPACE_BG = "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop";
const VOYAGER_AUDIO = "https://www.nasa.gov/wp-content/uploads/2015/01/voyager-plasma-waves.mp3";
const QUINDAR_AUDIO = "https://www.nasa.gov/wp-content/uploads/2015/01/quindar_tones.mp3";

function SpaceBackdrop() {
  return <div className="space-backdrop" aria-hidden="true"><img src={SPACE_BG} alt=""/><div className="space-backdrop-gradient"/></div>;
}

function Topbar() {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const isMars = location.pathname.startsWith("/mars");
  const isMoon = location.pathname.startsWith("/moon") || location.pathname.startsWith("/eagle");
  const world = isMars ? "MARS" : "THE MOON";
  useEffect(() => { setOpenMenu(null); }, [location.pathname]);
  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === "Escape") setOpenMenu(null); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);
  const toggleMenu = (name) => setOpenMenu(current => current === name ? null : name);
  return (
      <header className="topbar">
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Link className="brand" to="/" aria-label="Sleeping Beauties home">
          <span className="brand-mark"><Orbit size={21}/></span>
          <span><strong>{isMoon || isMars ? `${world} — Explore the Sleeping Beauties.` : "SLEEPING BEAUTIES"}</strong>{!(isMoon || isMars) && <small>THE FORGOTTEN SPACE EXPLORERS</small>}</span>
        </Link>
        <nav aria-label="Main navigation">
          <Link className={location.pathname === "/" ? "nav-active" : ""} to="/">Home</Link>
          <Link className={location.pathname === "/space" ? "nav-active" : ""} to="/space">Deep Space</Link>
          <div className={`nav-dropdown ${openMenu === "explore" ? "menu-open" : ""}`}><button type="button" aria-haspopup="true" aria-expanded={openMenu === "explore"} className={location.pathname.startsWith("/moon") || location.pathname.startsWith("/mars") ? "nav-active" : ""} onClick={()=>toggleMenu("explore")}>Explore <ChevronDown size={13}/></button><div className="nav-dropdown-menu"><Link to="/moon" onClick={()=>setOpenMenu(null)}>Moon</Link><Link to="/mars" onClick={()=>setOpenMenu(null)}>Mars</Link><Link to="/space" onClick={()=>setOpenMenu(null)}>Deep Space</Link></div></div>
          {(isMoon || isMars || location.pathname.startsWith("/space")) && <div className={`nav-dropdown ${openMenu === "objects" ? "menu-open" : ""}`}><button type="button" aria-haspopup="true" aria-expanded={openMenu === "objects"} className={openMenu === "objects" ? "nav-active" : ""} onClick={()=>toggleMenu("objects")}>Objects <ChevronDown size={13}/></button><div className="nav-dropdown-menu">{location.pathname.startsWith("/space") ? <><Link to="/space?object=voyager-1" onClick={()=>setOpenMenu(null)}>Voyager 1</Link><Link to="/space?object=voyager-2" onClick={()=>setOpenMenu(null)}>Voyager 2</Link><Link to="/space?object=pioneer-10" onClick={()=>setOpenMenu(null)}>Pioneer 10</Link><Link to="/space?object=pioneer-11" onClick={()=>setOpenMenu(null)}>Pioneer 11</Link><Link to="/space?object=new-horizons" onClick={()=>setOpenMenu(null)}>New Horizons</Link></> : isMars ? <Link to="/mars" onClick={()=>setOpenMenu(null)}>Vikings</Link> : <Link to="/eagle" onClick={()=>setOpenMenu(null)}>Eagle</Link>}</div></div>}
        </nav>
      </header>
  );
}

function Shell({ children, immersive = false }) {
  return <div className={`app-shell ${immersive ? "immersive-shell" : ""}`}><SpaceBackdrop/><Topbar/>{children}</div>;
}

function EntryGate({ onEnter }) {
  const [leaving, setLeaving] = useState(false);
  const enter = () => {
    setLeaving(true);
    window.setTimeout(onEnter, 650);
  };
  return <AnimatePresence>{!leaving && <motion.div className="entry-gate" initial={{opacity:1}} exit={{opacity:0}} transition={{duration:.6}} onClick={enter}>
    <div className="entry-stars"/>
    <motion.div className="entry-core" initial={{scale:.92,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:1.1}}>
      <span className="eyebrow">SLEEPING BEAUTIES / ARCHIVE 001</span>
      <h1>Initiate<br/><span>Sequence</span></h1>
      <p>Enter the celestial museum.</p>
      <button className="entry-button"><span>CLICK ANYWHERE</span><ArrowRight size={15}/></button>
    </motion.div>
    <div className="entry-corner">AUDIO SYSTEM READY · VISUAL SYSTEM READY · ARCHIVE ONLINE</div>
  </motion.div>}</AnimatePresence>;
}

function useEntryAudio(enabled) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.volume = 0.4;
    if (enabled) ref.current.play().catch(() => {});
    else ref.current.pause();
    return () => ref.current?.pause();
  }, [enabled]);
  return ref;
}

function PlanetSphere({ kind }) {
  const group = useRef();
  useFrame((_, delta) => { if (group.current) group.current.rotation.y += delta * 0.07; });
  const color = kind === "mars" ? "#9d4a31" : kind === "deep" ? "#315b88" : "#8e8b84";
  return <group ref={group}>
    <mesh castShadow receiveShadow>
      <sphereGeometry args={[1.55, 64, 64]} />
      <meshStandardMaterial color={color} roughness={1} metalness={0.02} />
    </mesh>
    {kind === "moon" && <mesh scale={1.01}><sphereGeometry args={[1.55,64,64]}/><meshBasicMaterial color="#d7d4cc" transparent opacity={0.05}/></mesh>}
    {kind === "deep" && <mesh scale={1.035}><sphereGeometry args={[1.55,64,64]}/><meshBasicMaterial color="#55b7ff" transparent opacity={0.08}/></mesh>}
  </group>;
}

function MiniCanvas({ kind }) {
  return <Canvas shadows camera={{position:[0,0,4.2], fov:38}} dpr={[1,2]}>
    <ambientLight intensity={0.06}/><directionalLight position={[-4,3,5]} intensity={4.5} castShadow/>
    <Stars radius={25} depth={12} count={900} factor={1.4} fade/>
    <Float speed={0.55} rotationIntensity={0.08} floatIntensity={0.12}><PlanetSphere kind={kind}/></Float>
  </Canvas>;
}

export function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [audioOn, setAudioOn] = useState(true);
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [speedModifier, setSpeedModifier] = useState(1);
  const [distanceToSelected, setDistanceToSelected] = useState(null);
  const audioRef = useRef(null);
  const cameraRef = useRef(null);
  const moonAnchorRef = useRef(null);
  const marsAnchorRef = useRef(null);
  const earthAnchorRef = useRef(null);
  const sunAnchorRef = useRef(null);
  const probesRefs = useRef({});
  const [journey, setJourney] = useState(null);
  useEffect(() => {
    const object = new URLSearchParams(location.search).get("object");
    const valid = ["voyager-1", "voyager-2", "pioneer-10", "pioneer-11", "new-horizons"];
    if (valid.includes(object)) setSelected(object);
  }, [location.search]);
  const enterWorld = async (world) => {
    if (journey) return;
    setJourney({ world, phase: "approach" });
    const controls = cameraRef.current;
    const anchor = world === "moon" ? moonAnchorRef.current : marsAnchorRef.current;
    if (controls && anchor) {
      const target = anchor.getWorldPosition(new THREE.Vector3());
      const current = controls.getPosition(new THREE.Vector3());
      const approach = current.clone().sub(target).normalize();
      if (approach.lengthSq() < 0.001) approach.set(0, 0.25, 1);
      // End just above the globe, then aim at its center for a precise final frame.
      const radius = world === "moon" ? 0.105 : 0.24;
      const destination = target.clone().add(approach.multiplyScalar(radius * 2.25));
      try {
        await controls.setLookAt(
            destination.x, destination.y, destination.z,
            target.x, target.y, target.z, true
        );
      } catch (_) {
        // If the camera animation is interrupted, still complete the route change.
      } finally {
        // Keep the camera controls available after the cinematic approach.
      }
    }
    setJourney({ world, phase: "fade" });
    window.setTimeout(() => navigate(world === "moon" ? "/moon" : "/mars"), 460);
  };
  const enterMoonArchive = () => enterWorld("moon");
  const enterMarsArchive = () => enterWorld("mars");

  useEffect(() => {
    const timeout = window.setTimeout(() => setWelcomeVisible(false), 6600);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;
    if (audioOn) {
      const attemptPlay = () => audio.play().catch(() => {});
      attemptPlay();
      // Browsers may block audible autoplay until the visitor interacts.
      const resume = () => {
        if (audioOn) attemptPlay();
        window.removeEventListener("pointerdown", resume);
        window.removeEventListener("keydown", resume);
      };
      window.addEventListener("pointerdown", resume, { once: true });
      window.addEventListener("keydown", resume, { once: true });
      return () => {
        window.removeEventListener("pointerdown", resume);
        window.removeEventListener("keydown", resume);
        audio.pause();
      };
    }
    audio.pause();
    return () => audio.pause();
  }, [audioOn]);

  const searchable = [
    { name: "Moon", detail: "Explore the lunar archive", type: "WORLD", action: () => setSelected("moon") },
    { name: "Apollo 11 · Eagle", detail: "The first lunar landing module", type: "ARTIFACT", action: () => navigate("/eagle") },
    { name: "Mars", detail: "The red planet · collection coming later", type: "WORLD", action: () => setSelected("mars") },
    { name: "Deep Space", detail: "Interplanetary and heliocentric objects", type: "ARCHIVE", action: () => setSelected("deep") },
    { name: "Earth", detail: "Our home world", type: "WORLD", action: () => setSelected("earth") },
    { name: "Voyager 1", detail: "Interstellar probe launched in 1977", type: "SPACECRAFT", action: () => setSelected("voyager-1") },
    { name: "Voyager 2", detail: "Outer-planet explorer launched in 1977", type: "SPACECRAFT", action: () => setSelected("voyager-2") },
    { name: "Pioneer 10", detail: "Jupiter flyby mission launched in 1972", type: "SPACECRAFT", action: () => setSelected("pioneer-10") },
    { name: "Pioneer 11", detail: "Jupiter and Saturn flyby mission launched in 1973", type: "SPACECRAFT", action: () => setSelected("pioneer-11") },
    { name: "New Horizons", detail: "Pluto and Kuiper Belt explorer launched in 2006", type: "SPACECRAFT", action: () => setSelected("new-horizons") }
  ];
  const matches = query.trim()
      ? searchable.filter(item => `${item.name} ${item.detail} ${item.type}`.toLowerCase().includes(query.trim().toLowerCase()))
      : [];

  return <Shell><main className="solar-home" id="main-content" tabIndex="-1">
    <AnimatePresence>
      {welcomeVisible && <motion.div className="solar-welcome" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.35}}>
        <motion.span initial={{y:8}} animate={{y:0}} exit={{y:-5}} transition={{duration:0.55}}>Welcome to the Space</motion.span>
      </motion.div>}
    </AnimatePresence>
    <audio ref={audioRef} loop src="/audio/home-audio.mp3" preload="auto"/>
    <div className="solar-home-scene">
      <Canvas shadows camera={{ position: [0, 5.5, 13.5], fov: 42, near: 0.1, far: 500 }} dpr={[1, 1.75]}>
        <color attach="background" args={["#030712"]}/>
        <ambientLight intensity={0.12}/>
        <pointLight
            position={[0, 0, 0]}
            intensity={180}
            distance={0}
            decay={2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={0.05}
            shadow-camera-far={24}
            shadow-bias={-0.00008}
            shadow-normalBias={0.006}
        />
        <MovingStarfield/>
        <Suspense fallback={null}>
          <SolarSystem selected={selected} onSelect={setSelected} moonAnchorRef={moonAnchorRef} marsAnchorRef={marsAnchorRef} earthAnchorRef={earthAnchorRef} sunAnchorRef={sunAnchorRef} probesRefs={probesRefs} paused={!!journey} speedModifier={speedModifier} cameraRef={cameraRef} onDistanceChange={setDistanceToSelected}/>
        </Suspense>
        <CameraControls ref={cameraRef} makeDefault minDistance={1.5} maxDistance={80} smoothTime={0.6} dollyToCursor={false}/>
      </Canvas>
    </div>

    <div className="solar-scale-caption">Planetary orbit spacing uses a shared AU scale; the Moon orbit and deep-space probes are compressed for visibility.</div>
    {distanceToSelected && selected && <div style={{ position: "absolute", top: 20, left: 20, zIndex: 1000, background: "rgba(0,0,0,0.5)", padding: "8px 14px", borderRadius: "8px", color: "#afc8e8", fontFamily: "monospace", fontSize: "13px", backdropFilter: "blur(4px)", letterSpacing: "0.5px" }}>
      <span style={{ color: "#7a9cc6", fontSize: "11px" }}>DIST </span>{distanceToSelected} AU
    </div>}
    <div className="solar-controls-panel" style={{ position: "absolute", bottom: 20, right: 20, zIndex: 1000, background: "rgba(0,0,0,0.5)", padding: "10px", borderRadius: "8px", color: "white", display: "flex", flexDirection: "column", gap: "10px", backdropFilter: "blur(4px)" }}>
      
      <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", flexDirection: "column" }}>Simulation Speed <input type="range" min="0" max="5" step="0.1" value={speedModifier} onChange={e => setSpeedModifier(parseFloat(e.target.value))} style={{ width: "150px" }} /></label>
    </div>
    <div className="solar-search-wrap">
      <label className="solar-search">
        <ScanLine size={18}/>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search the universe..." aria-label="Search space elements"/>
        {query && <button type="button" aria-label="Clear search" onClick={()=>setQuery("")}>×</button>}
      </label>
      {matches.length > 0 && <div className="solar-search-results">
        {matches.map(item=><button key={item.name} onClick={()=>{item.action();setQuery("");}}>
          <span><small>{item.type}</small><strong>{item.name}</strong><em>{item.detail}</em></span><ArrowRight size={16}/>
        </button>)}
      </div>}
      {query.trim() && matches.length===0 && <div className="solar-search-empty">No space objects found. Try “Moon”, “Mars” or “Voyager”.</div>}
    </div>

    {selected && <div className="solar-explore-pop solar-explore-other">
      <strong>{selected === "deep" ? "DEEP SPACE" : selected.toUpperCase()}</strong>
      {selected === "sun" && <em>The heart of our solar system</em>}
      {selected === "earth" && <em>The only place we know of inhabited by living things.</em>}
      {selected === "moon" && <><em>Earth's only natural satellite</em><button onClick={enterMoonArchive} disabled={!!journey}>Explore <ArrowRight size={16}/></button></>}
      {selected === "mars" && <><em>Dusty, cold, desert world with a very thin atmosphere.</em><button onClick={enterMarsArchive} disabled={!!journey}>Explore <ArrowRight size={16}/></button></>}
      {selected === "deep" && <em>Interplanetary and heliocentric objects</em>}
      {["voyager-1","voyager-2","pioneer-10","pioneer-11","new-horizons"].includes(selected) && <><em>{{"voyager-1":"Voyager 1 · Interstellar mission, launched 1977.","voyager-2":"Voyager 2 · The only spacecraft to visit Uranus and Neptune, launched 1977.","pioneer-10":"Pioneer 10 · First spacecraft to fly past Jupiter, launched 1972.","pioneer-11":"Pioneer 11 · First spacecraft to fly past Saturn, launched 1973.","new-horizons":"New Horizons · Pluto and Kuiper Belt explorer, launched 2006."}[selected]}</em><small className="scale-note">Schematic deep-space placement · not to scale</small></>}
    </div>}
    <AnimatePresence>{journey?.phase === "fade" && <motion.div className={`moon-journey-fade journey-${journey.world}`} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.46}} aria-hidden="true"/>}</AnimatePresence>
    <button className="solar-audio-toggle" onClick={()=>setAudioOn(v=>!v)} aria-label={audioOn?"Mute ambient audio":"Play ambient audio"}>
      {audioOn?<Volume2 size={17}/>:<VolumeX size={17}/> }
    </button>
  </main></Shell>;
}

const PLANET_TEXTURES = {
  earth: "/models/2k_earth.jpeg",
  mars: "/models/2k_mars.jpeg",
  moon: "/models/2k_moon.jpeg"
};

function SunModel({ onClick, hovered, setHovered }) {
  const spin = useRef();
  const { scene } = useGLTF("/models/sun.glb");
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = false;
        node.receiveShadow = false;
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        materials.forEach((material) => {
          if (material && "emissiveIntensity" in material) material.emissiveIntensity = 1.2;
          if (material && "emissive" in material) material.emissive = new THREE.Color("#ffcc66");
          if (material) material.needsUpdate = true;
        });
      }
    });
    return clone;
  }, [scene]);
  
  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const diameter = Math.max(size.x, size.y, size.z) || 1;
    return { scale: (1.05 * 2) / diameter, center };
  }, [model]);

  useFrame((_, delta) => {
    if (spin.current) spin.current.rotation.y += delta * 0.11;
  });

  return (
    <group onClick={onClick} onPointerOver={(e)=>{e.stopPropagation();setHovered("sun")}} onPointerOut={(e)=>{e.stopPropagation();setHovered(null)}}>
      <pointLight position={[0,0,0]} intensity={60} distance={4.5} decay={2} color="#ffddaa" />
      <group ref={spin} scale={fit.scale}>
        <primitive object={model} position={[-fit.center.x,-fit.center.y,-fit.center.z]}/>
      </group>
    </group>
  );
}
useGLTF.preload("/models/sun.glb");

function CelestialModel({ radius, onClick, name, hovered, setHovered }) {
  const spin = useRef();
  const texture = useTexture(PLANET_TEXTURES[name]);
  useFrame((_, delta) => {
    // Keep the Moon tidally locked in this schematic: its position orbits Earth,
    // while the visible face stays fixed instead of rotating around its axis.
    if (name !== "moon" && spin.current) spin.current.rotation.y += delta * 0.11;
  });
  return (
    <group onClick={onClick} onPointerOver={(e)=>{e.stopPropagation();setHovered(name)}} onPointerOut={(e)=>{e.stopPropagation();setHovered(null)}}>
      <group ref={spin}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[radius, 64, 32]} />
          <meshStandardMaterial map={texture} roughness={1} />
        </mesh>
      </group>
    </group>
  );
}

function MovingStarfield() {
  const far = useRef();
  const near = useRef();
  useFrame((_, delta) => {
    if (far.current) far.current.rotation.y += delta * 0.0025;
    if (near.current) near.current.rotation.y -= delta * 0.006;
  });
  return <>
    <group ref={far}><Stars radius={180} depth={120} count={9500} factor={1.25} saturation={0.06} fade speed={0.025}/></group>
    <group ref={near}><Stars radius={85} depth={55} count={1800} factor={2.0} saturation={0.1} fade speed={0.045}/></group>
  </>;
}

const PROBE_DATA = [
  { id:"voyager-1", label:"Voyager 1", color:"#c9b98f", position:[8.7*2.2, .55*2.2, -1.2*2.2], style:"voyager" },
  { id:"voyager-2", label:"Voyager 2", color:"#c9b98f", position:[-7.8*2.2, -.35*2.2, 2.6*2.2], style:"voyager" },
  { id:"pioneer-10", label:"Pioneer 10", color:"#d9b34f", position:[-1.8*2.2, .4*2.2, 6.9*2.2], style:"pioneer" },
  { id:"pioneer-11", label:"Pioneer 11", color:"#d9b34f", position:[2.8*2.2, -.55*2.2, -7.6*2.2], style:"pioneer" },
  { id:"new-horizons", label:"New Horizons", color:"#aeb9c7", position:[-5.8*2.2, .9*2.2, -7.3*2.2], style:"new-horizons" }
];

function DeepSpaceProbe({ probe, hovered, setHovered, onClick, anchorRef }) {
  const group = useRef();
  const isPioneer = probe.style === "pioneer";
  const isNH = probe.style === "new-horizons";
  const metal = useMemo(() => new THREE.MeshStandardMaterial({color:probe.color, metalness:.72, roughness:.34}), [probe.color]);
  const gold = useMemo(() => new THREE.MeshStandardMaterial({color:"#b89a55", metalness:.62, roughness:.42, side:THREE.DoubleSide}), []);
  useFrame((_,delta) => {
    if (group.current) group.current.rotation.y += delta * (isPioneer ? .055 : .035);
  });
  return <group position={probe.position} ref={(node) => { group.current = node; if (anchorRef) anchorRef(node); }} rotation={[.24,.4,-.18]}
                onClick={(e)=>{e.stopPropagation();onClick(probe.id)}}
                onPointerOver={(e)=>{e.stopPropagation();setHovered(probe.id)}}
                onPointerOut={(e)=>{e.stopPropagation();setHovered(null)}}>
    <mesh><sphereGeometry args={[.27,16,12]}/><meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false}/></mesh>
    {isPioneer ? <>
      <mesh rotation={[Math.PI/2,0,0]} material={gold}><circleGeometry args={[.23,32]}/></mesh>
      <mesh position={[0,0,.09]}><cylinderGeometry args={[.055,.07,.18,10]}/><primitive object={metal} attach="material"/></mesh>
      <mesh position={[0,.22,0]}><cylinderGeometry args={[.009,.009,.42,6]}/><primitive object={gold} attach="material"/></mesh>
    </> : <>
      <mesh position={[0,0,0]} material={metal}><boxGeometry args={isNH?[.13,.15,.17]:[.12,.12,.13]}/></mesh>
      <mesh position={[0,.12,0]} rotation={[Math.PI/2,0,0]} material={metal}><circleGeometry args={[isNH ? .12 : .21,32]}/></mesh>
      <mesh position={[0,.01,-.19]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.008,.008,.42,6]}/><primitive object={gold} attach="material"/></mesh>
      {!isNH && [-1,1].map(side=><group key={side} position={[side*.22,-.01,-.12]} rotation={[0,0,side*.04]}>
        <mesh material={gold}><boxGeometry args={[.24,.012,.27]}/></mesh>
        {[0,1,2,3].map(i=><mesh key={i} position={[-.09+i*.06,.009,0]}><boxGeometry args={[.006,.006,.25]}/><meshStandardMaterial color="#6d7890" metalness={0.25} roughness={0.7}/></mesh>)}
      </group>)}
    {isNH && <mesh position={[.19,-.015,-.1]} material={gold}><boxGeometry args={[.3,.012,.22]}/></mesh>}
    </>}
    <Html position={[0,.48,0]} center distanceFactor={12} zIndexRange={[30,0]}>
      <span className="deep-space-probe-label">{probe.label}</span>
    </Html>
  </group>;
}

function solveKepler(meanAnomaly, eccentricity) {
  let eccentricAnomaly = meanAnomaly;
  for (let i = 0; i < 6; i++) {
    eccentricAnomaly -= (eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly) - meanAnomaly) /
        (1 - eccentricity * Math.cos(eccentricAnomaly));
  }
  return eccentricAnomaly;
}

function EllipticalOrbit({ semiMajor, eccentricity, inclination = 0, color = "#9ba9bb", opacity = .18 }) {
  const line = useMemo(() => {
    const semiMinor = semiMajor * Math.sqrt(1 - eccentricity * eccentricity);
    const points = [];
    for (let i = 0; i < 240; i++) {
      const E = (i / 240) * Math.PI * 2;
      points.push(new THREE.Vector3(semiMajor * (Math.cos(E) - eccentricity), 0, semiMinor * Math.sin(E)));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
    return new THREE.LineLoop(geometry, material);
  }, [semiMajor, eccentricity, color, opacity]);
  useEffect(() => () => { line.geometry.dispose(); line.material.dispose(); }, [line]);
  return <group rotation={[inclination,0,0]}><primitive object={line}/></group>;
}

function SolarSystem({ selected, onSelect, moonAnchorRef, marsAnchorRef, earthAnchorRef, sunAnchorRef, probesRefs, paused, speedModifier, cameraRef, onDistanceChange }) {
  const [hovered,setHovered] = useState(null);
  const elapsed = useRef(0);
  const earthPosition = useRef();
  const marsPosition = useRef();
  const moonPosition = useRef();
  const earthPlane = useRef();
  const marsPlane = useRef();
  const moonPlane = useRef();
  const moonWorld = useMemo(() => new THREE.Vector3(), []);
  const earthA = 5.0, marsA = 5.0 * 1.523679, moonA = 0.85;
  const earthE = .0167, marsE = .0934, moonE = .0549;
  const earthPeriod = 365.256, marsPeriod = 686.98, moonPeriod = 27.3217;
  const inclinationMars = THREE.MathUtils.degToRad(1.85);
  const inclinationMoon = THREE.MathUtils.degToRad(5.145);
  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const camPos = useMemo(() => new THREE.Vector3(), []);
  const prevSelected = useRef(null);
  const distFrameCount = useRef(0);

  const RADII = { sun: 1.05, earth: .31, moon: .105, mars: .24 };
  const ZOOM_DISTANCES = { sun: 3.5, earth: 1.4, moon: 0.6, mars: 1.1 };

  const getTargetRef = (sel) => {
    if (sel === "earth") return earthAnchorRef;
    if (sel === "mars") return marsAnchorRef;
    if (sel === "moon") return moonAnchorRef;
    if (sel === "sun") return sunAnchorRef;
    if (probesRefs && probesRefs.current[sel]) return { current: probesRefs.current[sel] };
    return null;
  };

  useFrame((state, delta) => {
    if (paused) return;
    elapsed.current += Math.min(delta, .05) * 3 * speedModifier;
    const days = elapsed.current;
    const earthEccentric = solveKepler((days / earthPeriod) * Math.PI * 2 + .3, earthE);
    const marsEccentric = solveKepler((days / marsPeriod) * Math.PI * 2 + 2.1, marsE);
    const moonEccentric = solveKepler((days / moonPeriod) * Math.PI * 2 + .7, moonE);
    if (earthPosition.current) earthPosition.current.position.set(earthA * (Math.cos(earthEccentric) - earthE), 0, earthA * Math.sqrt(1-earthE*earthE) * Math.sin(earthEccentric));
    if (marsPosition.current) marsPosition.current.position.set(marsA * (Math.cos(marsEccentric) - marsE), 0, marsA * Math.sqrt(1-marsE*marsE) * Math.sin(marsEccentric));
    if (moonPosition.current) moonPosition.current.position.set(moonA * (Math.cos(moonEccentric) - moonE), 0, moonA * Math.sqrt(1-moonE*moonE) * Math.sin(moonEccentric));
    if (moonAnchorRef?.current) moonAnchorRef.current.getWorldPosition(moonWorld);
    
    const controls = cameraRef?.current;
    if (!controls) return;

    // Selection changed — fire a one-shot fly-to animation
    if (selected !== prevSelected.current) {
      prevSelected.current = selected;
      
      const tRef = selected ? getTargetRef(selected) : sunAnchorRef;
      if (tRef && tRef.current) {
        tRef.current.getWorldPosition(targetPos);
        const radius = RADII[selected] || 0.3;
        const zoomDist = ZOOM_DISTANCES[selected] || (radius * 4.5);
        
        // Compute a destination camera position: offset from target
        controls.getPosition(camPos);
        const dir = camPos.clone().sub(targetPos);
        if (dir.lengthSq() < 0.001) dir.set(0, 0.4, 1);
        dir.normalize().multiplyScalar(zoomDist);
        const dest = targetPos.clone().add(dir);
        
        // Set clipping distance — generous padding so you can never enter the sphere
        controls.minDistance = radius * 3;
        
        // Smooth fly-to animation (setLookAt with smooth=true)
        controls.setLookAt(
          dest.x, dest.y, dest.z,
          targetPos.x, targetPos.y, targetPos.z,
          true
        );
      } else if (!selected) {
        controls.minDistance = 1.5;
        controls.setLookAt(0, 5.5, 13.5, 0, 0, 0, true);
      }
    }
    
    // For orbiting objects: continuously update the controls target to follow them
    if (selected) {
      const tRef = getTargetRef(selected);
      if (tRef && tRef.current) {
        tRef.current.getWorldPosition(targetPos);
        controls.moveTo(targetPos.x, targetPos.y, targetPos.z, false);
      }
    }
    
    // Distance calculation (throttle to every ~10 frames for perf)
    distFrameCount.current++;
    if (onDistanceChange && distFrameCount.current % 10 === 0) {
      controls.getPosition(camPos);
      const tRef = selected ? getTargetRef(selected) : sunAnchorRef;
      if (tRef && tRef.current) {
        tRef.current.getWorldPosition(targetPos);
        const dist = camPos.distanceTo(targetPos);
        onDistanceChange((dist * 0.2).toFixed(2));
      }
    }
  });
  const select = (name) => (event) => { event.stopPropagation(); onSelect(name); };
  return <>
    <group ref={sunAnchorRef}>
      <SunModel hovered={hovered} setHovered={setHovered} onClick={select("sun")} />
    </group>
    <EllipticalOrbit semiMajor={earthA} eccentricity={earthE}/>
    <EllipticalOrbit semiMajor={marsA} eccentricity={marsE} inclination={inclinationMars}/>
    {PROBE_DATA.map(probe =>
        <DeepSpaceProbe key={probe.id} probe={probe} hovered={hovered} setHovered={setHovered} onClick={onSelect} anchorRef={(node) => { if (probesRefs) probesRefs.current[probe.id] = node; }}/>
    )}
    <group ref={earthPlane}>
      <group ref={earthPosition}>
        <group ref={earthAnchorRef}>
          <CelestialModel radius={.31} name="earth" hovered={hovered} setHovered={setHovered} onClick={select("earth")} />
        </group>
        <EllipticalOrbit semiMajor={moonA} eccentricity={moonE} inclination={inclinationMoon} color="#aabbd0" opacity={.25}/>
        <group ref={moonPlane} rotation={[inclinationMoon,0,0]}>
          <group ref={moonPosition}>
            <group ref={moonAnchorRef}>
              <CelestialModel radius={.105} name="moon" hovered={hovered} setHovered={setHovered} onClick={select("moon")} />
            </group>
          </group>
        </group>
      </group>
    </group>
    <group ref={marsPlane} rotation={[inclinationMars,0,0]}>
      <group ref={marsPosition}>
        <group ref={marsAnchorRef}>
          <CelestialModel radius={.24} name="mars" hovered={hovered} setHovered={setHovered} onClick={select("mars")} />
        </group>
      </group>
    </group>
  </>;
}


export function LandingPage() {
  const navigate = useNavigate();
  return <main className="landing-page">
    <div className="landing-stars" aria-hidden="true"/>
    <div className="landing-copy">
      <p>Abandoned but not forgotten</p>
      <h1>Explore the Sleeping Beauties</h1>
      <button type="button" className="landing-explore" onClick={() => navigate("/space")}>Explore <ArrowRight size={17}/></button>
    </div>
  </main>;
}

export function MoonPage() {
  const navigate = useNavigate();
  return <Shell immersive><div id="main-content" className="moon-route-arrival" tabIndex="-1"><MoonMap onDecrypt={(missionId) => { if (missionId === "apollo-11") navigate("/eagle"); }}/></div></Shell>;
}
export function MarsPage() { return <Shell immersive><div id="main-content" tabIndex="-1"><MarsMap /></div></Shell>; }


function Lander3D({ year }) {
  const { scene } = useGLTF("/models/apollo-lunar-module.glb");
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
      if (Array.isArray(child.material)) {
        child.material = child.material.map((material) => material.clone());
      } else if (child.material) {
        child.material = child.material.clone();
      }
    });
    return clone;
  }, [scene]);

  const fit = useMemo(() => {
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const largestDimension = Math.max(size.x, size.y, size.z) || 1;
    return { center, scale: 2.8 / largestDimension };
  }, [model]);

  useEffect(() => {
    const wear = THREE.MathUtils.clamp((year - 1969) / (2026 - 1969), 0, 1);
    model.traverse((child) => {
      if (!child.isMesh) return;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if (!material) return;
        material.roughness = THREE.MathUtils.lerp(0.32, 0.92, wear);
        material.metalness = THREE.MathUtils.lerp(
            material.userData.originalMetalness ?? material.metalness ?? 0.35,
            0.12,
            wear
        );
        material.needsUpdate = true;
      });
    });
  }, [model, year]);

  return (
      <group position={[0, -0.15, 0]} rotation={[0.08, -0.2, 0]}>
        <group scale={fit.scale}>
          <primitive object={model} position={[-fit.center.x, -fit.center.y, -fit.center.z]} />
        </group>
      </group>
  );
}
useGLTF.preload("/models/apollo-lunar-module.glb");

function LaserBeam({ active }) {
  const ref = useRef();
  useFrame((_, delta) => { if (ref.current && active) ref.current.scale.y = Math.min(1, ref.current.scale.y + delta * 3); });
  if (!active) return null;
  return <group ref={ref} position={[0,2.8,0]}><mesh rotation={[0,0,0]} scale={[.025,3.2,.025]}><cylinderGeometry args={[1,1,1,12]}/><meshBasicMaterial color="#5dff9b" transparent opacity={.8}/></mesh><mesh position={[0,-3.15,0]} rotation={[0,0,0]}><sphereGeometry args={[.09,20,20]}/><meshBasicMaterial color="#b6ffd5"/></mesh></group>;
}

function EagleScene({ year, ejected, laserActive, background = "#f2eee3", stars = false }) {
  return <Canvas shadows camera={{position:[5,2.6,6],fov:38}} dpr={[1,1.6]}>
    <color attach="background" args={[background]}/><ambientLight intensity={THREE.MathUtils.lerp(.45,.12,(year-1969)/57)}/><directionalLight position={[-4,5,5]} intensity={THREE.MathUtils.lerp(4.4,2.2,(year-1969)/57)} castShadow/>
    {stars && <Stars radius={55} depth={30} count={1500} factor={1.4} fade/>}
    <Suspense fallback={null}><Float speed={.3} rotationIntensity={.025} floatIntensity={.035}><Lander3D year={year}/></Float></Suspense>
    <PayloadObject label="CAMERAS" position={[-2.1,.9,.5]} ejected={ejected.cameras} onClick={ejected.toggleCamera}/>
    <PayloadObject label="BOOTS" position={[2.0,.7,.5]} ejected={ejected.boots} onClick={ejected.toggleBoots}/>
    <LaserBeam active={laserActive}/>
    <CameraControls makeDefault minDistance={4.3} maxDistance={9} smoothTime={1.1}/>
  </Canvas>;
}

function PayloadObject({ label, position, ejected, onClick }) {
  const ref = useRef();
  useFrame((_,delta)=>{ if(ref.current && ejected) { ref.current.position.y -= delta*1.2; ref.current.rotation.x += delta*2; ref.current.rotation.z += delta; } });
  if(ejected && ref.current?.position.y < -4) return null;
  return <group ref={ref} position={position} onClick={(e)=>{e.stopPropagation();onClick?.();}}><mesh><boxGeometry args={[.42,.32,.3]}/><meshStandardMaterial color={ejected?"#4b4b45":"#d5c39a"} emissive={ejected?"#000000":"#2d2615"} emissiveIntensity={.4}/></mesh><Html center distanceFactor={8}><div className={`payload-tag ${ejected?"ejected":""}`}>{label}</div></Html></group>;
}

const EAGLE_CHAPTERS = [
  ["chapter-1","The strangest ship"],
  ["chapter-2","A golden spider"],
  ["chapter-3","Two stages"],
  ["chapter-4","The descent"],
  ["chapter-5","Touchdown"],
  ["chapter-6","Footprints"],
  ["chapter-7","The great escape"],
  ["chapter-8","Reunion"],
  ["chapter-9","The ghost"]
];

const EAGLE_PHOTOS = {
  orbit: "https://upload.wikimedia.org/wikipedia/commons/4/41/Apollo_11_Lunar_Module_Eagle_in_lunar_orbit.jpg",
  aldrin: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Aldrin_Apollo_11_original.jpg",
  reunion: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Apollo_11_lunar_module.jpg",
  lro: "https://www.universetoday.com/article_images/Apollo-11-second-look.jpg"
};

export function EaglePage() {
  const [audioOn,setAudioOn]=useState(false);
  const [activeChapter,setActiveChapter]=useState(0);
  const [selectedPart,setSelectedPart]=useState("ascent");
  const [terrainZoom,setTerrainZoom]=useState(0);
  const [theme,setTheme]=useState("dark");
  const [speaking,setSpeaking]=useState(null);
  const audioRef=useRef(null);
  useEffect(()=>{
    if(!audioRef.current)return;
    audioRef.current.volume=.22;
    if(audioOn)audioRef.current.play().catch(()=>setAudioOn(false));
    else audioRef.current.pause();
    return ()=>audioRef.current?.pause();
  },[audioOn]);
  useEffect(()=>()=>{ if ("speechSynthesis" in window) window.speechSynthesis.cancel(); },[]);
  const narrateChapter=(id,index)=>{
    if(!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;
    if(speaking===index){window.speechSynthesis.cancel();setSpeaking(null);return;}
    window.speechSynthesis.cancel();
    const node=document.getElementById(id);
    const copy=node?.cloneNode(true);
    copy?.querySelectorAll("button,a,.chapter-index,.book-eyebrow,.terrain-controls").forEach(el=>el.remove());
    const narration=copy?.innerText?.replace(/\\s+/g," ").trim() || EAGLE_CHAPTERS[index][1];
    const utterance=new SpeechSynthesisUtterance(narration);
    utterance.rate=.94;
    utterance.onend=()=>setSpeaking(null);
    utterance.onerror=()=>setSpeaking(null);
    setSpeaking(index);
    window.speechSynthesis.speak(utterance);
  };
  useEffect(()=>{
    const nodes=EAGLE_CHAPTERS.map(([id])=>document.getElementById(id)).filter(Boolean);
    if(!("IntersectionObserver" in window))return;
    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(visible){visible.target.classList.add("is-visible");const index=EAGLE_CHAPTERS.findIndex(([id])=>id===visible.target.id);if(index>=0)setActiveChapter(index);}
    },{rootMargin:"-22% 0px -58% 0px",threshold:[0,.15,.35,.6]});
    nodes.forEach(n=>observer.observe(n));
    return ()=>observer.disconnect();
  },[]);
  const goTo=(id)=>document.getElementById(id)?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
  const chapterTurn=(index)=><div className="storybook-turn" aria-label="Story navigation">
    {index>0?<button className="story-prev" onClick={()=>goTo(`chapter-${index}`)}>← Previous</button>:<span className="story-prev-placeholder">THE STORY BEGINS</span>}
    <span className="story-page-count">PAGE {String(index+1).padStart(2,"0")} / 09</span>
    {index<8?<button className="story-next" onClick={()=>goTo(`chapter-${index+2}`)}>Next: {EAGLE_CHAPTERS[index+1][1]} →</button>:<button className="story-next" onClick={()=>goTo("top")}>Read again ↑</button>}
  </div>;
  const partInfo={
    ascent:{name:"Ascent stage",tag:"THE CREW'S WAY HOME",body:"The upper cabin held Armstrong and Aldrin, the guidance equipment, and the engine that lifted them back to lunar orbit. It separated from the descent stage after the surface stay."},
    descent:{name:"Descent stage",tag:"THE LANDING PLATFORM",body:"The lower stage carried the descent engine, landing legs, and surface equipment. It became Eagle's launch platform—and remained at Tranquility Base."},
    legs:{name:"Landing legs",tag:"FOUR POINTS OF CONTACT",body:"The four legs absorbed the final contact with the lunar surface. Probes beneath the footpads signalled when the surface was reached."},
    engine:{name:"Descent engine",tag:"SLOWING DOWN",body:"The throttleable descent propulsion system reduced Eagle's speed for landing. Its job was to bring the crew safely down, not to take them home."}
  };
  const img=(src,alt,caption,href)=> <figure className="eagle-photo"><a href={href} target="_blank" rel="noreferrer" aria-label={`Open source: ${caption}`}><img src={src} alt={alt} loading="lazy" onError={e=>{e.currentTarget.style.display="none";e.currentTarget.parentElement.classList.add("image-unavailable")}}/></a><figcaption>{caption} <a href={href} target="_blank" rel="noreferrer">NASA source ↗</a></figcaption></figure>;
  return <Shell>
    <audio ref={audioRef} loop src={QUINDAR_AUDIO} preload="none"/>
    <main className={`eagle-page eagle-book eagle-theme-${theme}`} id="main-content" tabIndex="-1">
      <nav className="eagle-progress" aria-label="Story chapters">
        <span className="progress-label">THE STORY</span><button className="theme-switch" aria-label={`Switch to ${theme==="dark"?"light":"dark"} theme`} onClick={()=>setTheme(t=>t==="dark"?"light":"dark")}>{theme==="dark"?"LIGHT MODE":"DARK MODE"}</button>
        <div className="progress-track"><span style={{width:`${((activeChapter+1)/9)*100}%`}}/></div>
        {EAGLE_CHAPTERS.map(([id,label],i)=><div className="chapter-nav-row" key={id}><button className={activeChapter===i?"active":""} onClick={()=>goTo(id)} aria-current={activeChapter===i?"step":undefined}><b>{String(i+1).padStart(2,"0")}</b><span>{label}</span></button><button className="chapter-listen" aria-label={`Listen to ${label}`} title={`Listen to ${label}`} onClick={()=>narrateChapter(id,i)}>{speaking===i?<VolumeX size={13}/>:<Volume2 size={13}/>}</button></div>)}
      </nav>
      <section className="eagle-book-hero" id="top">
        <div className="hero-copy">
          <div className="book-eyebrow"><span>✦</span> THE APOLLO 11 ARCHIVE</div>
          <p className="hero-meta">APOLLO 11 <i/> JULY 20, 1969 <i/> TRANQUILITY BASE</p>
          <h1>EAGLE — THE SPIDER THAT DARED TO TOUCH THE MOON</h1>
          <p className="hero-subtitle">The Ultimate Spaceship</p>
          <p className="hero-hook">Some machines are built to travel. <em>One was built to make history.</em></p>
          <p className="hero-intro">It looked like a spider made of gold foil and aluminium. It had no wings, no wheels and no comfortable seats. Yet, in 1969, it carried two humans to another world.</p>
          <div className="hero-controls"><a className="book-cta" href="#chapter-1">Begin the story <span>↓</span></a><button className="audio-control" onClick={()=>setAudioOn(v=>!v)} aria-pressed={audioOn}>{audioOn?<Volume2 size={16}/>:<VolumeX size={16}/>} {audioOn?"Mission tones on":"Mission tones"}</button></div>
        </div>
        <div className="hero-visual">
          <div className="hero-photo-frame"><a href="https://science.nasa.gov/resource/the-eagle-prepares-to-land/" target="_blank" rel="noreferrer" aria-label="Open NASA source photograph"><img src={EAGLE_PHOTOS.orbit} alt="Apollo 11 lunar module Eagle photographed in lunar orbit" fetchPriority="high" onError={e=>e.currentTarget.style.opacity=0}/></a><div className="hero-photo-overlay"/></div>

          <div className="hero-caption">A lunar module in its landing configuration · NASA</div>
        </div>
        <div className="hero-bottom-note">A JOURNEY IN NINE CHAPTERS <span>✦</span> SCROLL TO TURN THE PAGE</div>
      </section>

      <section className="book-chapter chapter-light" id="chapter-1">
        <div className="chapter-inner">
          <div className="chapter-heading-row"><span className="chapter-index">01</span><div><p className="book-eyebrow">BUILT FOR ANOTHER WORLD</p><h2>The Strangest Spaceship Ever Built</h2></div></div><p className="storybook-narrator">Have you ever seen a spaceship that looks a little like a spider? Eagle was built that way for a very good reason.</p>
          <div className="editorial-split"><div className="chapter-prose"><p className="dropcap">Why no wings? Because the Moon has almost no air. Wings need air to work, and a pointed airplane nose would not help Eagle there. The engineers had a different idea: build a spacecraft that could float down gently and stand on four legs.</p><p>Every kilogram mattered. Engineers gave the lunar module a light, angular body and four spindly legs. Its strange shape was not a compromise in the usual sense—it was a design shaped by the place it had to go.</p><p>Layers of reflective thermal insulation helped protect the spacecraft from the extreme hot and cold of space. The gold appearance was part of that practical protection, not decoration.</p><p className="chapter-last-line">Eagle wasn't designed to look beautiful. It was designed to do something no machine had ever done before.</p></div>{img(EAGLE_PHOTOS.orbit,"Eagle in landing configuration, photographed from Columbia","Eagle prepares to land · Apollo 11 / NASA","https://science.nasa.gov/resource/the-eagle-prepares-to-land/")}</div>
          {chapterTurn(0)}
        </div>
      </section>

      <section className="book-chapter chapter-sand" id="chapter-2">
        <div className="chapter-inner">
          <div className="chapter-heading-row"><span className="chapter-index">02</span><div><p className="book-eyebrow">A MACHINE OF UNUSUAL DETAILS</p><h2>A Golden Spider with a Secret</h2></div></div><p className="storybook-narrator">Look closely at the golden wrapping. It wasn't there to make Eagle pretty—it helped protect it from the wild temperatures of space.</p>
          <div className="detail-layout"><div className="detail-copy"><p>So, what was it like inside? Armstrong and Aldrin stood up, held safely by special restraints. There were no pilot seats. Instead, switches, displays and hand controllers filled the space in front of them—rather like a tiny control room.</p><p>The cabin and its equipment were carried by a light structure wrapped in insulation. Eagle was designed around the needs of a short, precise mission: descend, land, explore, and leave.</p><div className="fact-ribbon"><span>✦</span><div><strong>Standing room only</strong><small>The astronauts operated the lunar module while standing, with restraints to help them stay in position.</small></div></div></div><div className="detail-illustration"><div className="foil-graphic"><div className="foil-grid"/><span>THERMAL BLANKET</span></div><div className="illustration-note">Reflective insulation helped manage heat in the harsh lunar environment.</div></div></div>
          {chapterTurn(1)}
        </div>
      </section>

      <section className="book-chapter chapter-light" id="chapter-3">
        <div className="chapter-inner">
          <div className="chapter-heading-row"><span className="chapter-index">03</span><div><p className="book-eyebrow">THE CLEVER TWO-PART DESIGN</p><h2>A Spaceship Designed to Leave Itself Behind</h2></div></div><p className="storybook-narrator">Here's a clever trick: Eagle had two parts. One helped the astronauts land, and the other would carry them back up.</p>
          <p className="chapter-intro-wide">Here's the clever part: Eagle was made of two sections joined together. One would stay on the Moon, while the other would carry the astronauts back to orbit. Choose a part below to see what it did.</p>
          <div className="cutaway-panel"><div className="cutaway-view"><div className="cutaway-label cutaway-ascent">01 · ASCENT STAGE</div><div className="cutaway-label cutaway-descent">02 · DESCENT STAGE</div><div className="cutaway-model"><EagleScene year={1969} ejected={{cameras:false,boots:false,descent:false}} laserActive={false} background="#e9e8e2"/></div><div className="hotspot-row">{[["ascent","Ascent stage"],["descent","Descent stage"],["legs","Landing legs"],["engine","Descent engine"]].map(([key,label])=><button key={key} className={selectedPart===key?"selected":""} onClick={()=>setSelectedPart(key)}>{label}</button>)}</div></div><aside className="part-explainer"><span className="book-eyebrow">COMPONENT GUIDE</span><div className="part-number">0{["ascent","descent","legs","engine"].indexOf(selectedPart)+1}</div><h3>{partInfo[selectedPart].name}</h3><p className="part-tag">{partInfo[selectedPart].tag}</p><p>{partInfo[selectedPart].body}</p><div className="part-reason"><strong>Why separate?</strong><span>The lower stage did the heavy work of landing. The lighter upper stage could then lift the crew back into orbit without carrying the landing gear and empty descent hardware.</span></div></aside></div>
          {chapterTurn(2)}
        </div>
      </section>

      <section className="book-chapter chapter-night" id="chapter-4">
        <div className="night-stars" aria-hidden="true"/><div className="chapter-inner night-inner">
        <div className="chapter-heading-row"><span className="chapter-index">04</span><div><p className="book-eyebrow">JULY 20, 1969 · DESCENT</p><h2>The Descent into the Unknown</h2></div></div><p className="storybook-narrator">Now imagine looking out of a tiny window as the Moon grows larger. The computer beeps—and everyone has to stay calm.</p>
        <div className="night-grid"><div className="night-copy"><p>Now the Moon was getting closer. Eagle had separated from Columbia, and its descent engine began slowing the spacecraft as it headed toward the Sea of Tranquility. Imagine watching the grey ground grow bigger in the windows.</p><p>Then the computer issued alarms: 1202, followed by 1201. These were not signs that the computer had completely failed. They indicated that it was overloaded with work. In Mission Control, flight controllers assessed the alarms and confirmed that the landing could continue.</p><p>But the descent was still far from routine. The crew had to keep flying while the team on Earth watched the numbers and listened.</p></div><div className="alarm-panel"><span className="alarm-label">GUIDANCE COMPUTER · PROGRAM ALARMS</span><div className="alarm-readout"><strong>1202</strong><span>EXECUTIVE OVERFLOW</span></div><div className="alarm-readout"><strong>1201</strong><span>EXECUTIVE OVERFLOW</span></div><p>The alarms indicated the computer was overloaded—not that all guidance had stopped.</p><a href="https://www.nasa.gov/mission/apollo-11/" target="_blank" rel="noreferrer">Explore NASA's mission archive ↗</a></div></div>
        <div className="descent-timeline" aria-label="Key descent events"><div><span>01</span><strong>Powered descent</strong><small>Eagle begins braking toward the surface.</small></div><div><span>02</span><strong>1202 / 1201 alarms</strong><small>Mission Control confirms the computer can continue.</small></div><div><span>03</span><strong>Manual approach</strong><small>Armstrong steers away from rough terrain.</small></div><div><span>04</span><strong>Touchdown</strong><small>20:17:40 UTC · July 20, 1969</small></div></div><div className="descent-media"><div className="descent-media-copy"><span>MISSION AUDIO & VIDEO</span><h3>Listen to the moment unfold.</h3><p>Optional archival footage. Use the player controls to start or pause.</p></div><div className="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/nOcDftgR5UQ?rel=0" title="NASA Apollo 11 landing video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/></div></div>
        {chapterTurn(3)}
      </div>
      </section>

      <section className="book-chapter chapter-touchdown" id="chapter-5">
        <div className="chapter-inner">
          <div className="chapter-heading-row"><span className="chapter-index">05</span><div><p className="book-eyebrow">THE FINAL APPROACH</p><h2>Thirty Seconds to Make History</h2></div></div><p className="storybook-narrator">Would you have been nervous? Armstrong had to steer around rocks while the fuel clock kept ticking.</p>
          <div className="touchdown-layout"><div className="touchdown-copy"><p>But there was a problem. The computer was guiding Eagle toward a rocky crater. Armstrong took control and steered toward a safer patch of ground. Every second mattered, so he had to choose carefully.</p><p>Dust kicked up beneath the descent engine and made the surface harder to judge. The fuel margin was shrinking, and the crew had little room for delay. The landing depended on careful decisions in the final moments.</p><div className="landing-time"><span>TOUCHDOWN · UTC</span><strong>20:17:40</strong><small>July 20, 1969</small></div></div>{img("https://upload.wikimedia.org/wikipedia/commons/a/a4/Aldrin_Apollo_11_original.jpg","Buzz Aldrin on the lunar surface during Apollo 11","Apollo 11 surface photography · NASA","https://science.nasa.gov/resource/the-eagle-prepares-to-land/")}</div>
          <blockquote className="hero-quote">“Houston, Tranquility Base here. The Eagle has landed.”<cite>— Neil Armstrong · July 20, 1969</cite></blockquote>
          {chapterTurn(4)}
        </div>
      </section>

      <section className="book-chapter chapter-sand" id="chapter-6">
        <div className="chapter-inner">
          <div className="chapter-heading-row"><span className="chapter-index">06</span><div><p className="book-eyebrow">A FEW HOURS ON ANOTHER WORLD</p><h2>Footprints in a Silent World</h2></div></div><p className="storybook-narrator">On the Moon, even walking was different. Every step left a mark in the powdery ground.</p>
          <div className="surface-story"><div className="surface-image"><img src="https://apod.nasa.gov/apod/image/1907/AS11-40-5961pan.jpg" alt="Apollo 11 Tranquility Base lunar panorama" loading="lazy" onError={e=>e.currentTarget.style.display="none"}/><div className="surface-image-caption">Tranquility Base panorama · Armstrong / NASA</div></div><div className="surface-copy"><p>At last, a human stepped onto the Moon! Armstrong went first, and Aldrin followed. With weaker gravity than on Earth, moving felt different. Their boots pressed marks into the soft lunar dust while they took pictures, set up experiments and gathered rocks and soil.</p><p>The crew brought back approximately 21.5 kilograms of lunar material. Their work gave scientists rocks and soil to study directly, as well as photographs and measurements from the surface.</p><div className="sample-stat"><strong>21.5 kg</strong><span>APPROXIMATE LUNAR SAMPLES RETURNED</span></div><p>With no wind or rain to erase them, footprints can remain visible for an extremely long time. They still change slowly, though, as tiny impacts and other processes gradually alter the surface.</p></div></div>
          <div className="panorama-source"><a href="https://apod.nasa.gov/apod/ap190719.html" target="_blank" rel="noreferrer">View the original Tranquility Base panorama at NASA APOD ↗</a></div>
          {chapterTurn(5)}
        </div>
      </section>

      <section className="book-chapter chapter-night liftoff-chapter" id="chapter-7">
        <div className="night-stars" aria-hidden="true"/><div className="chapter-inner night-inner">
        <div className="chapter-heading-row"><span className="chapter-index">07</span><div><p className="book-eyebrow">JULY 21, 1969 · ASCENT</p><h2>The Great Escape</h2></div></div><p className="storybook-narrator">Time to go home! Eagle's top half had one engine and one big job: lift the astronauts back to orbit.</p>
        <div className="liftoff-grid"><div><p>Soon it was time to say goodbye to the Moon. Eagle's upper section separated from the lower landing platform. Its own engine fired, lifting the astronauts upward while the landing legs stayed behind.</p><p>There was no launch tower or runway. The descent stage itself had served as the launch platform. Eagle's upper half climbed back toward the orbiting command module.</p><div className="liftoff-note"><span>✦</span><p>The ascent stage used the descent stage as a platform—but did not take it along.</p></div></div><div className="liftoff-model"><EagleScene year={1969} ejected={{cameras:false,boots:false,descent:false}} laserActive={false} background="#101722" stars/></div></div>
        {chapterTurn(6)}
      </div>
      </section>

      <section className="book-chapter chapter-light" id="chapter-8">
        <div className="chapter-inner">
          <div className="chapter-heading-row"><span className="chapter-index">08</span><div><p className="book-eyebrow">BACK TO COLUMBIA</p><h2>A Reunion Among the Stars</h2></div></div><p className="storybook-narrator">Someone was waiting above the Moon. Michael Collins and Columbia were the next stop on Eagle's journey.</p>
          <div className="editorial-split reunion-split"><div className="chapter-prose"><p>High above the Moon, Michael Collins was waiting in Columbia. Eagle's upper section carefully met up with the spacecraft and docked. Armstrong and Aldrin could finally join their crewmate again.</p><p>The astronauts transferred to Columbia, carrying the lunar samples and the records of their time on the surface. The ascent stage was then discarded. It later impacted the Moon; its precise impact location is unknown.</p><p>The crew's return journey to Earth was now underway. The lower half of Eagle remained at Tranquility Base, a silent witness to the first crewed lunar landing.</p></div>{img(EAGLE_PHOTOS.reunion,"Apollo 11 Eagle ascent stage near Columbia in lunar orbit","Eagle return toward Columbia · NASA","https://science.nasa.gov/resource/eagles-return/")}</div>
          {chapterTurn(7)}
        </div>
      </section>

      <section className="book-chapter chapter-final" id="chapter-9">
        <div className="chapter-inner">
          <div className="chapter-heading-row"><span className="chapter-index">09</span><div><p className="book-eyebrow">THE LASTING FOOTPRINT</p><h2>The Ghost That Never Left</h2></div></div><p className="storybook-narrator">And what happened to Eagle after the astronauts left? Part of it is still there, resting quietly on the Moon.</p>
          <p className="final-intro">So, here we are again: back at that quiet patch of the Moon. Eagle's journey is over—but its story is still here for us to discover.</p>
          <div className="landing-site-viewer"><div className={`landing-site-art zoom-${terrainZoom}`}><div className="terrain-moon"/><div className="terrain-crater crater-a"/><div className="terrain-crater crater-b"/><div className="terrain-crater crater-c"/><div className="landing-marker"><span>✦</span><b>TRANQUILITY BASE</b></div><div className="terrain-caption">ILLUSTRATIVE LANDING-SITE VIEW · NOT A SURVEY-GRADE MAP</div></div><div className="terrain-controls"><span>LANDING SITE EXPLORER</span><a href="https://svs.gsfc.nasa.gov/4185/" target="_blank" rel="noreferrer">Open NASA 3D terrain ↗</a><div><button onClick={()=>setTerrainZoom(z=>Math.max(0,z-1))} aria-label="Zoom out">−</button><button onClick={()=>setTerrainZoom(z=>Math.min(2,z+1))} aria-label="Zoom in">+</button><button onClick={()=>setTerrainZoom(0)}>Reset</button></div></div></div>
          <div className="final-copy"><p>Look closely at the pictures. NASA's Lunar Reconnaissance Orbiter has photographed the descent stage still resting at Tranquility Base. You can even see traces of the astronauts' paths nearby.</p><p>The upper stage had a different ending. After it finished its job, it later struck the Moon. Scientists do not know its exact impact spot.</p><blockquote>“Eagle came to the Moon to help two people explore. Then it stayed behind, keeping a little piece of their story.”</blockquote><p className="final-caption">Eagle was never meant to stay. But its landing platform became part of the Moon—and part of history.</p></div>
          <div className="final-gallery">{img(EAGLE_PHOTOS.lro,"Lunar Reconnaissance Orbiter image of the Apollo 11 landing site","LRO view of the Eagle descent stage · NASA/GSFC/ASU","https://science.nasa.gov/earth/earth-observatory/apollo-11-landing-site-39408/")}{img(EAGLE_PHOTOS.reunion,"Apollo 11 Eagle ascent stage in lunar orbit","Eagle’s return · NASA","https://science.nasa.gov/resource/eagles-return/")}</div>
          <div className="archive-links"><a href="https://science.nasa.gov/earth/earth-observatory/apollo-11-landing-site-39408/" target="_blank" rel="noreferrer">NASA · Apollo 11 landing site ↗</a><a href="https://science.nasa.gov/resource/apollo-11-landing-site-from-dawn-to-dusk/" target="_blank" rel="noreferrer">NASA · Dawn to dusk sequence ↗</a><a href="https://svs.gsfc.nasa.gov/4185/" target="_blank" rel="noreferrer">NASA · 3D landing-site visualization ↗</a><a href="https://www.nasa.gov/mission/apollo-11/" target="_blank" rel="noreferrer">Apollo 11 mission archive ↗</a></div>
          <div className="book-end"><span>END OF STORY · ARCHIVE 001</span><a href="#top" className="back-to-top">Back to the beginning ↑</a><Link to="/moon">Explore Tranquility Base →</Link></div>
          {chapterTurn(8)}
        </div>
      </section>
    </main>
  </Shell>;
}
function Overview(){
  const [liveArtifact,setLiveArtifact]=useState(null);
  useEffect(()=>{
    const controller=new AbortController();
    getArtifact("apollo-11-eagle-descent-stage",controller.signal)
        .then(setLiveArtifact).catch(()=>{});
    return ()=>controller.abort();
  },[]);
  return <div className="content-grid"><article className="story"><span className="eyebrow">RECOVERY NOTE 001</span><h2>The Eagle landed. Then it stayed.</h2><p>{liveArtifact?.longStory || eagle.story}</p><p>Its descent stage remains at Tranquility Base. The ascent stage carried Armstrong and Aldrin back to lunar orbit, where they rendezvoused with Columbia. The descent stage became the platform from which humanity first stepped onto another world.</p><div className="quote">“Houston, Tranquility Base here. The Eagle has landed.”<small>— Neil Armstrong, July 20, 1969</small></div></article><aside className="data-panel">{eagle.facts.map(f=><div className="data-row" key={f.label}><span>{f.label}</span><strong>{f.value}</strong></div>)}<a className="source-button" href={eagle.sources[0].url} target="_blank" rel="noreferrer">OPEN NASA ARCHIVE <ExternalLink size={14}/></a></aside></div>}
function Timeline(){return <div className="timeline">{eagle.timeline.map((item,i)=><div className="timeline-item" key={item.date}><div className="timeline-dot">{String(i+1).padStart(2,"0")}</div><div><span>{item.date}</span><h3>{item.title}</h3><p>{item.text}</p></div></div>)}</div>}
function Photos(){return <div className="photo-grid">{eagle.media.map(m=><a key={m.title} className="photo-card" href={m.url} target="_blank" rel="noreferrer"><div className="photo-placeholder"><MoonIcon size={30}/></div><span>{m.type}</span><h3>{m.title}</h3><small>{m.source}</small></a>)}</div>}
export function About(){return <Shell><main className="simple-page"><span className="eyebrow">PROJECT NOTE</span><h1>Sleeping Beauties</h1><p>A cinematic digital museum for abandoned space hardware — built as an archive, a map and a series of interactive archaeological stories.</p><div className="about-grid"><div><Satellite/><h3>THE COLLECTION</h3><p>Moon first. Mars and Deep Space remain future archive doors until their collections are ready.</p></div><div><MapPin/><h3>THE METHOD</h3><p>Every artifact gets a location, a mission history, source material and an interactive way to understand why it matters.</p></div><div><RadioTower/><h3>THE SIGNAL</h3><p>Audio, light, motion and data are treated as part of the archive itself — not decoration around it.</p></div></div></main></Shell>}

export default function App(){return <Routes><Route path="/" element={<Home/>}/><Route path="/moon" element={<MoonPage/>}/><Route path="/mars" element={<MarsPage/>}/><Route path="/eagle" element={<EaglePage/>}/><Route path="/about" element={<About/>}/></Routes>}
