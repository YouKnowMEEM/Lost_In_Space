import NasaImage from "../storybook/NasaImage";
import React, { useEffect } from "react";

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

  // Apollo lunar module: gold descent stage on four legs, angular grey ascent stage on top.
  lm: (
    <>
      <Shadow rx={96} />
      <path d="M72 116 L40 154 M168 116 L200 154 M96 120 L88 156 M144 120 L152 156" stroke={C.shade} strokeWidth="5" strokeLinecap="round" />
      {[[38, 156], [202, 156], [86, 158], [154, 158]].map(([x, y]) => (
        <ellipse key={x} cx={x} cy={y} rx="11" ry="4" fill={C.body} />
      ))}
      <path d="M66 92 L174 92 L180 124 L60 124 Z" fill={C.gold} />
      <path d="M66 92 L174 92 L172 100 L68 100 Z" fill="#ffd77a" />
      <path d="M84 92 L84 50 L104 34 L148 34 L162 52 L162 92 Z" fill={C.body} />
      <path d="M100 52 L118 52 L114 66 L96 66 Z" fill={C.lens} />
      <path d="M126 52 L144 52 L148 66 L130 66 Z" fill={C.lens} />
      <path d="M118 34 L118 18 M118 18 L132 12" stroke={C.shade} strokeWidth="3" />
      <rect x="154" y="40" width="22" height="14" rx="3" fill={C.shade} />
      <path d="M150 124 L150 140 M156 124 L156 140 M150 130 L156 130 M150 136 L156 136" stroke={C.shade} strokeWidth="2" />
    </>
  ),

  // Lunar Roving Vehicle: open frame, two seats, wire wheels and an umbrella antenna.
  buggy: (
    <>
      <Shadow rx={100} />
      <path d="M36 112 L204 112" stroke={C.shade} strokeWidth="9" strokeLinecap="round" />
      <path d="M30 104 Q56 82 82 104 M158 104 Q184 82 210 104" stroke="#7da0d6" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M92 110 L86 80 M126 110 L120 80 M86 80 L104 80 M120 80 L138 80" stroke="#5b79c4" strokeWidth="6" strokeLinecap="round" />
      <rect x="146" y="72" width="34" height="26" rx="5" fill={C.body} />
      <path d="M190 110 L196 42" stroke={C.shade} strokeWidth="3" />
      <path d="M176 44 Q196 60 216 40 Z" fill={C.gold} />
      <rect x="22" y="86" width="22" height="22" rx="3" fill={C.shade} />
      {[56, 184].map((x) => (
        <g key={x}>
          <circle cx={x} cy="134" r="22" fill={C.dark} />
          <circle cx={x} cy="134" r="22" fill="none" stroke="#c9c3ae" strokeWidth="4" strokeDasharray="5 4" />
          <circle cx={x} cy="134" r="7" fill={C.shade} />
        </g>
      ))}
    </>
  ),

  // Apollo science station: box under a sunshade, helical antenna, finned battery and cables.
  station: (
    <>
      <Shadow rx={100} />
      <path d="M120 130 Q90 150 46 146 M120 130 Q160 150 196 140" stroke="#d8c88e" strokeWidth="2.5" fill="none" />
      <rect x="84" y="94" width="72" height="40" rx="4" fill={C.body} />
      <rect x="84" y="122" width="72" height="8" fill={C.gold} opacity="0.9" />
      <path d="M90 94 L90 74 M150 94 L150 74" stroke={C.shade} strokeWidth="3" />
      <rect x="76" y="66" width="88" height="9" rx="2" fill="#dfe3ec" />
      <path d="M144 66 L156 26" stroke={C.shade} strokeWidth="3" />
      <rect x="150" y="10" width="12" height="30" rx="4" fill={C.body} transform="rotate(16 156 25)" />
      <g transform="translate(46 146)">
        {[-12, -6, 0, 6, 12].map((x) => (
          <path key={x} d={`M${x} 0 L${x} -34`} stroke={C.dark} strokeWidth="3.5" />
        ))}
        <rect x="-8" y="-38" width="16" height="36" rx="4" fill="#5b6276" />
      </g>
      <path d="M180 140 Q196 128 212 140 Z" fill="#e4e1d6" />
      <path d="M190 138 L192 120 Q196 116 200 120 L202 138 Z" fill={C.shade} />
    </>
  ),

  // Viking lander: hexagonal body on three legs, dish on a mast and a long sampling arm.
  viking: (
    <>
      <Shadow rx={96} />
      <path d="M84 116 L52 154 M156 116 L188 154 M120 118 L120 156" stroke={C.shade} strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="50" cy="156" rx="12" ry="4" fill={C.body} />
      <ellipse cx="190" cy="156" rx="12" ry="4" fill={C.body} />
      <ellipse cx="120" cy="158" rx="10" ry="4" fill={C.body} />
      <path d="M72 96 L96 82 L144 82 L168 96 L160 120 L80 120 Z" fill={C.body} />
      <rect x="82" y="104" width="76" height="7" fill={C.gold} opacity="0.85" />
      <path d="M92 82 L80 44" stroke={C.shade} strokeWidth="3" />
      <ellipse cx="78" cy="38" rx="26" ry="9" fill={C.body} transform="rotate(-18 78 38)" />
      <path d="M140 82 L140 60" stroke={C.shade} strokeWidth="4" />
      <rect x="132" y="48" width="16" height="16" rx="3" fill={C.lens} />
      <path d="M168 100 L206 116 L214 140" stroke={C.shade} strokeWidth="3.5" strokeLinecap="round" fill="none" />
    </>
  ),

  // Spirit / Opportunity: wide winged solar deck, six wheels, camera head on a mast.
  mer: (
    <>
      <Shadow rx={100} />
      <path d="M20 92 L84 86 L156 86 L220 92 L216 100 L24 100 Z" fill={C.panel} />
      <PanelGrid x={40} y={88} w={160} h={10} cols={8} rows={1} />
      <rect x="84" y="100" width="72" height="24" rx="3" fill={C.body} />
      <rect x="84" y="114" width="72" height="6" fill={C.gold} opacity="0.9" />
      <path d="M144 86 L144 40" stroke={C.shade} strokeWidth="5" />
      <rect x="126" y="24" width="38" height="18" rx="5" fill={C.body} />
      <circle cx="137" cy="33" r="4.5" fill={C.lens} />
      <circle cx="153" cy="33" r="4.5" fill={C.lens} />
      <path d="M78 126 L102 112 L126 126 L150 112 L174 126" stroke={C.shade} strokeWidth="4" fill="none" />
      {[78, 126, 174].map((x) => (
        <g key={x}>
          <circle cx={x} cy="140" r="14" fill={C.dark} />
          <circle cx={x} cy="140" r="5" fill={C.shade} />
        </g>
      ))}
    </>
  ),

  // Pioneer: a big dish, a box behind it and two booms with finned nuclear batteries.
  pioneer: (
    <>
      <Shadow rx={90} />
      <path d="M100 104 L40 146 M140 104 L200 146 M150 88 L226 60" stroke={C.shade} strokeWidth="3.5" />
      {[[40, 146], [200, 146]].map(([x, y]) => (
        <g key={x}>
          <rect x={x - 12} y={y - 8} width="24" height="16" rx="3" fill={C.dark} />
          <path d={`M${x - 6} ${y - 12} V${y + 12} M${x} ${y - 12} V${y + 12} M${x + 6} ${y - 12} V${y + 12}`} stroke={C.shade} strokeWidth="2" />
        </g>
      ))}
      <rect x="220" y="54" width="12" height="12" rx="2" fill={C.body} />
      <path d="M96 108 L144 108 L150 122 L90 122 Z" fill={C.gold} />
      <ellipse cx="120" cy="70" rx="58" ry="40" fill={C.body} />
      <ellipse cx="120" cy="70" rx="46" ry="31" fill="none" stroke={C.shade} strokeWidth="2" />
      <path d="M120 70 L120 22" stroke={C.shade} strokeWidth="2.5" />
      <circle cx="120" cy="20" r="4" fill={C.shade} />
    </>
  ),

  // Voyager: a white dish on a ten-sided bus, a long magnetometer boom and an instrument arm.
  voyager: (
    <>
      <Shadow rx={90} />
      <path d="M104 110 L24 64 M136 112 L208 150" stroke={C.shade} strokeWidth="3" />
      <rect x="196" y="140" width="22" height="16" rx="3" fill={C.dark} />
      <circle cx="22" cy="62" r="5" fill={C.body} />
      <path d="M92 104 L148 104 L156 128 L84 128 Z" fill={C.gold} />
      <path d="M100 128 L96 150 M140 128 L144 150" stroke={C.shade} strokeWidth="3" />
      <ellipse cx="120" cy="72" rx="64" ry="34" fill={C.body} />
      <ellipse cx="120" cy="72" rx="50" ry="25" fill="none" stroke={C.shade} strokeWidth="2" />
      <path d="M120 72 L120 30 M104 52 L120 30 L136 52" stroke={C.shade} strokeWidth="2.5" fill="none" />
      <circle cx="148" cy="116" r="9" fill={C.gold} stroke={C.dark} strokeWidth="1.5" />
    </>
  ),

  // NEAR Shoemaker: an octagonal gold body with four square solar panels around a dish.
  near: (
    <>
      <Shadow rx={90} />
      <rect x="18" y="62" width="62" height="44" rx="2" fill={C.panel} />
      <PanelGrid x={18} y={62} w={62} h={44} cols={4} rows={3} />
      <rect x="160" y="62" width="62" height="44" rx="2" fill={C.panel} />
      <PanelGrid x={160} y={62} w={62} h={44} cols={4} rows={3} />
      <rect x="98" y="10" width="44" height="30" rx="2" fill={C.panel} />
      <PanelGrid x={98} y={10} w={44} h={30} cols={3} rows={2} />
      <rect x="98" y="128" width="44" height="26" rx="2" fill={C.panel} />
      <PanelGrid x={98} y={128} w={44} h={26} cols={3} rows={2} />
      <path d="M96 48 L144 48 L162 66 L162 102 L144 120 L96 120 L78 102 L78 66 Z" fill={C.gold} />
      <circle cx="120" cy="84" r="30" fill={C.body} />
      <circle cx="120" cy="84" r="22" fill="none" stroke={C.shade} strokeWidth="2" />
      <circle cx="120" cy="84" r="5" fill={C.shade} />
    </>
  ),

  // Dawn: a gold box with very long solar wings and a dish.
  dawn: (
    <>
      <Shadow rx={100} />
      <rect x="4" y="76" width="88" height="22" rx="2" fill={C.panel} />
      <PanelGrid x={4} y={76} w={88} h={22} cols={8} rows={2} />
      <rect x="148" y="76" width="88" height="22" rx="2" fill={C.panel} />
      <PanelGrid x={148} y={76} w={88} h={22} cols={8} rows={2} />
      <path d="M92 87 L100 87 M140 87 L148 87" stroke={C.shade} strokeWidth="3" />
      <rect x="100" y="64" width="40" height="46" rx="4" fill={C.gold} />
      <ellipse cx="120" cy="56" rx="24" ry="8" fill={C.body} />
      <path d="M112 110 L128 110 L132 120 L108 120 Z" fill={C.dark} />
      <path d="M112 122 L128 122 L140 158 L100 158 Z" fill="#7cc7f5" opacity="0.45" />
    </>
  ),

  // Kepler: a tall telescope tube with a slanted sunshade and a solar panel along its back.
  kepler: (
    <>
      <Shadow rx={70} />
      <path d="M78 44 L94 30 L94 140 L78 150 Z" fill={C.panel} />
      <PanelGrid x={78} y={40} w={16} h={104} cols={1} rows={5} />
      <rect x="96" y="34" width="56" height="104" rx="8" fill={C.body} />
      <path d="M96 40 L152 14 L152 40 L96 54 Z" fill="#dfe3ec" />
      <ellipse cx="124" cy="40" rx="24" ry="6" fill={C.lens} />
      <path d="M96 138 L152 138 L146 156 L102 156 Z" fill={C.gold} />
      <path d="M100 80 L148 80 M100 112 L148 112" stroke="#dfe3ec" strokeWidth="2" />
    </>
  ),
};

