import React, { useEffect, useMemo, useRef, useState } from "react";
import { AU_KM, LIGHT_DAY_MOMENT, SPEED_KM_S, lightTime, voyagerAt } from "../lib/voyagerDistance";

/*
 * "Where it is now" for Voyager 1: a map of the Sun's bubble on a ten-times scale, and a
 * live estimate of Voyager's distance that ticks while the page is open.
 */

// nudge: on the wide map, Uranus and Neptune sit close together, so their names lean apart.
const BODIES = [
  { id: "earth", name: "Earth", au: 1, r: 4.5, fill: "#5fa8ff" },
  { id: "jupiter", name: "Jupiter", au: 5.2, r: 9, fill: "#e0b48a" },
  { id: "saturn", name: "Saturn", au: 9.54, r: 7.5, fill: "#ecd09a", ring: true },
  { id: "uranus", name: "Uranus", au: 19.2, r: 5.5, fill: "#9fe3ea", nudge: ["end", 10] },
  { id: "neptune", name: "Neptune", au: 30.1, r: 5.5, fill: "#6f8dff", nudge: ["start", -10] },
];
const TERMINATION_SHOCK = 94;
const HELIOPAUSE = 121.6;
const PALE_BLUE_DOT = 40.5;
const TICKS = [1, 10, 100];

// Two drawings of the same map: wide (Sun on the left) and tall for phones (Sun at the top).
const LAYOUTS = {
  wide: { w: 1000, h: 400, sun: [38, 214], axis: [1, 0], side: [0, 1], r0: 120, k: 290 },
  tall: { w: 400, h: 780, sun: [70, 40], axis: [0, 1], side: [1, 0], r0: 92, k: 258 },
};

const fmt = new Intl.NumberFormat("en-GB");

