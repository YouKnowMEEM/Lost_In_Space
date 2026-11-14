import React from "react";
import { useUid, rng } from "./common";

/* The cast of the eleven new storybooks. Like the parts of the first three books, landers and
   rovers are drawn around (0,0) = the ground point under their middle (negative y goes up);
   spacecraft are drawn around their centre. Each machine has a friendly face so young
   readers can follow it from page to page. */

export const INK = "#1b2340";
const FOIL = "#e2b552";
const FOIL_DARK = "#a9781f";
const WHITE = "#f6f7fb";
const SHADE = "#c9cfdd";
const EDGE = "#8a93aa";
const CELL = "#2c4a9a";
const CELL_LIGHT = "#5f86d8";

/* ------------------------------------------------------------------ faces */

/**
 * Two eyes and a mouth. eyes: "open" | "closed" | "happy" | "wide" | "sleepy" | "side" | "up".
 * (x, y) is the point between the eyes; `gap` is the distance between them.
 */
export function Face({ x = 0, y = 0, s = 1, eyes = "open", gap = 26, lid = WHITE, mouth = true, blush = true }) {
  const half = gap / 2;
  const xs = [-half, half];
  let eyesEl;
  if (eyes === "closed") {
    eyesEl = (
      <g stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round">
        {xs.map((ex) => (
          <g key={ex}>
            <path d={`M${ex - 8} 0 Q${ex} 7 ${ex + 8} 0`} />
            <path d={`M${ex - 6} 3.5 l-3 4 M${ex + 6} 3.5 l3 4`} strokeWidth="1.8" />
          </g>
        ))}
      </g>
    );
  } else if (eyes === "happy") {
    eyesEl = (
      <g stroke={INK} strokeWidth="3.4" fill="none" strokeLinecap="round">
        {xs.map((ex) => (
          <path key={ex} d={`M${ex - 8} 3 Q${ex} -8 ${ex + 8} 3`} />
        ))}
      </g>
    );
  } else {
    const big = eyes === "wide";
    const look = eyes === "side" ? 3 : 0;
    const lookY = eyes === "up" ? -3 : 0;
    eyesEl = xs.map((ex) => (
      <g key={ex}>
        <ellipse cx={ex} cy="0" rx={big ? 9.5 : 8.5} ry={big ? 11 : 10} fill="#fff" stroke={INK} strokeWidth="2.2" />
        <ellipse cx={ex + look} cy={1 + lookY} rx={big ? 5.2 : 4.8} ry={big ? 6.4 : 6} fill={INK} />
        <circle cx={ex + look + 1.8} cy={-1.6 + lookY} r="1.8" fill="#fff" />
        {eyes === "sleepy" && <path d={`M${ex - 9.5} -1 Q${ex} -14 ${ex + 9.5} -1Z`} fill={lid} stroke={INK} strokeWidth="2.2" />}
      </g>
    ));
  }
  const my = 15;
  let mouthEl = null;
  if (mouth) {
    if (eyes === "wide") mouthEl = <ellipse cx="0" cy={my + 2} rx="4.5" ry="5.5" fill={INK} />;
    else if (eyes === "closed" || eyes === "sleepy") mouthEl = <ellipse cx="0" cy={my} rx="3.2" ry="2.6" fill={INK} opacity="0.85" />;
    else mouthEl = <path d={`M-7 ${my - 2} Q0 ${my + 6} 7 ${my - 2}`} stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />;
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {blush && eyes !== "wide" && (
        <g fill="#ff9db0" opacity="0.5">
          <ellipse cx={-half - 7} cy="11" rx="5" ry="3" />
          <ellipse cx={half + 7} cy="11" rx="5" ry="3" />
        </g>
      )}
      {eyesEl}
      {mouthEl}
    </g>
  );
}

function SolarPanel({ x, y, w, h, cols = 4, rows = 2, dusty = 0, rotate = 0, frost = false }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="2" fill={CELL} stroke="#dfe6fa" strokeWidth="1.5" />
      {Array.from({ length: cols - 1 }, (_, i) => (
        <path key={`c${i}`} d={`M${-w / 2 + ((i + 1) * w) / cols} ${-h / 2} V${h / 2}`} stroke={CELL_LIGHT} strokeWidth="1" />
      ))}
      {Array.from({ length: rows - 1 }, (_, i) => (
        <path key={`r${i}`} d={`M${-w / 2} ${-h / 2 + ((i + 1) * h) / rows} H${w / 2}`} stroke={CELL_LIGHT} strokeWidth="1" />
      ))}
      <path d={`M${-w / 2 + 3} ${-h / 2 + 3} L${-w / 2 + w * 0.35} ${-h / 2 + 3}`} stroke="#fff" strokeOpacity="0.35" strokeWidth="2" />
      {dusty > 0 && <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="2" fill="#c98a5e" opacity={dusty} />}
      {frost && <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="2" fill="#eef6ff" opacity="0.7" />}
    </g>
  );
}

/* ------------------------------------------------------------------ Moon machines */

/**
 * A Surveyor lander: three legs, a mast with a solar panel and a flat antenna, a box with a
 * face, and a TV camera looking into a mirror. arm: "stowed" | "out". retro: the big braking
 * rocket still attached (for the landing pages).
 */
