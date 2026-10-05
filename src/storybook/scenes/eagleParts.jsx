import React from "react";
import { useUid, rng, W, H } from "./common";

/* Illustrated parts for the Eagle book. Coordinates are local: (0,0) is the ground
   point under the middle of each object, and negative y goes up. */

const C = {
  gold: "#f2b641",
  goldLight: "#ffd97e",
  goldDark: "#c1801d",
  goldDeep: "#8c5512",
  silver: "#e2e5ee",
  silverMid: "#b9bfce",
  silverDark: "#858ca2",
  ink: "#2a2e3d",
  window: "#18214a",
};

/* ------------------------------------------------------------- the Moon */

export function MoonGround({ y = 560, seed = 2, tone = "night", craters = true }) {
  const u = useUid();
  const r = rng(seed);
  const pal =
    tone === "day"
      ? ["#e3e4ea", "#c9cbd6", "#a9acbb", "#8b8ea1"]
      : ["#c9ccd9", "#a9adbf", "#878ba1", "#62667f"];
  const bumps = Array.from({ length: 7 }, (_, i) => y - 8 + (r() - 0.5) * 14 + (i === 3 ? -6 : 0));
  const d = `M0 ${bumps[0]} ${bumps
    .map((b, i) => `Q${(i + 0.5) * (W / 7)} ${b - 10} ${(i + 1) * (W / 7)} ${b}`)
    .join(" ")} L${W} ${H} L0 ${H}Z`;
  const holes = craters
    ? Array.from({ length: 6 }, () => ({
        x: 40 + r() * (W - 80),
        y: y + 40 + r() * (H - y - 70),
        rx: 18 + r() * 46,
      }))
    : [];
  return (
    <g>
      <defs>
        <linearGradient id={`${u}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={pal[0]} />
          <stop offset="0.45" stopColor={pal[1]} />
          <stop offset="1" stopColor={pal[2]} />
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#${u}-g)`} />
      <path d={`M0 ${y + 4} Q${W / 2} ${y - 18} ${W} ${y + 2}`} stroke="#ffffff" strokeOpacity="0.45" strokeWidth="2" fill="none" />
      {holes.map((h, i) => (
        <Crater key={i} cx={h.x} cy={h.y} rx={h.rx} pal={pal} />
      ))}
      {Array.from({ length: 26 }, (_, i) => (
        <circle key={i} cx={r() * W} cy={y + 20 + r() * (H - y - 20)} r={1 + r() * 2.4} fill={pal[3]} opacity={0.35 + r() * 0.3} />
      ))}
    </g>
  );
}

export function Crater({ cx, cy, rx, pal = ["#c9ccd9", "#a9adbf", "#878ba1", "#62667f"] }) {
  const ry = rx * 0.32;
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={pal[3]} opacity="0.55" />
      <ellipse cx={cx + rx * 0.06} cy={cy + ry * 0.12} rx={rx * 0.86} ry={ry * 0.74} fill={pal[2]} />
      <path d={`M${cx - rx} ${cy} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy}`} fill="none" stroke="#f4f5fa" strokeOpacity="0.6" strokeWidth="2" />
    </g>
  );
}

export function Boulder({ x, y, s = 1, fill = "#8b8fa3", light = "#c3c6d3" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="2" rx="30" ry="6" fill="#000" opacity="0.25" />
      <path d="M-30 0 L-26 -20 L-10 -34 L10 -32 L26 -18 L30 -2 Z" fill={fill} />
      <path d="M-26 -20 L-10 -34 L10 -32 L4 -18 L-12 -14Z" fill={light} />
      <path d="M4 -18 L26 -18 L30 -2 L8 0Z" fill="#000" opacity="0.18" />
    </g>
  );
}

/* ------------------------------------------------------------- Eagle */

