import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { CameraControls, Float, Html, Stars, useAnimations, useGLTF, useTexture } from "@react-three/drei";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowDown, ArrowRight, Box, ChevronDown, ExternalLink, Lock, MapPin, Moon as MoonIcon,
  Orbit, Play, Radio, RadioTower, Rotate3D, Satellite, ScanLine, Sparkles, Timer, Volume2, VolumeX, Weight, Zap
} from "lucide-react";
import eagle from "../data/eagle.json";
import { getArtifact } from "../services/archiveApi";
import MoonExplorer from "../pages/MoonExplorer";
import MarsExplorer from "../pages/MarsExplorer";

const SPACE_BG = "/images/HomeBG.png";
const VOYAGER_AUDIO = "https://www.nasa.gov/wp-content/uploads/2015/01/voyager-plasma-waves.mp3";
const QUINDAR_AUDIO = "https://www.nasa.gov/wp-content/uploads/2015/01/quindar_tones.mp3";

function SpaceBackdrop() {
  return <div className="space-backdrop" aria-hidden="true"><img src={SPACE_BG} alt=""/><div className="space-backdrop-gradient"/></div>;
}

function Topbar() {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const isMars = location.pathname.startsWith("/mars") || location.pathname.startsWith("/viking");
  const isMoon = location.pathname.startsWith("/moon") || location.pathname.startsWith("/eagle");
  const isSpace = location.pathname.startsWith("/space") || location.pathname.startsWith("/voyager");
  const brandText = isMars ? "THE MARS" : isMoon ? "THE MOON" : isSpace ? "DEEP SPACE" : "SLEEPING BEAUTIES";
  useEffect(() => { setOpenMenu(null); }, [location.pathname]);
  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === "Escape") setOpenMenu(null); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);
  const toggleMenu = (name) => setOpenMenu(current => current === name ? null : name);
  return (
      <header className="topbar topbar-transparent">
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Link className="brand" to="/" aria-label="Sleeping Beauties home">
          <span className="brand-mark"><Orbit size={21}/></span>
          <span><strong>{brandText}</strong></span>
        </Link>
        <nav aria-label="Main navigation">
          <Link className={location.pathname === "/" ? "nav-active" : ""} to="/">Home</Link>
          <div className={`nav-dropdown ${openMenu === "worlds" ? "menu-open" : ""}`}><button type="button" aria-haspopup="true" aria-expanded={openMenu === "worlds"} className={isMoon || isMars || isSpace ? "nav-active" : ""} onClick={()=>toggleMenu("worlds")}>Worlds <ChevronDown size={13}/></button><div className="nav-dropdown-menu"><Link to="/space" onClick={()=>setOpenMenu(null)}>Deep Space</Link><Link to="/moon" onClick={()=>setOpenMenu(null)}>Moon</Link><Link to="/mars" onClick={()=>setOpenMenu(null)}>Mars</Link></div></div>
          {(isMoon || isMars || isSpace) && <div className={`nav-dropdown ${openMenu === "objects" ? "menu-open" : ""}`}><button type="button" aria-haspopup="true" aria-expanded={openMenu === "objects"} className={openMenu === "objects" ? "nav-active" : ""} onClick={()=>toggleMenu("objects")}>Objects <ChevronDown size={13}/></button><div className="nav-dropdown-menu">{isSpace ? <Link to="/voyager-1" onClick={()=>setOpenMenu(null)}>Voyager 1</Link> : isMars ? <Link to="/viking-1" onClick={()=>setOpenMenu(null)}>Viking 1</Link> : <Link to="/eagle" onClick={()=>setOpenMenu(null)}>Eagle</Link>}</div></div>}
        </nav>
      </header>
  );
}