export function SurveyorLander({ x = 0, y = 0, s = 1, eyes = "open", arm = "stowed", camera = true, retro = false, shadow = true, firing = false }) {
  const u = useUid();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <linearGradient id={`${u}-b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor={SHADE} />
        </linearGradient>
      </defs>
      {shadow && <ellipse cx="4" cy="4" rx="150" ry="13" fill="#000" opacity="0.25" />}
      {/* back leg */}
      <path d="M0 -106 L8 -24" stroke={EDGE} strokeWidth="5" />
      <ellipse cx="9" cy="-20" rx="14" ry="4.5" fill={SHADE} />
      {/* mast, solar panel and planar antenna */}
      <path d="M0 -150 L0 -262" stroke={EDGE} strokeWidth="5" />
      <SolarPanel x={-36} y={-262} w={78} h={44} cols={5} rows={3} rotate={-14} />
      <g transform="translate(40 -248) rotate(18)">
        <rect x="-24" y="-20" width="48" height="40" rx="3" fill="#dfe3ec" stroke={EDGE} strokeWidth="1.5" />
        <path d="M-24 -6 H24 M-24 7 H24 M-8 -20 V20 M8 -20 V20" stroke={EDGE} strokeWidth="1" />
      </g>
      {/* triangular frame */}
      <path d="M-46 -108 L46 -108 L0 -150Z" fill="none" stroke={EDGE} strokeWidth="4" strokeLinejoin="round" />
      {/* side legs and footpads */}
      <path d="M-40 -108 L-118 -12 M40 -108 L118 -12" stroke="#dfe3ec" strokeWidth="7" strokeLinecap="round" />
      <path d="M-30 -120 L-100 -30 M30 -120 L100 -30" stroke={EDGE} strokeWidth="2.5" />
      <ellipse cx="-122" cy="-7" rx="20" ry="6.5" fill="#eef0f6" stroke={EDGE} strokeWidth="1.5" />
      <ellipse cx="122" cy="-7" rx="20" ry="6.5" fill="#eef0f6" stroke={EDGE} strokeWidth="1.5" />
      {/* little steering engines */}
      {[-30, 30].map((vx) => (
        <path key={vx} d={`M${vx - 6} -104 L${vx + 6} -104 L${vx + 9} -88 L${vx - 9} -88Z`} fill="#6b7287" />
      ))}
      {retro && (
        <g>
          <circle cx="0" cy="-74" r="34" fill="#d9dce6" stroke={EDGE} strokeWidth="2" />
          <path d="M-14 -42 L14 -42 L20 -24 L-20 -24Z" fill="#5b6276" />
          {firing && (
            <g className="anim flame">
              <path d="M-20 -24 Q-26 30 0 92 Q26 30 20 -24Z" fill="#ffd36b" opacity="0.85" />
              <path d="M-9 -24 Q-11 10 0 40 Q11 10 9 -24Z" fill="#fffbe8" />
            </g>
          )}
        </g>
      )}
      {/* the body with its face */}
      <rect x="-40" y="-170" width="80" height="54" rx="10" fill={`url(#${u}-b)`} stroke={EDGE} strokeWidth="2" />
      <rect x="-40" y="-128" width="80" height="12" rx="4" fill={FOIL} opacity="0.9" />
      <Face x={0} y={-150} s={0.95} eyes={eyes} gap={30} />
      {/* TV camera with its mirror hood */}
      {camera && (
        <g transform="translate(58 -150) rotate(-12)">
          <rect x="-9" y="-6" width="18" height="44" rx="4" fill="#e9ecf3" stroke={EDGE} strokeWidth="1.5" />
          <path d="M-12 -6 Q0 -26 12 -6Z" fill="#cfd4e0" stroke={EDGE} strokeWidth="1.5" />
          <ellipse cx="0" cy="-8" rx="6" ry="4" fill="#3d4766" />
        </g>
      )}
      {/* the folding arm with its scoop */}
      {arm === "out" ? (
        <g stroke="#b9bfce" strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M-36 -128 L-96 -84 L-142 -24" />
          <path d="M-156 -26 L-130 -26 L-134 -10 L-152 -10Z" fill="#9aa1b5" stroke="#6b7287" strokeWidth="2" />
        </g>
      ) : (
        <path d="M-36 -126 L-64 -112 L-58 -96" stroke="#b9bfce" strokeWidth="5" strokeLinecap="round" fill="none" />
      )}
    </g>
  );
}

/** An astronaut sitting on a seat, seen from the side, for the Moon buggy. */
function Rider({ x, y, s = 1, wave = false }) {
  const u = useUid();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <linearGradient id={`${u}-v`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="1" stopColor="#c47d14" />
        </linearGradient>
      </defs>
      <rect x="-26" y="-58" width="16" height="36" rx="6" fill="#cfd4df" />
      <path d="M-6 -12 L22 -12 L24 12" stroke="#f4f5f8" strokeWidth="12" strokeLinecap="round" fill="none" />
      <rect x="-16" y="-56" width="28" height="46" rx="11" fill="#f7f8fb" />
      <path d={wave ? "M6 -46 L22 -70" : "M6 -44 L24 -30"} stroke="#f4f5f8" strokeWidth="9" strokeLinecap="round" fill="none" />
      <circle cx="0" cy="-70" r="14" fill="#f7f8fb" />
      <path d="M0 -78 Q12 -78 13 -70 Q12 -62 0 -62Z" fill={`url(#${u}-v)`} />
    </g>
  );
}

/**
 * The Lunar Roving Vehicle, side view, facing right. riders: 0, 1 or 2 astronauts.
 */
export function MoonBuggy({ x = 0, y = 0, s = 1, eyes = "open", riders = 0, dusty = false, shadow = true, roll = false }) {
  const wheel = (cx, far) => (
    <g key={`${cx}-${far}`} transform={`translate(${cx} -32)`} opacity={far ? 0.7 : 1}>
      <g className={roll ? "anim spin-slow" : undefined}>
        <circle r="32" fill="#8d8a7e" />
        <circle r="32" fill="none" stroke="#c9c3ae" strokeWidth="5" strokeDasharray="6 5" />
        <circle r="24" fill="none" stroke="#6c695f" strokeWidth="2" />
        {[0, 45, 90, 135].map((a) => (
          <path key={a} d="M-22 0 H22" stroke="#bdb7a3" strokeWidth="1.6" transform={`rotate(${a})`} />
        ))}
        <circle r="7" fill="#d6d9e2" stroke="#6c695f" strokeWidth="1.5" />
      </g>
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {shadow && <ellipse cx="0" cy="2" rx="170" ry="11" fill="#000" opacity="0.25" />}
      {wheel(-96 + 12, true)}
      {wheel(96 + 12, true)}
      {/* antenna mast with the umbrella dish, and the TV camera */}
      <path d="M118 -74 L118 -168" stroke={EDGE} strokeWidth="4" />
      <g transform="translate(118 -172) rotate(-30)">
        <path d="M-30 0 Q0 22 30 0Z" fill="#d9b357" opacity="0.85" />
        <ellipse cx="0" cy="0" rx="30" ry="8" fill="#f1d58a" stroke="#a9781f" strokeWidth="1.5" />
        <path d="M0 0 L0 -14" stroke={EDGE} strokeWidth="2" />
      </g>
      <path d="M100 -74 L102 -130" stroke={EDGE} strokeWidth="2.5" />
      <path d="M96 -130 q6 -4 12 0 q-6 4 -12 0 m0 -8 q6 -4 12 0 q-6 4 -12 0 m0 -8 q6 -4 12 0" stroke={EDGE} strokeWidth="2" fill="none" />
      <g transform="translate(140 -96)">
        <rect x="-10" y="-10" width="24" height="18" rx="3" fill="#e9ecf3" stroke={EDGE} strokeWidth="1.5" />
        <circle cx="16" cy="-1" r="5" fill="#3d4766" stroke={EDGE} strokeWidth="1.5" />
      </g>
      {/* chassis and fenders */}
      <rect x="-150" y="-80" width="292" height="16" rx="5" fill="#b8bdca" stroke={EDGE} strokeWidth="1.5" />
      <rect x="-150" y="-72" width="292" height="5" fill="#7f879c" />
      {[-96, 96].map((cx) => (
        <path key={cx} d={`M${cx - 40} -64 Q${cx} -98 ${cx + 40} -64`} fill="none" stroke="#7da0d6" strokeWidth="7" strokeLinecap="round" />
      ))}
      {/* tool carrier at the back */}
      <rect x="-150" y="-112" width="40" height="34" rx="4" fill="#d6d9e2" stroke={EDGE} strokeWidth="1.5" />
      <path d="M-140 -112 L-136 -146 M-124 -112 L-118 -140" stroke="#8d95ab" strokeWidth="3" strokeLinecap="round" />
      {/* seats */}
      {[-58, 10].map((sx) => (
        <g key={sx}>
          <path d={`M${sx} -82 L${sx + 40} -82 M${sx} -82 L${sx - 6} -122`} stroke="#5b79c4" strokeWidth="6" strokeLinecap="round" />
        </g>
      ))}
      {riders >= 1 && <Rider x={-34} y={-82} s={1} />}
      {riders >= 2 && <Rider x={34} y={-82} s={1} wave />}
      {/* control console with the face */}
      <path d="M70 -80 L76 -108" stroke={EDGE} strokeWidth="4" />
      <rect x="52" y="-148" width="56" height="44" rx="9" fill={WHITE} stroke={EDGE} strokeWidth="2" />
      <rect x="52" y="-114" width="56" height="10" rx="4" fill="#3d4766" />
      <Face x={80} y={-132} s={0.75} eyes={eyes} gap={26} />
      {/* near wheels */}
      {wheel(-96, false)}
      {wheel(96, false)}
      {dusty && <rect x="-150" y="-150" width="300" height="150" fill="#9a9db0" opacity="0.18" />}
    </g>
  );
}

/** Apollo's science station: the central box with its sunshade and Earth-pointing antenna. */
export function ScienceStation({ x = 0, y = 0, s = 1, eyes = "open", shadow = true, beam = false }) {
  const u = useUid();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <linearGradient id={`${u}-b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor={SHADE} />
        </linearGradient>
      </defs>
      {shadow && <ellipse cx="0" cy="3" rx="90" ry="9" fill="#000" opacity="0.22" />}
      {/* antenna: a twisted helix on a pole, aimed at Earth */}
      <path d="M38 -86 L48 -150" stroke={EDGE} strokeWidth="3.5" />
      <g transform="translate(50 -164) rotate(-28)">
        <rect x="-7" y="-46" width="14" height="52" rx="4" fill="#eef0f6" stroke={EDGE} strokeWidth="1.5" />
        {Array.from({ length: 7 }, (_, i) => (
          <path key={i} d={`M-7 ${-40 + i * 7} L7 ${-36 + i * 7}`} stroke="#a9781f" strokeWidth="1.6" />
        ))}
      </g>
      {beam && (
        <g className="anim waves" stroke="#9fdcff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8">
          <path d="M70 -214 q14 -6 22 4" />
          <path d="M78 -230 q22 -10 36 6" />
          <path d="M86 -246 q30 -14 50 8" />
        </g>
      )}
      {/* sunshade on four posts */}
      <path d="M-46 -86 L-46 -52 M46 -86 L46 -52 M-30 -86 L-30 -52 M30 -86 L30 -52" stroke={EDGE} strokeWidth="2.5" />
      <rect x="-60" y="-94" width="120" height="10" rx="3" fill="#e8eaf1" stroke={EDGE} strokeWidth="1.5" />
      {/* the box */}
      <rect x="-48" y="-56" width="96" height="54" rx="7" fill={`url(#${u}-b)`} stroke={EDGE} strokeWidth="2" />
      <rect x="-48" y="-14" width="96" height="12" rx="3" fill={FOIL} />
      <Face x={0} y={-36} s={0.9} eyes={eyes} gap={30} />
    </g>
  );
}

/** The plutonium battery (RTG) that powered the science stations: a finned can with a warm glow. */
export function RTG({ x = 0, y = 0, s = 1, glow = true }) {
  const u = useUid();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <radialGradient id={`${u}-g`}>
          <stop offset="0" stopColor="#ffb36b" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffb36b" stopOpacity="0" />
        </radialGradient>
      </defs>
      {glow && <circle cx="0" cy="-30" r="60" fill={`url(#${u}-g)`} className="anim breathe" />}
      <ellipse cx="0" cy="2" rx="30" ry="5" fill="#000" opacity="0.22" />
      <path d="M-12 0 L-12 -10 M12 0 L12 -10" stroke="#6b7287" strokeWidth="3" />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${-26 + i * 7.4} -12 L${-26 + i * 7.4} -56`} stroke="#4d5468" strokeWidth="4" />
      ))}
      <rect x="-14" y="-60" width="28" height="52" rx="6" fill="#5b6276" stroke="#3a4052" strokeWidth="1.5" />
      <rect x="-10" y="-56" width="6" height="44" rx="3" fill="#8e95aa" opacity="0.6" />
    </g>
  );
}

/** The passive seismometer under its spread-out thermal skirt. */
export function MoonSeismometer({ x = 0, y = 0, s = 1, shake = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="46" ry="9" fill="#e4e1d6" stroke="#b9b29a" strokeWidth="1.5" />
      <ellipse cx="0" cy="-1" rx="32" ry="6" fill="#f2efe4" />
      <g className={shake ? "anim shake" : undefined}>
        <path d="M-14 -4 L-12 -30 Q0 -38 12 -30 L14 -4Z" fill="#d8dbe4" stroke={EDGE} strokeWidth="1.5" />
        <ellipse cx="0" cy="-31" rx="12" ry="4" fill="#eef0f6" stroke={EDGE} strokeWidth="1.2" />
      </g>
    </g>
  );
}

/** The magnetometer: three arms on a stand, a sensor at each tip. */
export function Magnetometer({ x = 0, y = 0, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="2" rx="40" ry="5" fill="#000" opacity="0.2" />
      <path d="M0 0 L0 -40 M0 -40 L-38 -30 M0 -40 L38 -30 M0 -40 L0 -78" stroke="#b9bfce" strokeWidth="4" strokeLinecap="round" />
      {[[-38, -30], [38, -30], [0, -78]].map(([cx, cy]) => (
        <rect key={`${cx}${cy}`} x={cx - 7} y={cy - 7} width="14" height="14" rx="4" fill={FOIL} stroke={FOIL_DARK} strokeWidth="1.2" />
      ))}
      <rect x="-8" y="-46" width="16" height="12" rx="3" fill="#e8eaf1" stroke={EDGE} strokeWidth="1.2" />
    </g>
  );
}

/** A cable lying on the dust between two points. */
export function Cable({ from, to, sag = 10 }) {
  const mx = (from[0] + to[0]) / 2;
  const my = (from[1] + to[1]) / 2 + sag;
  return <path d={`M${from[0]} ${from[1]} Q${mx} ${my} ${to[0]} ${to[1]}`} stroke="#d8c88e" strokeWidth="2.2" fill="none" opacity="0.9" />;
}

/* ------------------------------------------------------------------ Mars machines */

/** Mars Pathfinder's lander after landing: three open solar petals, airbags, a camera head on a mast. */
export function PathfinderLander({ x = 0, y = 0, s = 1, eyes = "open", dusty = false, shadow = true }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {shadow && <ellipse cx="0" cy="6" rx="190" ry="16" fill="#2a0f08" opacity="0.25" />}
      {/* deflated airbags */}
      {[-160, -118, 118, 160].map((ax, i) => (
        <path key={ax} d={`M${ax - 26} 0 Q${ax - 20} -26 ${ax} -20 Q${ax + 18} -32 ${ax + 28} -2Z`} fill="#efe6d6" stroke="#c9b9a0" strokeWidth="1.5" opacity={0.95 - i * 0.05} />
      ))}
      {/* petals */}
      <path d="M-34 -16 L-150 -6 L-140 6 L-30 0Z" fill={CELL} stroke="#dfe6fa" strokeWidth="1.5" />
      <path d="M34 -16 L150 -6 L140 6 L30 0Z" fill={CELL} stroke="#dfe6fa" strokeWidth="1.5" />
      <path d="M-40 2 L40 2 L58 30 L-58 30Z" fill={CELL} stroke="#dfe6fa" strokeWidth="1.5" />
      <path d="M-90 -10 L-86 2 M90 -10 L86 2 M-20 2 L-28 30 M20 2 L28 30 M0 2 L0 30" stroke={CELL_LIGHT} strokeWidth="1" />
      {dusty && <path d="M-150 -6 L150 -6 L58 30 L-58 30Z" fill="#c98a5e" opacity="0.35" />}
      {/* ramps */}
      <path d="M-14 30 L-30 58 M14 30 L30 58" stroke="#c9c2b6" strokeWidth="4" strokeLinecap="round" />
      {/* base */}
      <path d="M-34 -16 L34 -16 L40 2 L-40 2Z" fill={FOIL} stroke={FOIL_DARK} strokeWidth="1.5" />
      {/* mast and camera head */}
      <path d="M0 -16 L0 -120" stroke={EDGE} strokeWidth="5" />
      <path d="M-6 -60 L6 -60 M-6 -90 L6 -90" stroke={EDGE} strokeWidth="2" />
      <rect x="-30" y="-150" width="60" height="32" rx="10" fill={WHITE} stroke={EDGE} strokeWidth="2" />
      <Face x={0} y={-136} s={0.8} eyes={eyes} gap={28} mouth={false} />
      <path d="M-8 -150 L-8 -160 M8 -150 L8 -160" stroke={EDGE} strokeWidth="2" />
      {/* small antenna */}
      <path d="M26 -16 L36 -64" stroke={EDGE} strokeWidth="2.5" />
      <circle cx="37" cy="-67" r="5" fill="#e8eaf1" stroke={EDGE} strokeWidth="1.5" />
    </g>
  );
}

/** The airbag ball Pathfinder (and Spirit and Opportunity) bounced across Mars inside. */
export function AirbagBall({ x = 0, y = 0, s = 1, className = "anim hop" }) {
  const r = rng(7);
  return (
    <g className={className}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        {Array.from({ length: 11 }, (_, i) => {
          const a = (i / 11) * Math.PI * 2;
          return <circle key={i} cx={Math.cos(a) * 42} cy={Math.sin(a) * 42} r={26 + r() * 6} fill="#f4ecdd" stroke="#cbbca4" strokeWidth="1.5" />;
        })}
        <circle r="44" fill="#f7f0e3" />
        <path d="M-30 -18 Q0 -34 30 -18" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.7" fill="none" />
      </g>
    </g>
  );
}

/** Sojourner, the microwave-oven-sized first Mars rover. Facing right. */
export function Sojourner({ x = 0, y = 0, s = 1, eyes = "open", dusty = false, shadow = true, roll = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {shadow && <ellipse cx="0" cy="2" rx="62" ry="6" fill="#2a0f08" opacity="0.28" />}
      {/* rocker-bogie legs */}
      <path d="M-40 -14 L-20 -34 L2 -14 M2 -14 L20 -34 L40 -14" stroke="#9aa1b5" strokeWidth="3.5" fill="none" strokeLinejoin="round" />
      {[-40, 2, 40].map((wx) => (
        <g key={wx} transform={`translate(${wx} -12)`}>
          <g className={roll ? "anim spin-slow" : undefined}>
            <circle r="12" fill="#5b6276" />
            <circle r="12" fill="none" stroke="#b9bfce" strokeWidth="2.5" strokeDasharray="3 3" />
            <circle r="4" fill="#d6d9e2" />
          </g>
        </g>
      ))}
      {/* body */}
      <rect x="-34" y="-58" width="72" height="28" rx="6" fill={FOIL} stroke={FOIL_DARK} strokeWidth="1.5" />
      <SolarPanel x={0} y={-62} w={86} h={8} cols={6} rows={1} dusty={dusty ? 0.45 : 0} />
      {/* the face on the front */}
      <rect x="20" y="-56" width="30" height="26" rx="7" fill={WHITE} stroke={EDGE} strokeWidth="1.5" />
      <Face x={35} y={-45} s={0.55} eyes={eyes} gap={24} />
      {/* whip antenna */}
      <path d="M-26 -66 L-30 -104" stroke={EDGE} strokeWidth="2" />
      <circle cx="-30" cy="-106" r="3" fill="#e8eaf1" />
      {/* the little science nose (APXS) at the back */}
      <path d="M-34 -40 L-46 -30" stroke="#9aa1b5" strokeWidth="3" />
      <circle cx="-48" cy="-28" r="4" fill="#d6d9e2" stroke={EDGE} strokeWidth="1" />
    </g>
  );
}

/**
 * Spirit or Opportunity: six wheels, wide solar wings, and a camera head (with the face) on a mast.
 * who: "spirit" | "opportunity" (a coloured scarf on the mast tells them apart) | "perseverance"
 * (no solar wings: a nuclear battery at the back instead).
 * arm: "stowed" | "out"; stuck: sunk to its wheel hubs in sand.
 */
export function MarsRover({ x = 0, y = 0, s = 1, eyes = "open", who = "spirit", arm = "stowed", dusty = 0, shadow = true, roll = false, stuck = false, look = 0 }) {
  const percy = who === "perseverance";
  const scarf = who === "spirit" ? "#5aa6ff" : who === "opportunity" ? "#ff8d5c" : null;
  return (
    <g transform={`translate(${x} ${y + (stuck ? 12 : 0)}) scale(${s})`}>
      {shadow && <ellipse cx="0" cy="2" rx="130" ry="10" fill="#2a0f08" opacity="0.28" />}
      {/* far wheels */}
      {[-68, 0, 68].map((wx) => (
        <circle key={`f${wx}`} cx={wx + 10} cy="-22" r="18" fill="#3e4354" opacity="0.7" />
      ))}
      {/* rocker-bogie */}
      <path d="M-68 -22 L-34 -62 L0 -22 M0 -22 L34 -62 L68 -22 M-34 -62 L34 -62" stroke="#a9b0c2" strokeWidth="5" fill="none" strokeLinejoin="round" />
      {/* body */}
      <rect x="-58" y="-98" width="116" height="40" rx="7" fill={WHITE} stroke={EDGE} strokeWidth="2" />
      <rect x="-58" y="-70" width="116" height="12" rx="4" fill={FOIL} />
      {percy ? (
        <g>
          {/* deck and the finned nuclear battery at the back */}
          <rect x="-66" y="-108" width="132" height="12" rx="4" fill="#e3e6ee" stroke={EDGE} strokeWidth="1.5" />
          <g transform="translate(-84 -96) rotate(-30)">
            <rect x="-14" y="-30" width="28" height="44" rx="5" fill="#4d5468" />
            {[-10, -4, 2, 8].map((f) => (
              <path key={f} d={`M${f} -36 V20`} stroke="#6b7287" strokeWidth="3" />
            ))}
          </g>
        </g>
      ) : (
        <g>
          {/* solar deck with wings */}
          <path d="M-140 -100 L-58 -108 L58 -108 L140 -100 L136 -92 L-136 -92Z" fill={CELL} stroke="#dfe6fa" strokeWidth="1.5" />
          <path d="M-100 -104 L-98 -95 M-58 -108 L-58 -93 M-20 -108 L-20 -93 M20 -108 L20 -93 M58 -108 L58 -93 M100 -104 L98 -95" stroke={CELL_LIGHT} strokeWidth="1" />
          {dusty > 0 && <path d="M-140 -100 L-58 -108 L58 -108 L140 -100 L136 -92 L-136 -92Z" fill="#c98a5e" opacity={dusty} />}
        </g>
      )}
      {/* high-gain dish and low-gain rod */}
      <path d="M-34 -108 L-34 -124" stroke={EDGE} strokeWidth="3" />
      <ellipse cx="-34" cy="-128" rx="16" ry="5" fill="#e8eaf1" stroke={EDGE} strokeWidth="1.5" />
      <path d="M-84 -104 L-84 -146" stroke={EDGE} strokeWidth="2.5" />
      {/* mast, scarf and camera head */}
      <path d="M44 -108 L44 -196" stroke={EDGE} strokeWidth="6" />
      {scarf && <path d={`M38 -168 L52 -168 L52 -160 L38 -160Z M52 -166 q14 2 18 14 q-10 -4 -18 -6Z`} fill={scarf} />}
      <g transform={`rotate(${look} 44 -212)`}>
        <rect x="8" y="-230" width="72" height="34" rx="11" fill={WHITE} stroke={EDGE} strokeWidth="2" />
        <Face x={44} y={-216} s={0.82} eyes={eyes} gap={32} mouth={false} />
      </g>
      {/* arm with its tool turret */}
      {arm === "out" ? (
        <g>
          <path d="M58 -74 L104 -96 L136 -40" stroke="#a9b0c2" strokeWidth="5" strokeLinecap="round" fill="none" />
          <rect x="124" y="-42" width="24" height="18" rx="4" fill="#d6d9e2" stroke={EDGE} strokeWidth="1.5" />
          <circle cx="136" cy="-20" r="5" fill="#5b6276" />
        </g>
      ) : (
        <path d="M58 -66 L76 -62 L74 -50" stroke="#a9b0c2" strokeWidth="5" strokeLinecap="round" fill="none" />
      )}
      {/* near wheels */}
      {[-68, 0, 68].map((wx) => (
        <g key={wx} transform={`translate(${wx} -22)`}>
          <g className={roll ? "anim spin-slow" : undefined}>
            <circle r="20" fill="#5b6276" />
            <circle r="20" fill="none" stroke="#c4cad8" strokeWidth="3" strokeDasharray="4 4" />
            <path d="M-14 0 H14 M0 -14 V14" stroke="#8e95aa" strokeWidth="2" />
            <circle r="6" fill="#d6d9e2" />
          </g>
        </g>
      ))}
      {stuck && <path d="M-110 -6 Q-60 -22 0 -12 Q60 -22 110 -6 L110 4 L-110 4Z" fill="#d79a6c" />}
    </g>
  );
}

/**
 * A lander with two round solar panels: Phoenix (with a camera mast that carries its face)
 * or InSight (bigger panels, face on its deck). arm: "stowed" | "dig" | "place".
 */
export function RoundLander({ x = 0, y = 0, s = 1, kind = "phoenix", eyes = "open", arm = "stowed", dusty = 0, frost = false, shadow = true }) {
  const insight = kind === "insight";
  const pr = insight ? 82 : 66;
  const panel = (cx) => (
    <g key={cx}>
      <ellipse cx={cx} cy="-92" rx={pr} ry={pr * 0.3} fill={CELL} stroke="#dfe6fa" strokeWidth="1.5" />
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return <path key={i} d={`M${cx} -92 L${cx + Math.cos(a) * pr} ${-92 + Math.sin(a) * pr * 0.3}`} stroke={CELL_LIGHT} strokeWidth="1" />;
      })}
      <ellipse cx={cx} cy="-92" rx={pr * 0.18} ry={pr * 0.06} fill="#c9d4ff" />
      {dusty > 0 && <ellipse cx={cx} cy="-92" rx={pr} ry={pr * 0.3} fill="#c98a5e" opacity={dusty} />}
      {frost && <ellipse cx={cx} cy="-92" rx={pr} ry={pr * 0.3} fill="#f2f8ff" opacity="0.75" />}
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {shadow && <ellipse cx="0" cy="4" rx={insight ? 200 : 170} ry="13" fill="#2a0f08" opacity="0.25" />}
      {/* legs */}
      <path d="M-46 -74 L-74 -4 M46 -74 L74 -4 M0 -74 L6 -18" stroke={EDGE} strokeWidth="6" strokeLinecap="round" />
      {[[-76, 0], [76, 0], [7, -14]].map(([lx, ly]) => (
        <ellipse key={lx} cx={lx} cy={ly - 2} rx="16" ry="5" fill="#e8eaf1" stroke={EDGE} strokeWidth="1.2" />
      ))}
      {panel(-(pr + 52))}
      {panel(pr + 52)}
      {/* deck */}
      <path d="M-60 -104 L60 -104 L66 -74 L-66 -74Z" fill={insight ? "#e7e9ef" : WHITE} stroke={EDGE} strokeWidth="2" />
      <path d="M-66 -82 L66 -82 L66 -74 L-66 -74Z" fill={FOIL} />
      {frost && <path d="M-60 -104 L60 -104 L66 -74 L-66 -74Z" fill="#f2f8ff" opacity="0.7" />}
      {!insight && (
        <g>
          {/* weather mast with its telltale */}
          <path d="M34 -104 L34 -170" stroke={EDGE} strokeWidth="2.5" />
          <path d="M34 -170 L44 -158" stroke="#e8eaf1" strokeWidth="2" className="anim wobble" />
          {/* camera mast with the face */}
          <path d="M-18 -104 L-18 -168" stroke={EDGE} strokeWidth="5" />
          <rect x="-48" y="-200" width="60" height="32" rx="11" fill={WHITE} stroke={EDGE} strokeWidth="2" />
          {frost && <rect x="-48" y="-200" width="60" height="10" rx="5" fill="#ffffff" />}
          <Face x={-18} y={-185} s={0.8} eyes={eyes} gap={28} mouth={false} />
        </g>
      )}
      {insight && <Face x={0} y={-92} s={0.75} eyes={eyes} gap={30} />}
      {/* the robot arm */}
      {arm === "dig" && (
        <g>
          <path d="M60 -96 L128 -150 L176 -26" stroke="#b9bfce" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M164 -30 L190 -30 L186 -10 L168 -10Z" fill="#9aa1b5" stroke="#6b7287" strokeWidth="2" />
        </g>
      )}
      {arm === "place" && (
        <g>
          <path d="M60 -96 L134 -160 L182 -100" stroke="#b9bfce" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M176 -100 L188 -100 L186 -88 L178 -88Z" fill="#9aa1b5" />
        </g>
      )}
      {arm === "stowed" && <path d="M58 -96 L92 -112 L86 -84" stroke="#b9bfce" strokeWidth="6" strokeLinecap="round" fill="none" />}
    </g>
  );
}

/** InSight's seismometer under its dome-shaped wind and heat shield. */
export function SeismoDome({ x = 0, y = 0, s = 1, listen = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {listen && (
        <g className="anim waves" stroke="#fff1e4" strokeWidth="2.5" fill="none" opacity="0.7">
          <path d="M-58 -30 q-10 16 0 30" />
          <path d="M-72 -40 q-16 26 0 48" />
          <path d="M58 -30 q10 16 0 30" />
          <path d="M72 -40 q16 26 0 48" />
        </g>
      )}
      <ellipse cx="0" cy="0" rx="52" ry="9" fill="#cdb79a" opacity="0.9" />
      <path d="M-46 0 Q-44 -46 0 -48 Q44 -46 46 0Z" fill="#f2efe8" stroke="#b5aa98" strokeWidth="2" />
      <path d="M-30 -12 Q0 -24 30 -12" stroke="#d9d2c4" strokeWidth="2" fill="none" />
      <ellipse cx="-14" cy="-36" rx="10" ry="5" fill="#fff" opacity="0.6" />
    </g>
  );
}

/** Ingenuity, the Mars helicopter. spin: blades turning; body has the face. */
export function Helicopter({ x = 0, y = 0, s = 1, eyes = "open", spin = false, broken = false, shadow = true, lift = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {shadow && <ellipse cx="0" cy="2" rx={56 - lift * 0.2} ry="6" fill="#2a0f08" opacity={Math.max(0.08, 0.28 - lift * 0.002)} />}
      <g transform={`translate(0 ${-lift})`}>
        {/* legs */}
        <path d="M-16 -34 L-46 0 M16 -34 L46 0 M-6 -34 L-16 -4 M6 -34 L16 -4" stroke="#c4cad8" strokeWidth="3" strokeLinecap="round" />
        {/* body */}
        <rect x="-22" y="-74" width="44" height="40" rx="9" fill={WHITE} stroke={EDGE} strokeWidth="2" />
        <rect x="-22" y="-44" width="44" height="10" rx="4" fill={FOIL} />
        <Face x={0} y={-58} s={0.62} eyes={eyes} gap={22} />
        {/* mast and rotors */}
        <path d="M0 -74 L0 -130" stroke={EDGE} strokeWidth="4" />
        {spin ? (
          <g>
            <ellipse cx="0" cy="-92" rx="94" ry="7" fill="#dfe3ec" opacity="0.5" className="anim flicker" />
            <ellipse cx="0" cy="-110" rx="94" ry="7" fill="#dfe3ec" opacity="0.5" className="anim flicker" style={{ animationDelay: "0.15s" }} />
            <path d="M-94 -92 h12 M82 -92 h12 M-94 -110 h12 M82 -110 h12" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.7" className="anim flicker" />
          </g>
        ) : (
          <g>
            <path d={broken ? "M-86 -88 L-20 -92 M20 -92 L70 -94" : "M-90 -92 L90 -92"} stroke="#f4f5f8" strokeWidth="5" strokeLinecap="round" />
            <path d="M-90 -110 L90 -110" stroke="#e3e6ee" strokeWidth="5" strokeLinecap="round" />
          </g>
        )}
        <rect x="-8" y="-98" width="16" height="12" rx="3" fill="#9aa1b5" />
        <SolarPanel x={0} y={-134} w={52} h={9} cols={4} rows={1} />
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ deep-space machines */

/** NEAR Shoemaker: a dish face in the middle of four square solar panels, like a flower. */
export function NearCraft({ x = 0, y = 0, s = 1, rotate = 0, eyes = "open", shadow = false }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
      {shadow && <ellipse cx="0" cy="96" rx="110" ry="10" fill="#000" opacity="0.25" />}
      <SolarPanel x={-96} y={0} w={92} h={64} cols={4} rows={3} />
      <SolarPanel x={96} y={0} w={92} h={64} cols={4} rows={3} />
      <SolarPanel x={0} y={-90} w={64} h={74} cols={3} rows={4} />
      <SolarPanel x={0} y={90} w={64} h={74} cols={3} rows={4} />
      {/* octagonal body */}
      <path d="M-30 -52 L30 -52 L52 -30 L52 30 L30 52 L-30 52 L-52 30 L-52 -30Z" fill={FOIL} stroke={FOIL_DARK} strokeWidth="2" />
      {/* dish face */}
      <circle cx="0" cy="0" r="46" fill={WHITE} stroke={EDGE} strokeWidth="2.5" />
      <circle cx="0" cy="0" r="38" fill="none" stroke="#dfe3ec" strokeWidth="2" />
      <Face x={0} y={-4} s={1.05} eyes={eyes} gap={30} />
    </g>
  );
}

/** Dawn: a gold box with very long solar wings and a gentle blue ion glow. */
export function DawnCraft({ x = 0, y = 0, s = 1, rotate = 0, eyes = "open", thrust = false, wings = 1 }) {
  const u = useUid();
  const len = 230 * wings;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
      <defs>
        <linearGradient id={`${u}-ion`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe9ff" stopOpacity="0.95" />
          <stop offset="0.4" stopColor="#5ab8ff" stopOpacity="0.6" />
          <stop offset="1" stopColor="#3a7bff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {thrust && (
        <g className="anim glowpulse">
          <path d="M-16 44 L16 44 L46 240 L-46 240Z" fill={`url(#${u}-ion)`} />
          <ellipse cx="0" cy="46" rx="16" ry="5" fill="#dff4ff" />
        </g>
      )}
      {/* wings */}
      {[-1, 1].map((d) => (
        <g key={d}>
          <path d={`M${d * 36} -2 L${d * 54} -2`} stroke={EDGE} strokeWidth="4" />
          {Array.from({ length: 5 }, (_, i) => (
            <SolarPanel key={i} x={d * (54 + (len / 5) * (i + 0.5))} y={-2} w={len / 5 - 3} h={46} cols={2} rows={3} />
          ))}
        </g>
      ))}
      {/* body */}
      <rect x="-38" y="-40" width="76" height="80" rx="9" fill={FOIL} stroke={FOIL_DARK} strokeWidth="2" />
      <path d="M-30 -32 L-12 -10 M10 -36 L30 -12 M-26 14 L-6 34" stroke="#f6d98e" strokeWidth="2" opacity="0.7" />
      {/* dish on top */}
      <path d="M0 -40 L0 -52" stroke={EDGE} strokeWidth="3" />
      <ellipse cx="0" cy="-58" rx="34" ry="10" fill={WHITE} stroke={EDGE} strokeWidth="2" />
      <rect x="-26" y="-22" width="52" height="40" rx="10" fill={WHITE} stroke={EDGE} strokeWidth="1.5" />
      <Face x={0} y={-6} s={0.78} eyes={eyes} gap={26} />
      <path d="M-14 40 L14 40 L10 48 L-10 48Z" fill="#5b6276" />
    </g>
  );
}