function Leg({ side = 1, probes }) {
  // side: -1 left, 1 right
  const sx = (v) => v * side;
  return (
    <g>
      <path d={`M${sx(60)} -100 L${sx(128)} -42`} stroke={C.silverDark} strokeWidth="3.5" strokeLinecap="round" />
      <path d={`M${sx(78)} -116 L${sx(128)} -42`} stroke={C.silverMid} strokeWidth="3" strokeLinecap="round" />
      <path d={`M${sx(80)} -152 L${sx(118)} -70`} stroke={C.goldDark} strokeWidth="11" strokeLinecap="round" />
      <path d={`M${sx(80)} -152 L${sx(118)} -70`} stroke={C.gold} strokeWidth="6" strokeLinecap="round" />
      <path d={`M${sx(118)} -70 L${sx(148)} -10`} stroke={C.silverMid} strokeWidth="5.5" strokeLinecap="round" />
      {probes && <path d={`M${sx(150)} -4 L${sx(150)} 44`} stroke={C.silverDark} strokeWidth="2" />}
      <ellipse cx={sx(150)} cy="-5" rx="25" ry="7.5" fill={C.goldDark} />
      <ellipse cx={sx(150)} cy="-8" rx="23" ry="5.5" fill={C.goldLight} />
    </g>
  );
}

