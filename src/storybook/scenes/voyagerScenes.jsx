import React from "react";
import { Earth, Flame, Frame, Glow, Puffs, Sky, Stars, Zzz, useUid, W, H } from "./common";
import { TitanRocket } from "./vikingParts";
import {
  BigDish,
  FarSun,
  GoldenRecord,
  HazyMoon,
  IceGiant,
  Io,
  Jupiter,
  MilkyWay,
  Saturn,
  SignalWaves,
  SmallPlanet,
  SPACE_SKIES,
  VoyagerCraft,
} from "./voyagerParts";

function Space({ variant = "deep", stars = 90, seed = 1, milky = false, milkyY = 280 }) {
  const u = useUid();
  return (
    <>
      <Sky id={`${u}-sky`} stops={SPACE_SKIES[variant]} />
      {milky && <MilkyWay seed={seed + 5} y={milkyY} />}
      <Stars seed={seed} count={stars} bottom={H} color="#f4f7ff" />
    </>
  );
}

function SpeechBubble({ x, y, text, w = 120, lang, flip = false, delay = 0 }) {
  return (
    <g className="anim hover-soft" style={{ animationDelay: `${delay}s` }}>
      <g transform={`translate(${x} ${y})`}>
        <rect x={-w / 2} y="-24" width={w} height="46" rx="23" fill="#fffaf0" />
        <path d={flip ? "M18 18 L30 40 L34 16Z" : "M-18 18 L-30 40 L-34 16Z"} fill="#fffaf0" />
        <text x="0" y="8" textAnchor="middle" lang={lang} fontFamily="Fraunces, 'Noto Sans Bengali', 'Nirmala UI', Vrinda, Georgia, serif" fontWeight="800" fontSize="21" fill="#1b2340">
          {text}
        </text>
      </g>
    </g>
  );
}

function Note({ x, y, s = 1, color = "#ffe08a", delay = 0 }) {
  return (
    <g className="anim hover" style={{ animationDelay: `${delay}s` }}>
      <g transform={`translate(${x} ${y}) scale(${s})`} fill={color}>
        <ellipse cx="-8" cy="14" rx="9" ry="7" transform="rotate(-20 -8 14)" />
        <ellipse cx="22" cy="6" rx="9" ry="7" transform="rotate(-20 22 6)" />
        <path d="M-1 12 L-1 -26 L29 -34 L29 4" stroke={color} strokeWidth="4" fill="none" />
        <path d="M-1 -26 L29 -34 L29 -24 L-1 -16Z" />
      </g>
    </g>
  );
}

function Viewfinder({ x, y, size = 70, color = "#bfe6ff" }) {
  const h = size / 2;
  const c = size * 0.22;
  return (
    <g stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.85">
      <path d={`M${x - h} ${y - h + c} V${y - h} H${x - h + c}`} />
      <path d={`M${x + h - c} ${y - h} H${x + h} V${y - h + c}`} />
      <path d={`M${x + h} ${y + h - c} V${y + h} H${x + h - c}`} />
      <path d={`M${x - h + c} ${y + h} H${x - h} V${y + h - c}`} />
    </g>
  );
}

/* ------------------------------------------------------------------ scenes */

function Cover() {
  return (
    <Frame label="Voyager 1, a spacecraft with a big white dish for a face, sailing through the stars with the Milky Way behind it">
      <Space variant="deep" stars={95} seed={31} milky milkyY={330} />
      <FarSun cx={92} cy={598} r={7} halo={64} />
      <Saturn cx={505} cy={628} r={15} tilt={-12} />
      <g className="anim hover-soft">
        <VoyagerCraft x={286} y={430} s={1.12} rotate={-8} />
      </g>
    </Frame>
  );
}

function Farthest() {
  return (
    <Frame label="A tiny Voyager 1 far away in the dark, with a dotted trail leading back to a small, bright Sun">
      <Space variant="deep" stars={150} seed={41} />
      <Glow cx={470} cy={210} r={150} color="#5f7bff" opacity={0.16} />
      <FarSun cx={104} cy={604} r={8} halo={86} />
      <path d="M104 604 C220 568 330 470 404 330 S462 236 470 216" stroke="#9fdcff" strokeWidth="2.5" strokeDasharray="2 12" strokeLinecap="round" fill="none" opacity="0.7" />
      <SmallPlanet cx={150} cy={590} r={4} color="#5aa8ff" />
      <SmallPlanet cx={196} cy={566} r={9} color="#e0b384" />
      <SmallPlanet cx={262} cy={530} r={7} color="#ecd6a6" />
      <SmallPlanet cx={318} cy={482} r={5} color="#9fe8ee" />
      <SmallPlanet cx={356} cy={436} r={5} color="#6f9cff" />
      <g className="anim hover-soft">
        <Glow cx={476} cy={206} r={48} color="#cfe6ff" opacity={0.35} />
        <VoyagerCraft x={476} y={206} s={0.3} rotate={-14} />
      </g>
    </Frame>
  );
}