function useNarrow(query) {
  const [match, setMatch] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

/** Deterministic little starfield, so the drawing is identical on every visit. */
function stars(n, w, h, seed) {
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  return Array.from({ length: n }, () => ({ x: rand() * w, y: rand() * h, r: 0.5 + rand() * 1.1, o: 0.25 + rand() * 0.55 }));
}

function HeliosphereMap({ sunAU, tall }) {
  const L = tall ? LAYOUTS.tall : LAYOUTS.wide;
  const [sx, sy] = L.sun;
  const rad = (au) => L.r0 + L.k * Math.log10(au);
  // A point at distance r along the axis, pushed sideways by s (positive = label side).
  const at = (r, s = 0) => [sx + L.axis[0] * r + L.side[0] * s, sy + L.axis[1] * r + L.side[1] * s];
  // Where a circle of radius r centred on the Sun meets a line parallel to the axis, offset by s.
  const onArc = (r, s) => {
    const along = Math.sqrt(Math.max(0, r * r - s * s));
    return [sx + L.axis[0] * along + L.side[0] * s, sy + L.axis[1] * along + L.side[1] * s];
  };
  const field = useMemo(() => stars(tall ? 90 : 120, L.w, L.h, tall ? 7 : 11), [tall, L.w, L.h]);

  const ts = rad(TERMINATION_SHOCK);
  const hp = rad(HELIOPAUSE);
  const vr = rad(sunAU);
  const [vx, vy] = at(vr);
  const pbd = rad(PALE_BLUE_DOT);

  // Label placement differs between the two drawings.
  const tsLabel = tall ? onArc(ts, 150) : onArc(ts, -182);
  const hpLabel = tall ? onArc(hp, 150) : onArc(hp, -182);
  const title = "Map of the Sun's bubble, with Voyager 1 beyond its edge";

  return (
    <svg
      className="mf-helio-svg"
      viewBox={`0 0 ${L.w} ${L.h}`}
      role="img"
      aria-label={`${title}. Distances grow ten times with each step: Earth at 1 AU, Jupiter at 5, Saturn at 10, Neptune at 30, the termination shock at about 94 AU, the heliopause at about 122 AU, and Voyager 1 at about ${Math.round(sunAU)} AU from the Sun.`}
    >
      <defs>
        <radialGradient id="helio-bubble" gradientUnits="userSpaceOnUse" cx={sx} cy={sy} r={hp}>
          <stop offset="0" stopColor="#3a2a12" />
          <stop offset="0.18" stopColor="#1d1a24" />
          <stop offset="0.7" stopColor="#101a33" />
          <stop offset="0.94" stopColor="#14284a" />
          <stop offset="1" stopColor="#1d3b66" />
        </radialGradient>
        <radialGradient id="helio-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff6d6" />
          <stop offset="0.45" stopColor="#ffd36b" />
          <stop offset="1" stopColor="#ff9f2e" stopOpacity="0" />
        </radialGradient>
        <filter id="helio-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <rect width={L.w} height={L.h} fill="#050a17" />
      {field.map((s, i) => (
        <circle key={i} cx={s.x.toFixed(1)} cy={s.y.toFixed(1)} r={s.r.toFixed(2)} fill="#dfe9ff" opacity={s.o.toFixed(2)} />
      ))}

      {/* The Sun's bubble, with the heliosheath as a brighter rim */}
      <circle cx={sx} cy={sy} r={hp} fill="url(#helio-bubble)" />
      <circle cx={sx} cy={sy} r={(ts + hp) / 2} fill="none" stroke="#5aa9e6" strokeOpacity="0.12" strokeWidth={hp - ts} />
      <circle cx={sx} cy={sy} r={ts} fill="none" stroke="#9ccfff" strokeOpacity="0.65" strokeWidth="1.5" strokeDasharray="6 6" />
      <circle cx={sx} cy={sy} r={hp} fill="none" stroke="#8fd3ff" strokeWidth="2.5" opacity="0.9" />
      <circle cx={sx} cy={sy} r={hp} fill="none" stroke="#8fd3ff" strokeWidth="9" opacity="0.18" filter="url(#helio-glow)" />

      {/* Planet orbits */}
      {BODIES.map((b) => (
        <circle key={b.id} cx={sx} cy={sy} r={rad(b.au)} fill="none" stroke="#c9d6f5" strokeOpacity="0.16" strokeWidth="1" />
      ))}

      {/* Voyager 1's path */}
      <line x1={at(rad(1))[0]} y1={at(rad(1))[1]} x2={vx} y2={vy} stroke="#8fd3ff" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="2 5" />

      {/* Scale ticks on the far side of the axis from the planet names, on small dark tags */}
      {TICKS.map((au) => {
        const r = rad(au);
        const [x1, y1] = at(r, -6);
        const [x2, y2] = at(r, 6);
        const label = `${au} AU`;
        const tw = label.length * 7.6 + 12;
        const [cx, cy] = tall ? at(r, -12 - tw / 2) : at(r, -19);
        return (
          <g key={au} className="mf-helio-tick">
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c9d6f5" strokeOpacity="0.5" />
            <rect x={cx - tw / 2} y={cy - 10} width={tw} height="20" rx="10" fill="#071024" fillOpacity="0.85" />
            <text x={cx} y={cy + 4.5} textAnchor="middle">
              {label}
            </text>
          </g>
        );
      })}

      {/* Sun */}
      <circle cx={sx} cy={sy} r={tall ? 30 : 34} fill="url(#helio-sun)" />
      <circle cx={sx} cy={sy} r={tall ? 10 : 12} fill="#fff1c4" />
      <text className="mf-helio-name" x={at(0, tall ? 0 : 30)[0] + (tall ? 22 : 0)} y={at(0, tall ? 0 : 30)[1] + (tall ? 5 : 8)} textAnchor={tall ? "start" : "middle"}>
        Sun
      </text>

      {/* Planets */}
      {BODIES.map((b) => {
        const [x, y] = at(rad(b.au));
        const [lx, ly] = at(rad(b.au), tall ? b.r + 9 : b.r + 18);
        const nudge = !tall && b.nudge;
        return (
          <g key={b.id}>
            {b.ring && <ellipse cx={x} cy={y} rx={b.r * 1.9} ry={b.r * 0.55} fill="none" stroke={b.fill} strokeWidth="1.6" opacity="0.9" />}
            <circle cx={x} cy={y} r={b.r} fill={b.fill} />
            <text
              className="mf-helio-name"
              x={lx + (nudge ? nudge[1] : 0)}
              y={ly + (tall ? 5 : 0)}
              textAnchor={tall ? "start" : nudge ? nudge[0] : "middle"}
            >
              {b.name}
            </text>
          </g>
        );
      })}

      {/* Pale Blue Dot, 1990 */}
      {(() => {
        const [x, y] = at(pbd);
        const [lx, ly] = at(pbd, tall ? 12 : -14);
        return (
          <g>
            <circle cx={x} cy={y} r="3" fill="#8fd3ff" />
            <text className="mf-helio-note" x={lx} y={ly + (tall ? 4 : 0)} textAnchor={tall ? "start" : "middle"}>
              1990: Pale Blue Dot
            </text>
          </g>
        );
      })()}

      {/* Boundary labels */}
      <text className="mf-helio-edge" x={tsLabel[0] + (tall ? 0 : -10)} y={tsLabel[1] + (tall ? -10 : 4)} textAnchor={tall ? "start" : "end"}>
        Termination shock · 2004
      </text>
      <text className="mf-helio-edge is-strong" x={hpLabel[0] + (tall ? 0 : 12)} y={hpLabel[1] + (tall ? 22 : 4)} textAnchor="start">
        Heliopause · 2012
      </text>
      {!tall && (
        <text className="mf-helio-region" x="200" y="40" textAnchor="start">
          Inside the Sun's bubble
        </text>
      )}
      <text className="mf-helio-region" x={L.w - 18} y={L.h - 18} textAnchor="end">
        Interstellar space
      </text>

      {/* Voyager 1 */}
      <g className="mf-helio-voyager">
        <circle className="mf-helio-ping" cx={vx} cy={vy} r="9" fill="none" stroke="#ffe08a" strokeWidth="2" />
        <circle cx={vx} cy={vy} r="5.5" fill="#ffe08a" />
        <text className="mf-helio-vname" x={vx + 24} y={tall ? vy + 6 : vy - 8} textAnchor="start">
          Voyager 1
        </text>
        <text className="mf-helio-note" x={vx + 24} y={tall ? vy + 26 : vy + 15} textAnchor="start">
          {sunAU.toFixed(1)} AU from the Sun
        </text>
      </g>
    </svg>
  );
}

/** The live counters: distance, light time and the kilometres flown since the page opened. */
function LiveNumbers() {
  const rootRef = useRef(null);
  const earthRef = useRef(null);
  const sunRef = useRef(null);
  const lightRef = useRef(null);
  const sinceRef = useRef(null);
  const start = useRef(Date.now());

  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const every = reduced ? 1000 : 100;
    let visible = true;
    let timer = 0;
    const draw = () => {
      const t = Date.now();
      const v = voyagerAt(t);
      if (earthRef.current) earthRef.current.textContent = `${fmt.format(Math.round(v.earthKm))} km`;
      if (sunRef.current) sunRef.current.textContent = `${fmt.format(Math.round(v.sunKm))} km`;
      if (lightRef.current) lightRef.current.textContent = lightTime(v.lightSeconds);
      if (sinceRef.current) sinceRef.current.textContent = `${fmt.format(Math.round(((t - start.current) / 1000) * SPEED_KM_S))} km`;
    };
    const loop = () => {
      draw();
      if (visible) timer = window.setTimeout(loop, every);
    };
    loop();
    let io;
    if ("IntersectionObserver" in window && rootRef.current) {
      io = new IntersectionObserver(([e]) => {
        const was = visible;
        visible = e.isIntersecting;
        if (visible && !was) loop();
      });
      io.observe(rootRef.current);
    }
    return () => {
      window.clearTimeout(timer);
      io?.disconnect();
    };
  }, []);

  const first = voyagerAt();
  return (
    <dl className="mf-now" ref={rootRef}>
      <div>
        <dt>From Earth</dt>
        <dd ref={earthRef}>{fmt.format(Math.round(first.earthKm))} km</dd>
        <small>{(first.earthKm / AU_KM).toFixed(1)} AU</small>
      </div>
      <div>
        <dt>From the Sun</dt>
        <dd ref={sunRef}>{fmt.format(Math.round(first.sunKm))} km</dd>
        <small>{first.sunAU.toFixed(1)} AU</small>
      </div>
      <div>
        <dt>Radio signal, one way</dt>
        <dd ref={lightRef}>{lightTime(first.lightSeconds)}</dd>
        <small>travelling at the speed of light</small>
      </div>
      <div>
        <dt>Flown since you opened this page</dt>
        <dd ref={sinceRef}>0 km</dd>
        <small>at about {SPEED_KM_S} km every second</small>
      </div>
    </dl>
  );
}