function Descent({ probes, flag = true }) {
  const u = useUid();
  return (
    <g>
      <defs>
        <linearGradient id={`${u}-foil`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={C.goldLight} />
          <stop offset="0.45" stopColor={C.gold} />
          <stop offset="1" stopColor={C.goldDark} />
        </linearGradient>
        <linearGradient id={`${u}-side`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={C.goldDeep} />
          <stop offset="1" stopColor={C.goldDark} />
        </linearGradient>
        <linearGradient id={`${u}-bell`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a4f63" />
          <stop offset="1" stopColor="#1d202b" />
        </linearGradient>
      </defs>
      <Leg side={-1} probes={probes} />
      <Leg side={1} probes={probes} />
      {/* engine bell */}
      <path d="M-24 -98 L24 -98 L33 -76 L-33 -76Z" fill={`url(#${u}-bell)`} />
      {/* body */}
      <path d="M-86 -160 L-56 -168 L-56 -96 L-82 -104Z" fill={`url(#${u}-side)`} />
      <path d="M86 -160 L56 -168 L56 -96 L82 -104Z" fill={`url(#${u}-side)`} />
      <rect x="-56" y="-168" width="112" height="72" fill={`url(#${u}-foil)`} />
      <path
        d="M-48 -150 l14 6 l10 -8 l16 9 l12 -6 l18 7 l14 -5 M-50 -122 l18 5 l9 -7 l20 8 l14 -4 l16 6 l12 -5 M-44 -106 l12 -4 l22 5 l18 -6 l20 4"
        stroke="#fff3c8"
        strokeOpacity="0.55"
        strokeWidth="1.6"
        fill="none"
      />
      <rect x="-86" y="-104" width="172" height="7" fill="#3a3a44" opacity="0.65" />
      <rect x="-56" y="-171" width="112" height="5" fill="#d9dce5" />
      {flag && (
        <g transform="translate(-78 -146) skewY(-14)">
          <rect width="18" height="12" fill="#fff" />
          {[0, 1, 2].map((i) => (
            <rect key={i} y={i * 4} width="18" height="2" fill="#d33a3a" />
          ))}
          <rect width="8" height="6" fill="#2b4aa8" />
        </g>
      )}
      {/* front leg, porch and ladder */}
      <path d="M0 -98 L0 -12" stroke={C.goldDark} strokeWidth="12" strokeLinecap="round" />
      <path d="M0 -98 L0 -12" stroke={C.gold} strokeWidth="6" strokeLinecap="round" />
      <g stroke="#e9ebf2" strokeWidth="2.6" strokeLinecap="round">
        <path d="M-12 -164 L-12 -18 M12 -164 L12 -18" />
        {Array.from({ length: 10 }, (_, i) => (
          <path key={i} d={`M-12 ${-152 + i * 14} L12 ${-152 + i * 14}`} />
        ))}
      </g>
      <rect x="-24" y="-172" width="48" height="6" rx="2" fill="#d4d7e2" />
      <path d="M-22 -172 L-22 -186 M22 -172 L22 -186 M-22 -184 L-12 -184 M22 -184 L12 -184" stroke="#d4d7e2" strokeWidth="2" />
      <ellipse cx="0" cy="6" rx="28" ry="8.5" fill={C.goldDark} />
      <ellipse cx="0" cy="3" rx="26" ry="6.5" fill={C.goldLight} />
    </g>
  );
}

function Window({ points, eyes, flip = 1 }) {
  const [a, b, c] = points;
  if (eyes === "closed") {
    return (
      <g>
        <polygon points={points.map((p) => p.join(",")).join(" ")} fill="#c9cedb" />
        <path
          d={`M${a[0] + 4 * flip} ${a[1] + 9} Q${(a[0] + b[0]) / 2} ${a[1] + 18} ${b[0] - 3 * flip} ${b[1] + 8}`}
          stroke={C.ink}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    );
  }
  return (
    <g>
      <polygon points={points.map((p) => p.join(",")).join(" ")} fill={C.window} stroke="#0d1230" strokeWidth="2" strokeLinejoin="round" />
      <path d={`M${a[0] + 7 * flip} ${a[1] + 5} L${a[0] + 15 * flip} ${a[1] + 5} L${a[0] + 11 * flip} ${a[1] + 11}Z`} fill="#bcd2ff" opacity="0.85" />
      <circle cx={(a[0] + b[0] + c[0]) / 3 + 3 * flip} cy={(a[1] + b[1] + c[1]) / 3 + 2} r="1.8" fill="#fff" opacity="0.8" />
    </g>
  );
}

export function Ascent({ eyes = "open" }) {
  const u = useUid();
  const left = [
    [-42, -244],
    [-11, -244],
    [-14, -218],
  ];
  const right = [
    [42, -244],
    [11, -244],
    [14, -218],
  ];
  return (
    <g>
      <defs>
        <linearGradient id={`${u}-hull`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3f5f9" />
          <stop offset="0.55" stopColor={C.silver} />
          <stop offset="1" stopColor={C.silverMid} />
        </linearGradient>
      </defs>
      {/* antennas behind the hull */}
      <path d="M-50 -276 L-70 -322" stroke={C.silverDark} strokeWidth="2.2" />
      <circle cx="-70" cy="-323" r="3.2" fill={C.silver} />
      <path d="M40 -272 L58 -298" stroke={C.silverDark} strokeWidth="3" />
      <ellipse cx="62" cy="-306" rx="15" ry="13" fill="#eef0f6" stroke={C.silverDark} strokeWidth="2" />
      <path d="M62 -306 L70 -314" stroke={C.ink} strokeWidth="2" />
      {/* RCS thruster quads */}
      {[-1, 1].map((s) => (
        <g key={s} transform={`translate(${s * 86} -230)`}>
          <rect x="-6" y="-6" width="12" height="12" fill={C.silverMid} />
          <path d={`M-4 -6 L4 -6 L2 -14 L-2 -14Z M-4 6 L4 6 L2 14 L-2 14Z M${s * 6} -4 L${s * 6} 4 L${s * 14} 2 L${s * 14} -2Z`} fill={C.goldDark} />
        </g>
      ))}
      {/* hull */}
      <path d="M-68 -168 L-84 -198 L-78 -244 L-52 -278 L52 -278 L78 -244 L84 -198 L68 -168Z" fill={`url(#${u}-hull)`} />
      <path d="M-68 -168 L-84 -198 L-78 -244 L-52 -278 L-40 -246 L-48 -204 L-42 -168Z" fill={C.silverMid} opacity="0.75" />
      <path d="M68 -168 L84 -198 L78 -244 L52 -278 L40 -246 L48 -204 L42 -168Z" fill={C.silverDark} opacity="0.55" />
      <path d="M-52 -278 L52 -278 L40 -248 L-40 -248Z" fill="#f7f8fb" />
      <path d="M-46 -248 L46 -248 L49 -214 L-49 -214Z" fill="#3b4052" />
      <Window points={left} eyes={eyes} flip={1} />
      <Window points={right} eyes={eyes} flip={-1} />
      {/* hatch */}
      <rect x="-16" y="-208" width="32" height="32" rx="4" fill="#cdd2de" stroke={C.silverDark} strokeWidth="2" />
      <path d="M-8 -192 L8 -192" stroke={C.ink} strokeWidth="2.5" strokeLinecap="round" />
      {/* docking tunnel and rendezvous radar */}
      <rect x="-15" y="-294" width="30" height="18" rx="3" fill="#d6dae5" stroke={C.silverDark} strokeWidth="1.5" />
      <rect x="-18" y="-298" width="36" height="6" rx="3" fill="#eef0f6" />
      <circle cx="-34" cy="-290" r="11" fill="#eef0f6" stroke={C.silverDark} strokeWidth="2" />
      <circle cx="-34" cy="-290" r="3.5" fill={C.ink} />
    </g>
  );
}

/**
 * Eagle, the Apollo 11 lunar module.
 * part: "full" | "descent" | "ascent"; eyes: "open" | "closed".
 */
export function EagleLM({ x = 0, y = 0, s = 1, part = "full", eyes = "open", probes = false, shadow = false, flag = true }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {shadow && <ellipse cx="0" cy="8" rx="190" ry="16" fill="#1c1f33" opacity="0.32" />}
      {part !== "ascent" && <Descent probes={probes} flag={flag} />}
      {part !== "descent" && <Ascent eyes={eyes} />}
    </g>
  );
}

/* ------------------------------------------------------------- Columbia */

export function Columbia({ x, y, s = 1, rotate = 0 }) {
  const u = useUid();
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
      <defs>
        <linearGradient id={`${u}-sm`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f6fa" />
          <stop offset="0.5" stopColor="#c9cfdc" />
          <stop offset="1" stopColor="#8d94a8" />
        </linearGradient>
      </defs>
      <path d="M-112 -14 L-150 -30 L-150 30 L-112 14Z" fill="#3b3f50" />
      <rect x="-112" y="-38" width="170" height="76" rx="4" fill={`url(#${u}-sm)`} />
      {[-90, -60, -30, 0, 30].map((px) => (
        <rect key={px} x={px} y="-38" width="12" height="76" fill="#ffffff" opacity="0.55" />
      ))}
      <path d="M58 -38 L118 -8 Q124 0 118 8 L58 38Z" fill="#eef1f7" stroke="#aab1c3" strokeWidth="1.5" />
      <path d="M58 -38 L118 -8 L118 0 L58 0Z" fill="#ffffff" opacity="0.6" />
      <rect x="118" y="-3" width="16" height="6" fill="#9ba2b6" />
      <rect x="64" y="-14" width="10" height="8" rx="2" fill="#1d2550" />
      <g transform="translate(-96 38)">
        <path d="M0 0 L-10 24" stroke="#9ba2b6" strokeWidth="2.5" />
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={-16 + (i % 2) * 12} cy={28 + Math.floor(i / 2) * 12} r="6" fill="#e6e9f1" stroke="#8d94a8" />
        ))}
      </g>
      {[-1, 1].map((sd) => (
        <g key={sd} transform={`translate(-20 ${sd * 40})`}>
          <rect x="-5" y={sd > 0 ? 0 : -8} width="10" height="8" fill="#b6bccb" />
          <path d={`M-6 ${sd * 6} L-14 ${sd * 6}`} stroke={C.goldDark} strokeWidth="3" />
        </g>
      ))}
    </g>
  );
}

