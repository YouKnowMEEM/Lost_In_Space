import React from "react";

/*
 * Simple illustrated portraits for machines that have no 3D render in the project.
 * They are stylised, not engineering drawings: each shows the features a visitor would
 * recognise (legs, mast, dish, solar panels, wheels), in the same palette as the site.
 */

const C = {
  body: "#e8ecf6",
  shade: "#aab5d0",
  dark: "#4a5578",
  gold: "#f2b640",
  panel: "#2e4a90",
  grid: "#7f9de0",
  lens: "#1b2240",
};

const Shadow = ({ rx = 80 }) => <ellipse cx="120" cy="160" rx={rx} ry="8" fill="#000" opacity="0.28" />;

function PanelGrid({ x, y, w, h, cols = 4, rows = 2 }) {
  const lines = [];
  for (let i = 1; i < cols; i += 1) lines.push(<line key={`c${i}`} x1={x + (w / cols) * i} y1={y} x2={x + (w / cols) * i} y2={y + h} />);
  for (let j = 1; j < rows; j += 1) lines.push(<line key={`r${j}`} x1={x} y1={y + (h / rows) * j} x2={x + w} y2={y + (h / rows) * j} />);
  return <g stroke={C.grid} strokeWidth="1" opacity="0.8">{lines}</g>;
}