// Where a mission number is stamped on the body, so five Surveyors do not look like one.
const STAMP = {
  surveyor: [120, 107, 13],
  ranger: [120, 118, 17],
  lm: [120, 118, 16],
  buggy: [163, 91, 14],
  viking: [120, 101, 13],
  pioneer: [120, 76, 18],
  voyager: [120, 80, 18],
};

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

/** Tells the page, once, that a photo could not be loaded from anywhere. */
function PhotoFailed({ onFail }) {
  useEffect(() => {
    onFail?.();
  }, [onFail]);
  return null;
}

/**
 * The picture for a catalog entry. With `photo`, its real NASA photo comes first (falling back
 * to the drawing if it cannot load); otherwise a render if there is one, then its portrait.
 */
export default function ObjectArt({ item, className = "", eager = false, alt, photo = false, onPhotoFail }) {
  const label = alt ?? `${item.short}, ${item.type || "spacecraft"}`;
  if (photo && item.photo) {
    return (
      <NasaImage
        src={item.photo.src}
        alt={alt ?? item.photo.caption}
        className={`sx-photo ${className}`}
        eager={eager}
        onGiveUp={() => (
          <>
            <PhotoFailed onFail={onPhotoFail} />
            <ObjectArt item={item.artShared && item.glyph ? { ...item, art: null } : item} className={className} eager={eager} alt={alt} />
          </>
        )}
      />
    );
  }
  if (item.art) {
    return <img className={`sx-art-img ${className}`} src={item.art} alt={label} loading={eager ? "eager" : "lazy"} decoding="async" width="380" height="320" />;
  }
  // The mission number (Ranger 7, Apollo 14, Viking 2...) is stamped on the portrait.
  const num = (item.short.match(/\d+/) || (item.mission || "").match(/\d+/) || [])[0];
  return <Glyph kind={item.glyph || "surveyor"} title={alt === "" ? undefined : label} className={className} stamp={num} />;
}
