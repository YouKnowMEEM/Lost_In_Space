import React from "react";
import { Earth, Glow, Sky, Stars, useUid, W, H } from "./common";
import { MARS_SKIES } from "./vikingParts";
import { MilkyWay, SPACE_SKIES } from "./voyagerParts";

/* Backdrops and small helpers shared by the eleven new storybooks. */

export const MOON_NIGHT = [
  [0, "#050820"],
  [0.55, "#121a4d"],
  [1, "#27306c"],
];

/** The black lunar sky with stars and, optionally, the Earth hanging in it. */
export function MoonSky({ seed = 1, bottom = 560, earth = null, stars = 80 }) {
  const u = useUid();
  return (
    <>
      <Sky id={`${u}-sky`} stops={MOON_NIGHT} />
      <Stars seed={seed} count={stars} bottom={bottom} />
      {earth && <Earth cx={earth[0]} cy={earth[1]} r={earth[2] || 30} />}
    </>
  );
}

export function MarsSky({ variant = "day", stars = 0, seed = 1 }) {
  const u = useUid();
  return (
    <>
      <Sky id={`${u}-sky`} stops={MARS_SKIES[variant]} />
      {stars > 0 && <Stars seed={seed} count={stars} bottom={460} color="#fff1e4" />}
    </>
  );
}

export function Space({ variant = "deep", stars = 100, seed = 1, milky = false, milkyY = 280 }) {
  const u = useUid();
  return (
    <>
      <Sky id={`${u}-sky`} stops={SPACE_SKIES[variant]} />
      {milky && <MilkyWay seed={seed + 5} y={milkyY} />}
      <Stars seed={seed} count={stars} bottom={H} color="#f4f7ff" />
    </>
  );
}

/** A small white sun with a soft halo. */
export function Sun({ cx, cy, r = 14, halo = "#fff3df", opacity = 0.65 }) {
  return (
    <g>
      <Glow cx={cx} cy={cy} r={r * 6} color={halo} opacity={opacity} />
      <circle cx={cx} cy={cy} r={r} fill="#fffaf0" />
    </g>
  );
}

/** A speech bubble that pops in. */
export function Bubble({ x, y, text, w = 140, ink = "#1b2340", paper = "#fffaf3", flip = false, size = 22 }) {
  return (
    <g className="anim pop" style={{ transformOrigin: `${x}px ${y + 50}px` }}>
      <g transform={`translate(${x - w / 2} ${y})`}>
        <rect width={w} height="50" rx="25" fill={paper} />
        <path d={flip ? `M${w - 24} 44 L${w - 16} 68 L${w - 46} 46Z` : "M24 44 L16 68 L46 46Z"} fill={paper} />
        <text x={w / 2} y="33" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontWeight="800" fontSize={size} fill={ink}>
          {text}
        </text>
      </g>
    </g>
  );
}

/** A handwritten label with an arrow, like a note in the margin of a picture book. */
export function Tag({ x, y, text, to = null, color = "#fff6dc", size = 19, anchor = "middle" }) {
  return (
    <g>
      {to && <path d={`M${x} ${y + 6} Q${(x + to[0]) / 2} ${y + 30} ${to[0]} ${to[1]}`} stroke={color} strokeWidth="2" fill="none" strokeDasharray="4 5" opacity="0.85" />}
      <text x={x} y={y} textAnchor={anchor} fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontWeight="700" fontSize={size} fill={color}>
        {text}
      </text>
    </g>
  );
}

/** A big friendly question mark that bobs. */
export function Question({ x, y, s = 1, color = "#ffe08a", delay = 0 }) {
  return (
    <g className="anim hover" style={{ animationDelay: `${delay}s` }}>
      <text x={x} y={y} textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontWeight="800" fontSize={60 * s} fill={color} stroke="#1a2150" strokeWidth={2.5 * s} paintOrder="stroke">
        ?
      </text>
    </g>
  );
}

/** A little twinkling sparkle. */
export function Sparkle({ x, y, s = 1, color = "#fff6c8", delay = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="anim sparkle" style={{ animationDelay: `${delay}s`, transformBox: "fill-box", transformOrigin: "center" }}>
        <path d="M0 -14 L3 -3 L14 0 L3 3 L0 14 L-3 3 L-14 0 L-3 -3Z" fill={color} />
      </g>
    </g>
  );
}

/** A photo frame floating in space (for pages about pictures sent home). */
export function PhotoCard({ x, y, w = 96, h = 72, rotate = 0, delay = 0, children }) {
  return (
    <g className="anim hover-soft" style={{ animationDelay: `${delay}s` }}>
      <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
        <rect x={-w / 2 - 6} y={-h / 2 - 6} width={w + 12} height={h + 22} rx="3" fill="#fffdf6" />
        <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#3b3f52" />
        <g clipPath={undefined}>{children}</g>
      </g>
    </g>
  );
}

export { W, H };