const SHAPES = {
  // Three-legged robotic lander on a tall mast: Surveyor.
  surveyor: (
    <>
      <Shadow />
      <path d="M104 110 L56 152 M136 110 L186 152 M120 114 L120 154" stroke={C.shade} strokeWidth="5" strokeLinecap="round" />
      <circle cx="54" cy="153" r="8" fill={C.body} />
      <circle cx="188" cy="153" r="8" fill={C.body} />
      <ellipse cx="120" cy="156" rx="10" ry="4" fill={C.body} />
      <path d="M90 78 L150 78 L158 110 L82 110 Z" fill={C.body} />
      <rect x="90" y="86" width="64" height="8" fill={C.gold} opacity="0.9" />
      <rect x="117" y="40" width="6" height="40" fill={C.shade} />
      <path d="M84 30 L156 30 L148 46 L92 46 Z" fill={C.panel} />
      <PanelGrid x={90} y={30} w={60} h={16} cols={5} rows={1} />
      <circle cx="120" cy="64" r="7" fill={C.lens} stroke={C.shade} strokeWidth="2" />
      <path d="M92 88 L66 56" stroke={C.shade} strokeWidth="2.5" />
      <circle cx="65" cy="54" r="3.5" fill={C.body} />
      <ellipse cx="166" cy="70" rx="12" ry="6" fill={C.body} transform="rotate(-28 166 70)" />
      <path d="M150 90 L162 74" stroke={C.shade} strokeWidth="2" />
    </>
  ),

  // Ranger: a six-sided bus with two huge solar wings, a dish and a camera tower.
  ranger: (
    <>
      <Shadow rx={90} />
      <rect x="14" y="62" width="82" height="46" rx="2" fill={C.panel} />
      <PanelGrid x={14} y={62} w={82} h={46} cols={6} rows={3} />
      <rect x="144" y="62" width="82" height="46" rx="2" fill={C.panel} />
      <PanelGrid x={144} y={62} w={82} h={46} cols={6} rows={3} />
      <rect x="96" y="80" width="48" height="12" fill={C.shade} />
      <path d="M100 70 L140 70 L146 124 L94 124 Z" fill={C.body} />
      <rect x="100" y="88" width="40" height="6" fill={C.gold} opacity="0.9" />
      <path d="M120 70 L120 28" stroke={C.shade} strokeWidth="4" />
      <rect x="110" y="16" width="20" height="14" rx="3" fill={C.lens} stroke={C.shade} strokeWidth="2" />
      <circle cx="120" cy="23" r="4" fill="#79a7ff" />
      <ellipse cx="120" cy="140" rx="30" ry="9" fill={C.body} />
      <ellipse cx="120" cy="138" rx="24" ry="6" fill={C.shade} />
      <path d="M120 126 L120 138" stroke={C.shade} strokeWidth="3" />
    </>
  ),

  // Lunar Prospector: a spinning drum with three long booms.
  prospector: (
    <>
      <Shadow rx={70} />
      <path d="M92 100 L20 100" stroke={C.shade} strokeWidth="3" />
      <rect x="12" y="94" width="12" height="12" rx="2" fill={C.body} />
      <path d="M148 100 L222 100" stroke={C.shade} strokeWidth="3" />
      <rect x="216" y="94" width="12" height="12" rx="2" fill={C.body} />
      <path d="M120 70 L120 14" stroke={C.shade} strokeWidth="3" />
      <circle cx="120" cy="12" r="6" fill={C.body} />
      <rect x="86" y="70" width="68" height="62" fill={C.body} />
      <ellipse cx="120" cy="70" rx="34" ry="9" fill={C.shade} />
      <ellipse cx="120" cy="132" rx="34" ry="9" fill={C.shade} />
      <rect x="86" y="86" width="68" height="10" fill={C.panel} />
      <PanelGrid x={86} y={86} w={68} h={10} cols={8} rows={1} />
      <rect x="86" y="106" width="68" height="6" fill={C.gold} opacity="0.9" />
      <circle cx="120" cy="124" r="5" fill={C.lens} />
    </>
  ),

  // Mars Pathfinder: opened petals around a central box, with the little Sojourner rover in front.
  pathfinder: (
    <>
      <Shadow rx={96} />
      <path d="M30 152 L100 112 L142 152 Z" fill={C.shade} />
      <path d="M100 112 L176 120 L210 152 L142 152 Z" fill={C.body} />
      <path d="M100 112 L142 152 L90 152 Z" fill="#cdd5e8" />
      <rect x="92" y="82" width="46" height="34" fill={C.body} />
      <rect x="92" y="96" width="46" height="6" fill={C.gold} opacity="0.9" />
      <path d="M126 82 L126 38" stroke={C.shade} strokeWidth="4" />
      <rect x="116" y="26" width="22" height="14" rx="3" fill={C.lens} stroke={C.shade} strokeWidth="2" />
      <circle cx="123" cy="33" r="4" fill="#79a7ff" />
      <path d="M92 88 L70 70" stroke={C.shade} strokeWidth="2.5" />
      <circle cx="68" cy="68" r="3.5" fill={C.body} />
      {/* Sojourner */}
      <rect x="160" y="132" width="40" height="12" rx="2" fill={C.body} />
      <rect x="160" y="128" width="40" height="5" fill={C.panel} />
      <circle cx="166" cy="148" r="6" fill={C.dark} />
      <circle cx="180" cy="148" r="6" fill={C.dark} />
      <circle cx="194" cy="148" r="6" fill={C.dark} />
    </>
  ),

  // Car-sized rover with a mast, an arm, six wheels and a tail: Curiosity and Perseverance.
  rover: (
    <>
      <Shadow rx={92} />
      <rect x="74" y="88" width="102" height="30" rx="4" fill={C.body} />
      <rect x="74" y="98" width="102" height="6" fill={C.gold} opacity="0.9" />
      <rect x="64" y="84" width="22" height="22" rx="3" fill={C.shade} />
      <path d="M146 88 L146 44" stroke={C.shade} strokeWidth="5" />
      <rect x="132" y="28" width="30" height="20" rx="3" fill={C.body} />
      <circle cx="140" cy="38" r="5" fill={C.lens} />
      <circle cx="154" cy="38" r="5" fill={C.lens} />
      <path d="M78 104 L44 120 L30 112" stroke={C.shade} strokeWidth="5" strokeLinecap="round" fill="none" />
      <rect x="20" y="104" width="16" height="14" rx="3" fill={C.dark} />
      <path d="M176 100 L206 94" stroke={C.shade} strokeWidth="9" strokeLinecap="round" />
      <path d="M198 86 L214 82 M198 96 L214 94 M200 104 L214 106" stroke={C.dark} strokeWidth="2.5" />
      <path d="M84 118 L84 134 M124 118 L124 134 M164 118 L164 134" stroke={C.shade} strokeWidth="4" />
      {[84, 124, 164].map((x) => (
        <g key={x}>
          <circle cx={x} cy="142" r="15" fill={C.dark} />
          <circle cx={x} cy="142" r="6" fill={C.shade} />
        </g>
      ))}
    </>
  ),

  // Phoenix: a low deck on three legs with two big round solar panels and a long arm.
  phoenix: (
    <>
      <Shadow rx={96} />
      <path d="M96 112 L74 154 M144 112 L168 154 M120 114 L120 156" stroke={C.shade} strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="72" cy="155" rx="9" ry="4" fill={C.body} />
      <ellipse cx="170" cy="155" rx="9" ry="4" fill={C.body} />
      <ellipse cx="120" cy="158" rx="9" ry="4" fill={C.body} />
      <ellipse cx="46" cy="84" rx="36" ry="26" fill={C.panel} />
      <ellipse cx="46" cy="84" rx="36" ry="26" fill="none" stroke={C.grid} strokeWidth="1.5" strokeDasharray="4 5" />
      <ellipse cx="194" cy="84" rx="36" ry="26" fill={C.panel} />
      <ellipse cx="194" cy="84" rx="36" ry="26" fill="none" stroke={C.grid} strokeWidth="1.5" strokeDasharray="4 5" />
      <rect x="80" y="94" width="80" height="22" rx="3" fill={C.body} />
      <rect x="80" y="102" width="80" height="5" fill={C.gold} opacity="0.9" />
      <path d="M120 94 L120 52" stroke={C.shade} strokeWidth="4" />
      <rect x="108" y="40" width="24" height="14" rx="3" fill={C.lens} stroke={C.shade} strokeWidth="2" />
      <circle cx="115" cy="47" r="3.5" fill="#79a7ff" />
      <circle cx="125" cy="47" r="3.5" fill="#79a7ff" />
      <path d="M82 108 L56 132 L34 124" stroke={C.shade} strokeWidth="4" strokeLinecap="round" fill="none" />
      <rect x="22" y="119" width="14" height="10" rx="2" fill={C.dark} />
    </>
  ),

  // New Horizons: a big dish on a triangular body, with the nuclear power unit on a boom.
  horizons: (
    <>
      <Shadow rx={90} />
      <path d="M120 28 L120 52" stroke={C.shade} strokeWidth="3" />
      <ellipse cx="120" cy="64" rx="62" ry="18" fill={C.shade} transform="rotate(-8 120 64)" />
      <ellipse cx="120" cy="60" rx="56" ry="14" fill={C.body} transform="rotate(-8 120 64)" />
      <path d="M86 74 L154 74 L170 128 L70 128 Z" fill={C.body} />
      <path d="M96 74 L144 74 L150 92 L90 92 Z" fill={C.gold} opacity="0.92" />
      <rect x="86" y="100" width="68" height="6" fill={C.gold} opacity="0.9" />
      <circle cx="112" cy="116" r="5" fill={C.lens} />
      <rect x="170" y="100" width="46" height="14" rx="2" fill={C.dark} />
      <path d="M176 100 L176 114 M184 100 L184 114 M192 100 L192 114 M200 100 L200 114 M208 100 L208 114" stroke={C.shade} strokeWidth="2.5" />
      <path d="M154 108 L170 107" stroke={C.shade} strokeWidth="4" />
      <path d="M76 120 L44 138 M60 138 L36 138" stroke={C.shade} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
};

export const GLYPH_KEYS = Object.keys(SHAPES);

// Where a mission number is stamped on the body, so five Surveyors do not look like one.
const STAMP = { surveyor: [120, 107, 13], ranger: [120, 118, 17] };

/** A glyph drawn as an inline SVG. `title` becomes its accessible name when given; `stamp` is a short number printed on the body. */
export function Glyph({ kind, title, className = "", stamp }) {
  const shape = SHAPES[kind];
  if (!shape) return null;
  const at = STAMP[kind];
  return (
    <svg className={`sx-glyph ${className}`} viewBox="0 0 240 180" role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : "true"} focusable="false">
      {shape}
      {stamp && at && (
        <text x={at[0]} y={at[1]} textAnchor="middle" fontFamily="Jost, system-ui, sans-serif" fontWeight="700" fontSize={at[2]} fill={C.dark}>
          {stamp}
        </text>
      )}
    </svg>
  );
}

/** The picture for a catalog entry: a render if there is one, otherwise its illustrated portrait. */
export default function ObjectArt({ item, className = "", eager = false, alt }) {
  const label = alt ?? `${item.short}, ${item.type || "spacecraft"}`;
  if (item.art) {
    return <img className={`sx-art-img ${className}`} src={item.art} alt={label} loading={eager ? "eager" : "lazy"} decoding="async" width="380" height="320" />;
  }
  const num = (item.short.match(/\d+/) || [])[0];
  return <Glyph kind={item.glyph || "surveyor"} title={alt === "" ? undefined : label} className={className} stamp={num} />;
}
