import React from "react";
import { Glow, rng, useUid, W, H } from "./common";

/* Illustrated parts for the Voyager 1 book. VoyagerCraft is drawn around (0,0), the middle
   of its big dish; planets are drawn around their centres. */

export const VOY = {
  dish: "#f5f7fc",
  dishShade: "#c9d1e3",
  dishEdge: "#8d97b0",
  ink: "#1b2340",
  bus: "#b98a3a",
  busLight: "#e3be72",
  busDark: "#7a5520",
  boom: "#8a93a9",
  rtg: "#3c4252",
  rtgFin: "#5b6276",
  gold: "#e9b949",
  goldDark: "#b07d22",
  blush: "#ff9db0",
};

export const SPACE_SKIES = {
  deep: [
    [0, "#02040b"],
    [0.55, "#0a1430"],
    [1, "#152548"],
  ],
  indigo: [
    [0, "#050816"],
    [0.6, "#121a3f"],
    [1, "#22285a"],
  ],
  dawn: [
    [0, "#3b4f8f"],
    [0.45, "#9a8fc0"],
    [0.78, "#f2b9a0"],
    [1, "#ffd9a8"],
  ],
  night: [
    [0, "#030712"],
    [0.6, "#0b1834"],
    [1, "#18294f"],
  ],
};

/* ------------------------------------------------------------- the spacecraft */

function Eyes({ eyes }) {
  const ink = VOY.ink;
  const lx = -36;
  const rx = 36;
  const ey = -14;
  if (eyes === "closed") {
    return (
      <g stroke={ink} strokeWidth="4.5" fill="none" strokeLinecap="round">
        {[lx, rx].map((x) => (
          <g key={x}>
            <path d={`M${x - 15} ${ey} Q${x} ${ey + 13} ${x + 15} ${ey}`} />
            <path d={`M${x - 11} ${ey + 6} l-5 6 M${x} ${ey + 9} l0 7 M${x + 11} ${ey + 6} l5 6`} strokeWidth="2.6" />
          </g>
        ))}
      </g>
    );
  }
  if (eyes === "happy") {
    return (
      <g stroke={ink} strokeWidth="5" fill="none" strokeLinecap="round">
        {[lx, rx].map((x) => (
          <path key={x} d={`M${x - 14} ${ey + 5} Q${x} ${ey - 13} ${x + 14} ${ey + 5}`} />
        ))}
      </g>
    );
  }
  if (eyes === "dizzy") {
    return (
      <g stroke={ink} strokeWidth="3.4" fill="none" strokeLinecap="round">
        {[lx, rx].map((x) => (
          <g key={x} className="anim spin-slow" style={{ transformOrigin: `${x}px ${ey}px` }}>
            <path d={`M${x} ${ey} m-2 0 a2 2 0 1 1 4 0 a5 5 0 1 1 -10 0 a8 8 0 1 1 16 0 a11 11 0 1 1 -22 0`} />
          </g>
        ))}
      </g>
    );
  }
  const look = eyes === "side" ? 6 : eyes === "up" ? 0 : 0;
  const lookY = eyes === "up" ? -5 : 0;
  const big = eyes === "wide";
  return (
    <g>
      {[lx, rx].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={ey} rx={big ? 17 : 15} ry={big ? 20 : 18} fill="#ffffff" stroke={ink} strokeWidth="3" />
          <ellipse cx={x + look} cy={ey + 2 + lookY} rx={big ? 9 : 8.5} ry={big ? 11 : 10.5} fill={ink} />
          <circle cx={x + look + 3} cy={ey - 3 + lookY} r="3.2" fill="#fff" />
          {eyes === "sleepy" && <path d={`M${x - 17} ${ey - 3} Q${x} ${ey - 26} ${x + 17} ${ey - 3}Z`} fill={VOY.dish} stroke={ink} strokeWidth="3" />}
        </g>
      ))}
    </g>
  );
}

