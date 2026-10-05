import React from "react";
import { Earth, Flame, Frame, Glow, Orbiter, Puffs, Sky, Stars, Zzz, useUid, W, H } from "./common";
import {
  Aeroshell,
  BigJoe,
  DSNDish,
  MARS_SKIES,
  MarsGlobe,
  MarsGround,
  Parachute,
  Rock,
  SmallMoon,
  TitanRocket,
  VikingCraft,
  VikingLander,
} from "./vikingParts";

function MarsSky({ variant = "day", stars = 0, seed = 1 }) {
  const u = useUid();
  return (
    <>
      <Sky id={`${u}-sky`} stops={MARS_SKIES[variant]} />
      {stars > 0 && <Stars seed={seed} count={stars} bottom={420} color="#fff1e4" />}
    </>
  );
}

function Sun({ cx, cy, r = 14, halo = "#fff3df", blue = false }) {
  return (
    <g>
      {blue && <Glow cx={cx} cy={cy} r={150} color="#9cc4ff" opacity={0.75} />}
      <Glow cx={cx} cy={cy} r={r * 6} color={halo} opacity={0.65} />
      <circle cx={cx} cy={cy} r={r} fill="#fffaf0" />
    </g>
  );
}

function Bubble({ x, y, text, w = 120 }) {
  return (
    <g className="anim pop" style={{ transformOrigin: `${x + 20}px ${y + 60}px` }}>
      <g transform={`translate(${x} ${y})`}>
        <rect width={w} height="50" rx="25" fill="#fffaf3" />
        <path d="M24 44 L16 68 L46 46Z" fill="#fffaf3" />
        <text x={w / 2} y="33" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontWeight="800" fontSize="22" fill="#3a1f18">
          {text}
        </text>
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ scenes */

function Cover() {
  return (
    <Frame label="Viking 1, a white three-legged robot, standing on the red rocky plains of Mars under a butterscotch sky">
      <MarsSky variant="day" />
      <Sun cx={474} cy={322} r={13} />
      <SmallMoon cx={110} cy={342} r={8} fill="#c9a492" />
      <MarsGround y={585} seed={4} rocks={26} />
      <g className="anim hover-soft">
        <VikingLander x={300} y={676} s={1.12} />
      </g>
    </Frame>
  );
}

function Asleep() {
  return (
    <Frame label="Viking 1 asleep on the dusty Plains of Gold at dusk, with two tiny moons in the pink sky">
      <MarsSky variant="dusk" stars={36} seed={12} />
      <SmallMoon cx={150} cy={190} r={13} fill="#d8b8a8" />
      <SmallMoon cx={440} cy={140} r={6} fill="#d8b8a8" />
      <MarsGround y={560} seed={13} tone="dusk" />
      <VikingLander x={300} y={672} s={1.22} eyes="closed" dusty />
      <Glow cx={300} cy={520} r={160} color="#ffd9b8" opacity={0.18} className="anim breathe" />
      <Zzz x={364} y={392} size={30} color="#fff1e4" />
    </Frame>
  );
}

function Twins() {
  const u = useUid();
  return (
    <Frame label="Viking 1 blasting off from Florida on a Titan rocket, while its twin waits on another launch pad">
      <Sky id={`${u}-sky`} stops={[[0, "#3a5fae"], [0.55, "#97b7e6"], [1, "#ffd3a6"]]} />
      <g fill="#fff" opacity="0.55">
        <ellipse cx="460" cy="130" rx="70" ry="14" />
        <ellipse cx="120" cy="96" rx="54" ry="12" />
      </g>
      <rect y="606" width={W} height="154" fill="#5f7f6b" />
      <rect y="640" width={W} height="34" fill="#5f9bd3" opacity="0.85" />
      <rect y="674" width={W} height="86" fill="#4d6e59" />
      {/* the twin, waiting its turn */}
      <g>
        <path d="M78 606 L78 330 M100 606 L100 330" stroke="#b9434a" strokeWidth="3" />
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M78 ${596 - i * 30} L100 ${582 - i * 30}`} stroke="#b9434a" strokeWidth="1.6" />
        ))}
        <TitanRocket x={126} y={606} s={0.5} />
      </g>
      <g className="anim shake">
        <Flame x={296} y={600} w={30} h={150} />
        <Flame x={364} y={600} w={30} h={150} />
        <TitanRocket x={330} y={602} s={0.98} />
      </g>
      <Puffs x={330} y={646} w={460} color="#ffffff" opacity={0.92} seed={22} count={12} className="anim billow" />
      <Puffs x={330} y={672} w={560} color="#efe6dc" opacity={0.95} seed={23} count={13} className="anim billow-slow" />
    </Frame>
  );
}

function Journey() {
  return (
    <Frame label="Viking 1 on its ten-month journey from the tiny Earth toward the big red planet Mars">
      <MarsSky variant="space" stars={90} seed={31} />
      <Glow cx={-40} cy={80} r={260} color="#fff1c9" opacity={0.35} />
      <Earth cx={80} cy={636} r={16} glow={false} />
      <path d="M96 624 C220 520 320 470 400 420" stroke="#ffd7a8" strokeWidth="2.5" strokeDasharray="6 10" fill="none" opacity="0.7" />
      <MarsGlobe cx={500} cy={330} r={160} />
      <g className="anim hover">
        <VikingCraft x={262} y={470} s={0.62} rotate={-26} />
      </g>
    </Frame>
  );
}

function Landing() {
  const u = useUid();
  return (
    <Frame label="Viking 1 landing on Mars in three steps: a glowing heat shield, a big parachute, and then rockets firing just above the ground">
      <Sky id={`${u}-sky`} stops={[[0, "#120812"], [0.35, "#5a2c3a"], [0.75, "#c9896b"], [1, "#e6b48e"]]} />
      <Stars seed={41} count={30} bottom={200} color="#fff1e4" />
      <MarsGround y={650} seed={42} rocks={14} />
      <path d="M150 210 C220 270 330 250 360 330 C390 410 400 470 420 560" stroke="#fff" strokeOpacity="0.55" strokeWidth="2.5" strokeDasharray="5 9" fill="none" />
      <Aeroshell x={150} y={196} s={0.8} rotate={-28} />
      <g className="anim hover-soft">
        <Parachute x={352} y={298} s={0.72} />
        <g transform="translate(352 392) scale(0.72)">
          <path d="M-30 -36 L30 -36 L20 -8 L-20 -8Z" fill="#f2efe9" stroke="#a69d91" strokeWidth="1.5" />
          <path d="M-36 -8 L36 -8 L30 10 L-30 10Z" fill="#d9d2c6" />
        </g>
      </g>
      <g className="anim hover">
        <g transform="translate(430 560)">
          <Flame x={-52 * 0.62} y={-52 * 0.62} w={14} h={50} />
          <Flame x={52 * 0.62} y={-52 * 0.62} w={14} h={50} />
          <VikingLander x={0} y={0} s={0.62} engines shadow={false} />
        </g>
      </g>
      <Puffs x={430} y={650} w={180} color="#e9a983" opacity={0.6} seed={45} count={7} className="anim drift" />
    </Frame>
  );
}

function Footpad() {
  const u = useUid();
  return (
    <Frame label="An old 1970s TV screen showing the first photo from Mars appearing stripe by stripe: Viking's own footpad on the rocky ground">
      <rect width={W} height={H} fill="#1d1418" />
      <rect y="600" width={W} height="160" fill="#2a1d22" />
      <g transform="translate(300 352)">
        <rect x="-236" y="-196" width="472" height="372" rx="34" fill="#4a3c36" />
        <rect x="-226" y="-186" width="452" height="352" rx="28" fill="#3a2e2a" />
        <defs>
          <clipPath id={`${u}-screen`}>
            <rect x="-196" y="-158" width="392" height="270" rx="22" />
          </clipPath>
          <radialGradient id={`${u}-crt`} cx="0.5" cy="0.45" r="0.75">
            <stop offset="0.6" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.55" />
          </radialGradient>
        </defs>
        <g clipPath={`url(#${u}-screen)`}>
          <rect x="-200" y="-160" width="400" height="280" fill="#8e8a86" />
          <path d="M-200 -160 L200 -160 L200 -60 Q0 -84 -200 -40Z" fill="#a9a5a1" />
          {[
            [-150, -90, 1.4],
            [-90, -40, 2],
            [-40, 0, 1.2],
            [60, -70, 1.6],
            [-170, 40, 2.6],
            [130, -20, 1.1],
            [-110, 80, 1.8],
            [20, 60, 1.4],
          ].map(([rx, ry, rs], i) => (
            <g key={i} transform={`translate(${rx} ${ry}) scale(${rs})`}>
              <path d="M-12 0 L-10 -8 L-2 -13 L8 -11 L13 -4 L12 0Z" fill="#3e3a38" />
              <path d="M-10 -8 L-2 -13 L8 -11 L2 -6 L-6 -5Z" fill="#c9c5c0" />
            </g>
          ))}
          <ellipse cx="120" cy="64" rx="112" ry="50" fill="#d8d4cf" />
          <ellipse cx="120" cy="58" rx="100" ry="40" fill="#ece9e5" />
          <ellipse cx="120" cy="58" rx="60" ry="22" fill="#cfcbc6" />
          <path d="M40 -160 L96 30" stroke="#e8e5e0" strokeWidth="18" />
          <g className="anim scanwipe">
            <rect x="-196" y="-160" width="420" height="290" fill="#131012" />
            <rect x="-198" y="-160" width="5" height="290" fill="#fff6dc" opacity="0.9" />
          </g>
          <rect x="-200" y="-160" width="400" height="280" fill={`url(#${u}-crt)`} />
          {Array.from({ length: 34 }, (_, i) => (
            <rect key={i} x="-200" y={-160 + i * 8.4} width="400" height="1.2" fill="#000" opacity="0.18" />
          ))}
        </g>
        <rect x="-196" y="-158" width="392" height="270" rx="22" fill="none" stroke="#1a1414" strokeWidth="6" />
        <circle cx="-150" cy="144" r="12" fill="#2a2220" />
        <circle cx="-110" cy="144" r="12" fill="#2a2220" />
        <rect x="80" y="136" width="100" height="14" rx="7" fill="#2a2220" />
        <circle cx="190" cy="143" r="5" fill="#ff7a4f" className="anim blink" />
      </g>
      <g fill="#120c0f">
        {[110, 230, 380, 500].map((hx, i) => (
          <g key={hx} transform={`translate(${hx} ${728 - (i % 2) * 6})`}>
            <circle cx="0" cy="-58" r="30" />
            <rect x="-48" y="-30" width="96" height="70" rx="34" />
          </g>
        ))}
      </g>
    </Frame>
  );
}

function SkyColor() {
  return (
    <Frame label="Is the sky on Mars blue? For a moment it looks blue, then it turns its true butterscotch color, while Viking's color charts help check">
      <MarsSky variant="day" />
      <g className="anim skyswap">
        <MarsSky variant="blue" />
      </g>
      <Sun cx={150} cy={250} r={12} />
      <MarsGround y={560} seed={51} rocks={20} />
      <VikingLander x={360} y={680} s={1.02} />
      <g transform="translate(250 560)">
        <rect x="-4" y="-4" width="74" height="30" rx="4" fill="#fbf9f5" stroke="#a69d91" />
        {["#d33a3a", "#e8b04a", "#3fa35a", "#2f62c9", "#7b7f8c", "#222"].map((c, i) => (
          <rect key={c} x={i * 11.5} y="0" width="10" height="22" fill={c} />
        ))}
      </g>
      <g fontFamily="Fraunces, Georgia, serif" fontWeight="800" fill="#fffaf2" stroke="#4a2a20" strokeWidth="5" paintOrder="stroke">
        <text x="66" y="150" fontSize="64" className="anim wobble">?</text>
      </g>
    </Frame>
  );
}

function BigJoeScene() {
  return (
    <Frame label="Viking 1 next to a big boulder named Big Joe. A see-through drawing shows how the robot could have tipped over if it had landed on top of it">
      <MarsSky variant="day" />
      <Sun cx={492} cy={196} r={12} />
      <MarsGround y={560} seed={61} rocks={18} />
      <BigJoe x={196} y={652} s={1.25} />
      <g opacity="0.32" className="anim ghost">
        <g transform="translate(196 548) rotate(-24)">
          <VikingLander x={0} y={0} s={0.62} shadow={false} flag={false} />
        </g>
      </g>
      <path d="M96 470 L300 470" stroke="#fffaf2" strokeWidth="0" />
      <VikingLander x={448} y={708} s={0.7} />
      <Bubble x={460} y={470} text="Phew!" w={118} />
    </Frame>
  );
}

function Lab() {
  const u = useUid();
  return (
    <Frame label="Viking's long arm scoops Martian soil into a tiny laboratory inside, where bubbling tests ask: is anything alive?">
      <MarsSky variant="day" />
      <MarsGround y={560} seed={71} rocks={14} />
      <path d="M370 708 Q430 690 500 712 Q440 728 370 708Z" fill="#6f2f1d" />
      <path d="M372 706 Q430 692 498 710" stroke="#e7a47a" strokeWidth="2" fill="none" />
      <VikingLander x={230} y={694} s={0.95} arm="out" />
      <path d="M262 548 C300 440 360 380 380 330" stroke="#fffaf2" strokeWidth="2.5" strokeDasharray="5 8" fill="none" />
      <g transform="translate(436 232)">
        <defs>
          <clipPath id={`${u}-lab`}>
            <circle r="118" />
          </clipPath>
        </defs>
        <circle r="128" fill="#fffaf3" />
        <g clipPath={`url(#${u}-lab)`}>
          <rect x="-130" y="-130" width="260" height="260" fill="#2d2440" />
          <path d="M-130 60 L130 60 L130 130 L-130 130Z" fill="#3c3152" />
          {[-60, 0, 60].map((bx, i) => (
            <g key={bx} transform={`translate(${bx} 52)`}>
              <path d="M-16 -86 L16 -86 L16 -6 Q16 10 0 10 Q-16 10 -16 -6Z" fill="#cfe7ff" opacity="0.35" stroke="#e9f3ff" strokeWidth="2" />
              <path d={`M-14 ${-40 + i * 10} L14 ${-40 + i * 10} L14 -6 Q14 8 0 8 Q-14 8 -14 -6Z`} fill={["#ef8a55", "#8fd18b", "#ffd36b"][i]} opacity="0.85" />
              {[0, 1, 2].map((b) => (
                <circle key={b} cx={-6 + b * 6} cy={-20} r={2.6 + b} fill="#fff" opacity="0.8" className="anim bubble" style={{ animationDelay: `${b * 0.5 + i * 0.3}s` }} />
              ))}
            </g>
          ))}
          <text x="0" y="-62" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontWeight="800" fontSize="56" fill="#ffd36b" className="anim wobble">
            ?
          </text>
        </g>
        <circle r="122" fill="none" stroke="#3a1f18" strokeWidth="8" />
      </g>
    </Frame>
  );
}

function Weather() {
  return (
    <Frame label="Viking's little weather station measures the wind and the cold: about minus 14 degrees by day and minus 77 before dawn, as dust dims the Sun">
      <MarsSky variant="day" />
      <rect y="380" width={W} height="200" fill="#c48a6a" opacity="0.45" />
      <Sun cx={420} cy={236} r={12} halo="#ffe1c4" />
      <rect width={W} height={H} fill="#b8794f" opacity="0.18" />
      <MarsGround y={575} seed={81} rocks={16} />
      <g stroke="#fff6ec" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.75" className="anim drift">
        <path d="M60 300 q60 -20 120 0 t120 0" />
        <path d="M200 360 q50 -16 100 0 t100 0" />
        <path d="M40 430 q70 -22 140 0" />
      </g>
      <VikingLander x={360} y={690} s={1.02} />
      <g transform="translate(96 470)">
        <rect x="-26" y="-250" width="52" height="250" rx="26" fill="#fffaf3" stroke="#3a1f18" strokeWidth="4" />
        <circle cx="0" cy="8" r="38" fill="#fffaf3" stroke="#3a1f18" strokeWidth="4" />
        <circle cx="0" cy="8" r="26" fill="#d6463a" />
        <rect x="-9" y="-80" width="18" height="90" fill="#d6463a" className="anim mercury" style={{ transformOrigin: "0px 10px" }} />
        <g fontFamily="Jost, sans-serif" fontWeight="700" fontSize="17" fill="#fffaf2" stroke="#3a1f18" strokeWidth="4" paintOrder="stroke">
          <text x="34" y="-200">−14°C</text>
          <text x="34" y="-40">−77°C</text>
        </g>
        <path d="M14 -204 L26 -204 M14 -44 L26 -44" stroke="#3a1f18" strokeWidth="3" />
      </g>
    </Frame>
  );
}

function Sunsets() {
  return (
    <Frame label="A Martian sunset glowing blue around the Sun, with a trail of suns showing day after day going by, and Viking's silhouette">
      <MarsSky variant="dusk" stars={28} seed={91} />
      {Array.from({ length: 7 }, (_, i) => (
        <circle key={i} cx={90 + i * 40} cy={160 + i * 50} r={7 + i * 0.8} fill="#fff6e8" opacity={0.18 + i * 0.1} />
      ))}
      <Sun cx={346} cy={520} r={14} blue />
      <MarsGround y={556} seed={92} tone="dusk" rocks={16} />
      <g opacity="0.92">
        <VikingLander x={446} y={696} s={0.72} />
      </g>
      <rect y="556" width={W} height="204" fill="#1a0a12" opacity="0.25" />
    </Frame>
  );
}

function Mistake() {
  return (
    <Frame label="Radio waves from Earth reach Mars, but Viking's dish antenna has turned the wrong way, so it cannot hear them">
      <MarsSky variant="night" stars={80} seed={101} />
      <circle cx="74" cy="92" r="6" fill="#9fc6ff" />
      <Glow cx={74} cy={92} r={40} color="#9fc6ff" opacity={0.6} />
      <g stroke="#9fc6ff" strokeWidth="3" fill="none" strokeLinecap="round" className="anim waves">
        <path d="M130 150 q30 -30 0 -60" opacity="0.9" />
        <path d="M180 214 q44 -44 0 -88" opacity="0.7" />
        <path d="M238 288 q58 -58 0 -116" opacity="0.5" />
        <path d="M300 368 q72 -72 0 -144" opacity="0.32" />
      </g>
      <MarsGround y={575} seed={102} tone="night" rocks={14} />
      <VikingLander x={340} y={690} s={1.05} dish="away" />
      <Bubble x={176} y={402} text="Hello?" w={124} />
    </Frame>
  );
}

function Goodnight() {
  return (
    <Frame label="Goodnight, Viking: the lander sleeps under the stars and two small moons, while a spacecraft passing overhead snaps its picture">
      <MarsSky variant="night" stars={110} seed={111} />
      <SmallMoon cx={460} cy={150} r={16} fill="#cdb2a4" />
      <SmallMoon cx={120} cy={222} r={7} fill="#cdb2a4" />
      <Orbiter x={0} y={300} s={0.95} panel="#5d3b8f" />
      <MarsGround y={565} seed={112} tone="night" rocks={18} />
      <g transform="translate(110 640)">
        <path d="M-60 0 Q-20 -18 30 -6 Q60 0 70 10 Q10 20 -60 0Z" fill="#e9dccf" opacity="0.8" />
        <path d="M-40 -2 Q-10 -12 20 -4" stroke="#ef8a55" strokeWidth="4" fill="none" opacity="0.8" />
      </g>
      <VikingLander x={330} y={688} s={1.08} eyes="closed" dusty />
      <Glow cx={330} cy={520} r={150} color="#ffd9b8" opacity={0.14} className="anim breathe" />
      <Zzz x={398} y={410} size={30} color="#fff1e4" />
    </Frame>
  );
}

export const vikingScenes = {
  "viking-cover": Cover,
  "viking-asleep": Asleep,
  "viking-twins": Twins,
  "viking-journey": Journey,
  "viking-landing": Landing,
  "viking-footpad": Footpad,
  "viking-sky": SkyColor,
  "viking-bigjoe": BigJoeScene,
  "viking-lab": Lab,
  "viking-weather": Weather,
  "viking-sunsets": Sunsets,
  "viking-mistake": Mistake,
  "viking-goodnight": Goodnight,
};
