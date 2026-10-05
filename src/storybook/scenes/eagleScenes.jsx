import React from "react";
import { Earth, Flame, Frame, Glow, Orbiter, Puffs, Sky, Stars, Zzz, useUid, W, H, rng } from "./common";
import {
  Astronaut,
  Boulder,
  Breakers,
  Columbia,
  Crater,
  DSKY,
  EagleLM,
  FeltPen,
  Flag,
  Footprints,
  MoonGround,
  Plaque,
  Retroreflector,
  SaturnV,
  Seismometer,
  Ascent,
} from "./eagleParts";

const NIGHT = [
  [0, "#050820"],
  [0.55, "#121a4d"],
  [1, "#27306c"],
];

function NightSky({ seed = 1, bottom = 560 }) {
  const u = useUid();
  return (
    <>
      <Sky id={`${u}-sky`} stops={NIGHT} />
      <Stars seed={seed} count={80} bottom={bottom} />
    </>
  );
}

/** The curved edge of the Moon seen from orbit. */
function MoonLimb({ cy = 1500, r = 960, seed = 5 }) {
  const u = useUid();
  const rr = rng(seed);
  return (
    <g>
      <defs>
        <radialGradient id={`${u}-m`} cx="0.42" cy="0.08" r="0.7">
          <stop offset="0" stopColor="#e6e8ef" />
          <stop offset="0.5" stopColor="#a9adbf" />
          <stop offset="1" stopColor="#5f647d" />
        </radialGradient>
        <clipPath id={`${u}-c`}>
          <circle cx={W / 2} cy={cy} r={r} />
        </clipPath>
      </defs>
      <circle cx={W / 2} cy={cy} r={r + 10} fill="#9fb3ff" opacity="0.12" />
      <circle cx={W / 2} cy={cy} r={r} fill={`url(#${u}-m)`} />
      <g clipPath={`url(#${u}-c)`}>
        {Array.from({ length: 14 }, (_, i) => {
          const x = rr() * W;
          const y = cy - r + 20 + rr() * 260;
          const rx = 10 + rr() * 40;
          return <Crater key={i} cx={x} cy={y} rx={rx} />;
        })}
      </g>
    </g>
  );
}

function SpeechBubble({ x, y, text, w = 250, tail = "left" }) {
  return (
    <g className="anim pop" style={{ transformOrigin: `${x + 40}px ${y + 70}px` }}>
      <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width={w} height="56" rx="28" fill="#fffdf5" />
      <path d={tail === "left" ? "M40 50 L28 78 L64 52Z" : `M${w - 40} 50 L${w - 28} 78 L${w - 64} 52Z`} fill="#fffdf5" />
      <text
        x={w / 2}
        y="36"
        textAnchor="middle"
        fontFamily="Fraunces, Georgia, serif"
        fontStyle="italic"
        fontWeight="700"
        fontSize="21"
        fill="#1b2240"
      >
        {text}
      </text>
      </g>
    </g>
  );
}