/** Kepler: a tall telescope tube with a slanted sunshade and a solar panel on its back. */
export function KeplerScope({ x = 0, y = 0, s = 1, rotate = 0, eyes = "open", tilt = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
      {/* solar panel behind */}
      <path d="M-60 -60 L-30 -128 L-30 72 L-60 104Z" fill={CELL} stroke="#dfe6fa" strokeWidth="1.5" />
      <path d="M-45 -94 L-45 88 M-60 -10 L-30 -30 M-60 40 L-30 22" stroke={CELL_LIGHT} strokeWidth="1" />
      {/* tube */}
      <rect x="-38" y="-120" width="84" height="196" rx="14" fill={WHITE} stroke={EDGE} strokeWidth="2" />
      <path d="M-38 -120 L46 -162 L46 -110 L-38 -96Z" fill="#e8eaf1" stroke={EDGE} strokeWidth="2" />
      <ellipse cx="4" cy="-118" rx="36" ry="9" fill="#141b3a" />
      <path d="M-30 -70 L38 -70 M-30 30 L38 30" stroke="#dfe3ec" strokeWidth="3" />
      {/* bus at the bottom */}
      <path d="M-44 76 L52 76 L46 112 L-38 112Z" fill={FOIL} stroke={FOIL_DARK} strokeWidth="2" />
      <g transform={`rotate(${tilt} 4 -20)`}>
        <Face x={4} y={-20} s={1.05} eyes={eyes} gap={32} />
      </g>
    </g>
  );
}