/* ------------------------------------------------------------- Saturn V */

export function SaturnV({ x, y, s = 1 }) {
  const u = useUid();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <linearGradient id={`${u}-r`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c9cdd8" />
          <stop offset="0.35" stopColor="#ffffff" />
          <stop offset="1" stopColor="#aeb4c4" />
        </linearGradient>
      </defs>
      {/* fins and engines */}
      <path d="M-22 -40 L-40 0 L-22 -6Z M22 -40 L40 0 L22 -6Z" fill="#2c2f3b" />
      <rect x="-22" y="-8" width="44" height="10" fill="#4b4f60" />
      {/* first stage */}
      <rect x="-22" y="-190" width="44" height="184" fill={`url(#${u}-r)`} />
      <rect x="-22" y="-120" width="22" height="34" fill="#20232e" />
      <rect x="0" y="-86" width="22" height="34" fill="#20232e" />
      <rect x="-22" y="-190" width="44" height="12" fill="#20232e" />
      <text x="0" y="-150" textAnchor="middle" fontFamily="Jost, sans-serif" fontWeight="700" fontSize="10" fill="#2a2e3d" letterSpacing="1">
        USA
      </text>
      {/* second and third stages */}
      <rect x="-22" y="-282" width="44" height="92" fill={`url(#${u}-r)`} />
      <rect x="-22" y="-202" width="44" height="6" fill="#20232e" />
      <path d="M-22 -282 L-16 -296 L16 -296 L22 -282Z" fill="#d9dde6" />
      <rect x="-16" y="-352" width="32" height="56" fill={`url(#${u}-r)`} />
      <rect x="-16" y="-330" width="16" height="16" fill="#20232e" />
      {/* lunar module adapter, command module and escape tower */}
      <path d="M-16 -352 L-12 -386 L12 -386 L16 -352Z" fill="#eceff5" />
      <path d="M-12 -386 L-12 -402 L12 -402 L12 -386Z" fill="#f6f7fa" />
      <path d="M-12 -402 L0 -420 L12 -402Z" fill="#e9ecf2" />
      <path d="M0 -420 L0 -452" stroke="#b33" strokeWidth="3" />
      <path d="M-4 -446 L4 -446 L0 -462Z" fill="#c33" />
    </g>
  );
}

