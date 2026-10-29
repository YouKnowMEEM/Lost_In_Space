import { useCallback, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import "./signalHunter.css";

/* ------------------------------------------------------------------ */
/* Tuning                                                              */
/* ------------------------------------------------------------------ */
const ROUNDS = 5;
const PINGS_PER_ROUND = 8;
const FOUND_RADIUS_DEG = 4; // about 120 km on the Moon
const HINT_AFTER_PINGS = 3;

// Closest band first. `max` is angular distance in degrees.
const BANDS = [
  { max: FOUND_RADIUS_DEG, label: "Signal locked", color: "#7cffb2", pitch: 1100 },
  { max: 10, label: "Burning", color: "#ff3b5c", pitch: 880 },
  { max: 20, label: "Hot", color: "#ff7a45", pitch: 700 },
  { max: 40, label: "Warm", color: "#ffd166", pitch: 540 },
  { max: 70, label: "Cool", color: "#6ee7d8", pitch: 420 },
  { max: 181, label: "Cold", color: "#4aa3ff", pitch: 320 },
];
const bandFor = (dist) => BANDS.find((b) => dist <= b.max);
const MAX_SCORE = ROUNDS * (100 + (PINGS_PER_ROUND - 1) * 100);

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                    */
/* ------------------------------------------------------------------ */
const D2R = Math.PI / 180;

// IMPORTANT: this pair must match how EquipmentMarker places markers.
// This is the common three.js convention for an equirectangular texture
// (lon -180 at the left edge of SphereGeometry).
export function latLonToVector3(lat, lon, r = 1) {
  const phi = (90 - lat) * D2R;
  const theta = (lon + 180) * D2R;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

export function vector3ToLatLon(v) {
  const r = v.length();
  const lat = 90 - Math.acos(THREE.MathUtils.clamp(v.y / r, -1, 1)) / D2R;
  let lon = Math.atan2(v.z, -v.x) / D2R - 180;
  if (lon < -180) lon += 360;
  return { lat, lon };
}

// Great-circle (haversine) angular distance in degrees.
export function angularDistanceDeg(a, b) {
  const p1 = a.lat * D2R;
  const p2 = b.lat * D2R;
  const dp = p2 - p1;
  const dl = (b.lon - a.lon) * D2R;
  const h = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return (2 * Math.asin(Math.min(1, Math.sqrt(h)))) / D2R;
}

const fmtCoord = (lat, lon) =>
  `${Math.abs(lat).toFixed(1)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lon).toFixed(1)}° ${lon >= 0 ? "E" : "W"}`;

function shuffled(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ------------------------------------------------------------------ */
/* Sound: one short beep, higher pitch = closer                        */
/* ------------------------------------------------------------------ */
let audioCtx;
function beep(freq) {
  try {
    audioCtx ??= new (window.AudioContext || window.webkitAudioContext)();
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.15, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + 0.27);
  } catch {
    /* audio is optional */
  }
}

/* ------------------------------------------------------------------ */
/* Game logic                                                          */
/* ------------------------------------------------------------------ */
const INITIAL = { phase: "idle", queue: [], round: 0, pings: [], score: 0, lastGain: 0 };

export function useSignalHunter(artifacts) {
  const [state, setState] = useState(INITIAL);
  const [muted, setMuted] = useState(false);

  const target = state.queue[state.round] ?? null;
  const playingPhases = ["playing", "found", "missed"];

  const start = useCallback(() => {
    const valid = artifacts.filter((a) => Number.isFinite(a.lat) && Number.isFinite(a.lon));
    setState({ ...INITIAL, phase: "playing", queue: shuffled(valid).slice(0, ROUNDS) });
  }, [artifacts]);

  const ping = (lat, lon) => {
    if (state.phase !== "playing" || !target) return;
    const dist = angularDistanceDeg({ lat, lon }, target);
    const band = bandFor(dist);
    if (!muted) beep(band.pitch);

    const pings = [
      ...state.pings,
      { id: `${state.pings.length}-${Date.now()}`, lat, lon, dist, color: band.color, label: band.label },
    ];
    const left = PINGS_PER_ROUND - pings.length;

    if (dist <= FOUND_RADIUS_DEG) {
      const gain = 100 + left * 100;
      setState({ ...state, pings, phase: "found", score: state.score + gain, lastGain: gain });
    } else if (left <= 0) {
      setState({ ...state, pings, phase: "missed", lastGain: 0 });
    } else {
      setState({ ...state, pings });
    }
  };

  const next = () => {
    if (state.round + 1 >= state.queue.length) setState({ ...state, phase: "summary" });
    else setState({ ...state, phase: "playing", round: state.round + 1, pings: [], lastGain: 0 });
  };

  const lastPing = state.pings[state.pings.length - 1] ?? null;

  return {
    phase: state.phase,
    active: playingPhases.includes(state.phase), // hide your normal markers while true
    revealed: state.phase === "found" || state.phase === "missed",
    target,
    round: state.round,
    total: state.queue.length,
    pings: state.pings,
    pingsLeft: PINGS_PER_ROUND - state.pings.length,
    lastPing,
    hintUnlocked: state.pings.length >= HINT_AFTER_PINGS || state.phase !== "playing",
    score: state.score,
    lastGain: state.lastGain,
    muted,
    setMuted,
    start,
    ping,
    next,
  };
}

/* ------------------------------------------------------------------ */
/* In-canvas layer. Render INSIDE the same group that holds the Moon   */
/* mesh, so it rotates with the globe.                                 */
/* ------------------------------------------------------------------ */
export function SignalLayer({ game, radius = 1 }) {
  const onClick = (e) => {
    if (e.delta > 4) return; // the player was dragging to rotate, not pinging
    e.stopPropagation();
    const local = e.object.worldToLocal(e.point.clone());
    const { lat, lon } = vector3ToLatLon(local);
    game.ping(lat, lon);
  };

  return (
    <group>
      {/* Invisible sphere that catches clicks */}
      <mesh onClick={onClick}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {game.pings.map((p) => (
        <PingMark key={p.id} ping={p} radius={radius} />
      ))}

      {game.revealed && game.target && (
        <RevealMark target={game.target} found={game.phase === "found"} radius={radius} />
      )}
    </group>
  );
}

function useSurfaceTransform(lat, lon, radius) {
  return useMemo(() => {
    const position = latLonToVector3(lat, lon, radius * 1.004);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      position.clone().normalize()
    );
    return { position, quaternion };
  }, [lat, lon, radius]);
}

// A colored dot that stays, plus a ring that expands once and fades.
function PingMark({ ping, radius }) {
  const { position, quaternion } = useSurfaceTransform(ping.lat, ping.lon, radius);
  const ring = useRef();
  const born = useRef(performance.now());

  useFrame(() => {
    if (!ring.current) return;
    const t = Math.min((performance.now() - born.current) / 900, 1);
    ring.current.scale.setScalar(0.3 + t * 3);
    ring.current.material.opacity = 0.9 * (1 - t);
  });

  return (
    <group position={position} quaternion={quaternion}>
      <mesh>
        <circleGeometry args={[radius * 0.012, 16]} />
        <meshBasicMaterial color={ping.color} />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[radius * 0.03, radius * 0.036, 48]} />
        <meshBasicMaterial color={ping.color} transparent depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Shows where the equipment really was. Swap for your EquipmentMarker if you like.
function RevealMark({ target, found, radius }) {
  const { position, quaternion } = useSurfaceTransform(target.lat, target.lon, radius);
  const ring = useRef();
  const color = found ? "#7cffb2" : "#ffffff";

  useFrame(({ clock }) => {
    if (ring.current) ring.current.scale.setScalar(1 + 0.4 * Math.sin(clock.elapsedTime * 3));
  });

  return (
    <group position={position} quaternion={quaternion}>
      <mesh>
        <circleGeometry args={[radius * 0.02, 20]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[radius * 0.04, radius * 0.048, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.85} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* HTML overlay. Render OUTSIDE the Canvas.                            */
/* ------------------------------------------------------------------ */
export function SignalHUD({ game, onOpenStory }) {
  const { phase, target, lastPing } = game;

  if (phase === "idle") {
    return (
      <div className="sh-root">
        <section className="sh-panel">
          <h2 className="sh-title">Signal Hunter</h2>
          <p className="sh-text">
            A forgotten piece of equipment is still sending a faint signal. Tap the Moon to send a
            ping. The warmer the color, the closer you are. You have {PINGS_PER_ROUND} pings per
            target.
          </p>
          <button className="sh-btn sh-btn-primary" onClick={game.start}>
            Start hunt
          </button>
        </section>
      </div>
    );
  }

  if (phase === "summary") {
    const ratio = game.score / MAX_SCORE;
    const rank = ratio >= 0.75 ? "Lunar archaeologist" : ratio >= 0.4 ? "Signal tracker" : "Rookie listener";
    return (
      <div className="sh-root">
        <section className="sh-panel">
          <h2 className="sh-title">Hunt complete</h2>
          <p className="sh-score">
            {game.score} <span className="sh-muted">of {MAX_SCORE}</span>
          </p>
          <p className="sh-text">You ranked as a {rank}.</p>
          <button className="sh-btn sh-btn-primary" onClick={game.start}>
            Play again
          </button>
        </section>
      </div>
    );
  }

  const dots = Array.from({ length: PINGS_PER_ROUND }, (_, i) => game.pings[i]);
  const closeness = lastPing ? Math.round((1 - Math.min(lastPing.dist, 120) / 120) * 100) : 0;

  return (
    <div className="sh-root">
      <section className="sh-panel" aria-live="polite">
        <header className="sh-head">
          <span>
            Target {game.round + 1} of {game.total}
          </span>
          <span className="sh-head-right">
            <span>Score {game.score}</span>
            <button
              className="sh-icon-btn"
              onClick={() => game.setMuted(!game.muted)}
              aria-pressed={game.muted}
              aria-label={game.muted ? "Unmute pings" : "Mute pings"}
            >
              {game.muted ? "Sound off" : "Sound on"}
            </button>
          </span>
        </header>

        <p className="sh-clue">
          Hunting a <strong>{target.equipmentType}</strong> from {target.year}.
        </p>
        {game.hintUnlocked && <p className="sh-hint">{target.description}</p>}

        <div className="sh-meter" role="img" aria-label={lastPing ? `${lastPing.label}` : "No ping yet"}>
          <div
            className="sh-meter-fill"
            style={{ width: `${closeness}%`, background: lastPing?.color ?? "transparent" }}
          />
        </div>
        <p className="sh-readout" style={{ color: lastPing?.color }}>
          {lastPing ? lastPing.label : "Tap the Moon to send your first ping."}
        </p>

        <div className="sh-dots" aria-label={`${game.pingsLeft} pings left`}>
          {dots.map((d, i) => (
            <span key={i} className="sh-dot" style={d ? { background: d.color, borderColor: d.color } : undefined} />
          ))}
        </div>

        {phase === "found" && (
          <div className="sh-result">
            <h3 className="sh-result-title">Found {target.name}</h3>
            <p className="sh-text">
              {target.status}. Left behind: {target.hardwareList.join(", ")}.
            </p>
            <p className="sh-gain">+{game.lastGain} points</p>
            <div className="sh-actions">
              {target.storyPath && onOpenStory && (
                <button className="sh-btn" onClick={() => onOpenStory(target.storyPath)}>
                  Read its story
                </button>
              )}
              <button className="sh-btn sh-btn-primary" onClick={game.next}>
                {game.round + 1 >= game.total ? "See results" : "Next target"}
              </button>
            </div>
          </div>
        )}

        {phase === "missed" && (
          <div className="sh-result">
            <h3 className="sh-result-title">Signal lost</h3>
            <p className="sh-text">
              It was {target.name}, at {fmtCoord(target.lat, target.lon)}. {target.description}
            </p>
            <div className="sh-actions">
              <button className="sh-btn sh-btn-primary" onClick={game.next}>
                {game.round + 1 >= game.total ? "See results" : "Next target"}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
