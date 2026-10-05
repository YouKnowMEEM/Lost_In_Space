import React, { useId } from "react";

/* Shared building blocks for the storybook illustrations.
   Every scene is an <svg viewBox="0 0 600 760">; the middle 600×600 (y 80–680) is the
   safe area that stays visible when phones crop the picture to a square. */

export const W = 600;
export const H = 760;

export function useUid() {
  return useId().replace(/[^a-zA-Z0-9_-]/g, "");
}

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function Frame({ label, children, className = "" }) {
  return (
    <svg
      className={`scene ${className}`}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label}
    >
      {children}
    </svg>
  );
}

export function Sky({ id, stops }) {
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          {stops.map(([o, c]) => (
            <stop key={o} offset={o} stopColor={c} />
          ))}
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id})`} />
    </>
  );
}

export function Stars({ seed = 1, count = 70, top = 0, bottom = 520, color = "#fff6dc", twinkle = 0.35 }) {
  const r = rng(seed);
  const stars = Array.from({ length: count }, (_, i) => {
    const big = r() < 0.12;
    return {
      x: r() * W,
      y: top + r() * (bottom - top),
      s: big ? 1.5 + r() * 1.3 : 0.6 + r() * 0.9,
      o: 0.45 + r() * 0.55,
      tw: r() < twinkle,
      d: (r() * 4).toFixed(2),
      big,
      i,
    };
  });
  return (
    <g>
      {stars.map((s) =>
        s.big ? (
          <g
            key={s.i}
            transform={`translate(${s.x} ${s.y})`}
            className={s.tw ? "anim tw" : undefined}
            style={s.tw ? { animationDelay: `${s.d}s` } : undefined}
            opacity={s.o}
          >
            <path
              d={`M0 ${-s.s * 3} L${s.s * 0.55} ${-s.s * 0.55} L${s.s * 3} 0 L${s.s * 0.55} ${s.s * 0.55} L0 ${
                s.s * 3
              } L${-s.s * 0.55} ${s.s * 0.55} L${-s.s * 3} 0 L${-s.s * 0.55} ${-s.s * 0.55}Z`}
              fill={color}
            />
          </g>
        ) : (
          <circle
            key={s.i}
            cx={s.x}
            cy={s.y}
            r={s.s}
            fill={color}
            opacity={s.o}
            className={s.tw ? "anim tw" : undefined}
            style={s.tw ? { animationDelay: `${s.d}s` } : undefined}
          />
        )
      )}
    </g>
  );
}

/** The Earth as seen from the Moon: oceans, a few friendly continents, clouds, a night side. */
export function Earth({ cx, cy, r, tilt = -20, night = 0.42, glow = true }) {
  const u = useUid();
  return (
    <g>
      <defs>
        <radialGradient id={`${u}-glow`}>
          <stop offset="0.55" stopColor="#7fb2ff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#7fb2ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${u}-sea`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#6fb0ff" />
          <stop offset="0.6" stopColor="#2f6fe0" />
          <stop offset="1" stopColor="#1d3f9a" />
        </radialGradient>
        <clipPath id={`${u}-clip`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      {glow && <circle cx={cx} cy={cy} r={r * 1.55} fill={`url(#${u}-glow)`} />}
      <circle cx={cx} cy={cy} r={r} fill={`url(#${u}-sea)`} />
      <g clipPath={`url(#${u}-clip)`} transform={`rotate(${tilt} ${cx} ${cy})`}>
        <g transform={`translate(${cx} ${cy}) scale(${r / 100})`}>
          <path d="M-58 -60c18-14 44-10 52 4 6 12-6 22 2 34 8 12 26 6 30 20 4 16-14 30-30 28-14-2-16-18-30-20-16-2-30 6-38-8-8-14 6-26 2-38-2-8 4-14 12-20z" fill="#7fca73" />
          <path d="M20 10c16-6 34 2 40 18 6 18-6 40-22 46-16 6-26-8-24-24 2-14-10-12-10-24 0-8 6-12 16-16z" fill="#8bd27e" />
          <path d="M40 -70c12-4 26 4 26 14s-12 12-20 10-14-18-6-24z" fill="#9bd889" />
          <path d="M-88 10c8-4 16 2 14 10s-10 10-16 6-6-12 2-16z" fill="#8ccf7e" />
          <path d="M-96 -20c30-10 60 4 90-6s54-22 96-4" stroke="#fff" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.55" />
          <path d="M-90 40c26 8 44-6 70 2s44 18 76 6" stroke="#fff" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.5" />
          <path d="M-40 -88c20 6 40-2 60 4" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.45" />
          <path d="M-20 80c20 4 34-4 52 0" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.45" />
        </g>
        <ellipse cx={cx + r * 0.9} cy={cy} rx={r * 1.15} ry={r * 1.35} fill="#06081c" opacity={night} />
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#bcd6ff" strokeOpacity="0.5" strokeWidth="1.5" />
    </g>
  );
}

