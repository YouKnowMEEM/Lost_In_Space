import React from "react";
import { Earth, Flame, Frame, Glow, Puffs, Sky, Stars, Zzz, rng, useUid } from "./common";
import { TitanRocket } from "./vikingParts";
import { FarSun, SmallPlanet } from "./voyagerParts";
import { Bubble, Question, Space, Sparkle, Tag } from "./kit";
import { KeplerScope, LightCurve, TransitStar } from "./machines";

/** A reaction wheel: a spinning disc, crossed out when broken. */
function Wheel({ x, y, broken = false }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="40" fill="#1b2a52" stroke="#8fd3ff" strokeWidth="3" />
      <g className={broken ? undefined : "anim spin-slow"}>
        <path d="M-30 0 H30 M0 -30 V30" stroke="#8fd3ff" strokeWidth="4" strokeLinecap="round" />
        <circle r="8" fill="#8fd3ff" />
      </g>
      {broken && <path d="M-34 -34 L34 34 M34 -34 L-34 34" stroke="#ff8d8d" strokeWidth="8" strokeLinecap="round" />}
    </g>
  );
}

function Cover() {
  return (
    <Frame label="Kepler, a tall telescope with a slanted hood, gazing at a star while a tiny planet passes in front of it">
      <Space variant="deep" stars={160} seed={3} milky />
      <TransitStar cx={430} cy={230} r={44} />
      <g className="anim hover-soft">
        <KeplerScope x={250} y={520} s={1.0} rotate={18} eyes="happy" />
      </g>
    </Frame>
  );
}

function Asleep() {
  return (
    <Frame label="Kepler asleep, drifting along behind the Earth around the Sun like a duckling following its mother">
      <Space variant="night" stars={140} seed={13} />
      <FarSun cx={90} cy={620} r={14} halo={110} rays={false} />
      <path d="M90 620 m-520 0 a520 520 0 0 1 1040 0" fill="none" stroke="#9fdcff" strokeWidth="2" strokeDasharray="6 8" opacity="0.45" transform="rotate(-30 90 620)" />
      <Earth cx={440} cy={200} r={34} />
      <g className="anim drift">
        <KeplerScope x={250} y={330} s={0.55} rotate={40} eyes="closed" />
      </g>
      <Glow cx={250} cy={330} r={110} color="#cfe0ff" opacity={0.12} className="anim breathe" />
      <Zzz x={290} y={220} size={22} />
      <Tag x={450} y={300} text="follow me!" size={18} />
    </Frame>
  );
}

function QuestionScene() {
  const u = useUid();
  const r = rng(22);
  return (
    <Frame label="A little backyard telescope on a hill under a starry sky, wondering which stars have planets like Earth">
      <Sky id={`${u}-s`} stops={[[0, "#03061a"], [0.7, "#142456"], [1, "#2b3f7a"]]} />
      <Stars seed={21} count={180} bottom={520} color="#f4f7ff" />
      {Array.from({ length: 6 }, (_, i) => {
        const x = 80 + r() * 440;
        const y = 90 + r() * 300;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="5" fill="#fff6dc" />
            <circle cx={x + 16} cy={y + 6} r="3" fill={["#8fd3ff", "#ffb38a", "#9be59b"][i % 3]} />
          </g>
        );
      })}
      <path d="M0 560 Q300 500 600 560 L600 760 L0 760Z" fill="#1d2b3a" />
      <g transform="translate(300 560)">
        <path d="M-30 0 L0 -60 L30 0 M0 -60 L0 0" stroke="#b9bfce" strokeWidth="4" />
        <rect x="-50" y="-96" width="100" height="26" rx="8" fill="#e8eaf1" transform="rotate(-28 0 -80)" />
      </g>
      <Question x={160} y={300} s={1.1} />
      <Question x={440} y={250} s={0.8} delay={1} />
      <Tag x={300} y={680} text="Are there other Earths?" size={22} />
    </Frame>
  );
}

function Launch() {
  return (
    <Frame label="Kepler blasting off from Florida on a rocket into the night sky">
      <Space variant="dawn" stars={40} seed={31} />
      <rect y="640" width="600" height="120" fill="#33465c" />
      <rect y="660" width="600" height="20" fill="#5f9bd3" opacity="0.6" />
      <g className="anim shake">
        <Flame x={300} y={620} w={36} h={150} />
        <TitanRocket x={300} y={622} s={0.9} label="KEPLER" />
      </g>
      <Puffs x={300} y={660} w={460} color="#ffffff" opacity={0.9} seed={32} count={12} className="anim billow" />
      <Tag x={300} y={140} text="6 March 2009" size={22} />
    </Frame>
  );
}

function Blink() {
  return (
    <Frame label="A planet passing in front of its star, making the star dim a tiny bit, shown as a little dip on a chart">
      <Space variant="deep" stars={120} seed={41} />
      <TransitStar cx={300} cy={250} r={110} className="anim scanwipe" from={-1.9} />
      <LightCurve x={170} y={520} w={260} h={90} />
      <Tag x={300} y={470} text="blink!" size={26} />
      <g className="anim hover-soft">
        <KeplerScope x={520} y={640} s={0.42} rotate={-20} eyes="wide" />
      </g>
    </Frame>
  );
}