function Mouth({ eyes }) {
  const ink = VOY.ink;
  if (eyes === "wide") return <ellipse cx="0" cy="40" rx="9" ry="11" fill={ink} />;
  if (eyes === "dizzy") return <path d="M-18 42 q6 -7 12 0 t12 0 t12 0" stroke={ink} strokeWidth="3.5" fill="none" strokeLinecap="round" />;
  if (eyes === "closed" || eyes === "sleepy") return <ellipse cx="0" cy="40" rx="6" ry="5" fill={ink} opacity="0.85" />;
  return <path d="M-16 34 Q0 50 16 34" stroke={ink} strokeWidth="4.5" fill="none" strokeLinecap="round" />;
}

/**
 * Voyager 1 with its high-gain dish as a friendly face.
 * eyes: "open" | "closed" | "sleepy" | "happy" | "dizzy" | "wide" | "side" | "up"
 */
export function VoyagerCraft({ x = 0, y = 0, s = 1, rotate = 0, eyes = "open", cap = false, record = true, lights = 3, glowRtg = false }) {
  const u = useUid();
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
      <defs>
        <radialGradient id={`${u}-dish`} cx="0.42" cy="0.38" r="0.75">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.7" stopColor={VOY.dish} />
          <stop offset="1" stopColor={VOY.dishShade} />
        </radialGradient>
        <linearGradient id={`${u}-bus`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={VOY.busDark} />
          <stop offset="0.35" stopColor={VOY.busLight} />
          <stop offset="0.7" stopColor={VOY.bus} />
          <stop offset="1" stopColor={VOY.busDark} />
        </linearGradient>
        <radialGradient id={`${u}-rec`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fff1bf" />
          <stop offset="0.5" stopColor={VOY.gold} />
          <stop offset="1" stopColor={VOY.goldDark} />
        </radialGradient>
      </defs>

      {/* radio antennas: two long thin whips in a V */}
      <path d="M-8 118 L-118 252 M8 118 L96 262" stroke={VOY.boom} strokeWidth="2" opacity="0.8" />

      {/* magnetometer boom: a long thin mast reaching up and away */}
      <g stroke={VOY.boom} strokeLinecap="round">
        <path d="M58 92 L262 -118" strokeWidth="3.2" />
        <path d="M66 98 L268 -112" strokeWidth="1.4" strokeDasharray="3 9" opacity="0.8" />
      </g>
      <circle cx="266" cy="-122" r="7" fill="#cfd5e2" stroke={VOY.dishEdge} strokeWidth="1.5" />

      {/* power boom with three generators */}
      <path d="M-56 104 L-186 168" stroke={VOY.boom} strokeWidth="5" strokeLinecap="round" />
      {[0, 1, 2].map((i) => {
        const t = 0.32 + i * 0.25;
        const px = -56 + (-186 + 56) * t;
        const py = 104 + (168 - 104) * t;
        return (
          <g key={i} transform={`translate(${px} ${py}) rotate(26)`}>
            {glowRtg && <Glow cx={0} cy={0} r={30} color="#ff9a5a" opacity={0.35} />}
            <rect x="-17" y="-12" width="34" height="24" rx="5" fill={VOY.rtg} />
            {[-11, -4, 3, 10].map((fx) => (
              <rect key={fx} x={fx} y="-17" width="3" height="34" rx="1.5" fill={VOY.rtgFin} />
            ))}
          </g>
        );
      })}

      {/* science boom with the camera platform */}
      <path d="M54 108 L156 160" stroke={VOY.boom} strokeWidth="5" strokeLinecap="round" />
      <g transform="translate(166 166) rotate(-12)">
        <rect x="-22" y="-16" width="40" height="30" rx="5" fill="#d9dee9" stroke={VOY.dishEdge} strokeWidth="1.5" />
        <rect x="16" y="-12" width="22" height="11" rx="3" fill="#525a6e" />
        <rect x="16" y="2" width="16" height="9" rx="3" fill="#525a6e" />
        <circle cx="39" cy="-6.5" r="4" fill="#9fd6ff" />
      </g>

      {/* the ten-sided body */}
      <path d="M-74 66 L74 66 L64 118 L-64 118Z" fill={`url(#${u}-bus)`} stroke={VOY.busDark} strokeWidth="2" />
      <path d="M-74 66 L74 66 L70 80 L-70 80Z" fill="#000" opacity="0.18" />
      {[-40, -14, 14, 40].map((bx) => (
        <path key={bx} d={`M${bx} 82 L${bx * 0.92} 116`} stroke={VOY.busDark} strokeWidth="1.5" opacity="0.6" />
      ))}
      {Array.from({ length: 3 }, (_, i) => (
        <circle key={i} cx={22 + i * 12} cy="104" r="3" fill={i < lights ? "#7dffb0" : "#2c3344"} className={i < lights ? "anim glowpulse" : undefined} style={{ animationDelay: `${i * 0.3}s` }} />
      ))}

      {/* the golden record on the side */}
      {record && (
        <g transform="translate(-40 96)">
          <circle r="17" fill={`url(#${u}-rec)`} stroke={VOY.goldDark} strokeWidth="1.5" />
          {[13, 10, 7].map((rr) => (
            <circle key={rr} r={rr} fill="none" stroke={VOY.goldDark} strokeWidth="0.8" opacity="0.6" />
          ))}
          <circle r="3" fill={VOY.goldDark} />
          <path d="M-9 -9 l3 3" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" className="anim glint" />
        </g>
      )}

      {/* mast holding the dish */}
      <path d="M-10 66 L-6 52 L6 52 L10 66Z" fill={VOY.boom} />

      {/* the high-gain dish, which is also a face */}
      <ellipse cx="0" cy="6" rx="112" ry="70" fill={VOY.dishShade} />
      <ellipse cx="0" cy="0" rx="112" ry="104" fill={`url(#${u}-dish)`} stroke={VOY.dishEdge} strokeWidth="3" />
      <ellipse cx="0" cy="0" rx="98" ry="90" fill="none" stroke="#dde3ef" strokeWidth="2" />
      {/* struts to the little feed in the middle */}
      <g stroke={VOY.dishEdge} strokeWidth="2" opacity="0.55">
        <path d="M-80 -64 L0 -4 M80 -64 L0 -4 M0 102 L0 6" />
      </g>
      <circle cx="0" cy="-4" r="11" fill="#e7ebf4" stroke={VOY.dishEdge} strokeWidth="2" />
      <circle cx="0" cy="-4" r="4" fill={VOY.dishEdge} />
      <ellipse cx="-62" cy="18" rx="13" ry="8" fill={VOY.blush} opacity="0.55" />
      <ellipse cx="62" cy="18" rx="13" ry="8" fill={VOY.blush} opacity="0.55" />
      <Eyes eyes={eyes} />
      <Mouth eyes={eyes} />

      {/* a sleepy nightcap */}
      {cap && (
        <g transform="translate(36 -96) rotate(18)">
          <path d="M-44 10 Q-36 -48 30 -66 Q66 -70 82 -40 Q50 -48 34 -20 Q22 2 30 16Z" fill="#5d7fd6" />
          <path d="M-48 8 Q-6 -2 36 16 L34 28 Q-6 12 -50 22Z" fill="#f4f6fb" />
          <circle cx="86" cy="-36" r="12" fill="#f4f6fb" />
          <g fill="#ffe08a">
            <circle cx="-14" cy="-22" r="3" />
            <circle cx="12" cy="-40" r="2.4" />
            <circle cx="40" cy="-50" r="2" />
          </g>
        </g>
      )}
    </g>
  );
}

/* ------------------------------------------------------------- sky and worlds */

/** A soft band of the Milky Way across the sky. */
export function MilkyWay({ seed = 3, y = 260, tilt = -18, opacity = 0.5 }) {
  const u = useUid();
  const r = rng(seed);
  return (
    <g transform={`rotate(${tilt} ${W / 2} ${y})`} opacity={opacity}>
      <defs>
        <linearGradient id={`${u}-mw`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7a8cff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#c7c2ff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#7a8cff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x={-200} y={y - 90} width={W + 400} height={180} fill={`url(#${u}-mw)`} />
      {Array.from({ length: 110 }, (_, i) => (
        <circle key={i} cx={-150 + r() * (W + 300)} cy={y + (r() - 0.5) * 120 * (0.4 + r())} r={0.4 + r() * 0.9} fill="#fff" opacity={0.3 + r() * 0.6} />
      ))}
    </g>
  );
}

/** The Sun seen from far away: a bright star with a soft halo and rays. */
export function FarSun({ cx, cy, r = 9, halo = 70, rays = true }) {
  return (
    <g>
      <Glow cx={cx} cy={cy} r={halo} color="#ffe8b0" opacity={0.6} />
      <Glow cx={cx} cy={cy} r={halo * 0.45} color="#fff6dc" opacity={0.85} />
      {rays && (
        <g stroke="#fff3cf" strokeLinecap="round" opacity="0.7">
          <path d={`M${cx - r * 5} ${cy} L${cx + r * 5} ${cy}`} strokeWidth="1.6" />
          <path d={`M${cx} ${cy - r * 5} L${cx} ${cy + r * 5}`} strokeWidth="1.6" />
        </g>
      )}
      <circle cx={cx} cy={cy} r={r} fill="#fffdf2" />
    </g>
  );
}

export function Jupiter({ cx, cy, r, ring = false, spot = true }) {
  const u = useUid();
  const ringPath = (front) => (
    <g clipPath={`url(#${u}-${front ? "rf" : "rb"})`}>
      <ellipse cx={cx} cy={cy} rx={r * 1.45} ry={r * 0.16} fill="none" stroke="#efe2cf" strokeWidth={Math.max(1.2, r * 0.01)} opacity="0.5" />
    </g>
  );
  const bands = [
    [-0.82, 0.1, "#cfa57a"],
    [-0.62, 0.12, "#f2dfc0"],
    [-0.42, 0.13, "#b97b4f"],
    [-0.22, 0.12, "#f6e7cc"],
    [-0.02, 0.15, "#d9a873"],
    [0.18, 0.12, "#a8653d"],
    [0.36, 0.13, "#f0d9b4"],
    [0.56, 0.12, "#c48a5c"],
    [0.74, 0.14, "#e9cfa8"],
  ];
  return (
    <g>
      <defs>
        <clipPath id={`${u}-c`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        <radialGradient id={`${u}-shade`} cx="0.35" cy="0.35" r="0.85">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#120a0a" stopOpacity="0.6" />
        </radialGradient>
        <clipPath id={`${u}-rb`}>
          <rect x={cx - r * 2} y={cy - r} width={r * 4} height={r} />
        </clipPath>
        <clipPath id={`${u}-rf`}>
          <rect x={cx - r * 2} y={cy} width={r * 4} height={r} />
        </clipPath>
      </defs>
      <Glow cx={cx} cy={cy} r={r * 1.25} color="#ffd9b0" opacity={0.25} />
      {ring && ringPath(false)}
      <circle cx={cx} cy={cy} r={r} fill="#ead2ad" />
      <g clipPath={`url(#${u}-c)`}>
        {bands.map(([o, h, c], i) => (
          <path
            key={i}
            d={`M${cx - r} ${cy + o * r} Q${cx - r * 0.4} ${cy + (o - 0.03) * r} ${cx} ${cy + o * r} T${cx + r} ${cy + o * r} L${cx + r} ${cy + (o + h) * r} Q${cx + r * 0.4} ${cy + (o + h + 0.03) * r} ${cx} ${cy + (o + h) * r} T${cx - r} ${cy + (o + h) * r}Z`}
            fill={c}
          />
        ))}
        <path d={`M${cx - r} ${cy + 0.05 * r} q${r * 0.25} ${-r * 0.05} ${r * 0.5} 0 t${r * 0.5} 0 t${r * 0.5} 0 t${r * 0.5} 0`} stroke="#fff4e0" strokeWidth={r * 0.02} fill="none" opacity="0.6" />
        {spot && (
          <g>
            <ellipse cx={cx + r * 0.28} cy={cy + r * 0.3} rx={r * 0.22} ry={r * 0.12} fill="#c9542c" />
            <ellipse cx={cx + r * 0.28} cy={cy + r * 0.3} rx={r * 0.14} ry={r * 0.07} fill="#e07a4a" />
            <path d={`M${cx + r * 0.06} ${cy + r * 0.3} q${r * 0.22} ${-r * 0.16} ${r * 0.44} 0`} stroke="#f6dcc0" strokeWidth={r * 0.02} fill="none" opacity="0.7" />
          </g>
        )}
        <ellipse cx={cx - r * 0.5} cy={cy - r * 0.38} rx={r * 0.08} ry={r * 0.04} fill="#fff6e6" opacity="0.8" />
        <ellipse cx={cx + r * 0.55} cy={cy - r * 0.2} rx={r * 0.06} ry={r * 0.03} fill="#fff6e6" opacity="0.7" />
        <circle cx={cx} cy={cy} r={r} fill={`url(#${u}-shade)`} />
      </g>
      {ring && ringPath(true)}
    </g>
  );
}

export function Saturn({ cx, cy, r, tilt = -14 }) {
  const u = useUid();
  const ring = (rx, ry, w, c, o) => <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={c} strokeWidth={w} opacity={o} />;
  return (
    <g transform={`rotate(${tilt} ${cx} ${cy})`}>
      <defs>
        <clipPath id={`${u}-back`}>
          <rect x={cx - r * 3} y={cy - r * 3} width={r * 6} height={r * 3} />
        </clipPath>
        <clipPath id={`${u}-front`}>
          <rect x={cx - r * 3} y={cy} width={r * 6} height={r * 3} />
        </clipPath>
        <clipPath id={`${u}-ball`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        <radialGradient id={`${u}-shade`} cx="0.35" cy="0.3" r="0.85">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#140e05" stopOpacity="0.55" />
        </radialGradient>
      </defs>
      <Glow cx={cx} cy={cy} r={r * 1.6} color="#ffe6b8" opacity={0.2} />
      <g clipPath={`url(#${u}-back)`}>
        {ring(r * 2.15, r * 0.52, r * 0.22, "#e8d3a6", 0.85)}
        {ring(r * 1.78, r * 0.43, r * 0.16, "#cdb586", 0.9)}
        {ring(r * 1.45, r * 0.35, r * 0.1, "#b49b70", 0.6)}
      </g>
      <circle cx={cx} cy={cy} r={r} fill="#ecd6a6" />
      <g clipPath={`url(#${u}-ball)`}>
        {[-0.7, -0.4, -0.12, 0.18, 0.46, 0.72].map((o, i) => (
          <rect key={i} x={cx - r} y={cy + o * r} width={r * 2} height={r * 0.14} fill={i % 2 ? "#d9bb84" : "#f4e3bd"} opacity="0.85" />
        ))}
        <circle cx={cx} cy={cy} r={r} fill={`url(#${u}-shade)`} />
        <ellipse cx={cx} cy={cy + r * 0.12} rx={r * 1.2} ry={r * 0.16} fill="#1a1206" opacity="0.25" />
      </g>
      <g clipPath={`url(#${u}-front)`}>
        {ring(r * 2.15, r * 0.52, r * 0.22, "#f2e0b8", 0.95)}
        {ring(r * 1.78, r * 0.43, r * 0.16, "#d9c193", 0.95)}
        {ring(r * 1.45, r * 0.35, r * 0.1, "#bba277", 0.7)}
        {ring(r * 1.96, r * 0.475, r * 0.015, "#3a2e1c", 0.5)}
      </g>
    </g>
  );
}

export function Io({ cx, cy, r, plume = false }) {
  const u = useUid();
  const spots = [
    [-0.4, -0.3, 0.12, "#3a1f12"],
    [0.2, -0.45, 0.08, "#c0391b"],
    [0.35, 0.15, 0.14, "#2b170f"],
    [-0.15, 0.35, 0.1, "#d85a24"],
    [-0.55, 0.2, 0.07, "#fff4d0"],
    [0.05, 0.02, 0.18, "#e9a23b"],
    [0.55, -0.25, 0.09, "#fff1c0"],
  ];
  return (
    <g>
      <defs>
        <radialGradient id={`${u}-io`} cx="0.38" cy="0.32" r="0.8">
          <stop offset="0" stopColor="#fff4b8" />
          <stop offset="0.55" stopColor="#f1cd5b" />
          <stop offset="1" stopColor="#a8752a" />
        </radialGradient>
        <clipPath id={`${u}-c`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        <radialGradient id={`${u}-p`} cx="0.5" cy="1" r="1">
          <stop offset="0" stopColor="#c9e6ff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#7fb8ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {plume && (
        <g className="anim breathe">
          <path d={`M${cx - r * 0.62} ${cy - r * 0.78} Q${cx - r * 0.95} ${cy - r * 1.65} ${cx - r * 0.25} ${cy - r * 1.72} Q${cx + r * 0.32} ${cy - r * 1.6} ${cx - r * 0.18} ${cy - r * 0.94}Z`} fill={`url(#${u}-p)`} />
          <path d={`M${cx - r * 0.5} ${cy - r * 0.86} Q${cx - r * 0.55} ${cy - r * 1.3} ${cx - r * 0.35} ${cy - r * 1.5}`} stroke="#eaf6ff" strokeWidth={r * 0.03} fill="none" opacity="0.8" />
        </g>
      )}
      <circle cx={cx} cy={cy} r={r} fill={`url(#${u}-io)`} />
      <g clipPath={`url(#${u}-c)`}>
        {spots.map(([dx, dy, rr, c], i) => (
          <ellipse key={i} cx={cx + dx * r} cy={cy + dy * r} rx={rr * r} ry={rr * r * 0.8} fill={c} opacity="0.85" />
        ))}
        <ellipse cx={cx + r * 0.7} cy={cy + r * 0.25} rx={r * 1.0} ry={r * 1.3} fill="#2a1406" opacity="0.35" />
      </g>
    </g>
  );
}

export function HazyMoon({ cx, cy, r, color = "#e3a14d" }) {
  const u = useUid();
  return (
    <g>
      <defs>
        <radialGradient id={`${u}-t`} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#ffd38a" />
          <stop offset="0.6" stopColor={color} />
          <stop offset="1" stopColor="#8a4d1c" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r * 1.18} fill="#f3b766" opacity="0.28" />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${u}-t)`} />
    </g>
  );
}

export function IceGiant({ cx, cy, r, color = "#8fe0e8", dark = "#3c8fa8" }) {
  const u = useUid();
  return (
    <g>
      <defs>
        <radialGradient id={`${u}-g`} cx="0.36" cy="0.32" r="0.8">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="0.3" stopColor={color} />
          <stop offset="1" stopColor={dark} />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${u}-g)`} />
    </g>
  );
}