function Label({ x, y, title, lines, anchorX, anchorY }) {
  const width = 236;
  return (
    <g>
      <path d={`M${anchorX} ${anchorY} L${x + width / 2} ${y + 34}`} stroke="#fff" strokeWidth="2" strokeDasharray="5 6" opacity="0.85" />
      <circle cx={anchorX} cy={anchorY} r="6" fill="#ffd36b" stroke="#fff" strokeWidth="2" />
      <rect x={x} y={y} width={width} height={34 + lines.length * 21} rx="14" fill="#0e2b63" stroke="#cfe0ff" strokeWidth="1.5" />
      <text x={x + 16} y={y + 25} fontFamily="Jost, sans-serif" fontWeight="700" fontSize="18" fill="#ffd36b">
        {title}
      </text>
      {lines.map((l, i) => (
        <text key={i} x={x + 16} y={y + 48 + i * 21} fontFamily="Jost, sans-serif" fontWeight="500" fontSize="16" fill="#eef4ff">
          {l}
        </text>
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ scenes */

function Cover() {
  return (
    <Frame label="Eagle, a golden moon lander, standing on the grey Moon with the blue Earth in the black sky">
      <NightSky seed={3} />
      <Earth cx={478} cy={344} r={50} />
      <MoonGround y={585} seed={7} />
      <Footprints points={[[140, 690, 10], [158, 700, 18], [176, 708, 8], [430, 700, -12], [452, 694, -4], [470, 704, -16]]} />
      <g className="anim hover-soft">
        <EagleLM x={300} y={655} s={1.04} shadow />
      </g>
      <Glow cx={300} cy={470} r={210} color="#ffd36b" opacity={0.12} />
    </Frame>
  );
}

function Asleep() {
  return (
    <Frame label="The bottom half of Eagle, asleep on the Moon, with footprints all around and the Earth glowing above">
      <NightSky seed={11} />
      <Earth cx={128} cy={206} r={46} />
      <MoonGround y={560} seed={12} />
      <Footprints
        points={[
          [96, 650, 20], [114, 662, 26], [132, 672, 18], [150, 684, 30], [462, 646, -20], [480, 656, -26], [498, 668, -12], [516, 680, -24],
          [210, 716, 6], [232, 722, 12], [380, 724, -8], [404, 716, -14],
        ]}
        s={1.3}
      />
      <Flag x={430} y={716} s={0.9} fallen />
      <EagleLM x={300} y={660} s={1.38} part="descent" shadow />
      <Glow cx={300} cy={470} r={170} color="#ffe4a0" opacity={0.18} className="anim breathe" />
      <Zzz x={352} y={392} size={30} />
    </Frame>
  );
}

function Blueprint() {
  const u = useUid();
  return (
    <Frame label="A blueprint of Eagle pulled apart into its two halves: the top cabin with an engine to fly home, and the bottom with legs and a landing engine">
      <defs>
        <pattern id={`${u}-grid`} width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M30 0 L0 0 0 30" fill="none" stroke="#cfe0ff" strokeOpacity="0.16" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="#16438f" />
      <rect width={W} height={H} fill={`url(#${u}-grid)`} />
      <rect x="18" y="18" width={W - 36} height={H - 36} fill="none" stroke="#cfe0ff" strokeOpacity="0.5" strokeWidth="2" />
      <g className="anim lift-apart">
        <g transform="translate(300 420) scale(1.02)">
          <Ascent eyes="open" />
        </g>
      </g>
      <path d="M90 452 L510 452" stroke="#ffd36b" strokeWidth="2" strokeDasharray="10 8" />
      <EagleLM x={300} y={640} s={1.02} part="descent" probes />
      <Label x={330} y={92} title="Top half" lines={["A tiny cabin, plus an", "engine to fly home"]} anchorX={352} anchorY={196} />
      <Label x={36} y={566} title="Bottom half" lines={["Four legs, plus a", "landing engine"]} anchorX={150} anchorY={600} />
    </Frame>
  );
}

function Launch() {
  const u = useUid();
  return (
    <Frame label="The giant Saturn V rocket lifting off from Florida in a cloud of fire and smoke">
      <Sky id={`${u}-sky`} stops={[[0, "#3d6fc4"], [0.55, "#9cc3ee"], [1, "#ffe0b0"]]} />
      <g fill="#ffffff" opacity="0.6">
        <ellipse cx="110" cy="150" rx="60" ry="14" />
        <ellipse cx="480" cy="110" rx="70" ry="15" />
        <ellipse cx="520" cy="230" rx="40" ry="10" />
      </g>
      <rect y="600" width={W} height="160" fill="#5f7f6b" />
      <rect y="640" width={W} height="40" fill="#5f9bd3" opacity="0.85" />
      <rect y="680" width={W} height="80" fill="#4d6e59" />
      {/* launch tower */}
      <g stroke="#b9434a" strokeWidth="4" fill="none">
        <path d="M182 604 L182 140 M216 604 L216 140" />
        {Array.from({ length: 16 }, (_, i) => (
          <path key={i} d={`M182 ${590 - i * 29} L216 ${576 - i * 29} M216 ${590 - i * 29} L182 ${576 - i * 29}`} strokeWidth="2" />
        ))}
        <path d="M176 140 L222 140" strokeWidth="6" />
      </g>
      <g className="anim shake">
        <Flame x={320} y={596} w={76} h={170} />
        <SaturnV x={320} y={598} s={1.12} />
      </g>
      <Puffs x={320} y={640} w={500} color="#ffffff" opacity={0.92} seed={9} count={13} className="anim billow" />
      <Puffs x={320} y={668} w={600} color="#e8e4dc" opacity={0.95} seed={10} count={14} className="anim billow-slow" />
      <g fill="#2d3a33">
        {Array.from({ length: 30 }, (_, i) => (
          <g key={i} transform={`translate(${12 + i * 20} ${742 + (i % 3) * 3})`}>
            <circle cx="0" cy="-16" r="5" />
            <rect x="-5" y="-12" width="10" height="16" rx="4" />
          </g>
        ))}
      </g>
    </Frame>
  );
}

function Wings() {
  return (
    <Frame label="High above the Moon, Eagle lets go of the spaceship Columbia and flies off on its own">
      <NightSky seed={21} bottom={700} />
      <Earth cx={96} cy={132} r={24} glow={false} />
      <MoonLimb cy={1480} r={960} />
      <g className="anim hover-soft">
        <Columbia x={196} y={300} s={0.86} rotate={-12} />
      </g>
      <g className="anim drift-away">
        <g transform="translate(420 520) rotate(8)">
          <EagleLM x={0} y={0} s={0.56} probes />
        </g>
      </g>
      <path d="M300 300 Q360 360 384 410" stroke="#fff" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="4 8" fill="none" />
    </Frame>
  );
}

function Alarm() {
  const u = useUid();
  return (
    <Frame label="Inside Eagle: through the triangle window the grey Moon rushes closer, while the computer flashes the code 1202">
      <rect width={W} height={H} fill="#2a2f3d" />
      <g stroke="#3a4052" strokeWidth="3">
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M0 ${i * 90} L${W} ${i * 90}`} />
        ))}
      </g>
      <defs>
        <clipPath id={`${u}-win`}>
          <path d="M70 84 L530 84 L318 372Z" />
        </clipPath>
      </defs>
      <path d="M58 74 L542 74 L318 390Z" fill="#11131b" />
      <g clipPath={`url(#${u}-win)`}>
        <rect width={W} height="400" fill="#05060f" />
        <g className="anim approach" style={{ transformOrigin: "300px 280px" }}>
          <g transform="rotate(-12 300 250)">
            <rect x="-100" y="150" width="800" height="400" fill="#9ea2b5" />
            {[
              [150, 200, 40],
              [300, 240, 70],
              [430, 190, 30],
              [240, 300, 50],
              [380, 320, 34],
              [110, 280, 26],
            ].map(([cx, cy, rx], i) => (
              <Crater key={i} cx={cx} cy={cy} rx={rx} />
            ))}
          </g>
        </g>
      </g>
      <path d="M58 74 L542 74 L318 390Z" fill="none" stroke="#5b6177" strokeWidth="10" strokeLinejoin="round" />
      <DSKY x={300} y={560} s={0.8} />
      <g stroke="#ffcf5a" strokeWidth="4" fill="none" strokeLinecap="round" className="anim beep">
        <path d="M70 470 q-18 22 0 44" />
        <path d="M48 456 q-28 36 0 72" />
        <path d="M530 470 q18 22 0 44" />
        <path d="M552 456 q28 36 0 72" />
      </g>
    </Frame>
  );
}

function Boulders() {
  return (
    <Frame label="Neil flies Eagle over a crater full of huge boulders, looking for a safe place to land as the fuel runs low">
      <NightSky seed={31} bottom={420} />
      <MoonGround y={470} seed={33} craters={false} />
      <ellipse cx="230" cy="624" rx="214" ry="74" fill="#e2e4ec" />
      <ellipse cx="232" cy="630" rx="200" ry="64" fill="#6c7088" />
      <ellipse cx="240" cy="640" rx="178" ry="50" fill="#8a8ea4" />
      <path d="M40 628 A192 62 0 0 0 424 632" fill="none" stroke="#f3f4f8" strokeOpacity="0.55" strokeWidth="3" />
      <Boulder x={150} y={624} s={1.1} />
      <Boulder x={232} y={650} s={1.4} />
      <Boulder x={318} y={612} s={0.9} />
      <Boulder x={196} y={598} s={0.7} />
      <Boulder x={288} y={664} s={0.8} />
      <Boulder x={110} y={662} s={0.6} />
      <Puffs x={430} y={618} w={260} color="#d6d9e4" opacity={0.7} seed={5} count={10} className="anim drift" />
      <g className="anim hover">
        <g transform="translate(430 452) rotate(-7)">
          <Flame x={0} y={-78 * 0.62} w={30} h={92} />
          <EagleLM x={0} y={0} s={0.62} probes />
        </g>
      </g>
      {/* fuel gauge */}
      <g transform="translate(96 132)">
        <circle r="54" fill="#141a35" stroke="#e9ecf6" strokeWidth="4" />
        <path d="M-38 18 A42 42 0 1 1 38 18" fill="none" stroke="#2f3a6e" strokeWidth="10" />
        <path d="M-38 18 A42 42 0 0 1 -40 -6" fill="none" stroke="#ff6b5a" strokeWidth="10" />
        <text x="-30" y="40" fontFamily="Jost, sans-serif" fontWeight="700" fontSize="13" fill="#ff8a7a">E</text>
        <text x="24" y="40" fontFamily="Jost, sans-serif" fontWeight="700" fontSize="13" fill="#cfd6f2">F</text>
        <text x="0" y="-16" textAnchor="middle" fontFamily="Jost, sans-serif" fontWeight="700" fontSize="12" fill="#cfd6f2">FUEL</text>
        <g className="anim needle" style={{ transformOrigin: "0px 0px" }}>
          <path d="M0 0 L-34 10" stroke="#ffd36b" strokeWidth="4" strokeLinecap="round" />
        </g>
        <circle r="6" fill="#ffd36b" />
      </g>
    </Frame>
  );
}

function Landed() {
  return (
    <Frame label="Eagle standing safely on the Moon as the dust settles, saying: the Eagle has landed">
      <NightSky seed={41} />
      <Earth cx={122} cy={196} r={50} />
      <MoonGround y={575} seed={42} />
      <Puffs x={300} y={666} w={420} color="#d9dce6" opacity={0.5} seed={44} count={12} className="anim settle" />
      <EagleLM x={300} y={658} s={1.04} shadow />
      <g className="anim sparkle" style={{ transformOrigin: "452px 652px" }}>
        <path d="M452 630 L456 648 L474 652 L456 656 L452 674 L448 656 L430 652 L448 648Z" fill="#fff4c4" />
      </g>
      <SpeechBubble x={300} y={160} w={268} text="The Eagle has landed!" tail="left" />
    </Frame>
  );
}

function Step() {
  return (
    <Frame label="Neil Armstrong steps off Eagle's round footpad onto the Moon, leaving the very first footprint">
      <NightSky seed={51} bottom={400} />
      <Earth cx={78} cy={104} r={34} />
      <MoonGround y={640} seed={52} craters={false} />
      <g transform="translate(300 700)">
        <EagleLM x={0} y={0} s={2.3} />
      </g>
      <Glow cx={430} cy={724} r={60} color="#fff0b8" opacity={0.6} className="anim breathe" />
      <Footprints points={[[430, 724, -8]]} s={3.4} color="#4d5168" />
      <Astronaut x={392} y={710} s={1.9} pose="walk" />
    </Frame>
  );
}

function Busy() {
  return (
    <Frame label="Two astronauts bounce around on the Moon, planting a flag, setting up science experiments and leaving footprints, while Eagle watches">
      <NightSky seed={61} bottom={470} />
      <Earth cx={486} cy={150} r={42} />
      <MoonGround y={505} seed={62} />
      <EagleLM x={140} y={560} s={0.5} shadow />
      <Footprints
        points={[
          [220, 600, 20], [240, 612, 30], [262, 620, 18], [286, 630, 24], [312, 640, 12], [340, 648, 22], [366, 660, 8],
          [180, 640, -10], [200, 652, -4], [222, 664, -14], [248, 676, -2], [276, 690, -12],
        ]}
        s={1.2}
      />
      <Flag x={300} y={596} s={0.95} />
      <Seismometer x={96} y={690} s={1.05} />
      <Retroreflector x={520} y={712} s={1.1} />
      <Astronaut x={214} y={700} s={1.15} pose="stand" />
      <g className="anim hop">
        <Astronaut x={430} y={662} s={1.2} pose="hop" flip />
      </g>
    </Frame>
  );
}

function OliveBranch({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(-14)`}>
      <path d="M-50 0 Q0 -8 50 -2" stroke="#d8a531" strokeWidth="3" fill="none" />
      {[-40, -26, -12, 2, 16, 30].map((px, i) => (
        <ellipse key={px} cx={px} cy={i % 2 ? 6 : -9} rx="8" ry="3.5" fill="#f0c14b" transform={`rotate(${i % 2 ? 24 : -24} ${px} ${i % 2 ? 6 : -9})`} />
      ))}
    </g>
  );
}

function PlaqueScene() {
  const u = useUid();
  return (
    <Frame label="A close-up of the shiny plaque on Eagle's leg, with a golden olive branch left on the ground below">
      <defs>
        <linearGradient id={`${u}-foil`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd97e" />
          <stop offset="0.5" stopColor="#f2b641" />
          <stop offset="1" stopColor="#b97618" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="#070a1f" />
      <Stars seed={71} count={30} bottom={140} />
      <rect y="120" width={W} height="420" fill={`url(#${u}-foil)`} />
      <path d="M0 170 l60 10 l40 -14 l70 16 l50 -10 l80 12 l60 -8 l70 14 l70 -10 M0 470 l80 -12 l60 14 l90 -10 l60 12 l90 -6 l60 10 l60 -8" stroke="#fff3c8" strokeOpacity="0.5" strokeWidth="2" fill="none" />
      <g stroke="#e9ebf2" strokeWidth="9" strokeLinecap="round">
        <path d="M120 100 L120 640 M480 100 L480 640" />
        {Array.from({ length: 6 }, (_, i) => (
          <path key={i} d={`M120 ${130 + i * 96} L480 ${130 + i * 96}`} strokeWidth="7" opacity={i === 2 || i === 3 ? 0 : 1} />
        ))}
      </g>
      <MoonGround y={600} seed={73} craters={false} />
      <Plaque x={300} y={372} s={1.02} />
      <g className="anim glint">
        <path d="M168 284 l10 -32 l10 32 l32 10 l-32 10 l-10 32 l-10 -32 l-32 -10Z" fill="#fff" opacity="0.9" />
      </g>
      <OliveBranch x={210} y={668} s={1.2} />
      <g transform="translate(420 676)">
        <ellipse rx="26" ry="8" fill="#000" opacity="0.2" cy="4" />
        <ellipse rx="22" ry="7" fill="#e1e4ec" stroke="#9aa1b3" strokeWidth="2" />
        <ellipse rx="9" ry="3" fill="#b9c0cf" />
      </g>
    </Frame>
  );
}

function Pen() {
  return (
    <Frame label="Inside Eagle: a broken switch on a panel of circuit breakers, and a felt-tip pen about to push it in">
      <rect width={W} height={H} fill="#30364a" />
      <rect x="0" y="560" width={W} height="200" fill="#262b3b" />
      <Breakers x={300} y={330} s={1.18} />
      <g className="anim poke">
        <FeltPen x={323} y={265} s={1.25} rotate={-34} />
      </g>
      <g className="anim pop" style={{ transformOrigin: "420px 240px" }}>
        <text x="384" y="250" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontWeight="800" fontSize="44" fill="#ffd36b" stroke="#30364a" strokeWidth="6" paintOrder="stroke">
          click!
        </text>
      </g>
      {Array.from({ length: 10 }, (_, i) => (
        <circle key={i} cx={60 + i * 52} cy={620 + (i % 3) * 30} r={2 + (i % 2)} fill="#c6cbe0" opacity="0.4" className="anim float-dust" style={{ animationDelay: `${i * 0.6}s` }} />
      ))}
    </Frame>
  );
}

function Liftoff() {
  return (
    <Frame label="Whoosh! Eagle's top half blasts off, using the bottom half as a launch pad, and the flag tips over">
      <NightSky seed={81} />
      <Earth cx={110} cy={160} r={44} />
      <MoonGround y={590} seed={82} />
      <EagleLM x={300} y={668} s={1} part="descent" shadow />
      <Flag x={458} y={714} s={0.85} fallen />
      <g className="anim liftoff">
        <g transform="translate(300 600)">
          <Flame x={0} y={-160} w={46} h={150} />
          <Ascent />
        </g>
      </g>
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI - Math.PI;
        return (
          <rect
            key={i}
            x={300 + Math.cos(a) * 70}
            y={500 + Math.sin(a) * 30}
            width="7"
            height="4"
            fill={i % 2 ? "#ffd36b" : "#f2b641"}
            className="anim confetti"
            style={{ animationDelay: `${(i % 5) * 0.25}s`, "--dx": `${Math.cos(a) * 140}px`, "--dy": `${Math.sin(a) * 120 - 40}px` }}
          />
        );
      })}
    </Frame>
  );
}

function Reunion() {
  return (
    <Frame label="Eagle's top half flies back up to Columbia, with the half-lit Earth hanging in the black sky behind">
      <NightSky seed={91} bottom={700} />
      <Earth cx={430} cy={236} r={78} night={0.55} />
      <MoonLimb cy={1540} r={960} seed={9} />
      <g className="anim hover-soft">
        <Columbia x={170} y={448} s={0.82} rotate={0} />
      </g>
      <g className="anim dock">
        <g transform="translate(470 452) rotate(-90) scale(0.62)">
          <g transform="translate(0 236)">
            <Ascent />
          </g>
        </g>
      </g>
      <path d="M282 448 L330 448" stroke="#ffd36b" strokeWidth="3" strokeDasharray="6 7" />
    </Frame>
  );
}

function Goodnight() {
  return (
    <Frame label="Goodnight, Eagle: the bottom half sleeps on the Moon, a laser from Earth touches its mirror, and an orbiter passes overhead">
      <NightSky seed={101} />
      <Earth cx={492} cy={150} r={46} />
      <MoonGround y={575} seed={102} />
      <path d="M492 150 L452 690" stroke="#7dff9b" strokeWidth="2.5" strokeDasharray="10 12" className="anim laser" opacity="0.85" />
      <Glow cx={452} cy={690} r={26} color="#7dff9b" opacity={0.7} className="anim breathe" />
      <Retroreflector x={452} y={702} s={0.9} />
      <Footprints points={[[120, 680, 18], [138, 690, 24], [156, 700, 12], [174, 708, 22], [360, 712, -8], [380, 704, -16]]} s={1.2} />
      <Flag x={100} y={728} s={0.8} fallen />
      <Orbiter x={0} y={262} s={0.9} />
      <EagleLM x={290} y={660} s={1.2} part="descent" shadow />
      <Glow cx={290} cy={500} r={170} color="#ffe4a0" opacity={0.16} className="anim breathe" />
      <Zzz x={336} y={404} size={30} />
    </Frame>
  );
}

export const eagleScenes = {
  "eagle-cover": Cover,
  "eagle-asleep": Asleep,
  "eagle-blueprint": Blueprint,
  "eagle-launch": Launch,
  "eagle-wings": Wings,
  "eagle-alarm": Alarm,
  "eagle-boulders": Boulders,
  "eagle-landed": Landed,
  "eagle-step": Step,
  "eagle-busy": Busy,
  "eagle-plaque": PlaqueScene,
  "eagle-pen": Pen,
  "eagle-liftoff": Liftoff,
  "eagle-reunion": Reunion,
  "eagle-goodnight": Goodnight,
};