function Shell({ children, immersive = false, className = "", hideTopbar = false }) {
  return <div className={`app-shell ${immersive ? "immersive-shell" : ""} ${className}`}><SpaceBackdrop/>{!hideTopbar && <Topbar/>}{children}</div>;
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
  const tutorialIntro = new URLSearchParams(location.search).get("intro") === "pioneer";
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [audioOn, setAudioOn] = useState(true);
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [speedModifier, setSpeedModifier] = useState(1);
  const [distanceToSelected, setDistanceToSelected] = useState(null);
  const [introYaw, setIntroYaw] = useState(0);
  const [introYawImmediate, setIntroYawImmediate] = useState(false);
  const [introFlying, setIntroFlying] = useState(false);
  const audioRef = useRef(null);
  const cameraRef = useRef(null);
  const sunAnchorRef = useRef(null);
  const mercuryAnchorRef = useRef(null);
  const venusAnchorRef = useRef(null);
  const earthAnchorRef = useRef(null);
  const moonAnchorRef = useRef(null);
  const marsAnchorRef = useRef(null);
  const jupiterAnchorRef = useRef(null);
  const saturnAnchorRef = useRef(null);
  const uranusAnchorRef = useRef(null);
  const neptuneAnchorRef = useRef(null);
  const planetAnchors = {
    sun: sunAnchorRef,
    mercury: mercuryAnchorRef,
    venus: venusAnchorRef,
    earth: earthAnchorRef,
    moon: moonAnchorRef,
    mars: marsAnchorRef,
    jupiter: jupiterAnchorRef,
    saturn: saturnAnchorRef,
    uranus: uranusAnchorRef,
    neptune: neptuneAnchorRef
  };
  const probesRefs = useRef({});
  const [journey, setJourney] = useState(null);
  useEffect(() => {
    const object = new URLSearchParams(location.search).get("object");
    const valid = ["voyager-1", "voyager-2", "pioneer-10", "pioneer-11", "new-horizons"];
    if (valid.includes(object)) setSelected(object);
  }, [location.search]);
  useEffect(() => {
    if (!tutorialIntro) {
      setIntroYaw(0);
      setIntroYawImmediate(false);
      setIntroFlying(false);
      window.__sbPioneerIntroReady = false;
      return undefined;
    }
    const onView = (event) => {
      setIntroYaw(Number(event.detail?.yaw) || 0);
      setIntroYawImmediate(Boolean(event.detail?.immediate));
    };
    const onFlight = () => setIntroFlying(true);
    window.addEventListener("sb:pioneer-intro-view", onView);
    window.addEventListener("sb:pioneer-intro-flight", onFlight);
    return () => {
      window.removeEventListener("sb:pioneer-intro-view", onView);
      window.removeEventListener("sb:pioneer-intro-flight", onFlight);
    };
  }, [tutorialIntro]);
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
    const timeout = window.setTimeout(() => setWelcomeVisible(false), 2000);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;
    const pauseSolarAudio = () => audio.pause();
    const resumeSolarAudio = () => { if (audioOn) audio.play().catch(() => {}); };
    window.addEventListener("sb:tutorial-audio-start", pauseSolarAudio);
    window.addEventListener("sb:tutorial-audio-stop", resumeSolarAudio);

    let resumeOnGesture;
    if (window.__sbTutorialAudioActive) {
      audio.pause();
    } else if (audioOn) {
      const attemptPlay = () => audio.play().catch(() => {});
      attemptPlay();
      // Browsers may block audible autoplay until the visitor interacts.
      resumeOnGesture = () => {
        if (audioOn) attemptPlay();
        window.removeEventListener("pointerdown", resumeOnGesture);
        window.removeEventListener("keydown", resumeOnGesture);
      };
      window.addEventListener("pointerdown", resumeOnGesture, { once: true });
      window.addEventListener("keydown", resumeOnGesture, { once: true });
    } else {
      audio.pause();
    }

    return () => {
      window.removeEventListener("sb:tutorial-audio-start", pauseSolarAudio);
      window.removeEventListener("sb:tutorial-audio-stop", resumeSolarAudio);
      if (resumeOnGesture) {
        window.removeEventListener("pointerdown", resumeOnGesture);
        window.removeEventListener("keydown", resumeOnGesture);
      }
      audio.pause();
    };
  }, [audioOn]);

  const searchable = [
    { name: "Sun", detail: "Central star of our solar system", type: "STAR", action: () => setSelected("sun") },
    { name: "Mercury", detail: "First planet from the Sun", type: "WORLD", action: () => setSelected("mercury") },
    { name: "Venus", detail: "Second planet from the Sun", type: "WORLD", action: () => setSelected("venus") },
    { name: "Earth", detail: "Our home world", type: "WORLD", action: () => setSelected("earth") },
    { name: "Moon", detail: "Explore the lunar archive", type: "WORLD", action: () => setSelected("moon") },
    { name: "Apollo 11 · Eagle", detail: "The first lunar landing module", type: "ARTIFACT", action: () => navigate("/eagle") },
    { name: "Mars", detail: "The red planet · collection coming later", type: "WORLD", action: () => setSelected("mars") },
    { name: "Jupiter", detail: "The gas giant · largest planet in our solar system", type: "WORLD", action: () => setSelected("jupiter") },
    { name: "Saturn", detail: "The ringed planet", type: "WORLD", action: () => setSelected("saturn") },
    { name: "Uranus", detail: "Ice giant planet with retrograde rotation", type: "WORLD", action: () => setSelected("uranus") },
    { name: "Neptune", detail: "Outermost ice giant planet", type: "WORLD", action: () => setSelected("neptune") },
    { name: "Deep Space", detail: "Interplanetary and heliocentric objects", type: "ARCHIVE", action: () => setSelected("deep") },
    { name: "Voyager 1", detail: "Interstellar probe launched in 1977 · Currently at ~172 AU", type: "SPACECRAFT", action: () => setSelected("voyager-1") },
    { name: "Voyager 2", detail: "Outer-planet explorer launched in 1977 · Currently at ~144 AU", type: "SPACECRAFT", action: () => setSelected("voyager-2") },
    { name: "Pioneer 10", detail: "Jupiter flyby mission launched in 1972 · Currently at ~142 AU", type: "SPACECRAFT", action: () => setSelected("pioneer-10") },
    { name: "Pioneer 11", detail: "Jupiter and Saturn flyby mission launched in 1973 · Currently at ~119 AU", type: "SPACECRAFT", action: () => setSelected("pioneer-11") },
    { name: "New Horizons", detail: "Pluto and Kuiper Belt explorer launched in 2006 · Currently at ~66 AU", type: "SPACECRAFT", action: () => setSelected("new-horizons") }
  ];
  const matches = query.trim()
      ? searchable.filter(item => `${item.name} ${item.detail} ${item.type}`.toLowerCase().includes(query.trim().toLowerCase()))
      : [];

  return <Shell immersive hideTopbar={tutorialIntro}><main className={`solar-home${tutorialIntro ? " is-tutorial-intro" : ""}`} id="main-content" tabIndex="-1">
    <AnimatePresence>
      {!tutorialIntro && welcomeVisible && <motion.div className="solar-welcome" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.35}}>
        <motion.span initial={{y:8}} animate={{y:0}} exit={{y:-5}} transition={{duration:0.55}}>Welcome to the Space</motion.span>
      </motion.div>}
    </AnimatePresence>
    <audio ref={audioRef} loop src="/audio/home-audio.mp3" preload="auto"/>
    <div className="solar-home-scene">
      <Canvas shadows camera={{ position: [0, 18, 38], fov: 44, near: 0.1, far: 1200 }} dpr={[1, 1.75]}>
        <color attach="background" args={["#030712"]}/>
        <ambientLight intensity={0.18}/>
        <pointLight
            position={[0, 0, 0]}
            intensity={220}
            distance={0}
            decay={1.2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={0.05}
            shadow-camera-far={120}
            shadow-bias={-0.00008}
            shadow-normalBias={0.006}
        />
        {tutorialIntro && <pointLight position={[17.5, 20.5, -68.8]} intensity={26} distance={14} decay={2} color="#b9ddff"/>}
        <SpaceStarsBackdrop/>
        <Suspense fallback={null}>
          <SolarSystem selected={selected} onSelect={setSelected} planetAnchors={planetAnchors} probesRefs={probesRefs} paused={!!journey} speedModifier={speedModifier} cameraRef={cameraRef} onDistanceChange={setDistanceToSelected} tutorialIntro={tutorialIntro} introYaw={introYaw} introYawImmediate={introYawImmediate} introFlying={introFlying}/>
        </Suspense>
        <CameraControls ref={cameraRef} makeDefault enabled={!tutorialIntro} minDistance={1.0} maxDistance={350} smoothTime={0.6} dollyToCursor={false}/>
      </Canvas>
    </div>

    {!tutorialIntro && <div className="solar-scale-caption">Orbits and deep-space probes are not in actual scale.</div>}
    {!tutorialIntro && distanceToSelected && selected && <div style={{ position: "absolute", top: 20, left: 20, zIndex: 1000, background: "rgba(0,0,0,0.5)", padding: "8px 14px", borderRadius: "8px", color: "#afc8e8", fontFamily: "monospace", fontSize: "13px", backdropFilter: "blur(4px)", letterSpacing: "0.5px" }}>
      <span style={{ color: "#7a9cc6", fontSize: "11px" }}>DIST </span>{distanceToSelected} AU
    </div>}
    {!tutorialIntro && <div className="solar-controls-panel" style={{ position: "absolute", bottom: 20, right: 20, zIndex: 1000, background: "rgba(0,0,0,0.5)", padding: "10px", borderRadius: "8px", color: "white", display: "flex", flexDirection: "column", gap: "10px", backdropFilter: "blur(4px)" }}>
      
      <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", flexDirection: "column" }}>Simulation Speed <input type="range" min="0" max="5" step="0.1" value={speedModifier} onChange={e => setSpeedModifier(parseFloat(e.target.value))} style={{ width: "150px" }} /></label>
    </div>}
    {!tutorialIntro && <div className="solar-search-wrap">
      <label className="solar-search">
        <ScanLine size={18}/>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search the solar system..." aria-label="Search space elements"/>
        {query && <button type="button" aria-label="Clear search" onClick={()=>setQuery("")}>×</button>}
      </label>
      {matches.length > 0 && <div className="solar-search-results">
        {matches.map(item=><button key={item.name} onClick={()=>{item.action();setQuery("");}}>
          <span><small>{item.type}</small><strong>{item.name}</strong><em>{item.detail}</em></span><ArrowRight size={16}/>
        </button>)}
      </div>}
      {query.trim() && matches.length===0 && <div className="solar-search-empty">No space objects found. Try “Moon”, “Mars” or “Voyager”.</div>}
    </div>}

    {!tutorialIntro && selected && <div className="solar-explore-pop solar-explore-other">
      <strong>{selected === "deep" ? "DEEP SPACE" : selected.toUpperCase()}</strong>
      {selected === "sun" && <em>The heart of our solar system</em>}
      {selected === "mercury" && <em>A cratered world, racing around the Sun in just 88 days.</em>}
      {selected === "venus" && <em>Wrapped in thick clouds, Venus is the hottest planet in the solar system.</em>}
      {selected === "earth" && <em>The only place we know of inhabited by living things.</em>}
      {selected === "moon" && <><em>Earth's only natural satellite</em><button onClick={enterMoonArchive} disabled={!!journey}>Explore <ArrowRight size={16}/></button></>}
      {selected === "mars" && <><em>Dusty, cold, desert world with a very thin atmosphere.</em><button onClick={enterMarsArchive} disabled={!!journey}>Explore <ArrowRight size={16}/></button></>}
      {selected === "jupiter" && <em>A massive gas giant.The Great Red Spot is a giant storm that has raged for centuries.</em>}
      {selected === "saturn" && <em>Its spectacular rings are made mostly of countless icy particles.</em>}
      {selected === "uranus" && <em>Uranus spins on its side, giving it some of the solar system's most extreme seasons.</em>}
      {selected === "neptune" && <em>Supersonic winds sweep through Neptune's deep blue atmosphere.</em>}
      {selected === "deep" && <em>Interplanetary and heliocentric objects</em>}
      {["voyager-1","voyager-2","pioneer-10","pioneer-11","new-horizons"].includes(selected) && <><em>{{"voyager-1":"Voyager 1 · Interstellar mission, launched 1977.","voyager-2":"Voyager 2 · The only spacecraft to visit Uranus and Neptune, launched 1977.","pioneer-10":"Pioneer 10 · First spacecraft to fly past Jupiter, launched 1972.","pioneer-11":"Pioneer 11 · First spacecraft to fly past Saturn, launched 1973.","new-horizons":"New Horizons · Pluto and Kuiper Belt explorer, launched 2006."}[selected]}</em><small className="scale-note"></small></>}
    </div>}
    <AnimatePresence>{journey?.phase === "fade" && <motion.div className={`moon-journey-fade journey-${journey.world}`} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.46}} aria-hidden="true"/>}</AnimatePresence>
    {!tutorialIntro && <button className="solar-audio-toggle" onClick={()=>setAudioOn(v=>!v)} aria-label={audioOn?"Mute ambient audio":"Play ambient audio"}>
      {audioOn?<Volume2 size={17}/>:<VolumeX size={17}/> }
    </button>}
  </main></Shell>;
}

const PLANET_TEXTURES = {
  mercury: "/models/2k_mercury.jpeg",
  venus: "/models/2k_venus_atmosphere.jpeg",
  earth: "/models/2k_earth.jpeg",
  moon: "/models/2k_moon.jpeg",
  mars: "/models/2k_mars.jpeg",
  jupiter: "/models/2k_jupiter.jpeg",
  saturn: "/models/2k_saturn.jpeg",
  uranus: "/models/2k_uranus.jpeg",
  neptune: "/models/2k_neptune.jpeg"
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
  const ringTexture = name === "saturn" ? useTexture("/models/2k_saturn_ring_alpha.png") : null;
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
        {name === "saturn" && ringTexture && (
          <mesh rotation={[Math.PI / 2.35, 0, 0]}>
            <ringGeometry args={[radius * 1.35, radius * 2.45, 64]} />
            <meshStandardMaterial map={ringTexture} transparent side={THREE.DoubleSide} opacity={0.92} roughness={0.8} />
          </mesh>
        )}
      </group>
    </group>
  );
}