function LineUp() {
  return (
    <Frame label="The Sun, Earth and the giant planets lined up in a curve, with the dotted paths of the two Voyager twins swinging from planet to planet">
      <Space variant="indigo" stars={80} seed={52} />
      <Glow cx={-40} cy={400} r={260} color="#ffd98a" opacity={0.6} />
      <circle cx={-40} cy={400} r={86} fill="#fff1c4" />
      <path d="M118 478 Q190 446 228 432 Q300 392 356 336 Q392 286 420 210 Q432 150 424 84" stroke="#9fdcff" strokeWidth="3" strokeDasharray="3 10" strokeLinecap="round" fill="none" />
      <path d="M118 478 Q200 470 238 446 Q316 404 368 340 Q420 290 462 254 Q508 210 542 182 Q574 160 610 150" stroke="#ffd28a" strokeWidth="3" strokeDasharray="3 10" strokeLinecap="round" fill="none" />
      <SmallPlanet cx={118} cy={478} r={8} color="#5aa8ff" />
      <Jupiter cx={232} cy={438} r={44} />
      <Saturn cx={364} cy={336} r={27} tilt={-16} />
      <IceGiant cx={462} cy={252} r={17} color="#a5ecf0" dark="#4aa3b4" />
      <IceGiant cx={542} cy={182} r={16} color="#7aa8ff" dark="#2f4fb0" />
      <g className="anim hover">
        <VoyagerCraft x={120} y={590} s={0.24} eyes="happy" rotate={-10} />
      </g>
      <g className="anim hover" style={{ animationDelay: "1.4s" }}>
        <VoyagerCraft x={236} y={624} s={0.24} eyes="happy" rotate={6} />
      </g>
    </Frame>
  );
}

function Launch() {
  const u = useUid();
  return (
    <Frame label="A tall Titan rocket lifting off from Florida on a bright morning, with Voyager 1 tucked inside its nose">
      <Sky id={`${u}-sky`} stops={[[0, "#4f8fdc"], [0.55, "#9fcbf1"], [0.86, "#ffe7c4"], [1, "#ffd9a3"]]} />
      <Glow cx={470} cy={560} r={200} color="#fff3d6" opacity={0.65} />
      <path d={`M0 600 L${W} 590 L${W} ${H} L0 ${H}Z`} fill="#3f86b8" />
      <path d={`M0 626 Q150 610 300 624 T${W} 618 L${W} ${H} L0 ${H}Z`} fill="#6f8f4e" />
      <path d={`M0 664 Q160 648 320 662 T${W} 654 L${W} ${H} L0 ${H}Z`} fill="#55743c" />
      <g stroke="#d1d6e0" strokeWidth="3" fill="none" opacity="0.9">
        <path d="M150 640 L150 330 M190 640 L190 330" />
        {Array.from({ length: 10 }, (_, i) => (
          <path key={i} d={`M150 ${640 - i * 31} L190 ${609 - i * 31}`} />
        ))}
      </g>
      <g stroke="#2d3446" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.7">
        <path d="M418 268 q8 -8 16 0 q8 -8 16 0" />
        <path d="M470 236 q6 -6 12 0 q6 -6 12 0" />
      </g>
      <g className="anim liftoff">
        <Flame x={266} y={604} w={34} h={120} />
        <Flame x={334} y={604} w={34} h={120} />
        <TitanRocket x={300} y={600} s={0.9} label="" />
      </g>
      <Puffs x={300} y={668} w={420} color="#f3f1ec" opacity={0.92} seed={9} count={11} className="anim billow-slow" />
      <Puffs x={300} y={694} w={520} color="#e4e1da" opacity={0.85} seed={12} count={12} className="anim billow" />
    </Frame>
  );
}