/* ------------------------------------------------------------- people and things */

export function Astronaut({ x, y, s = 1, pose = "stand", flip = false }) {
  const u = useUid();
  const legs = {
    stand: "M-9 -30 L-10 0 M9 -30 L10 0",
    walk: "M-8 -30 L-18 -2 M8 -30 L14 0",
    hop: "M-8 -30 L-16 -16 L-10 -4 M8 -30 L16 -16 L12 -4",
    ladder: "M-8 -30 L-9 -2 M8 -30 L14 -14",
  }[pose];
  const arms = {
    stand: "M-16 -62 L-26 -40 M16 -62 L26 -40",
    walk: "M-16 -62 L-28 -46 M16 -62 L24 -38",
    hop: "M-16 -62 L-30 -70 M16 -62 L30 -70",
    ladder: "M-16 -62 L-14 -86 M16 -62 L18 -86",
  }[pose];
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <defs>
        <linearGradient id={`${u}-visor`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="1" stopColor="#c47d14" />
        </linearGradient>
      </defs>
      <ellipse cx="0" cy="1" rx="24" ry="4" fill="#000" opacity="0.2" />
      <rect x="-20" y="-80" width="40" height="40" rx="8" fill="#cfd4df" />
      <path d={legs} stroke="#f4f5f8" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d={legs} stroke="#c9ceda" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.4" />
      <rect x="-17" y="-72" width="34" height="46" rx="12" fill="#f7f8fb" />
      <rect x="-9" y="-62" width="18" height="12" rx="2" fill="#d7dbe5" />
      <circle cx="-4" cy="-56" r="2" fill="#d14141" />
      <circle cx="3" cy="-56" r="2" fill="#2c58c4" />
      <path d={arms} stroke="#f4f5f8" strokeWidth="10" strokeLinecap="round" fill="none" />
      <circle cx="0" cy="-88" r="16" fill="#f7f8fb" />
      <path d="M-11 -94 Q0 -103 11 -94 L11 -84 Q0 -78 -11 -84Z" fill={`url(#${u}-visor)`} />
      <path d="M-7 -95 Q-2 -98 3 -96" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.8" fill="none" />
    </g>
  );
}