function SpaceStarsBackdrop() {
  const texture = useTexture("/models/stars.jpeg");
  texture.colorSpace = THREE.SRGBColorSpace;
  return <mesh scale={[-450,450,450]}>
    <sphereGeometry args={[1,64,48]}/>
    <meshBasicMaterial map={texture} side={THREE.BackSide} depthWrite={false}/>
  </mesh>;
}

const PROBE_DATA = [
  { id:"voyager-1", label:"Voyager 1", color:"#c9b98f", position:[-19.1, 57.5, -79.6], style:"voyager" },
  { id:"voyager-2", label:"Voyager 2", color:"#c9b98f", position:[22.9, -54.8, -64.9], style:"voyager" },
  { id:"pioneer-10", label:"Pioneer 10", color:"#d9b34f", position:[15.3, 4.5, 85.5], style:"pioneer" },
  { id:"pioneer-11", label:"Pioneer 11", color:"#d9b34f", position:[17.5, 18.2, -71.7], style:"pioneer" },
  { id:"new-horizons", label:"New Horizons", color:"#aeb9c7", position:[16.6, 1.9, -52.4], style:"new-horizons" }
];

function getTutorialCameraPosition(pioneerPosition) {
  const toSolarSystem = new THREE.Vector3(-pioneerPosition.x, 0, -pioneerPosition.z).normalize();
  const cameraRight = new THREE.Vector3(-toSolarSystem.z, 0, toSolarSystem.x);
  return pioneerPosition.clone()
      .addScaledVector(toSolarSystem, -7.8)
      .addScaledVector(cameraRight, 2.2)
      .add(new THREE.Vector3(0, 0.75, 0));
}