function Whale({ x, y, s = 1, flip = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M0 0 C18 -34 96 -40 126 -8 C136 4 132 20 114 24 C72 36 22 30 0 0Z" fill="#7fb2ff" />
      <path d="M14 10 C40 30 90 30 118 18 C96 30 48 32 14 10Z" fill="#d4e7ff" />
      <path d="M2 2 L-24 -20 L-16 2 L-28 18Z" fill="#6aa0f0" />
      <circle cx="98" cy="-4" r="3.6" fill="#1b2340" />
      <path d="M90 6 q6 5 12 0" stroke="#1b2340" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <g stroke="#bfe0ff" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M80 -34 q-6 -14 -16 -18" />
        <path d="M84 -34 q6 -16 18 -18" />
      </g>
    </g>
  );
}

function Bird({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="22" ry="18" fill="#ffd36b" />
      <path d="M-6 -2 q-18 -22 -30 -6 q14 2 30 12Z" fill="#f2b83a" />
      <circle cx="10" cy="-6" r="3" fill="#1b2340" />
      <path d="M20 -2 L32 2 L20 6Z" fill="#ff9a4a" />
      <path d="M-20 4 L-34 10 L-22 12Z" fill="#f2b83a" />
    </g>
  );
}

function Record() {
  return (
    <Frame label="The shining Golden Record floating among stars, with music notes, a whale, a bird and greetings in different languages around it">
      <Space variant="indigo" stars={90} seed={63} />
      <GoldenRecord cx={300} cy={386} r={160} />
      <Note x={92} y={168} s={1.05} delay={0.2} />
      <Note x={474} y={624} s={0.85} color="#ffd1e8" delay={1.2} />
      <SpeechBubble x={112} y={332} text="এই যে!" w={136} lang="bn" delay={1.6} flip />
      <SpeechBubble x={498} y={402} text="Hola" w={96} delay={2.4} />
      <SpeechBubble x={120} y={566} text="Bonjour" w={124} delay={3.1} flip />
      <SpeechBubble x={300} y={150} text="Hello!" w={124} delay={0.6} />
      <g className="anim hover-soft" style={{ animationDelay: "0.4s" }}>
        <Whale x={238} y={652} s={0.9} />
      </g>
      <g className="anim hover" style={{ animationDelay: "0.8s" }}>
        <Bird x={522} y={506} s={0.9} />
      </g>
    </Frame>
  );
}

function JupiterScene() {
  return (
    <Frame label="Giant striped Jupiter with its Great Red Spot filling the sky, two small moons, and Voyager 1 flying past with wide eyes">
      <Space variant="deep" stars={70} seed={74} />
      <Jupiter cx={440} cy={420} r={250} ring />
      <SmallPlanet cx={118} cy={418} r={15} color="#f3d27a" shade="#7a5418" />
      <SmallPlanet cx={64} cy={330} r={12} color="#f2efe6" shade="#7d7466" />
      <g className="anim hover-soft">
        <VoyagerCraft x={150} y={196} s={0.5} eyes="wide" rotate={12} />
      </g>
    </Frame>
  );
}

function IoScene() {
  return (
    <Frame label="Jupiter's moon Io, yellow and spotty, with a glowing umbrella-shaped volcanic plume rising from its edge, and Voyager 1 watching in surprise">
      <Space variant="deep" stars={70} seed={85} />
      <Jupiter cx={-90} cy={930} r={560} spot={false} />
      <Io cx={340} cy={366} r={150} plume />
      <g className="anim hover-soft">
        <VoyagerCraft x={112} y={150} s={0.36} eyes="wide" rotate={8} />
      </g>
      <g className="anim pop" style={{ transformOrigin: "190px 96px" }}>
        <text x="186" y="104" fontFamily="Fraunces, Georgia, serif" fontWeight="900" fontSize="54" fill="#ffe08a" stroke="#1b2340" strokeWidth="3" paintOrder="stroke">
          !
        </text>
      </g>
    </Frame>
  );
}

function SaturnScene() {
  return (
    <Frame label="Saturn with its golden rings, the hazy orange moon Titan, and Voyager 1's path bending up and away from the planets">
      <Space variant="deep" stars={80} seed={96} />
      <Saturn cx={452} cy={300} r={78} tilt={-14} />
      <HazyMoon cx={146} cy={520} r={42} />
      <path d="M18 704 Q108 648 168 592 Q218 544 218 452 Q216 336 220 236 Q226 140 240 56" stroke="#9fdcff" strokeWidth="3" strokeDasharray="3 11" strokeLinecap="round" fill="none" />
      <g className="anim hover-soft">
        <VoyagerCraft x={218} y={262} s={0.36} rotate={-10} eyes="up" />
      </g>
    </Frame>
  );
}