/** Pioneer 10 or 11: a big dish face, two power booms, a long magnetometer boom and a plaque. */
export function PioneerCraft({ x = 0, y = 0, s = 1, rotate = 0, eyes = "open", plaque = true, glowRtg = false }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
      {/* booms */}
      <path d="M-30 30 L-130 104 M30 30 L130 104" stroke="#8a93a9" strokeWidth="4" />
      <path d="M40 -20 L250 -60" stroke="#8a93a9" strokeWidth="2.5" />
      <rect x="244" y="-68" width="16" height="14" rx="3" fill="#d6d9e2" stroke={EDGE} strokeWidth="1.2" />
      {[[-130, 104], [-112, 90], [130, 104], [112, 90]].map(([rx, ry]) => (
        <g key={`${rx}${ry}`} transform={`translate(${rx} ${ry})`}>
          {glowRtg && <circle r="22" fill="#ffb36b" opacity="0.25" className="anim breathe" />}
          <rect x="-12" y="-9" width="24" height="18" rx="3" fill="#4d5468" />
          {[-8, -3, 2, 7].map((f) => (
            <path key={f} d={`M${f} -14 V14`} stroke="#6b7287" strokeWidth="2.5" />
          ))}
        </g>
      ))}
      {/* the equipment box behind the dish */}
      <path d="M-40 34 L40 34 L52 58 L-52 58Z" fill={FOIL} stroke={FOIL_DARK} strokeWidth="1.5" />
      {plaque && (
        <g transform="translate(-18 62)">
          <rect width="36" height="22" rx="2" fill="#f2c96a" stroke={FOIL_DARK} strokeWidth="1.2" />
          <path d="M6 18 v-10 m0 -3 v0 M12 18 v-12 M22 6 l8 6 M20 12 h10" stroke={FOIL_DARK} strokeWidth="1.2" />
        </g>
      )}
      {/* dish */}
      <circle cx="0" cy="0" r="78" fill={WHITE} stroke={EDGE} strokeWidth="2.5" />
      <circle cx="0" cy="0" r="66" fill="none" stroke="#dfe3ec" strokeWidth="2" />
      <circle cx="0" cy="0" r="44" fill="none" stroke="#e8ebf2" strokeWidth="2" />
      <path d="M0 -78 L0 -96" stroke={EDGE} strokeWidth="3" />
      <circle cx="0" cy="-98" r="5" fill="#d6d9e2" stroke={EDGE} strokeWidth="1.2" />
      <Face x={0} y={-6} s={1.3} eyes={eyes} gap={34} />
    </g>
  );
}