const PROBE_MODELS = {
  voyager: "/models/voyager.glb",
  pioneer: "/models/pioneer.glb",
  "new-horizons": "/models/New_Horizons.glb"
};

function DeepSpaceProbe({ probe, hovered, setHovered, onClick, anchorRef, tutorialIntro = false }) {
  const group = useRef();
  const [labelHidden, setLabelHidden] = useState(false);
  const lastLabelHidden = useRef(false);
  const { scene } = useGLTF(PROBE_MODELS[probe.style]);
  const tutorialScale = tutorialIntro && probe.id === "pioneer-11" ? 3.1 : 1;
  const model = useMemo(() => {
    const clone = scene.clone(true);
    const bounds = new THREE.Box3().setFromObject(clone);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const longestSide = Math.max(size.x, size.y, size.z) || 1;
    clone.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    return { scene: clone, scale: 0.85 / longestSide, center };
  }, [scene]);
  useFrame((state) => {
    if (group.current) {
      const cameraDistance = state.camera.position.distanceTo(group.current.getWorldPosition(new THREE.Vector3()));
      const nextHidden = lastLabelHidden.current ? cameraDistance < 7 : cameraDistance < 5.5;
      if (nextHidden !== lastLabelHidden.current) {
        lastLabelHidden.current = nextHidden;
        setLabelHidden(nextHidden);
      }
    }
  });
  return <group position={probe.position} ref={(node) => { group.current = node; if (anchorRef) anchorRef(node); }} rotation={[.24,.4,-.18]}
                onClick={(e)=>{e.stopPropagation();onClick(probe.id)}}
                onPointerOver={(e)=>{e.stopPropagation();setHovered(probe.id)}}
                onPointerOut={(e)=>{e.stopPropagation();setHovered(null)}}>
    <mesh><sphereGeometry args={[.27,16,12]}/><meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false}/></mesh>
    {tutorialIntro && probe.id === "pioneer-11" && <pointLight position={[0, 0.25, 0.6]} intensity={8} distance={5} color="#b9ddff"/>}
    <group scale={model.scale * tutorialScale} position={[-model.center.x * model.scale * tutorialScale,-model.center.y * model.scale * tutorialScale,-model.center.z * model.scale * tutorialScale]}>
      <primitive object={model.scene}/>
    </group>
    {!labelHidden && <Html position={[0,.48,0]} center distanceFactor={12} zIndexRange={[30,0]}>
      <button type="button" className={`deep-space-probe-label${tutorialIntro && probe.id === "pioneer-11" ? " tutorial-pioneer-label" : ""}`} onClick={(e)=>{e.stopPropagation();onClick(probe.id)}} aria-label={`Zoom to ${probe.label}`} title={`Zoom to ${probe.label}`}>{probe.label}</button>
    </Html>}
  </group>;
}
Object.values(PROBE_MODELS).forEach((path) => useGLTF.preload(path));