function Planets() {
  const planets = [
    [120, 170, 30, "#e3a14d"],
    [470, 150, 18, "#8fd3ff"],
    [220, 330, 14, "#9be59b"],
    [520, 330, 24, "#c49bff"],
    [90, 470, 20, "#ff9db0"],
    [400, 470, 12, "#7fb2ff"],
  ];
  return (
    <Frame label="Lots of different planets around other stars: big ones, small rocky ones, and one with two suns, while Kepler smiles">
      <Space variant="indigo" stars={140} seed={51} milky />
      {planets.map(([x, y, r, c], i) => (
        <g key={i} className="anim hover-soft" style={{ animationDelay: `${i * 0.5}s` }}>
          <SmallPlanet cx={x} cy={y} r={r} color={c} />
        </g>
      ))}
      <g transform="translate(330 220)">
        <circle cx="-14" cy="0" r="10" fill="#ffe6a6" />
        <circle cx="14" cy="6" r="7" fill="#ffb36b" />
        <ellipse cx="0" cy="2" rx="46" ry="16" fill="none" stroke="#fff6dc" strokeWidth="1.5" strokeDasharray="3 4" />
        <circle cx="44" cy="0" r="5" fill="#8fd3ff" />
      </g>
      <Tag x={330} y={270} text="two suns!" size={16} />
      <KeplerScope x={300} y={600} s={0.62} eyes="happy" />
      <Sparkle x={200} y={560} delay={0.2} />
      <Sparkle x={420} y={560} delay={1.2} />
    </Frame>
  );
}

function Wheels() {
  return (
    <Frame label="Kepler's four steadying wheels: two still spinning and two broken, so Kepler begins to wobble">
      <Space variant="deep" stars={110} seed={61} />
      <Wheel x={150} y={190} />
      <Wheel x={250} y={190} />
      <Wheel x={350} y={190} broken />
      <Wheel x={450} y={190} broken />
      <g transform="rotate(-12 300 520)" className="anim hover">
        <KeplerScope x={300} y={520} s={0.9} eyes="wide" tilt={-8} />
      </g>
      <path d="M150 480 q-20 30 0 60 M460 470 q20 30 0 60" stroke="#cfe0ff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
      <Bubble x={460} y={300} text="Uh-oh..." w={130} flip />
    </Frame>
  );
}

function K2() {
  return (
    <Frame label="Kepler balancing on the gentle push of sunlight, like a kayak pointed into a river's current">
      <Space variant="indigo" stars={100} seed={71} />
      <FarSun cx={60} cy={380} r={16} halo={120} rays={false} />
      {[300, 350, 400, 450].map((y, i) => (
        <path key={y} d={`M110 ${y} L230 ${y}`} stroke="#ffe8b0" strokeWidth="3" strokeDasharray="8 8" opacity="0.7" className="anim laser" style={{ animationDelay: `${i * 0.2}s` }} />
      ))}
      <g className="anim hover-soft">
        <KeplerScope x={360} y={420} s={0.8} rotate={70} eyes="happy" />
      </g>
      <g transform="translate(400 660)">
        <rect x="-150" y="-50" width="300" height="100" rx="18" fill="#5f9bd3" opacity="0.6" />
        <path d="M-130 -20 H130 M-130 10 H130" stroke="#cfe8ff" strokeWidth="3" strokeDasharray="12 10" className="anim laser" />
        <path d="M-50 0 Q0 -16 50 0 Q0 16 -50 0Z" fill="#ff8d5c" />
        <path d="M-30 -18 L30 18" stroke="#8a5a3c" strokeWidth="4" />
      </g>
      <Tag x={190} y={250} text="sunlight pushes" size={18} />
      <Tag x={400} y={580} text="like a kayak" size={18} />
    </Frame>
  );
}

function Goodnight() {
  return (
    <Frame label="Kepler asleep, drifting far behind the Earth, while the sky fills with stars that have worlds of their own">
      <Space variant="night" stars={200} seed={81} milky milkyY={260} />
      <Earth cx={500} cy={160} r={18} glow={false} />
      {Array.from({ length: 10 }, (_, i) => {
        const r = rng(80 + i);
        const x = 40 + r() * 520;
        const y = 300 + r() * 380;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="3" fill="#fff6dc" />
            <circle cx={x + 9} cy={y + 3} r="1.8" fill="#8fd3ff" className="anim tw" style={{ animationDelay: `${i * 0.3}s` }} />
          </g>
        );
      })}
      <g className="anim drift">
        <KeplerScope x={240} y={420} s={0.75} rotate={30} eyes="closed" />
      </g>
      <Glow cx={240} cy={420} r={150} color="#cfe0ff" opacity={0.12} className="anim breathe" />
      <Zzz x={290} y={270} size={24} />
    </Frame>
  );
}

export const keplerScenes = {
  "kepler-cover": Cover,
  "kepler-asleep": Asleep,
  "kepler-question": QuestionScene,
  "kepler-launch": Launch,
  "kepler-blink": Blink,
  "kepler-planets": Planets,
  "kepler-wheels": Wheels,
  "kepler-k2": K2,
  "kepler-goodnight": Goodnight,
};