/* ------------------------------------------------------------------ worlds and props */

/** Asteroid 433 Eros: a peanut with a saddle in its middle. */
export function Eros({ cx, cy, s = 1, rotate = -12, landed = null }) {
  const u = useUid();
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate}) scale(${s})`}>
      <defs>
        <radialGradient id={`${u}-e`} cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#d9c9ae" />
          <stop offset="0.6" stopColor="#a8916f" />
          <stop offset="1" stopColor="#6c5a44" />
        </radialGradient>
      </defs>
      <path d="M-200 -10 C-206 -80 -110 -96 -60 -60 C-20 -34 20 -40 60 -66 C120 -104 210 -70 204 4 C198 78 120 96 64 70 C24 52 -18 54 -58 72 C-120 100 -196 70 -200 -10Z" fill={`url(#${u}-e)`} />
      <path d="M-60 -60 C-20 -34 20 -40 60 -66 C40 -10 30 30 64 70 C24 52 -18 54 -58 72 C-30 30 -40 -20 -60 -60Z" fill="#5f4f3c" opacity="0.35" />
      {[[-140, -10, 26], [-110, 40, 14], [120, -20, 30], [150, 40, 12], [70, -50, 10], [-170, -40, 9]].map(([x, y, r]) => (
        <g key={`${x}${y}`}>
          <ellipse cx={x} cy={y} rx={r} ry={r * 0.7} fill="#7a6650" opacity="0.6" />
          <path d={`M${x - r} ${y} A${r} ${r * 0.7} 0 0 0 ${x + r} ${y}`} stroke="#e9dcc4" strokeOpacity="0.5" strokeWidth="1.5" fill="none" />
        </g>
      ))}
      {landed && <g transform={`translate(${landed[0]} ${landed[1]})`}>{landed[2]}</g>}
    </g>
  );
}