export function SmallPlanet({ cx, cy, r, color, shade = "#1a1d2e" }) {
  const u = useUid();
  return (
    <g>
      <defs>
        <radialGradient id={`${u}-g`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.35" stopColor={color} />
          <stop offset="1" stopColor={shade} />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${u}-g)`} />
    </g>
  );
}

/** The Golden Record, seen from the front: gold grooves around a label. */
export function GoldenRecord({ cx, cy, r, spin = true }) {
  const u = useUid();
  return (
    <g>
      <defs>
        <radialGradient id={`${u}-g`} cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#fff4c4" />
          <stop offset="0.45" stopColor={VOY.gold} />
          <stop offset="1" stopColor={VOY.goldDark} />
        </radialGradient>
        <linearGradient id={`${u}-shine`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0.3" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="0.7" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <Glow cx={cx} cy={cy} r={r * 1.5} color="#ffd36b" opacity={0.35} className="anim breathe" />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${u}-g)`} stroke={VOY.goldDark} strokeWidth="3" />
      <g className={spin ? "anim spin-slow" : undefined} style={{ transformOrigin: `${cx}px ${cy}px`, animationDuration: "18s" }}>
        {Array.from({ length: 14 }, (_, i) => (
          <circle key={i} cx={cx} cy={cy} r={r * (0.38 + i * 0.043)} fill="none" stroke={VOY.goldDark} strokeWidth="1.2" opacity={0.35 + (i % 3) * 0.12} />
        ))}
        <path d={`M${cx - r * 0.9} ${cy - r * 0.2} A${r * 0.92} ${r * 0.92} 0 0 1 ${cx - r * 0.2} ${cy - r * 0.9}`} stroke="#fff6d6" strokeWidth={r * 0.05} fill="none" opacity="0.6" strokeLinecap="round" />
      </g>
      <circle cx={cx} cy={cy} r={r * 0.32} fill="#f6d77c" stroke={VOY.goldDark} strokeWidth="2" />
      {/* the drawings engraved on the cover: a pulsar map and a hydrogen atom */}
      <g stroke={VOY.goldDark} strokeWidth="1.4" fill="none" opacity="0.85">
        {[0, 23, 61, 97, 140, 188, 226, 262, 300, 333].map((a, i) => {
          const len = r * (0.12 + ((i * 37) % 10) / 70);
          const rad = (a * Math.PI) / 180;
          return <path key={a} d={`M${cx} ${cy} L${cx + Math.cos(rad) * len} ${cy + Math.sin(rad) * len}`} />;
        })}
        <circle cx={cx} cy={cy} r={r * 0.04} fill={VOY.goldDark} />
      </g>
      <circle cx={cx} cy={cy} r={r * 0.05} fill="#4a330c" />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${u}-shine)`} />
    </g>
  );
}

/** Rings of a radio signal travelling from (x, y) toward the bottom-left. */
export function SignalWaves({ x, y, count = 4, r = 40, color = "#9fdcff", rotate = 135 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      {Array.from({ length: count }, (_, i) => (
        <path
          key={i}
          d={`M${-r * 0.55} ${-r * (0.5 + i * 0.6)} Q0 ${-r * (0.75 + i * 0.6)} ${r * 0.55} ${-r * (0.5 + i * 0.6)}`}
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          className="anim beep"
          style={{ animationDelay: `${i * 0.25}s` }}
        />
      ))}
    </g>
  );
}

/** A wide dish antenna of the Deep Space Network, on its pedestal. */
export function BigDish({ x, y, s = 1, rotate = -32 }) {
  const u = useUid();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <linearGradient id={`${u}-d`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2f4f8" />
          <stop offset="1" stopColor="#b8bfcd" />
        </linearGradient>
      </defs>
      <path d="M-46 0 L-22 -96 L22 -96 L46 0Z" fill="#c7ccd8" />
      <path d="M-46 0 L-22 -96 L-10 -96 L-20 0Z" fill="#a5acbb" />
      <rect x="-60" y="-6" width="120" height="10" rx="3" fill="#8d94a6" />
      <g transform={`translate(0 -112) rotate(${rotate})`}>
        <path d="M-120 0 Q0 66 120 0 Q0 20 -120 0Z" fill="#a9b0c0" />
        <ellipse cx="0" cy="0" rx="120" ry="26" fill={`url(#${u}-d)`} stroke="#8d94a6" strokeWidth="2.5" />
        <path d="M-60 6 L0 -76 L60 6" stroke="#8d94a6" strokeWidth="3" fill="none" />
        <rect x="-9" y="-92" width="18" height="18" rx="3" fill="#dfe3ea" stroke="#8d94a6" strokeWidth="2" />
        <circle cx="0" cy="-83" r="4" fill="#9fdcff" className="anim glowpulse" />
      </g>
    </g>
  );
}
