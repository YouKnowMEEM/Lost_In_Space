import React from "react";
import { Frame, Glow, Zzz, rng } from "./common";
import { BigDish, FarSun, HazyMoon, Jupiter, Saturn, SignalWaves } from "./voyagerParts";
import { Bubble, Space, Sparkle, Tag } from "./kit";
import { PioneerCraft } from "./machines";

/** A soft zig-zag of radiation crackling around a planet. */
function Zap({ x, y, s = 1, delay = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 -20 L10 -4 L2 -2 L12 18" stroke="#ffe25a" strokeWidth="4" fill="none" strokeLinejoin="round" strokeLinecap="round" className="anim beep" style={{ animationDelay: `${delay}s` }} />
    </g>
  );
}

/** A constellation drawn as stars joined by faint lines. */
function Constellation({ points, color = "#cfe0ff" }) {
  return (
    <g>
      <path d={`M${points.map((p) => p.join(" ")).join(" L")}`} stroke={color} strokeWidth="1.5" fill="none" opacity="0.45" />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 0 ? 4 : 2.6} fill="#f4f7ff" className="anim tw" style={{ animationDelay: `${i * 0.4}s` }} />
      ))}
    </g>
  );
}

function Cover() {
  return (
    <Frame label="Pioneer, a spacecraft with a big white dish for a face and two long arms, flying past the giant striped planet Jupiter">
      <Space variant="deep" stars={140} seed={3} />
      <Jupiter cx={500} cy={330} r={190} />
      <g className="anim hover">
        <PioneerCraft x={230} y={560} s={0.92} rotate={-10} eyes="happy" />
      </g>
    </Frame>
  );
}

function Asleep() {
  return (
    <Frame label="Pioneer 10 and Pioneer 11 asleep, flying away from each other into the dark beyond all the planets">
      <Space variant="night" stars={180} seed={13} milky milkyY={360} />
      <FarSun cx={300} cy={420} r={5} halo={40} rays={false} />
      <g className="anim drift-away">
        <PioneerCraft x={140} y={230} s={0.5} rotate={-20} eyes="closed" />
      </g>
      <g className="anim drift">
        <PioneerCraft x={450} y={600} s={0.5} rotate={14} eyes="closed" />
      </g>
      <path d="M220 290 L270 380 M380 540 L330 460" stroke="#cfe0ff" strokeWidth="2" strokeDasharray="4 6" opacity="0.5" />
      <Zzz x={170} y={140} size={20} />
      <Zzz x={480} y={500} size={20} />
      <Tag x={140} y={330} text="Pioneer 10" size={18} />
      <Tag x={450} y={700} text="Pioneer 11" size={18} />
    </Frame>
  );
}

function Belt() {
  const r = rng(21);
  return (
    <Frame label="Pioneer 10 flying carefully through the asteroid belt, where the rocks turn out to be very far apart">
      <Space variant="indigo" stars={100} seed={21} />
      <g className="anim drift">
        {Array.from({ length: 34 }, (_, i) => {
          const x = r() * 600;
          const y = 80 + r() * 640;
          const s = 3 + r() * 12;
          return <ellipse key={i} cx={x} cy={y} rx={s} ry={s * 0.75} fill="#8f8170" transform={`rotate(${r() * 90} ${x} ${y})`} />;
        })}
      </g>
      <path d="M40 700 C200 600 260 420 560 120" stroke="#ffe08a" strokeWidth="2.5" strokeDasharray="6 8" fill="none" opacity="0.7" />
      <g className="anim hover">
        <PioneerCraft x={300} y={420} s={0.6} rotate={-36} eyes="side" />
      </g>
      <Bubble x={170} y={190} text="Phew! No scratches!" w={240} size={20} />
    </Frame>
  );
}

function JupiterScene() {
  return (
    <Frame label="Pioneer 10 at Jupiter, seeing the Great Red Spot up close while invisible radiation crackles around it">
      <Space variant="deep" stars={90} seed={31} />
      <Jupiter cx={300} cy={520} r={290} />
      <ellipse cx="300" cy="520" rx="370" ry="120" fill="none" stroke="#ffe25a" strokeWidth="2" strokeDasharray="3 10" opacity="0.4" transform="rotate(-8 300 520)" />
      <Zap x={120} y={260} />
      <Zap x={500} y={300} s={1.2} delay={0.4} />
      <Zap x={420} y={180} s={0.8} delay={0.8} />
      <g className="anim shake">
        <PioneerCraft x={260} y={180} s={0.55} rotate={8} eyes="wide" />
      </g>
      <Tag x={300} y={720} text="a storm bigger than the Earth" size={18} />
    </Frame>
  );
}