export function Flag({ x, y, s = 1, fallen = false }) {
  const stripes = Array.from({ length: 7 }, (_, i) => i);
  const cloth = (
    <g>
      <rect x="0" y="0" width="64" height="40" fill="#fff" />
      {stripes.map((i) => (
        <rect key={i} x="0" y={i * 5.8} width="64" height="2.9" fill="#d23b3b" />
      ))}
      <rect x="0" y="0" width="28" height="22" fill="#2a4aa6" />
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => <circle key={`${r}${c}`} cx={4 + c * 6.5} cy={4 + r * 6.5} r="1.1" fill="#fff" />)
      )}
      <path d="M10 2 Q12 20 9 38 M30 2 Q33 20 30 38 M50 2 Q52 20 49 38" stroke="#000" strokeOpacity="0.08" strokeWidth="5" />
    </g>
  );
  if (fallen) {
    return (
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <ellipse cx="34" cy="3" rx="46" ry="6" fill="#000" opacity="0.2" />
        <path d="M-8 0 L84 -4" stroke="#d6d9e3" strokeWidth="3" />
        <g transform="translate(8 -2) scale(1 0.32) skewX(-18)">{cloth}</g>
      </g>
    );
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="2" rx="12" ry="3" fill="#000" opacity="0.25" />
      <path d="M0 2 L0 -112" stroke="#dfe2ea" strokeWidth="3" />
      <path d="M0 -110 L66 -110" stroke="#dfe2ea" strokeWidth="2.5" />
      <g transform="translate(1 -109)">{cloth}</g>
    </g>
  );
}

export function Footprints({ points, s = 1, color = "#6f7389" }) {
  return (
    <g fill={color} opacity="0.55">
      {points.map(([x, y, a = 0], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
          <ellipse cx="0" cy="0" rx="4.5" ry="2.2" />
          <path d="M-3 -1 L-3 1 M-1 -1.6 L-1 1.6 M1 -1.6 L1 1.6 M3 -1 L3 1" stroke="#4d5168" strokeWidth="0.6" />
        </g>
      ))}
    </g>
  );
}

/** Science left on the Moon: the moonquake detector and the laser mirror. */
export function Seismometer({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="2" rx="40" ry="5" fill="#000" opacity="0.2" />
      <path d="M-46 -26 L-14 -20 L-14 -6 L-46 -12Z M46 -26 L14 -20 L14 -6 L46 -12Z" fill="#2e3c86" stroke="#9fb0ff" strokeWidth="1" />
      <rect x="-14" y="-26" width="28" height="26" rx="2" fill={C.gold} />
      <circle cx="0" cy="-30" r="5" fill="#e3e6ee" />
    </g>
  );
}

export function Retroreflector({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="2" rx="30" ry="5" fill="#000" opacity="0.2" />
      <path d="M-16 0 L-12 -12 M16 0 L12 -12" stroke="#c9cdd9" strokeWidth="2.5" />
      <g transform="translate(0 -20) skewX(-12)">
        <rect x="-24" y="-12" width="48" height="22" fill="#cfd3de" stroke="#8f96aa" />
        {Array.from({ length: 10 }, (_, i) => (
          <circle key={i} cx={-18 + (i % 5) * 9} cy={-6 + Math.floor(i / 5) * 9} r="3.3" fill="#2a3256" stroke="#9fb4ff" strokeWidth="0.8" />
        ))}
      </g>
    </g>
  );
}

/* ------------------------------------------------------------- close-ups */