function TutorialAstronaut({ position, flying }) {
  const { scene, animations } = useGLTF("/models/astronaut.glb");
  const root = useRef();
  const { actions, mixer } = useAnimations(animations, root);
  const actionRef = useRef(null);
  const flyingRef = useRef(flying);
  const finishedRef = useRef(false);
  const fit = useMemo(() => {
    const bounds = new THREE.Box3().setFromObject(scene);
    const size = bounds.getSize(new THREE.Vector3());
    return {
      center: bounds.getCenter(new THREE.Vector3()),
      scale: 1.85 / (size.y || Math.max(size.x, size.z, 1)),
    };
  }, [scene]);

  flyingRef.current = flying;
  useEffect(() => {
    const action = Object.values(actions)[0];
    if (!action) return undefined;
    actionRef.current = action;
    action.reset();
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.play();
    const onFinished = (event) => {
      if (event.action !== actionRef.current || !flyingRef.current || finishedRef.current) return;
      finishedRef.current = true;
      window.dispatchEvent(new Event("sb:pioneer-intro-complete"));
    };
    mixer.addEventListener("finished", onFinished);
    return () => {
      mixer.removeEventListener("finished", onFinished);
      action.stop();
      actionRef.current = null;
    };
  }, [actions, mixer]);

  useEffect(() => {
    if (!flying || !actionRef.current) return;
    actionRef.current.paused = false;
    actionRef.current.play();
  }, [flying]);

  useFrame(() => {
    const action = actionRef.current;
    if (!flyingRef.current && action && action.time >= 6.9) {
      action.time = 6.9;
      action.paused = true;
    }
  });

  return (
    <group ref={root} position={position} rotation={[0, 0.15, 0]} scale={fit.scale}>
      <primitive object={scene} position={[-fit.center.x, -fit.center.y, -fit.center.z]} />
    </group>
  );
}
useGLTF.preload("/models/astronaut.glb");

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

