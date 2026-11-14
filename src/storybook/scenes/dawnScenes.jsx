import React from "react";
import { Earth, Frame, Glow, Zzz, rng } from "./common";
import { FarSun } from "./voyagerParts";
import { Bubble, Space, Sparkle, Tag } from "./kit";
import { DawnCraft, DwarfWorld } from "./machines";

/** A scatter of little rocks drifting across the frame, for the asteroid belt. */
function BeltRocks({ seed = 5, count = 40, top = 0, bottom = 760 }) {
  const r = rng(seed);
  return (
    <g className="anim drift" opacity="0.8">
      {Array.from({ length: count }, (_, i) => {
        const x = r() * 600;
        const y = top + r() * (bottom - top);
        const s = 2 + r() * 6;
        return <ellipse key={i} cx={x} cy={y} rx={s} ry={s * 0.7} fill="#9a8b78" transform={`rotate(${r() * 90} ${x} ${y})`} />;
      })}
    </g>
  );
}

function Cover() {
  return (
    <Frame label="Dawn, a gold spacecraft with two very long solar wings and a gentle blue glow, flying towards the little grey world Ceres">
      <Space variant="deep" stars={130} seed={3} milky />
      <DwarfWorld cx={420} cy={600} r={180} kind="ceres" />
      <g className="anim hover">
        <DawnCraft x={260} y={300} s={0.62} rotate={-14} eyes="happy" thrust />
      </g>
    </Frame>
  );
}

function Asleep() {
  return (
    <Frame label="Dawn asleep, circling quietly around the dwarf planet Ceres in the asteroid belt">
      <Space variant="night" stars={130} seed={13} />
      <FarSun cx={90} cy={130} r={6} halo={50} />
      <DwarfWorld cx={300} cy={500} r={200} kind="ceres" />
      <ellipse cx="300" cy="500" rx="280" ry="70" fill="none" stroke="#9fdcff" strokeWidth="2" strokeDasharray="5 8" opacity="0.45" transform="rotate(-12 300 500)" />
      <g className="anim drift">
        <DawnCraft x={290} y={220} s={0.56} rotate={-6} eyes="closed" />
      </g>
      <Glow cx={290} cy={220} r={120} color="#cfe0ff" opacity={0.12} className="anim breathe" />
      <Zzz x={320} y={150} size={22} />
    </Frame>
  );
}

function Why() {
  return (
    <Frame label="Two worlds side by side: lumpy, rocky Vesta and round, icy Ceres, both leftovers from the beginning of the Solar System">
      <Space variant="indigo" stars={110} seed={23} />
      <BeltRocks seed={24} count={36} />
      <DwarfWorld cx={170} cy={360} r={110} kind="vesta" />
      <DwarfWorld cx={430} cy={420} r={140} kind="ceres" />
      <Tag x={170} y={520} text="Vesta: dry and rocky" size={19} />
      <Tag x={430} y={610} text="Ceres: icy inside" size={19} />
      <g transform="translate(300 170)">
        <rect x="-110" y="-40" width="220" height="70" rx="12" fill="#fffaf3" />
        <text x="0" y="6" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontWeight="800" fontSize="22" fill="#121a32">
          time capsules
        </text>
      </g>
    </Frame>
  );
}

function Engine() {
  return (
    <Frame label="Dawn's ion engine glowing soft blue, its push as gentle as a sheet of paper resting on a hand">
      <Space variant="deep" stars={110} seed={33} />
      <g className="anim hover-soft">
        <DawnCraft x={300} y={240} s={0.85} eyes="happy" thrust />
      </g>
      <g transform="translate(150 640)">
        {/* an open hand with a sheet of paper resting on it */}
        <path d="M-58 60 L-58 4 Q-58 -8 -46 -8 L46 -8 Q60 -8 60 6 L60 60Z" fill="#f2c9a4" />
        {[-44, -18, 8, 34].map((fx) => (
          <rect key={fx} x={fx} y="-40" width="22" height="44" rx="11" fill="#f2c9a4" />
        ))}
        <rect x="-82" y="-4" width="38" height="20" rx="10" fill="#f2c9a4" transform="rotate(-24 -63 6)" />
        <g className="anim hover-soft">
          <rect x="-74" y="-58" width="148" height="16" rx="2" fill="#fffdf6" transform="rotate(-3)" />
        </g>
      </g>
      <Tag x={150} y={530} text="as gentle as paper" size={19} />
      <Tag x={450} y={620} text="but for years and years!" size={19} />
      <Sparkle x={320} y={520} delay={0.4} color="#bfe9ff" />
    </Frame>
  );
}