/** A round little world: Ceres (with its bright salty spots) or Vesta (with its huge south crater). */
export function DwarfWorld({ cx, cy, r, kind = "ceres" }) {
  const u = useUid();
  const ceres = kind === "ceres";
  return (
    <g>
      <defs>
        <radialGradient id={`${u}-w`} cx="0.36" cy="0.32" r="0.85">
          <stop offset="0" stopColor={ceres ? "#bfbcb8" : "#d7c7aa"} />
          <stop offset="0.65" stopColor={ceres ? "#7d7a77" : "#9a8566"} />
          <stop offset="1" stopColor={ceres ? "#3f3d3c" : "#4e4130"} />
        </radialGradient>
        <clipPath id={`${u}-c`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${u}-w)`} />
      <g clipPath={`url(#${u}-c)`}>
        {[[-0.4, -0.3, 0.16], [0.3, 0.35, 0.22], [0.45, -0.4, 0.1], [-0.2, 0.5, 0.12], [0.05, -0.05, 0.08]].map(([dx, dy, k]) => (
          <ellipse key={`${dx}${dy}`} cx={cx + dx * r} cy={cy + dy * r} rx={k * r} ry={k * r * 0.8} fill="#000" opacity="0.18" />
        ))}
        {ceres ? (
          <g>
            <circle cx={cx + 0.1 * r} cy={cy - 0.12 * r} r={0.05 * r} fill="#ffffff" />
            <circle cx={cx + 0.18 * r} cy={cy - 0.08 * r} r={0.025 * r} fill="#ffffff" />
            <circle cx={cx + 0.1 * r} cy={cy - 0.12 * r} r={0.12 * r} fill="#ffffff" opacity="0.25" className="anim glowpulse" />
          </g>
        ) : (
          <g>
            <ellipse cx={cx} cy={cy + 0.82 * r} rx={0.75 * r} ry={0.32 * r} fill="#3d3124" opacity="0.5" />
            <path d={`M${cx - 0.7 * r} ${cy + 0.1 * r} Q${cx} ${cy + 0.22 * r} ${cx + 0.75 * r} ${cy + 0.05 * r}`} stroke="#3d3124" strokeWidth={r * 0.03} fill="none" opacity="0.5" />
            <path d={`M${cx - 0.75 * r} ${cy + 0.22 * r} Q${cx} ${cy + 0.34 * r} ${cx + 0.78 * r} ${cy + 0.18 * r}`} stroke="#3d3124" strokeWidth={r * 0.025} fill="none" opacity="0.4" />
          </g>
        )}
        <ellipse cx={cx + r * 0.55} cy={cy + r * 0.2} rx={r * 0.7} ry={r * 1.1} fill="#05060f" opacity="0.38" />
      </g>
    </g>
  );
}

/** A star (for Kepler's pages), optionally with a little planet crossing in front of it. */
export function TransitStar({ cx, cy, r, color = "#ffe6a6", planet = true, className = "anim drift", from = -0.2 }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r * 2.4} fill={color} opacity="0.12" />
      <circle cx={cx} cy={cy} r={r * 1.5} fill={color} opacity="0.22" />
      <circle cx={cx} cy={cy} r={r} fill={color} />
      <circle cx={cx - r * 0.3} cy={cy - r * 0.3} r={r * 0.45} fill="#fffbe8" opacity="0.6" />
      {planet && (
        <g className={className}>
          <circle cx={cx + r * from} cy={cy + r * 0.15} r={r * 0.16} fill="#1b2340" />
        </g>
      )}
    </g>
  );
}

