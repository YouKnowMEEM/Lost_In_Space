import React from "react";
import { Frame, Glow, Puffs, Zzz } from "./common";
import { MarsGround, SmallMoon } from "./vikingParts";
import { Bubble, MarsSky, Sparkle, Sun, Tag } from "./kit";
import { Helicopter, MarsRover } from "./machines";

/** Soft rippled sand dunes. */
function Dunes({ y = 560, tone = "day" }) {
  const c = tone === "dusk" ? ["#d86a3f", "#b04a2c", "#7e2f22"] : ["#f39058", "#dd6233", "#a63e1e"];
  return (
    <g>
      <path d={`M0 ${y} Q100 ${y - 50} 220 ${y - 10} T460 ${y - 20} T600 ${y - 6} L600 760 L0 760Z`} fill={c[0]} />
      <path d={`M0 ${y + 70} Q140 ${y + 20} 300 ${y + 60} T600 ${y + 50} L600 760 L0 760Z`} fill={c[1]} />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M${20 + (i % 3) * 190} ${y + 100 + Math.floor(i / 3) * 34} q30 -8 60 0 t60 0`} stroke={c[2]} strokeWidth="2.5" fill="none" opacity="0.5" />
      ))}
    </g>
  );
}

function Jar({ x, y, label, dots, seed }) {
  let a = seed;
  const pts = Array.from({ length: dots }, () => {
    a = (a * 9301 + 49297) % 233280;
    const px = -46 + (a / 233280) * 92;
    a = (a * 9301 + 49297) % 233280;
    const py = -96 + (a / 233280) * 150;
    return [px, py];
  });
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-56" y="-110" width="112" height="170" rx="18" fill="#ffffff" opacity="0.18" stroke="#fffaf3" strokeWidth="4" />
      <rect x="-44" y="-124" width="88" height="18" rx="6" fill="#fffaf3" />
      {pts.map(([px, py], i) => (
        <circle key={i} cx={px} cy={py} r="4" fill="#9fdcff" className="anim tw" style={{ animationDelay: `${(i % 7) * 0.4}s` }} />
      ))}
      <text x="0" y="96" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontWeight="800" fontSize="21" fill="#fff6dc">
        {label}
      </text>
    </g>
  );
}

function Cover() {
  return (
    <Frame label="Ingenuity, a tiny helicopter with long spinning blades, flying above the red dunes of Jezero crater">
      <MarsSky variant="day" />
      <Sun cx={470} cy={250} r={12} />
      <Dunes y={560} />
      <ellipse cx="300" cy="650" rx="70" ry="9" fill="#2a0f08" opacity="0.2" />
      <g className="anim hover">
        <Helicopter x={300} y={520} s={2.1} eyes="happy" spin shadow={false} />
      </g>
      <Puffs x={300} y={650} w={240} color="#ffd395" opacity={0.45} seed={5} count={8} className="anim billow" />
    </Frame>
  );
}

function Asleep() {
  return (
    <Frame label="Ingenuity resting asleep on soft rippled sand dunes under the evening sky of Mars">
      <MarsSky variant="dusk" stars={30} seed={11} />
      <SmallMoon cx={140} cy={170} r={12} fill="#d8b8a8" />
      <Dunes y={540} tone="dusk" />
      <Helicopter x={320} y={680} s={2.2} eyes="closed" />
      <Glow cx={320} cy={560} r={150} color="#ffd9b8" opacity={0.16} className="anim breathe" />
      <Zzz x={380} y={360} size={26} color="#fff1e4" />
    </Frame>
  );
}

function Thin() {
  return (
    <Frame label="Two jars of air: one from Earth packed with air, one from Mars with almost nothing in it, and Ingenuity working hard to fly">
      <MarsSky variant="space" stars={70} seed={21} />
      <Jar x={170} y={330} label="Earth air" dots={90} seed={3} />
      <Jar x={430} y={330} label="Mars air" dots={4} seed={9} />
      <MarsGround y={600} seed={22} rocks={10} />
      <g className="anim hover">
        <Helicopter x={300} y={640} s={1.5} eyes="wide" spin shadow={false} lift={20} />
      </g>
      <Tag x={300} y={140} text="less than 1 hundredth as thick!" size={20} />
    </Frame>
  );
}

function Ride() {
  return (
    <Frame label="Perseverance driving away after gently setting Ingenuity down on the ground, as the cold first night begins">
      <MarsSky variant="dusk" stars={24} seed={31} />
      <SmallMoon cx={470} cy={160} r={12} fill="#d8b8a8" />
      <MarsGround y={560} seed={32} tone="dusk" rocks={16} />
      <path d="M200 690 C280 700 330 680 380 690" stroke="#7e2f22" strokeWidth="5" strokeDasharray="8 6" opacity="0.6" fill="none" />
      <MarsRover x={440} y={690} s={0.85} who="perseverance" eyes="happy" roll />
      <Helicopter x={170} y={696} s={1.3} eyes="wide" />
      <Glow cx={170} cy={650} r={60} color="#ffb36b" opacity={0.35} className="anim breathe" />
      <Bubble x={420} y={290} text="Good luck!" w={160} flip />
      <Tag x={170} y={520} text="brrr..." size={22} />
    </Frame>
  );
}

function First() {
  return (
    <Frame label="Ingenuity's first flight: rising three metres into the pink sky while Perseverance watches from a safe distance">
      <MarsSky variant="day" />
      <Sun cx={110} cy={220} r={11} />
      <MarsGround y={560} seed={42} rocks={14} />
      <ellipse cx="280" cy="680" rx="70" ry="8" fill="#2a0f08" opacity="0.18" />
      <g className="anim hover">
        <Helicopter x={280} y={520} s={1.7} eyes="happy" spin shadow={false} />
      </g>
      <Puffs x={280} y={680} w={200} color="#ffd395" opacity={0.45} seed={43} count={7} className="anim billow" />
      <g transform="translate(560 0) scale(-1 1)">
        <MarsRover x={60} y={640} s={0.42} who="perseverance" eyes="wide" />
      </g>
      <Sparkle x={160} y={360} delay={0.2} />
      <Sparkle x={420} y={330} s={0.9} delay={0.9} />
      <Bubble x={300} y={170} text="It flies!" w={140} />
    </Frame>
  );
}

function Wright() {
  return (
    <Frame label="A tiny square of cloth from the Wright brothers' first airplane, tucked under Ingenuity's solar panel, with the airplane flying in a memory above">
      <MarsSky variant="day" />
      <g opacity="0.55" className="anim drift">
        <g transform="translate(300 200)" stroke="#fff3df" strokeWidth="4" fill="none" strokeLinecap="round">
          <path d="M-120 -16 H120 M-120 16 H120" />
          <path d="M-100 -16 V16 M-50 -16 V16 M0 -16 V16 M50 -16 V16 M100 -16 V16" strokeWidth="2.5" />
          <path d="M-150 -6 H-130 M-150 6 H-130 M-150 -6 V6" />
          <path d="M126 -12 V12" />
        </g>
      </g>
      <Tag x={300} y={290} text="Earth, 1903" size={18} />
      <MarsGround y={600} seed={52} rocks={12} />
      <Helicopter x={210} y={690} s={1.6} eyes="happy" />
      <g transform="translate(430 470)">
        <circle r="88" fill="#fffaf3" />
        <rect x="-36" y="-28" width="72" height="56" fill="#efe3c6" stroke="#c9b98a" strokeWidth="2" />
        <path d="M-36 -10 H36 M-36 8 H36 M-18 -28 V28 M0 -28 V28 M18 -28 V28" stroke="#d8c8a0" strokeWidth="1.2" />
        <text x="0" y="62" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontWeight="800" fontSize="15" fill="#3a1f18">
          stamp-sized
        </text>
      </g>
      <path d="M350 520 Q280 560 236 584" stroke="#fffaf3" strokeWidth="2" strokeDasharray="4 5" fill="none" />
    </Frame>
  );
}

function Scout() {
  return (
    <Frame label="Ingenuity flying high as a scout, looking down at the land and showing Perseverance a safe path between the rocks">
      <MarsSky variant="day" />
      <path d="M0 360 Q160 320 300 350 T600 330 L600 760 L0 760Z" fill="#dd6233" />
      <path d="M0 470 Q200 430 600 460 L600 760 L0 760Z" fill="#d86a3f" />
      {[[90, 520], [180, 600], [420, 560], [500, 660], [260, 690], [370, 640]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={24 + (i % 3) * 8} ry={9 + (i % 2) * 3} fill="#7e2f22" />
      ))}
      <path d="M150 700 C220 640 300 610 330 560 C360 510 440 500 520 460" stroke="#fff3df" strokeWidth="3" strokeDasharray="6 8" fill="none" className="anim laser" />
      <MarsRover x={140} y={740} s={0.4} who="perseverance" eyes="up" shadow={false} />
      <g className="anim hover">
        <Helicopter x={400} y={330} s={1.3} eyes="side" spin shadow={false} />
      </g>
      <path d="M400 360 L320 560 L500 560Z" fill="#fff3df" opacity="0.1" />
      <Tag x={130} y={240} text="up to 24 metres high!" size={19} />
    </Frame>
  );
}

function Last() {
  return (
    <Frame label="Ingenuity back on the smooth dunes after its last flight, with a piece of its broken blade lying in the sand">
      <MarsSky variant="day" />
      <Sun cx={480} cy={300} r={11} />
      <Dunes y={540} />
      <Helicopter x={280} y={680} s={1.9} eyes="sleepy" broken />
      <path d="M470 700 L520 690" stroke="#f4f5f8" strokeWidth="6" strokeLinecap="round" />
      <ellipse cx="495" cy="704" rx="30" ry="4" fill="#2a0f08" opacity="0.2" />
      <g transform="translate(300 180)">
        <rect x="-120" y="-50" width="240" height="100" rx="18" fill="#fffaf3" />
        <text x="0" y="-8" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontWeight="800" fontSize="34" fill="#3a1f18">
          72 flights
        </text>
        <text x="0" y="28" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontWeight="700" fontSize="18" fill="#92331a">
          (5 were planned)
        </text>
      </g>
    </Frame>
  );
}

function Goodnight() {
  return (
    <Frame label="Ingenuity asleep on the dunes at a blue Martian sunset, while three faint new helicopters are imagined in the sky above">
      <MarsSky variant="dusk" stars={40} seed={81} />
      <Sun cx={480} cy={470} r={10} halo="#9cc4ff" opacity={0.6} />
      <g opacity="0.4">
        {[[150, 200], [300, 150], [450, 210]].map(([x, y], i) => (
          <g key={x} className="anim hover" style={{ animationDelay: `${i * 0.6}s` }}>
            <Helicopter x={x} y={y} s={0.55} eyes="happy" spin shadow={false} />
          </g>
        ))}
      </g>
      <Tag x={300} y={250} text="SkyFall" size={22} />
      <Dunes y={540} tone="dusk" />
      <Helicopter x={300} y={690} s={1.9} eyes="closed" broken />
      <Glow cx={300} cy={600} r={150} color="#ffd9b8" opacity={0.15} className="anim breathe" />
      <Zzz x={350} y={460} size={24} color="#fff1e4" />
    </Frame>
  );
}

export const ingenuityScenes = {
  "ingenuity-cover": Cover,
  "ingenuity-asleep": Asleep,
  "ingenuity-thin": Thin,
  "ingenuity-ride": Ride,
  "ingenuity-first": First,
  "ingenuity-wright": Wright,
  "ingenuity-scout": Scout,
  "ingenuity-last": Last,
  "ingenuity-goodnight": Goodnight,
};