function SolarSystem({ selected, onSelect, planetAnchors, probesRefs, paused, speedModifier, cameraRef, onDistanceChange, tutorialIntro = false, introYaw = 0, introYawImmediate = false, introFlying = false }) {
  const [hovered, setHovered] = useState(null);
  const elapsed = useRef(0);

  // Position refs for orbiting bodies
  const mercuryPosition = useRef();
  const venusPosition = useRef();
  const earthPosition = useRef();
  const moonPosition = useRef();
  const marsPosition = useRef();
  const jupiterPosition = useRef();
  const saturnPosition = useRef();
  const uranusPosition = useRef();
  const neptunePosition = useRef();

  // Orbital plane refs for inclination tilts
  const mercuryPlane = useRef();
  const venusPlane = useRef();
  const earthPlane = useRef();
  const moonPlane = useRef();
  const marsPlane = useRef();
  const jupiterPlane = useRef();
  const saturnPlane = useRef();
  const uranusPlane = useRef();
  const neptunePlane = useRef();

  const moonWorld = useMemo(() => new THREE.Vector3(), []);

  // Semi-major axes (visually proportional spacing)
  // Mercury: 0.39 AU, Venus: 0.72 AU, Earth: 1.0 AU, Mars: 1.52 AU, Jupiter: 5.2 AU, Saturn: 9.5 AU, Uranus: 19.2 AU, Neptune: 30.1 AU
  const mercuryA = 2.4, venusA = 3.6, earthA = 5.0, moonA = 0.85, marsA = 7.6;
  const jupiterA = 14.5, saturnA = 21.5, uranusA = 29.5, neptuneA = 38.0;

  // Real orbital eccentricities
  const mercuryE = 0.2056, venusE = 0.0067, earthE = 0.0167, moonE = 0.0549, marsE = 0.0934;
  const jupiterE = 0.0489, saturnE = 0.0565, uranusE = 0.0463, neptuneE = 0.0095;

  // Real orbital periods in days
  const mercuryPeriod = 87.97, venusPeriod = 224.7, earthPeriod = 365.256, moonPeriod = 27.3217, marsPeriod = 686.98;
  const jupiterPeriod = 4332.6, saturnPeriod = 10759.2, uranusPeriod = 30685.4, neptunePeriod = 60189.0;

  // Real orbital inclinations in radians
  const incMercury = THREE.MathUtils.degToRad(7.0);
  const incVenus = THREE.MathUtils.degToRad(3.4);
  const incMars = THREE.MathUtils.degToRad(1.85);
  const incMoon = THREE.MathUtils.degToRad(5.145);
  const incJupiter = THREE.MathUtils.degToRad(1.3);
  const incSaturn = THREE.MathUtils.degToRad(2.49);
  const incUranus = THREE.MathUtils.degToRad(0.77);
  const incNeptune = THREE.MathUtils.degToRad(1.77);

  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const camPos = useMemo(() => new THREE.Vector3(), []);
  const tutorialAstronautPosition = useMemo(() => {
    const pioneer = PROBE_DATA.find((probe) => probe.id === "pioneer-11");
    const cameraPosition = getTutorialCameraPosition(new THREE.Vector3(...pioneer.position));
    const forward = cameraPosition.clone().negate().normalize();
    const cameraRight = new THREE.Vector3(-forward.z, 0, forward.x).normalize();
    return cameraPosition.addScaledVector(forward, 9.6).addScaledVector(cameraRight, 3.8).toArray();
  }, []);
  const prevSelected = useRef(null);
  const distFrameCount = useRef(0);
  const introCamera = useRef({
    active: false,
    yaw: null,
    flying: false,
    position: new THREE.Vector3(),
    lookAt: new THREE.Vector3(),
  });

  // Visually proportional sizes
  const RADII = {
    sun: 1.25,
    mercury: 0.16,
    venus: 0.28,
    earth: 0.31,
    moon: 0.105,
    mars: 0.24,
    jupiter: 0.72,
    saturn: 0.60,
    uranus: 0.42,
    neptune: 0.40
  };

  const ZOOM_DISTANCES = {
    sun: 4.2,
    mercury: 0.85,
    venus: 1.25,
    earth: 1.4,
    moon: 0.6,
    mars: 1.1,
    jupiter: 3.2,
    saturn: 3.5,
    uranus: 2.1,
    neptune: 2.0
  };

  const getTargetRef = (sel) => {
    if (planetAnchors && planetAnchors[sel]) return planetAnchors[sel];
    if (probesRefs && probesRefs.current[sel]) return { current: probesRefs.current[sel] };
    return null;
  };

  useFrame((state, delta) => {
    if (paused && !tutorialIntro) return;
    if (!paused) elapsed.current += Math.min(delta, 0.05) * 3 * speedModifier;
    const days = elapsed.current;
    // Outer planet periods are compressed so their orbital motion is visible in the model.
    const outerOrbitDays = days * 120;

    // Kepler equation solver for all planets
    const mercuryEcc = solveKepler((days / mercuryPeriod) * Math.PI * 2 + 1.2, mercuryE);
    const venusEcc = solveKepler((days / venusPeriod) * Math.PI * 2 + 0.8, venusE);
    const earthEcc = solveKepler((days / earthPeriod) * Math.PI * 2 + 0.3, earthE);
    const moonEcc = solveKepler((days / moonPeriod) * Math.PI * 2 + 0.7, moonE);
    const marsEcc = solveKepler((days / marsPeriod) * Math.PI * 2 + 2.1, marsE);
    const jupiterEcc = solveKepler((outerOrbitDays / jupiterPeriod) * Math.PI * 2 + 4.2, jupiterE);
    const saturnEcc = solveKepler((outerOrbitDays / saturnPeriod) * Math.PI * 2 + 1.6, saturnE);
    const uranusEcc = solveKepler((outerOrbitDays / uranusPeriod) * Math.PI * 2 + 3.1, uranusE);
    const neptuneEcc = solveKepler((outerOrbitDays / neptunePeriod) * Math.PI * 2 + 5.0, neptuneE);

    if (mercuryPosition.current) mercuryPosition.current.position.set(mercuryA * (Math.cos(mercuryEcc) - mercuryE), 0, mercuryA * Math.sqrt(1 - mercuryE * mercuryE) * Math.sin(mercuryEcc));
    if (venusPosition.current) venusPosition.current.position.set(venusA * (Math.cos(venusEcc) - venusE), 0, venusA * Math.sqrt(1 - venusE * venusE) * Math.sin(venusEcc));
    if (earthPosition.current) earthPosition.current.position.set(earthA * (Math.cos(earthEcc) - earthE), 0, earthA * Math.sqrt(1 - earthE * earthE) * Math.sin(earthEcc));
    if (moonPosition.current) moonPosition.current.position.set(moonA * (Math.cos(moonEcc) - moonE), 0, moonA * Math.sqrt(1 - moonE * moonE) * Math.sin(moonEcc));
    if (marsPosition.current) marsPosition.current.position.set(marsA * (Math.cos(marsEcc) - marsE), 0, marsA * Math.sqrt(1 - marsE * marsE) * Math.sin(marsEcc));
    if (jupiterPosition.current) jupiterPosition.current.position.set(jupiterA * (Math.cos(jupiterEcc) - jupiterE), 0, jupiterA * Math.sqrt(1 - jupiterE * jupiterE) * Math.sin(jupiterEcc));
    if (saturnPosition.current) saturnPosition.current.position.set(saturnA * (Math.cos(saturnEcc) - saturnE), 0, saturnA * Math.sqrt(1 - saturnE * saturnE) * Math.sin(saturnEcc));
    if (uranusPosition.current) uranusPosition.current.position.set(uranusA * (Math.cos(uranusEcc) - uranusE), 0, uranusA * Math.sqrt(1 - uranusE * uranusE) * Math.sin(uranusEcc));
    if (neptunePosition.current) neptunePosition.current.position.set(neptuneA * (Math.cos(neptuneEcc) - neptuneE), 0, neptuneA * Math.sqrt(1 - neptuneE * neptuneE) * Math.sin(neptuneEcc));

    if (planetAnchors?.moon?.current) planetAnchors.moon.current.getWorldPosition(moonWorld);

    const controls = cameraRef?.current;
    if (!controls) return;

    const intro = introCamera.current;
    if (tutorialIntro) {
      const pioneer = probesRefs?.current?.["pioneer-11"];
      if (!pioneer) return;
      pioneer.getWorldPosition(targetPos);

      if (!intro.active) {
        intro.active = true;
        intro.position.copy(getTutorialCameraPosition(targetPos));
        intro.yaw = null;
        intro.flying = false;
        controls.enabled = false;
        controls.setPosition(intro.position.x, intro.position.y, intro.position.z, false);
      }

      if (intro.yaw !== introYaw) {
        intro.lookAt.set(-intro.position.x, -intro.position.y, -intro.position.z).normalize();
        intro.lookAt.applyAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(introYaw));
        intro.lookAt.multiplyScalar(80).add(intro.position);
        controls.setTarget(intro.lookAt.x, intro.lookAt.y, intro.lookAt.z, intro.yaw !== null && !introYawImmediate);
        intro.yaw = introYaw;
        if (intro.yaw === introYaw && !window.__sbPioneerIntroReady) {
          window.__sbPioneerIntroReady = true;
          window.dispatchEvent(new Event("sb:pioneer-intro-ready"));
        }
      }

      if (introFlying && !intro.flying) {
        intro.flying = true;
        const forward = intro.lookAt.clone().sub(intro.position).normalize().multiplyScalar(1.4);
        intro.position.add(forward);
        controls.setLookAt(
          intro.position.x, intro.position.y, intro.position.z,
          intro.lookAt.x, intro.lookAt.y, intro.lookAt.z,
          true
        );
      }
      return;
    }

    if (intro.active) {
      intro.active = false;
      intro.yaw = null;
      intro.flying = false;
      controls.enabled = true;
      controls.minDistance = 1.0;
      controls.maxDistance = 350;
      prevSelected.current = selected;
      window.__sbPioneerIntroReady = false;
      controls.setLookAt(0, 18, 38, 0, 0, 0, true);
      return;
    }

    // Selection changed — fire smooth fly-to animation
    if (selected !== prevSelected.current) {
      prevSelected.current = selected;

      const tRef = selected ? getTargetRef(selected) : planetAnchors?.sun;
      if (tRef && tRef.current) {
        tRef.current.getWorldPosition(targetPos);
        const radius = RADII[selected] || 0.3;
        const zoomDist = ZOOM_DISTANCES[selected] || (radius * 4.5);

        controls.getPosition(camPos);
        const dir = camPos.clone().sub(targetPos);
        if (dir.lengthSq() < 0.001) dir.set(0, 0.4, 1);
        dir.normalize().multiplyScalar(zoomDist);
        const dest = targetPos.clone().add(dir);

        // Safe minDistance preventing entering inside the sphere
        controls.minDistance = radius * 2.8;

        controls.setLookAt(
          dest.x, dest.y, dest.z,
          targetPos.x, targetPos.y, targetPos.z,
          true
        );
      } else if (!selected) {
        controls.minDistance = 1.0;
        controls.setLookAt(0, 18, 38, 0, 0, 0, true);
      }
    }

    // Follow moving orbital target continuously
    if (selected) {
      const tRef = getTargetRef(selected);
      if (tRef && tRef.current) {
        tRef.current.getWorldPosition(targetPos);
        controls.moveTo(targetPos.x, targetPos.y, targetPos.z, false);
      }
    }

    // Distance calculation for HUD
    distFrameCount.current++;
    if (onDistanceChange && distFrameCount.current % 10 === 0) {
      controls.getPosition(camPos);
      const tRef = selected ? getTargetRef(selected) : planetAnchors?.sun;
      if (tRef && tRef.current) {
        tRef.current.getWorldPosition(targetPos);
        const dist = camPos.distanceTo(targetPos);
        onDistanceChange((dist * 0.2).toFixed(2));
      }
    }
  });

  const select = (name) => (event) => { event.stopPropagation(); onSelect(name); };

  return <>
    {/* Sun */}
    <group ref={planetAnchors?.sun}>
      <SunModel hovered={hovered} setHovered={setHovered} onClick={select("sun")} />
    </group>

    {/* Orbit lines */}
    <EllipticalOrbit semiMajor={mercuryA} eccentricity={mercuryE} inclination={incMercury} color="#e8edf5" opacity={0.22} />
    <EllipticalOrbit semiMajor={venusA} eccentricity={venusE} inclination={incVenus} color="#e8edf5" opacity={0.22} />
    <EllipticalOrbit semiMajor={earthA} eccentricity={earthE} color="#e8edf5" opacity={0.25} />
    <EllipticalOrbit semiMajor={marsA} eccentricity={marsE} inclination={incMars} color="#e8edf5" opacity={0.22} />
    <EllipticalOrbit semiMajor={jupiterA} eccentricity={jupiterE} inclination={incJupiter} color="#e8edf5" opacity={0.2} />
    <EllipticalOrbit semiMajor={saturnA} eccentricity={saturnE} inclination={incSaturn} color="#e8edf5" opacity={0.2} />
    <EllipticalOrbit semiMajor={uranusA} eccentricity={uranusE} inclination={incUranus} color="#e8edf5" opacity={0.18} />
    <EllipticalOrbit semiMajor={neptuneA} eccentricity={neptuneE} inclination={incNeptune} color="#e8edf5" opacity={0.18} />

    {/* Deep Space Probes */}
    {PROBE_DATA.map(probe =>
      <DeepSpaceProbe key={probe.id} probe={probe} hovered={hovered} setHovered={setHovered} onClick={onSelect} anchorRef={(node) => { if (probesRefs) probesRefs.current[probe.id] = node; }} tutorialIntro={tutorialIntro}/>
    )}
    {tutorialIntro && <TutorialAstronaut position={tutorialAstronautPosition} flying={introFlying}/>}

    {/* Mercury */}
    <group ref={mercuryPlane} rotation={[incMercury, 0, 0]}>
      <group ref={mercuryPosition}>
        <group ref={planetAnchors?.mercury}>
          <CelestialModel radius={RADII.mercury} name="mercury" hovered={hovered} setHovered={setHovered} onClick={select("mercury")} />
        </group>
      </group>
    </group>

    {/* Venus */}
    <group ref={venusPlane} rotation={[incVenus, 0, 0]}>
      <group ref={venusPosition}>
        <group ref={planetAnchors?.venus}>
          <CelestialModel radius={RADII.venus} name="venus" hovered={hovered} setHovered={setHovered} onClick={select("venus")} />
        </group>
      </group>
    </group>

    {/* Earth & Moon */}
    <group ref={earthPlane}>
      <group ref={earthPosition}>
        <group ref={planetAnchors?.earth}>
          <CelestialModel radius={RADII.earth} name="earth" hovered={hovered} setHovered={setHovered} onClick={select("earth")} />
        </group>
        <EllipticalOrbit semiMajor={moonA} eccentricity={moonE} inclination={incMoon} color="#e8edf5" opacity={0.25}/>
        <group ref={moonPlane} rotation={[incMoon, 0, 0]}>
          <group ref={moonPosition}>
            <group ref={planetAnchors?.moon}>
              <CelestialModel radius={RADII.moon} name="moon" hovered={hovered} setHovered={setHovered} onClick={select("moon")} />
            </group>
          </group>
        </group>
      </group>
    </group>

    {/* Mars */}
    <group ref={marsPlane} rotation={[incMars, 0, 0]}>
      <group ref={marsPosition}>
        <group ref={planetAnchors?.mars}>
          <CelestialModel radius={RADII.mars} name="mars" hovered={hovered} setHovered={setHovered} onClick={select("mars")} />
        </group>
      </group>
    </group>

    {/* Jupiter */}
    <group ref={jupiterPlane} rotation={[incJupiter, 0, 0]}>
      <group ref={jupiterPosition}>
        <group ref={planetAnchors?.jupiter}>
          <CelestialModel radius={RADII.jupiter} name="jupiter" hovered={hovered} setHovered={setHovered} onClick={select("jupiter")} />
        </group>
      </group>
    </group>

    {/* Saturn */}
    <group ref={saturnPlane} rotation={[incSaturn, 0, 0]}>
      <group ref={saturnPosition}>
        <group ref={planetAnchors?.saturn}>
          <CelestialModel radius={RADII.saturn} name="saturn" hovered={hovered} setHovered={setHovered} onClick={select("saturn")} />
        </group>
      </group>
    </group>

    {/* Uranus */}
    <group ref={uranusPlane} rotation={[incUranus, 0, 0]}>
      <group ref={uranusPosition}>
        <group ref={planetAnchors?.uranus}>
          <CelestialModel radius={RADII.uranus} name="uranus" hovered={hovered} setHovered={setHovered} onClick={select("uranus")} />
        </group>
      </group>
    </group>

    {/* Neptune */}
    <group ref={neptunePlane} rotation={[incNeptune, 0, 0]}>
      <group ref={neptunePosition}>
        <group ref={planetAnchors?.neptune}>
          <CelestialModel radius={RADII.neptune} name="neptune" hovered={hovered} setHovered={setHovered} onClick={select("neptune")} />
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
  return <Shell immersive className="home-sky-shell"><MoonExplorer /></Shell>;
}
export function MarsPage() { return <Shell immersive className="home-sky-shell"><MarsExplorer /></Shell>; }


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