function Vesta() {
  return (
    <Frame label="Dawn circling Vesta, a lumpy world with a giant crater and one of the tallest mountains in the Solar System">
      <Space variant="night" stars={120} seed={43} />
      <FarSun cx={520} cy={110} r={6} halo={50} />
      <DwarfWorld cx={300} cy={470} r={210} kind="vesta" />
      <path d="M220 640 L300 560 L380 640" fill="#7a6650" stroke="#e9dcc4" strokeWidth="2" />
      <path d="M300 560 L320 590 L280 590Z" fill="#e9dcc4" opacity="0.7" />
      <Tag x={300} y={720} text="a mountain more than twice as tall as Everest" size={17} />
      <g className="anim drift">
        <DawnCraft x={260} y={170} s={0.52} rotate={10} eyes="wide" />
      </g>
    </Frame>
  );
}

function Leave() {
  return (
    <Frame label="Dawn spiralling away from Vesta on its blue engine, heading through the asteroid belt towards Ceres">
      <Space variant="indigo" stars={110} seed={53} />
      <BeltRocks seed={54} count={30} />
      <DwarfWorld cx={90} cy={620} r={90} kind="vesta" />
      <DwarfWorld cx={520} cy={150} r={60} kind="ceres" />
      <path d="M100 520 C140 400 260 470 300 380 C340 290 420 300 470 210" stroke="#bfe9ff" strokeWidth="3" strokeDasharray="6 8" fill="none" opacity="0.8" />
      <g className="anim hover">
        <DawnCraft x={310} y={380} s={0.56} rotate={-40} eyes="happy" thrust />
      </g>
      <Bubble x={190} y={200} text="Next stop, Ceres!" w={210} />
    </Frame>
  );
}

function Spots() {
  return (
    <Frame label="Dawn arriving at Ceres and seeing bright white salty spots shining inside a crater">
      <Space variant="deep" stars={110} seed={63} />
      <DwarfWorld cx={300} cy={480} r={230} kind="ceres" />
      <Sparkle x={325} y={452} s={1.4} delay={0.2} />
      <Sparkle x={344} y={462} s={0.9} delay={0.9} />
      <g transform="translate(470 240)">
        <circle r="70" fill="#fffaf3" />
        <circle r="56" fill="#7d7a77" />
        <ellipse cx="0" cy="6" rx="38" ry="24" fill="#5f5c5a" />
        <circle cx="0" cy="4" r="10" fill="#ffffff" />
        <circle cx="16" cy="12" r="5" fill="#ffffff" />
        <text x="0" y="96" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontWeight="800" fontSize="17" fill="#fff6dc">
          salt!
        </text>
      </g>
      <path d="M418 290 L346 440" stroke="#fffaf3" strokeWidth="2" strokeDasharray="4 5" />
      <g className="anim drift">
        <DawnCraft x={220} y={170} s={0.5} rotate={-10} eyes="wide" />
      </g>
    </Frame>
  );
}

function Water() {
  return (
    <Frame label="A cut-away of Ceres showing pockets of very salty water deep under its crust">
      <Space variant="indigo" stars={100} seed={73} />
      <g>
        <circle cx="300" cy="430" r="230" fill="#6f6c69" />
        <path d="M300 200 A230 230 0 0 1 300 660Z" fill="#4f4c4a" />
        <circle cx="300" cy="430" r="160" fill="#8a8580" />
        <path d="M300 270 A160 160 0 0 1 300 590Z" fill="#6b6662" />
        <g className="anim glowpulse">
          <ellipse cx="380" cy="300" rx="34" ry="12" fill="#5ab8ff" opacity="0.8" />
          <ellipse cx="420" cy="380" rx="22" ry="9" fill="#5ab8ff" opacity="0.7" />
        </g>
        <path d="M300 200 V660" stroke="#3a3836" strokeWidth="2" />
      </g>
      <Tag x={500} y={250} text="salty water" to={[400, 296]} size={18} />
      <Tag x={300} y={710} text="carbon-rich clues on the surface" size={18} />
      <Sparkle x={200} y={240} delay={0.3} />
    </Frame>
  );
}

function Goodnight() {
  return (
    <Frame label="Dawn asleep in a high, safe orbit, circling Ceres forever like a silent guardian">
      <Space variant="night" stars={150} seed={83} milky milkyY={220} />
      <FarSun cx={520} cy={120} r={6} halo={50} />
      <Earth cx={80} cy={140} r={5} glow={false} />
      <DwarfWorld cx={300} cy={560} r={170} kind="ceres" />
      <ellipse cx="300" cy="560" rx="270" ry="90" fill="none" stroke="#9fdcff" strokeWidth="2" strokeDasharray="5 8" opacity="0.4" transform="rotate(-10 300 560)" />
      <g className="anim drift">
        <DawnCraft x={300} y={260} s={0.62} eyes="closed" />
      </g>
      <Glow cx={300} cy={260} r={150} color="#cfe0ff" opacity={0.12} className="anim breathe" />
      <Zzz x={330} y={200} size={22} />
    </Frame>
  );
}

export const dawnScenes = {
  "dawn-cover": Cover,
  "dawn-asleep": Asleep,
  "dawn-why": Why,
  "dawn-engine": Engine,
  "dawn-vesta": Vesta,
  "dawn-leave": Leave,
  "dawn-spots": Spots,
  "dawn-water": Water,
  "dawn-goodnight": Goodnight,
};