/** A little chart of a star's light dimming when a planet passes. */
export function LightCurve({ x, y, w = 260, h = 90, dip = 0.4 }) {
  const mid = x + w / 2;
  const base = y + h * 0.3;
  const low = base + h * dip;
  return (
    <g>
      <rect x={x - 14} y={y - 14} width={w + 28} height={h + 34} rx="12" fill="#0b1430" opacity="0.8" stroke="#8fd3ff" strokeOpacity="0.4" />
      <path d={`M${x} ${y + h + 6} H${x + w}`} stroke="#8fd3ff" strokeOpacity="0.4" strokeWidth="1.5" />
      <path
        d={`M${x} ${base} H${mid - 40} L${mid - 26} ${low} H${mid + 26} L${mid + 40} ${base} H${x + w}`}
        stroke="#ffe6a6"
        strokeWidth="3.5"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
        className="anim scanwipe"
      />
      {Array.from({ length: 22 }, (_, i) => {
        const px = x + (i / 21) * w;
        const inDip = px > mid - 30 && px < mid + 30;
        return <circle key={i} cx={px} cy={(inDip ? low : base) + ((i * 7) % 5) - 2} r="2.2" fill="#ffe6a6" opacity="0.7" />;
      })}
    </g>
  );
}

/** A whirling dust devil. */
export function DustDevil({ x, y, s = 1, className = "anim drift" }) {
  return (
    <g className={className}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <ellipse cx="0" cy="0" rx="40" ry="8" fill="#e8b48e" opacity="0.45" />
        <path d="M-12 0 Q-30 -70 -18 -130 Q-46 -190 -70 -250 Q0 -270 70 -250 Q46 -190 18 -130 Q30 -70 12 0Z" fill="#e8b48e" opacity="0.38" />
        <path d="M-14 -30 q28 -10 28 0 M-20 -80 q40 -14 40 0 M-30 -140 q60 -16 60 0 M-48 -200 q96 -18 96 0" stroke="#fbe1cb" strokeWidth="3" fill="none" opacity="0.55" strokeLinecap="round" />
      </g>
    </g>
  );
}