function DotScene() {
  const u = useUid();
  return (
    <Frame label="Voyager 1 looking back across the dark at a beam of sunlight, where Earth is a tiny pale blue dot">
      <Space variant="deep" stars={60} seed={107} />
      <defs>
        <linearGradient id={`${u}-beam`} x1="1" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ffe7b8" stopOpacity="0.55" />
          <stop offset="0.6" stopColor="#ffd7a0" stopOpacity="0.16" />
          <stop offset="1" stopColor="#ffd7a0" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M640 700 L120 210 L176 168 L640 640Z" fill={`url(#${u}-beam)`} />
      <FarSun cx={566} cy={648} r={11} halo={120} />
      <Glow cx={372} cy={420} r={22} color="#8fc8ff" opacity={0.8} className="anim breathe" />
      <circle cx={372} cy={420} r={3.6} fill="#a9d8ff" />
      <Viewfinder x={372} y={420} size={74} />
      <g className="anim hover-soft">
        <VoyagerCraft x={150} y={200} s={0.52} eyes="side" rotate={22} />
      </g>
    </Frame>
  );
}

function BubbleScene() {
  const u = useUid();
  return (
    <Frame label="The Sun's giant bubble, shaped like a comet, with the planets inside, and Voyager 1 slipping out through its edge into the space between the stars">
      <Space variant="deep" stars={100} seed={118} />
      <defs>
        <radialGradient id={`${u}-h`} cx="0.62" cy="0.5" r="0.7">
          <stop offset="0" stopColor="#6fb6ff" stopOpacity="0.32" />
          <stop offset="0.75" stopColor="#3f6fd8" stopOpacity="0.16" />
          <stop offset="1" stopColor="#8fd0ff" stopOpacity="0.4" />
        </radialGradient>
      </defs>
      <path d="M-60 250 Q120 170 330 196 Q470 220 486 380 Q470 540 330 566 Q120 590 -60 510Z" fill={`url(#${u}-h)`} stroke="#9fdcff" strokeWidth="3" strokeOpacity="0.6" className="anim breathe" />
      <g fill="none" stroke="#cfe6ff" strokeOpacity="0.3" strokeWidth="1.4">
        <ellipse cx="300" cy="384" rx="36" ry="14" />
        <ellipse cx="300" cy="384" rx="70" ry="28" />
        <ellipse cx="300" cy="384" rx="112" ry="44" />
      </g>
      <FarSun cx={300} cy={384} r={10} halo={70} rays={false} />
      <g fill="#ffd28a" opacity="0.8">
        {[[520, 300], [548, 420], [574, 520], [530, 600], [560, 210]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" className="anim drift" style={{ animationDelay: `${i * 0.7}s` }} />
        ))}
      </g>
      <g className="anim hover-soft">
        <VoyagerCraft x={480} y={288} s={0.36} eyes="happy" rotate={-12} />
      </g>
      <g className="anim sparkle" style={{ transformOrigin: "478px 230px" }}>
        <path d="M478 214 L482 226 L494 230 L482 234 L478 246 L474 234 L462 230 L474 226Z" fill="#fff6c8" />
      </g>
    </Frame>
  );
}