export function Plaque({ x, y, s = 1 }) {
  const u = useUid();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <linearGradient id={`${u}-steel`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f8f9fb" />
          <stop offset="0.4" stopColor="#d3d7e0" />
          <stop offset="0.7" stopColor="#eef0f4" />
          <stop offset="1" stopColor="#b7bdca" />
        </linearGradient>
      </defs>
      <rect x="-150" y="-122" width="300" height="244" rx="10" fill="#7e8599" />
      <rect x="-146" y="-118" width="292" height="236" rx="8" fill={`url(#${u}-steel)`} />
      {[
        [-132, -104],
        [132, -104],
        [-132, 104],
        [132, 104],
      ].map(([cx, cy]) => (
        <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="4" fill="#9aa1b3" />
      ))}
      {[-62, 62].map((cx, i) => (
        <g key={cx} transform={`translate(${cx} -58)`}>
          <circle r="44" fill="none" stroke="#3a3f52" strokeWidth="2" />
          <ellipse rx="44" ry="15" fill="none" stroke="#3a3f52" strokeWidth="0.8" opacity="0.6" />
          <ellipse rx="18" ry="44" fill="none" stroke="#3a3f52" strokeWidth="0.8" opacity="0.6" />
          <path d="M-44 0 L44 0 M0 -44 L0 44" stroke="#3a3f52" strokeWidth="0.8" opacity="0.6" />
          <path
            d={
              i === 0
                ? "M-26 -26 C-10 -34 6 -24 2 -10 C-2 4 10 8 4 22 C-4 36 -20 26 -18 10 C-16 -4 -36 -8 -26 -26Z"
                : "M-30 -20 C-14 -30 18 -30 24 -14 C30 2 8 0 10 14 C12 30 -2 34 -8 22 C-14 10 -26 8 -24 -4Z"
            }
            fill="none"
            stroke="#3a3f52"
            strokeWidth="1.6"
          />
        </g>
      ))}
      <g fontFamily="Jost, Futura, sans-serif" fontWeight="500" fill="#262a38" textAnchor="middle" letterSpacing="0.6">
        <text y="16" fontSize="13">HERE MEN FROM THE PLANET EARTH</text>
        <text y="34" fontSize="13">FIRST SET FOOT UPON THE MOON</text>
        <text y="52" fontSize="13">JULY 1969, A.D.</text>
        <text y="74" fontSize="12.5">WE CAME IN PEACE FOR ALL MANKIND</text>
      </g>
      <g stroke="#3a3f52" strokeWidth="1.3" fill="none">
        <path d="M-120 98 q8 -10 14 0 t14 -2 t10 2" />
        <path d="M-56 98 q6 -12 12 -2 t16 0 t8 -4" />
        <path d="M14 98 q10 -8 14 0 t12 -4 t10 4" />
        <path d="M78 98 q8 -10 12 0 t14 -2 t12 0" />
      </g>
    </g>
  );
}