/** Three sleepy Z's drifting up from (x, y). */
export function Zzz({ x, y, size = 26, color = "#fff2c6" }) {
  return (
    <g
      fill={color}
      stroke="#1a2150"
      strokeWidth="2"
      paintOrder="stroke"
      fontFamily="Fraunces, Georgia, serif"
      fontWeight="800"
    >
      {[0, 1, 2].map((i) => (
        <text
          key={i}
          x={x + i * size * 0.85}
          y={y - i * size * 1.05}
          fontSize={size * (0.85 + i * 0.32)}
          className="anim zzz"
          style={{ animationDelay: `${i * 1.1}s` }}
        >
          Z
        </text>
      ))}
    </g>
  );
}

/** Soft radial light, for lamps, glows and suns. */
export function Glow({ cx, cy, r, color, opacity = 0.6, className }) {
  const u = useUid();
  return (
    <g className={className}>
      <defs>
        <radialGradient id={`${u}-g`}>
          <stop offset="0" stopColor={color} stopOpacity={opacity} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${u}-g)`} />
    </g>
  );
}

/** Engine flame pointing down from (x, y). */
export function Flame({ x, y, w = 40, h = 110, flicker = true }) {
  const u = useUid();
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <linearGradient id={`${u}-f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff8dc" />
          <stop offset="0.3" stopColor="#ffd36b" />
          <stop offset="0.75" stopColor="#ff8a3d" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ff5a3d" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className={flicker ? "anim flame" : undefined}>
        <path d={`M${-w / 2} 0 Q${-w * 0.7} ${h * 0.45} 0 ${h} Q${w * 0.7} ${h * 0.45} ${w / 2} 0Z`} fill={`url(#${u}-f)`} />
        <path d={`M${-w * 0.22} 0 Q${-w * 0.3} ${h * 0.3} 0 ${h * 0.55} Q${w * 0.3} ${h * 0.3} ${w * 0.22} 0Z`} fill="#fffbe8" opacity="0.9" />
      </g>
    </g>
  );
}

/** Rounded puffs of dust or smoke. */
export function Puffs({ x, y, w, color = "#cfd2de", opacity = 0.75, seed = 4, count = 9, className = "anim drift" }) {
  const r = rng(seed);
  return (
    <g opacity={opacity} className={className}>
      {Array.from({ length: count }, (_, i) => {
        const px = x - w / 2 + (i / (count - 1)) * w + (r() - 0.5) * 16;
        const s = 14 + r() * 22;
        return <circle key={i} cx={px} cy={y - r() * 18} r={s} fill={color} />;
      })}
    </g>
  );
}

/** A small orbiter crossing the sky, used for LRO and MRO. */
export function Orbiter({ x, y, s = 1, className = "anim orbit", panel = "#3f5bd8" }) {
  return (
    <g className={className}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x="-34" y="-5" width="24" height="10" fill={panel} stroke="#c9d4ff" strokeWidth="1" />
        <rect x="10" y="-5" width="24" height="10" fill={panel} stroke="#c9d4ff" strokeWidth="1" />
        <rect x="-10" y="-9" width="20" height="18" rx="2" fill="#e8c46a" />
        <rect x="-6" y="9" width="12" height="6" fill="#9aa3b8" />
        <circle cx="0" cy="-12" r="5" fill="#d9dde8" />
      </g>
    </g>
  );
}