function Listening() {
  const u = useUid();
  return (
    <Frame label="A giant dish antenna on Earth at night, pointing at a tiny star that is really Voyager 1, with faint radio waves travelling between them">
      <Space variant="night" stars={120} seed={129} />
      <Glow cx={122} cy={140} r={40} color="#bfe6ff" opacity={0.6} className="anim breathe" />
      <circle cx={122} cy={140} r={3.5} fill="#ffffff" />
      <SignalWaves x={170} y={208} count={4} r={34} rotate={135} />
      <SignalWaves x={232} y={300} count={3} r={30} rotate={135} />
      <defs>
        <linearGradient id={`${u}-hill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2340" />
          <stop offset="1" stopColor="#120f20" />
        </linearGradient>
      </defs>
      <path d={`M0 600 Q120 560 240 590 T470 580 T${W} 572 L${W} ${H} L0 ${H}Z`} fill={`url(#${u}-hill)`} />
      <path d={`M0 640 Q160 618 330 636 T${W} 628 L${W} ${H} L0 ${H}Z`} fill="#0d0a18" />
      <BigDish x={360} y={640} s={1.12} rotate={-34} />
      <g>
        <rect x="478" y="608" width="70" height="34" rx="3" fill="#221c33" />
        {[488, 506, 524].map((wx) => (
          <rect key={wx} x={wx} y="618" width="10" height="10" fill="#ffd98a" opacity="0.85" />
        ))}
      </g>
    </Frame>
  );
}

function Glitch() {
  const glyphs = [
    ["#", 120, 200, 0],
    ["%", 470, 186, 0.4],
    ["@", 520, 330, 0.8],
    ["&", 96, 380, 1.2],
    ["?", 470, 520, 1.6],
    ["§", 150, 560, 2],
    ["01", 300, 150, 2.4],
    ["*", 540, 600, 2.8],
  ];
  return (
    <Frame label="Voyager 1 with dizzy spiral eyes, surrounded by scrambled letters and symbols, and a small Earth wondering what happened">
      <Space variant="indigo" stars={70} seed={140} />
      {glyphs.map(([g, x, y, d]) => (
        <text
          key={g + x}
          x={x}
          y={y}
          textAnchor="middle"
          fontFamily="Jost, sans-serif"
          fontWeight="700"
          fontSize="40"
          fill="#9fdcff"
          opacity="0.9"
          className="anim pop"
          style={{ animationDelay: `${d}s`, transformOrigin: `${x}px ${y}px` }}
        >
          {g}
        </text>
      ))}
      <g className="anim shake">
        <VoyagerCraft x={300} y={384} s={0.78} eyes="dizzy" rotate={-6} />
      </g>
      <Earth cx={92} cy={640} r={34} glow={false} />
      <g transform="translate(130 562)">
        <rect x="-4" y="-34" width="54" height="44" rx="22" fill="#fffaf0" />
        <path d="M2 4 L-8 20 L14 8Z" fill="#fffaf0" />
        <text x="23" y="2" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontWeight="900" fontSize="30" fill="#1b2340">
          ?
        </text>
      </g>
    </Frame>
  );
}

function Sleepy() {
  return (
    <Frame label="Voyager 1 in a cosy nightcap, eyes drooping, with only one little light still glowing on its body">
      <Space variant="deep" stars={70} seed={151} milky milkyY={240} />
      <Glow cx={300} cy={400} r={230} color="#ffcf9a" opacity={0.12} className="anim breathe" />
      <g className="anim hover-soft">
        <VoyagerCraft x={300} y={404} s={0.92} eyes="sleepy" cap lights={1} glowRtg />
      </g>
      <Zzz x={404} y={228} size={30} color="#fff2c6" />
    </Frame>
  );
}

function Goodnight() {
  return (
    <Frame label="A sleeping Voyager 1 drifting peacefully among the stars toward a faraway red star, with tiny Earth far behind">
      <Space variant="deep" stars={140} seed={162} milky milkyY={300} />
      <Glow cx={482} cy={168} r={60} color="#ffb08a" opacity={0.55} className="anim breathe" />
      <circle cx={482} cy={168} r={6} fill="#ffd2b8" />
      <path d="M40 690 C120 640 170 580 214 500" stroke="#9fdcff" strokeWidth="2.5" strokeDasharray="2 12" strokeLinecap="round" fill="none" opacity="0.6" />
      <Glow cx={52} cy={672} r={18} color="#8fc8ff" opacity={0.7} />
      <circle cx={52} cy={672} r={3} fill="#a9d8ff" />
      <g className="anim drift-away">
        <VoyagerCraft x={252} y={438} s={0.56} eyes="closed" rotate={-16} />
      </g>
      <Zzz x={330} y={300} size={22} color="#fff2c6" />
    </Frame>
  );
}

export const voyagerScenes = {
  "voyager-cover": Cover,
  "voyager-far": Farthest,
  "voyager-lineup": LineUp,
  "voyager-launch": Launch,
  "voyager-record": Record,
  "voyager-jupiter": JupiterScene,
  "voyager-io": IoScene,
  "voyager-saturn": SaturnScene,
  "voyager-dot": DotScene,
  "voyager-bubble": BubbleScene,
  "voyager-listening": Listening,
  "voyager-glitch": Glitch,
  "voyager-sleepy": Sleepy,
  "voyager-goodnight": Goodnight,
};
