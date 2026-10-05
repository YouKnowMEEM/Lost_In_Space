import React from "react";
import { useUid, rng, W, H } from "./common";

/* Illustrated parts for the Viking 1 book. Local coordinates: (0,0) is the ground point
   under the middle of each object, negative y goes up. */

export const V = {
  body: "#efebe4",
  bodyShade: "#cfc8bd",
  bodyDark: "#a69d91",
  ink: "#2f2624",
  copper: "#c97b45",
  rust: "#c4643b",
  rustLight: "#dc8a5c",
  rustDark: "#93452a",
  rock: "#6c3727",
  rockLight: "#b77455",
};

/* ------------------------------------------------------------- Mars */

export const MARS_SKIES = {
  day: [
    [0, "#b07a63"],
    [0.55, "#d9a685"],
    [1, "#f0cfae"],
  ],
  dusk: [
    [0, "#3a2440"],
    [0.5, "#8a5a66"],
    [0.85, "#d39b86"],
    [1, "#e8c0a4"],
  ],
  night: [
    [0, "#0d0712"],
    [0.6, "#2a1424"],
    [1, "#4a2632"],
  ],
  blue: [
    [0, "#4f86c9"],
    [0.6, "#8fb8e4"],
    [1, "#cfe2f4"],
  ],
  space: [
    [0, "#07050c"],
    [0.6, "#140b1c"],
    [1, "#241226"],
  ],
};