function Milestone() {
  const now = Date.now();
  const days = Math.ceil((LIGHT_DAY_MOMENT - now) / 86_400_000);
  if (days > 0) {
    return (
      <p className="mf-milestone">
        <strong>Coming up:</strong> on 18 November 2026 at 10:16 UTC, Voyager 1 will be one light-day from Earth: 25.902 billion km, so far that its
        signals take a full 24 hours to arrive. That is {days === 1 ? "tomorrow" : `${days} days from now`}.
      </p>
    );
  }
  return (
    <p className="mf-milestone">
      <strong>A first:</strong> on 18 November 2026, Voyager 1 became the first spacecraft ever to be one light-day from Earth, 25.902 billion km away.
    </p>
  );
}

export default function VoyagerNow({ where }) {
  const tall = useNarrow("(max-width: 640px)");
  const sunAU = voyagerAt().sunAU;
  return (
    <div className="mf-where">
      <figure className="mf-helio">
        <HeliosphereMap sunAU={sunAU} tall={tall} />
        <figcaption>
          Each step on this map is ten times farther than the one before, so the whole journey fits on one screen. 1 AU is the distance from Earth to
          the Sun, about 150 million km. Planet sizes are not to scale.
        </figcaption>
      </figure>
      <LiveNumbers />
      <Milestone />
      <div className="mf-where-text">
        {where.text.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <p className="mf-where-note">
          These numbers are estimates worked out from NASA's published distance and Voyager 1's speed. NASA's live figures are on{" "}
          <a href="https://science.nasa.gov/mission/voyager/where-are-voyager-1-and-voyager-2-now/" target="_blank" rel="noreferrer">
            Where are Voyager 1 and Voyager 2 now?
          </a>
        </p>
      </div>
    </div>
  );
}