function Plaque() {
  return (
    <Frame label="The little golden plaque Pioneer carries: two people saying hello, a map of where our Sun is, and a picture of our planets with Pioneer leaving the third one">
      <Space variant="indigo" stars={100} seed={41} />
      <g transform="translate(300 360)">
        <rect x="-220" y="-150" width="440" height="300" rx="14" fill="#f2c96a" stroke="#b07d22" strokeWidth="4" />
        <rect x="-206" y="-136" width="412" height="272" rx="8" fill="none" stroke="#d9a84a" strokeWidth="2" />
        {/* star map */}
        <g stroke="#7a5520" strokeWidth="2">
          {[0, 25, 60, 100, 150, 200, 250, 300, 330].map((a) => (
            <path key={a} d={`M-120 -50 L${-120 + Math.cos((a * Math.PI) / 180) * (50 + (a % 3) * 18)} ${-50 + Math.sin((a * Math.PI) / 180) * (50 + (a % 3) * 18)}`} />
          ))}
        </g>
        <circle cx="-120" cy="-50" r="5" fill="#7a5520" />
        {/* two people, simply drawn */}
        <g fill="none" stroke="#7a5520" strokeWidth="3" strokeLinecap="round">
          <circle cx="90" cy="-90" r="14" />
          <path d="M90 -76 L90 -10 M90 -10 L78 40 M90 -10 L102 40 M90 -62 L70 -40 M90 -62 L112 -96" />
          <circle cx="150" cy="-82" r="13" />
          <path d="M150 -69 L150 -8 M150 -8 L140 40 M150 -8 L160 40 M150 -56 L134 -30 M150 -56 L166 -30" />
        </g>
        {/* the Sun and planets, with Pioneer leaving the third */}
        <g fill="#7a5520">
          {[[-170, 14], [-120, 4], [-90, 5], [-60, 6], [-30, 4], [10, 11], [60, 10], [100, 7], [135, 7]].map(([x, r], i) => (
            <circle key={i} cx={x} cy={100} r={r} />
          ))}
        </g>
        <path d="M-60 100 Q-40 60 -10 70 Q40 84 60 60" stroke="#7a5520" strokeWidth="2.5" fill="none" />
        <path d="M60 60 l-10 -2 l4 10Z" fill="#7a5520" />
      </g>
      <Sparkle x={130} y={180} delay={0.2} />
      <Sparkle x={500} y={560} delay={1} />
      <Tag x={300} y={600} text="Hello from Earth!" size={24} />
    </Frame>
  );
}

function SaturnScene() {
  return (
    <Frame label="Pioneer 11 swooping past Saturn and its beautiful rings, with the hazy moon Titan nearby">
      <Space variant="deep" stars={120} seed={51} />
      <Saturn cx={300} cy={430} r={170} />
      <HazyMoon cx={510} cy={180} r={26} />
      <path d="M40 640 C200 560 300 650 560 600" stroke="#ffe08a" strokeWidth="2.5" strokeDasharray="6 8" fill="none" opacity="0.7" />
      <g className="anim hover">
        <PioneerCraft x={170} y={630} s={0.42} rotate={-12} eyes="happy" />
      </g>
      <Tag x={510} y={240} text="Titan: brrr!" size={17} />
      <Tag x={300} y={170} text="the first to visit Saturn" size={19} />
    </Frame>
  );
}

function Far() {
  return (
    <Frame label="A Pioneer far beyond the planets, its faint signal crawling back to a giant dish antenna on Earth">
      <Space variant="night" stars={200} seed={61} milky milkyY={200} />
      <g className="anim drift">
        <PioneerCraft x={460} y={190} s={0.36} rotate={-30} eyes="sleepy" />
      </g>
      <SignalWaves x={380} y={250} count={3} r={30} color="#9fdcff" rotate={-130} />
      <FarSun cx={250} cy={390} r={4} halo={30} rays={false} />
      <path d="M0 640 Q300 600 600 640 L600 760 L0 760Z" fill="#203048" />
      <BigDish x={170} y={650} s={0.9} rotate={-38} />
      <Tag x={300} y={470} text="a whisper from 12 billion kilometres away" size={17} />
    </Frame>
  );
}

function Goodnight() {
  return (
    <Frame label="Pioneer 10 drifting towards the red star Aldebaran and Pioneer 11 towards the stars of the Eagle, both fast asleep">
      <Space variant="night" stars={180} seed={71} milky milkyY={380} />
      <Constellation points={[[460, 120], [500, 160], [540, 150], [520, 210], [470, 230]]} />
      <g>
        <Glow cx={460} cy={120} r={30} color="#ff9a6a" opacity={0.7} />
        <circle cx="460" cy="120" r="6" fill="#ffb38a" />
      </g>
      <Tag x={470} y={270} text="Aldebaran" size={17} />
      <Constellation points={[[90, 560], [130, 600], [170, 590], [120, 650], [60, 640]]} />
      <Tag x={120} y={700} text="Aquila, the Eagle" size={17} />
      <g className="anim drift-away">
        <PioneerCraft x={330} y={260} s={0.42} rotate={-25} eyes="closed" />
      </g>
      <g className="anim drift">
        <PioneerCraft x={280} y={520} s={0.42} rotate={18} eyes="closed" />
      </g>
      <Zzz x={360} y={180} size={20} />
      <Zzz x={320} y={430} size={20} />
    </Frame>
  );
}

export const pioneersScenes = {
  "pioneers-cover": Cover,
  "pioneers-asleep": Asleep,
  "pioneers-belt": Belt,
  "pioneers-jupiter": JupiterScene,
  "pioneers-plaque": Plaque,
  "pioneers-saturn": SaturnScene,
  "pioneers-far": Far,
  "pioneers-goodnight": Goodnight,
};