export function MarsGround({ y = 560, seed = 3, rocks = 22, tone = "day" }) {
  const u = useUid();
  const r = rng(seed);
  const pal =
    tone === "night"
      ? ["#6d3a2c", "#57291f", "#3f1c15"]
      : tone === "dusk"
      ? ["#b15a39", "#8f4329", "#6c311f"]
      : [V.rustLight, V.rust, V.rustDark];
  const hill = `M0 ${y - 30} Q90 ${y - 64} 190 ${y - 38} T380 ${y - 44} T600 ${y - 34} L600 ${y} L0 ${y}Z`;
  const ground = `M0 ${y} ${Array.from({ length: 6 }, (_, i) => `Q${(i + 0.5) * 100} ${y - 6 - r() * 10} ${(i + 1) * 100} ${y - 2 + r() * 6}`).join(" ")} L${W} ${H} L0 ${H}Z`;
  return (
    <g>
      <defs>
        <linearGradient id={`${u}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={pal[0]} />
          <stop offset="0.5" stopColor={pal[1]} />
          <stop offset="1" stopColor={pal[2]} />
        </linearGradient>
      </defs>
      <path d={hill} fill={pal[1]} opacity="0.55" />
      <path d={ground} fill={`url(#${u}-g)`} />
      {Array.from({ length: 5 }, (_, i) => {
        const x = r() * W;
        const yy = y + 40 + r() * (H - y - 60);
        return <path key={`d${i}`} d={`M${x - 70} ${yy} Q${x} ${yy - 22} ${x + 80} ${yy}`} fill="#eaa67a" opacity="0.32" />;
      })}
      {Array.from({ length: rocks }, (_, i) => {
        const yy = y + 14 + r() * (H - y - 20);
        const sz = (3 + r() * 9) * (0.6 + (yy - y) / (H - y));
        return <Rock key={i} x={r() * W} y={yy} s={sz / 10} dark={tone === "night"} />;
      })}
    </g>
  );
}

export function Rock({ x, y, s = 1, dark = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="2" cy="1" rx="13" ry="3.5" fill="#000" opacity="0.22" />
      <path d="M-12 0 L-10 -8 L-2 -13 L8 -11 L13 -4 L12 0Z" fill={dark ? "#3c1d16" : V.rock} />
      <path d="M-10 -8 L-2 -13 L8 -11 L2 -6 L-6 -5Z" fill={dark ? "#6b3a2c" : V.rockLight} />
    </g>
  );
}

export function BigJoe({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="10" cy="4" rx="96" ry="14" fill="#000" opacity="0.25" />
      <path d="M-86 0 L-80 -42 L-52 -78 L-6 -92 L42 -84 L78 -54 L90 -14 L86 0Z" fill="#6a3424" />
      <path d="M-80 -42 L-52 -78 L-6 -92 L42 -84 L30 -58 L-18 -50 L-56 -34Z" fill="#a86447" />
      <path d="M42 -84 L78 -54 L90 -14 L60 -6 L48 -40Z" fill="#000" opacity="0.18" />
      <path d="M-56 -76 Q-18 -100 34 -86 Q2 -80 -30 -70Z" fill="#e2a173" opacity="0.9" />
    </g>
  );
}

export function MarsGlobe({ cx, cy, r }) {
  const u = useUid();
  return (
    <g>
      <defs>
        <radialGradient id={`${u}-m`} cx="0.36" cy="0.32" r="0.8">
          <stop offset="0" stopColor="#f0a172" />
          <stop offset="0.55" stopColor="#c85f36" />
          <stop offset="1" stopColor="#6e2818" />
        </radialGradient>
        <radialGradient id={`${u}-h`}>
          <stop offset="0.7" stopColor="#ff9a6a" stopOpacity="0.3" />
          <stop offset="1" stopColor="#ff9a6a" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${u}-c`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r * 1.18} fill={`url(#${u}-h)`} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${u}-m)`} />
      <g clipPath={`url(#${u}-c)`} transform={`translate(${cx} ${cy}) scale(${r / 100})`}>
        <path d="M-60 -10 C-40 -30 -10 -20 0 -4 C10 12 30 8 44 20 C30 40 0 30 -20 26 C-40 22 -70 10 -60 -10Z" fill="#7a3220" opacity="0.55" />
        <path d="M10 -50 C30 -60 56 -46 50 -30 C44 -18 20 -26 10 -36Z" fill="#7a3220" opacity="0.45" />
        <path d="M-90 40 C-60 30 -40 50 -60 64 C-76 74 -96 60 -90 40Z" fill="#7a3220" opacity="0.4" />
        <ellipse cx="-6" cy="-96" rx="44" ry="14" fill="#fff6ee" opacity="0.92" />
        <ellipse cx={70} cy={10} rx={95} ry={120} fill="#1a0a10" opacity="0.38" />
      </g>
    </g>
  );
}

export function SmallMoon({ cx, cy, r, fill = "#a99a90" }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={r * 1.2} ry={r} fill={fill} transform={`rotate(-20 ${cx} ${cy})`} />
      <circle cx={cx - r * 0.3} cy={cy - r * 0.2} r={r * 0.28} fill="#000" opacity="0.18" />
    </g>
  );
}

/* ------------------------------------------------------------- Viking */

function Eye({ x, y, eyes }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-9" y="-30" width="18" height="34" rx="3" fill="#dcd6cc" stroke={V.bodyDark} strokeWidth="1.5" />
      <path d="M-11 -30 Q0 -44 11 -30Z" fill="#f4f1ec" stroke={V.bodyDark} strokeWidth="1.5" />
      {eyes === "closed" ? (
        <path d="M-6 -22 Q0 -16 6 -22" stroke={V.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      ) : (
        <g>
          <rect x="-4" y="-29" width="8" height="15" rx="4" fill="#1f1a2b" />
          <circle cx="1.5" cy="-24" r="1.6" fill="#fff" />
        </g>
      )}
    </g>
  );
}

/**
 * Viking 1 lander. eyes: "open" | "closed"; arm: "stowed" | "out";
 * dish: "earth" (tilted up) | "away" (turned aside).
 */
export function VikingLander({ x = 0, y = 0, s = 1, eyes = "open", arm = "stowed", dish = "earth", shadow = true, engines = false, flag = true, dusty = false }) {
  const u = useUid();
  const dishTilt = dish === "away" ? 48 : -18;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <linearGradient id={`${u}-b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf9f5" />
          <stop offset="1" stopColor={V.bodyShade} />
        </linearGradient>
      </defs>
      {shadow && <ellipse cx="6" cy="6" rx="170" ry="15" fill="#2a0f08" opacity="0.28" />}
      {/* back leg */}
      <path d="M0 -84 L0 -30" stroke={V.bodyDark} strokeWidth="6" />
      <ellipse cx="0" cy="-26" rx="20" ry="6" fill={V.bodyShade} />
      {/* high-gain dish on its mast (behind the body) */}
      <path d="M-58 -120 L-70 -196" stroke={V.bodyDark} strokeWidth="5" />
      <g transform={`translate(-72 -204) rotate(${dishTilt})`}>
        <path d="M-34 0 Q0 26 34 0 Q0 8 -34 0Z" fill={V.bodyShade} />
        <ellipse cx="0" cy="0" rx="34" ry="11" fill="#fbf9f5" stroke={V.bodyDark} strokeWidth="1.5" />
        <path d="M0 0 L0 -18" stroke={V.bodyDark} strokeWidth="2.5" />
        <circle cx="0" cy="-20" r="3.5" fill={V.copper} />
      </g>
      {/* legs */}
      {[-1, 1].map((sd) => (
        <g key={sd}>
          <path d={`M${sd * 64} -78 L${sd * 132} -12`} stroke={V.bodyDark} strokeWidth="9" strokeLinecap="round" />
          <path d={`M${sd * 64} -78 L${sd * 132} -12`} stroke="#f6f3ee" strokeWidth="5" strokeLinecap="round" />
          <path d={`M${sd * 40} -72 L${sd * 118} -22`} stroke={V.bodyShade} strokeWidth="3.5" strokeLinecap="round" />
          <path d={`M${sd * 76} -96 L${sd * 118} -22`} stroke={V.bodyShade} strokeWidth="3" strokeLinecap="round" />
          <ellipse cx={sd * 136} cy="-4" rx="30" ry="9" fill={V.bodyShade} />
          <ellipse cx={sd * 136} cy="-7" rx="27" ry="6.5" fill="#fbf9f5" />
          {engines && (
            <g transform={`translate(${sd * 52} -66)`}>
              <path d="M-9 0 L9 0 L13 14 L-13 14Z" fill="#3b3434" />
            </g>
          )}
        </g>
      ))}
      {/* body */}
      <path d="M-98 -110 L-78 -124 L-70 -70 L-88 -78Z" fill={V.bodyShade} />
      <path d="M98 -110 L78 -124 L70 -70 L88 -78Z" fill={V.bodyDark} opacity="0.85" />
      <path d="M-78 -124 L78 -124 L70 -70 L-70 -70Z" fill={`url(#${u}-b)`} />
      <path d="M-62 -110 L62 -110 M-60 -92 L60 -92" stroke={V.bodyShade} strokeWidth="1.5" />
      <path d="M-40 -84 q12 -10 24 0 t24 0" stroke={V.copper} strokeWidth="2.5" fill="none" />
      <rect x="22" y="-104" width="30" height="18" rx="2" fill={V.bodyShade} />
      <circle cx="-48" cy="-82" r="4" fill={V.ink} opacity="0.7" />
      {/* RTG wind covers with fins */}
      {[-1, 1].map((sd) => (
        <g key={`rtg${sd}`} transform={`translate(${sd * 44} -124)`}>
          <rect x="-20" y="-24" width="40" height="24" rx="3" fill="#f6f3ee" stroke={V.bodyDark} strokeWidth="1.5" />
          {[-12, -4, 4, 12].map((fx) => (
            <path key={fx} d={`M${fx} -22 L${fx} -2`} stroke={V.bodyShade} strokeWidth="2" />
          ))}
          {flag && sd === -1 && (
            <g transform="translate(-14 -19)">
              <rect width="16" height="10" fill="#fff" />
              {[0, 1, 2].map((i) => (
                <rect key={i} y={i * 3.4} width="16" height="1.7" fill="#d23b3b" />
              ))}
              <rect width="7" height="5" fill="#2a4aa6" />
            </g>
          )}
        </g>
      ))}
      {/* the two camera "eyes" */}
      <Eye x={-14} y={-124} eyes={eyes} />
      <Eye x={20} y={-124} eyes={eyes} />
      {/* weather boom */}
      <path d="M86 -96 L112 -168" stroke={V.bodyDark} strokeWidth="3.5" />
      <path d="M100 -170 L126 -166 M112 -168 L112 -180" stroke={V.ink} strokeWidth="3" strokeLinecap="round" />
      <circle cx="112" cy="-182" r="4" fill={V.copper} />
      {/* sampler arm */}
      <rect x="44" y="-82" width="26" height="14" rx="3" fill={V.bodyShade} stroke={V.bodyDark} strokeWidth="1.2" />
      {arm === "out" && (
        <g>
          <path d="M66 -76 L200 -18" stroke={V.ink} strokeWidth="5" strokeLinecap="round" />
          <path d="M66 -76 L200 -18" stroke="#8d8378" strokeWidth="2" strokeLinecap="round" />
          <g transform="translate(204 -14) rotate(24)">
            <path d="M-10 -8 L12 -8 L16 6 L-12 6Z" fill={V.copper} />
            <path d="M-12 6 L16 6 L10 12 L-6 12Z" fill={V.rustDark} />
          </g>
        </g>
      )}
      {dusty && <path d="M-78 -124 L78 -124 L74 -116 L-74 -116Z" fill={V.rustLight} opacity="0.5" />}
    </g>
  );
}

/** Viking on its way: the orbiter with the lander tucked in its round shell underneath. */
export function VikingCraft({ x, y, s = 1, rotate = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
      {[-1, 1].map((sd) => (
        <g key={sd}>
          {[-1, 1].map((sv) => (
            <g key={sv} transform={`translate(${sd * 44} ${sv * 13})`}>
              <rect x={sd > 0 ? 0 : -128} y="-10" width="128" height="20" fill="#26386e" stroke="#b9c6f0" strokeWidth="1" />
              {Array.from({ length: 7 }, (_, i) => (
                <path key={i} d={`M${(sd > 0 ? 0 : -128) + 16 + i * 16} -10 L${(sd > 0 ? 0 : -128) + 16 + i * 16} 10`} stroke="#5e74c0" strokeWidth="1" />
              ))}
            </g>
          ))}
        </g>
      ))}
      <path d="M-44 -26 L44 -26 L52 0 L44 26 L-44 26 L-52 0Z" fill="#d79a3c" stroke="#8a5a1c" strokeWidth="1.5" />
      <path d="M-30 -26 L-30 26 M0 -26 L0 26 M30 -26 L30 26" stroke="#8a5a1c" strokeWidth="1" opacity="0.6" />
      <g transform="translate(-20 -36) rotate(-30)">
        <ellipse rx="26" ry="8" fill="#eef0f4" stroke="#8d94a8" strokeWidth="1.5" />
      </g>
      <path d="M-34 26 L-46 60 Q0 76 46 60 L34 26Z" fill="#f2efe9" stroke="#a69d91" strokeWidth="1.5" />
      <ellipse cx="0" cy="62" rx="47" ry="11" fill="#d9d2c6" />
    </g>
  );
}

export function Aeroshell({ x, y, s = 1, rotate = 0, hot = true }) {
  const u = useUid();
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
      <defs>
        <linearGradient id={`${u}-trail`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ffdd8a" stopOpacity="0.9" />
          <stop offset="0.4" stopColor="#ff7a45" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ff4f6a" stopOpacity="0" />
        </linearGradient>
      </defs>
      {hot && <path d="M-46 4 L-14 -170 L14 -170 L46 4Z" fill={`url(#${u}-trail)`} className="anim flicker" />}
      <path d="M-30 -36 L30 -36 L20 -8 L-20 -8Z" fill="#f2efe9" stroke="#a69d91" strokeWidth="1.5" />
      <path d="M-52 -8 Q0 30 52 -8Z" fill={hot ? "#ff8a4c" : "#c9a27e"} />
      <path d="M-52 -8 Q0 14 52 -8" stroke={hot ? "#ffe0a0" : "#e4cfb8"} strokeWidth="3" fill="none" />
      {hot && <ellipse cx="0" cy="8" rx="58" ry="20" fill="#ffb066" opacity="0.35" className="anim breathe" />}
    </g>
  );
}

export function Parachute({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-90 0 Q-86 -70 0 -84 Q86 -70 90 0 Q70 -14 45 0 Q22 -14 0 0 Q-22 -14 -45 0 Q-70 -14 -90 0Z" fill="#fff6ec" stroke="#c9a27e" strokeWidth="1.5" />
      {[-45, 0, 45].map((gx, i) => (
        <path key={gx} d={`M${gx - 22} -2 Q${gx} -${78 - Math.abs(gx) * 0.2} ${gx + 22} -2`} fill={i % 2 ? "#ef8a55" : "#ffd29c"} opacity="0.85" />
      ))}
      <g stroke="#e8dccf" strokeWidth="1.2">
        {[-88, -45, 0, 45, 88].map((lx) => (
          <path key={lx} d={`M${lx} 0 L0 120`} />
        ))}
      </g>
    </g>
  );
}

export function TitanRocket({ x, y, s = 1, label = "VIKING" }) {
  const u = useUid();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <linearGradient id={`${u}-r`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c9cdd8" />
          <stop offset="0.4" stopColor="#ffffff" />
          <stop offset="1" stopColor="#a7aec0" />
        </linearGradient>
      </defs>
      {[-1, 1].map((sd) => (
        <g key={sd} transform={`translate(${sd * 34} 0)`}>
          <rect x="-15" y="-250" width="30" height="244" rx="3" fill={`url(#${u}-r)`} />
          {[-200, -150, -100, -50].map((by) => (
            <rect key={by} x="-15" y={by} width="30" height="5" fill="#2b2f3b" />
          ))}
          <path d="M-15 -250 L0 -282 L15 -250Z" fill="#e9ecf2" />
          <path d="M-13 -6 L13 -6 L17 6 L-17 6Z" fill="#3b3f4c" />
        </g>
      ))}
      <rect x="-19" y="-330" width="38" height="324" fill="#e7c48d" />
      <rect x="-19" y="-330" width="38" height="324" fill={`url(#${u}-r)`} opacity="0.45" />
      <rect x="-22" y="-430" width="44" height="100" rx="4" fill={`url(#${u}-r)`} />
      <path d="M-22 -430 Q-22 -486 0 -500 Q22 -486 22 -430Z" fill="#f4f5f8" />
      {label && (
        <text x="0" y="-380" textAnchor="middle" fontFamily="Jost, sans-serif" fontWeight="700" fontSize="11" fill="#c0392b" transform="rotate(-90 0 -380)">
          {label}
        </text>
      )}
    </g>
  );
}

export function DSNDish({ x, y, s = 1, rotate = -28 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-30 0 L-14 -70 L14 -70 L30 0Z" fill="#cfd3dd" />
      <path d="M-30 0 L30 0" stroke="#9aa1b3" strokeWidth="4" />
      <g transform={`translate(0 -84) rotate(${rotate})`}>
        <path d="M-80 0 Q0 46 80 0 Q0 14 -80 0Z" fill="#b9bfcd" />
        <ellipse cx="0" cy="0" rx="80" ry="18" fill="#eef0f5" stroke="#9aa1b3" strokeWidth="2" />
        <path d="M-40 4 L0 -52 L40 4" stroke="#9aa1b3" strokeWidth="2.5" fill="none" />
        <circle cx="0" cy="-54" r="6" fill="#d8dce6" />
      </g>
    </g>
  );
}