/** The Apollo Guidance Computer's display and keyboard (DSKY) with a program alarm. */
export function DSKY({ x, y, s = 1, code = "1202" }) {
  const keys = ["VERB", "+", "7", "8", "9", "CLR", "NOUN", "−", "4", "5", "6", "PRO", "", "0", "1", "2", "3", "KEY REL", "", "", "", "ENTR", "", "RSET"];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-150" y="-170" width="300" height="340" rx="12" fill="#6e7385" />
      <rect x="-142" y="-162" width="284" height="324" rx="8" fill="#9ea3b3" />
      {/* status lights */}
      <rect x="-132" y="-150" width="120" height="150" rx="4" fill="#545a6c" />
      {Array.from({ length: 12 }, (_, i) => {
        const prog = i === 5;
        return (
          <g key={i} className={prog ? "anim blink" : undefined}>
            <rect
              x={-126 + (i % 2) * 58}
              y={-144 + Math.floor(i / 2) * 24}
              width="52"
              height="18"
              rx="2"
              fill={prog ? "#ffc23d" : "#ded9c4"}
              opacity={prog ? 1 : 0.55}
            />
            {prog && (
              <text x={-126 + (i % 2) * 58 + 26} y={-144 + Math.floor(i / 2) * 24 + 13} textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="Jost, sans-serif" fill="#4a2c00">
                PROG
              </text>
            )}
          </g>
        );
      })}
      {/* number display */}
      <rect x="0" y="-150" width="132" height="150" rx="4" fill="#20252c" />
      <text x="66" y="-122" textAnchor="middle" fontSize="11" fontFamily="Jost, sans-serif" fill="#7dffa0" opacity="0.8">
        PROG ALARM
      </text>
      <text x="66" y="-70" textAnchor="middle" fontSize="44" fontFamily="'Courier New', monospace" fontWeight="700" fill="#62ff8c" className="anim glowpulse">
        {code}
      </text>
      <rect x="12" y="-44" width="108" height="3" fill="#62ff8c" opacity="0.35" />
      <rect x="12" y="-30" width="108" height="3" fill="#62ff8c" opacity="0.35" />
      {/* keyboard */}
      {keys.map((k, i) =>
        k ? (
          <g key={i} transform={`translate(${-128 + (i % 6) * 46} ${18 + Math.floor(i / 6) * 34})`}>
            <rect width="40" height="28" rx="4" fill="#3d4253" />
            <text x="20" y={k.length > 3 ? 18 : 19} textAnchor="middle" fontSize={k.length > 3 ? 7.5 : 12} fontFamily="Jost, sans-serif" fontWeight="600" fill="#f2f3f7">
              {k}
            </text>
          </g>
        ) : null
      )}
    </g>
  );
}

export function Breakers({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-210" y="-120" width="420" height="240" rx="10" fill="#8d93a5" />
      <rect x="-198" y="-108" width="396" height="216" rx="6" fill="#a7adbe" />
      {Array.from({ length: 4 }, (_, r) =>
        Array.from({ length: 9 }, (_, c) => {
          const broken = r === 1 && c === 5;
          const cx = -168 + c * 42;
          const cy = -70 + r * 48;
          return (
            <g key={`${r}-${c}`}>
              <rect x={cx - 15} y={cy + 14} width="30" height="8" rx="2" fill="#f1f2f6" opacity="0.7" />
              <circle cx={cx} cy={cy} r="11" fill="#2d313f" />
              {broken ? (
                <g>
                  <circle cx={cx} cy={cy} r="6" fill="#0d0f16" />
                  <circle cx={cx} cy={cy} r="15" fill="none" stroke="#ffcf5a" strokeWidth="3" strokeDasharray="4 4" className="anim spin-slow" style={{ transformOrigin: `${cx}px ${cy}px` }} />
                </g>
              ) : (
                <circle cx={cx - 3} cy={cy - 3} r="3.5" fill="#5a5f72" />
              )}
            </g>
          );
        })
      )}
      {/* the snapped-off knob lying below the panel */}
      <g transform="translate(150 150) rotate(30)">
        <rect x="-6" y="-12" width="12" height="20" rx="3" fill="#2d313f" />
        <rect x="-3" y="8" width="6" height="6" fill="#a7adbe" />
      </g>
    </g>
  );
}

export function FeltPen({ x, y, s = 1, rotate = -38 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
      <rect x="-14" y="-150" width="28" height="150" rx="8" fill="#2c3c8f" />
      <rect x="-14" y="-150" width="10" height="150" rx="5" fill="#4a5fc4" opacity="0.6" />
      <rect x="-15" y="-190" width="30" height="44" rx="6" fill="#d9dde6" />
      <rect x="12" y="-186" width="6" height="40" rx="3" fill="#b6bccb" />
      <path d="M-10 0 L10 0 L4 26 L-4 26Z" fill="#1a1d29" />
      <path d="M-3 26 L3 26 L1 38 L-1 38Z" fill="#11131b" />
    </g>
  );
}

export { C as EAGLE_COLORS };