/** Falling snow or frost sparkles. */
export function Snow({ seed = 3, count = 40, top = 0, bottom = 600, color = "#ffffff" }) {
  const r = rng(seed);
  return (
    <g fill={color}>
      {Array.from({ length: count }, (_, i) => (
        <circle
          key={i}
          cx={r() * 600}
          cy={top + r() * (bottom - top)}
          r={1 + r() * 2.4}
          opacity={0.5 + r() * 0.5}
          className="anim float-dust"
          style={{ animationDelay: `${(r() * 5).toFixed(2)}s` }}
        />
      ))}
    </g>
  );
}

/** Ripples spreading through the ground from a quake. */
export function QuakeRings({ x, y, s = 1, color = "#ffe1c8" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={color} fill="none" strokeLinecap="round">
      {[30, 60, 92, 126].map((rr, i) => (
        <ellipse key={rr} cx="0" cy="0" rx={rr * 1.6} ry={rr * 0.42} strokeWidth={3.5 - i * 0.6} opacity={0.75 - i * 0.15} className="anim waves" style={{ animationDelay: `${i * 0.4}s` }} />
      ))}
    </g>
  );
}

/** A planet cut open: crust, mantle and a glowing liquid core. */
export function PlanetCutaway({ cx, cy, r }) {
  const u = useUid();
  return (
    <g>
      <defs>
        <radialGradient id={`${u}-core`}>
          <stop offset="0" stopColor="#fff1b0" />
          <stop offset="0.6" stopColor="#ffb347" />
          <stop offset="1" stopColor="#e2672f" />
        </radialGradient>
        <clipPath id={`${u}-half`}>
          <rect x={cx - r - 4} y={cy - r - 4} width={r + 4} height={r * 2 + 8} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="#c4643b" />
      <g clipPath={`url(#${u}-half)`}>
        <circle cx={cx} cy={cy} r={r} fill="#8f3f24" />
        <circle cx={cx} cy={cy} r={r * 0.92} fill="#b9562f" />
        <circle cx={cx} cy={cy} r={r * 0.54} fill={`url(#${u}-core)`} className="anim glowpulse" />
      </g>
      <path d={`M${cx} ${cy - r} V${cy + r}`} stroke="#5c2414" strokeWidth="2" />
      <ellipse cx={cx + r * 0.45} cy={cy - r * 0.35} rx={r * 0.25} ry={r * 0.12} fill="#e89a72" opacity="0.6" />
    </g>
  );
}
