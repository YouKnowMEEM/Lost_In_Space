import React from "react";
import { Frame, Glow, Orbiter, Sky, Stars, Zzz, useUid } from "./common";
import { Aeroshell, MarsGround, Parachute, Rock, SmallMoon } from "./vikingParts";
import { Bubble, MarsSky, Sparkle, Sun, Tag } from "./kit";
import { AirbagBall, DustDevil, PathfinderLander, Sojourner } from "./machines";

/** A rock with a name, the way Sojourner's team labelled them. */
function NamedRock({ x, y, s = 1, name, dark = false }) {
  return (
    <g>
      <Rock x={x} y={y} s={s * 4} dark={dark} />
      <Tag x={x} y={y - 13 * s * 4 - 12} text={name} size={17} />
    </g>
  );
}

function Twin({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#c9542c">
      <path d="M-120 0 Q-80 -70 -40 -40 Q-10 -80 30 -30 Q60 -60 120 0Z" opacity="0.85" />
    </g>
  );
}

function Cover() {
  return (
    <Frame label="Sojourner, a tiny six-wheeled rover, driving on red Mars rocks next to its flower-shaped lander">
      <MarsSky variant="day" />
      <Sun cx={480} cy={300} r={12} />
      <Twin x={300} y={520} s={1} />
      <MarsGround y={540} seed={4} rocks={24} />
      <PathfinderLander x={190} y={610} s={0.62} eyes="happy" />
      <g className="anim hover-soft">
        <Sojourner x={380} y={690} s={2.1} eyes="happy" roll />
      </g>
      <path d="M200 700 C260 704 300 698 330 700" stroke="#a63e1e" strokeWidth="5" strokeDasharray="6 5" opacity="0.6" fill="none" />
    </Frame>
  );
}

function Asleep() {
  return (
    <Frame label="The Pathfinder lander with its petals spread like a flower and little Sojourner beside it, both asleep at dusk in a rocky valley">
      <MarsSky variant="dusk" stars={30} seed={12} />
      <SmallMoon cx={460} cy={160} r={12} fill="#d8b8a8" />
      <Twin x={300} y={500} s={1.1} />
      <MarsGround y={530} seed={13} tone="dusk" rocks={30} />
      <PathfinderLander x={250} y={640} s={0.85} eyes="closed" dusty />
      <Sojourner x={470} y={700} s={1.5} eyes="closed" dusty />
      <Glow cx={300} cy={560} r={170} color="#ffd9b8" opacity={0.16} className="anim breathe" />
      <Zzz x={280} y={460} size={26} color="#fff1e4" />
    </Frame>
  );
}

function Name() {
  const u = useUid();
  return (
    <Frame label="A child's prize-winning essay with a gold star, and the little rover proudly wearing its new name, Sojourner">
      <Sky id={`${u}-s`} stops={[[0, "#2c1b63"], [1, "#7b4aa6"]]} />
      <Stars seed={21} count={50} bottom={400} color="#fff1e4" />
      <g transform="translate(190 330) rotate(-6)">
        <rect x="-110" y="-140" width="220" height="280" rx="6" fill="#fffdf6" />
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M-86 ${-96 + i * 26} H${70 - (i % 3) * 18}`} stroke="#9aa6c8" strokeWidth="3" strokeLinecap="round" />
        ))}
        <text x="0" y="-108" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontWeight="800" fontSize="18" fill="#3a1f18">
          My essay
        </text>
        <g transform="translate(78 110)">
          <circle r="28" fill="#f2b640" />
          <path d="M0 -16 L5 -5 L17 -5 L7 2 L11 14 L0 7 L-11 14 L-7 2 L-17 -5 L-5 -5Z" fill="#fffbe8" />
        </g>
      </g>
      <path d="M0 560 Q300 530 600 560 L600 760 L0 760Z" fill="#dd6233" />
      <g className="anim hover-soft">
        <Sojourner x={430} y={640} s={2.4} eyes="happy" />
      </g>
      <g transform="translate(430 500)">
        <rect x="-86" y="-22" width="172" height="40" rx="20" fill="#fffaf3" />
        <text x="0" y="6" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontWeight="800" fontSize="20" fill="#3a1f18">
          SOJOURNER
        </text>
      </g>
      <Sparkle x={330} y={460} delay={0.2} />
      <Sparkle x={540} y={440} s={0.8} delay={1.1} />
    </Frame>
  );
}

function Bounce() {
  return (
    <Frame label="Pathfinder arriving on Mars: a glowing heat shield, a parachute, and then a big bunch of airbags bouncing across the rocks">
      <MarsSky variant="day" />
      <MarsGround y={600} seed={32} rocks={20} />
      <g className="anim drift-away">
        <Aeroshell x={110} y={150} s={0.55} rotate={-24} />
      </g>
      <g className="anim hover-soft">
        <Parachute x={470} y={170} s={0.5} />
      </g>
      <path d="M90 560 Q140 380 200 560 Q250 440 300 560 Q340 480 380 600" stroke="#fff3df" strokeWidth="2.5" strokeDasharray="5 8" fill="none" opacity="0.8" />
      <AirbagBall x={430} y={560} s={1.1} />
      <Tag x={150} y={330} text="boing!" size={26} />
      <Tag x={270} y={400} text="boing!" size={22} />
      <Tag x={360} y={450} text="boing!" size={18} />
    </Frame>
  );
}

function Petals() {
  return (
    <Frame label="The lander opening its three solar petals, while Sojourner rolls down a little ramp onto Mars for the first time">
      <MarsSky variant="day" />
      <Sun cx={110} cy={290} r={12} />
      <Twin x={420} y={500} s={0.9} />
      <MarsGround y={520} seed={42} rocks={26} />
      <PathfinderLander x={260} y={600} s={0.95} eyes="happy" />
      <g transform="rotate(20 320 660)">
        <Sojourner x={310} y={670} s={1.25} eyes="wide" roll />
      </g>
      <Sparkle x={380} y={640} delay={0.3} />
      <Tag x={430} y={440} text="Twin Peaks" size={17} />
      <Bubble x={140} y={300} text="First wheels on Mars!" w={250} size={20} />
    </Frame>
  );
}

function Rocks() {
  return (
    <Frame label="Sojourner backing its sensor up against a rock, among rocks with funny names like Barnacle Bill and Yogi">
      <MarsSky variant="day" />
      <MarsGround y={520} seed={52} rocks={14} />
      <NamedRock x={180} y={680} s={1.3} name="Barnacle Bill" />
      <NamedRock x={480} y={640} s={1.9} name="Yogi" dark />
      <NamedRock x={300} y={560} s={0.8} name="Wedge" />
      <Sojourner x={330} y={700} s={2.0} eyes="side" />
      <g className="anim waves" stroke="#fff3df" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <path d="M228 650 q-8 10 0 20" />
        <path d="M216 644 q-14 16 0 32" />
      </g>
      <Tag x={420} y={300} text="sniff, sniff..." size={22} />
    </Frame>
  );
}

function Watching() {
  const u = useUid();
  return (
    <Frame label="On Earth, people at home watching pictures of Sojourner on their computer screens">
      <Sky id={`${u}-room`} stops={[[0, "#22305f"], [1, "#3b4c84"]]} />
      <rect y="560" width="600" height="200" fill="#5b4a6e" />
      <rect y="560" width="600" height="14" fill="#7a6690" />
      {[[150, 300, 0.7], [450, 300, 0.7], [300, 440, 1]].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <rect x="-120" y="-96" width="240" height="190" rx="16" fill="#e6e1d6" />
          <rect x="-100" y="-78" width="200" height="140" rx="6" fill="#ffaa6b" />
          <rect x="-100" y="-78" width="200" height="56" rx="6" fill="#ffd395" />
          <path d="M-100 22 Q0 0 100 18 L100 62 L-100 62Z" fill="#dd6233" />
          <g transform="translate(10 52) scale(0.9)">
            <Sojourner x={0} y={0} s={1} eyes="happy" shadow={false} />
          </g>
          <rect x="-30" y="94" width="60" height="22" fill="#c9c2b6" />
          <rect x="-70" y="114" width="140" height="12" rx="6" fill="#bfb8ab" />
        </g>
      ))}
      <Sparkle x={70} y={150} delay={0.2} />
      <Sparkle x={530} y={140} delay={0.9} />
      <Tag x={300} y={140} text="millions of clicks!" size={22} />
    </Frame>
  );
}

function Longer() {
  return (
    <Frame label="Sojourner still exploring long after it was meant to stop, while a dust devil dances across the valley">
      <MarsSky variant="day" />
      <Sun cx={470} cy={260} r={11} />
      <MarsGround y={540} seed={62} rocks={22} />
      <DustDevil x={480} y={560} s={0.8} />
      <PathfinderLander x={190} y={620} s={0.6} eyes="happy" />
      <path d="M260 690 C320 720 420 700 440 660 C460 620 380 610 330 640" stroke="#a63e1e" strokeWidth="4" strokeDasharray="6 5" opacity="0.6" fill="none" />
      <Sojourner x={360} y={690} s={1.6} eyes="happy" roll />
      {["1 week", "1 month", "3 months!"].map((t, i) => (
        <g key={t} transform={`translate(${110 + i * 150} ${170 + i * 26}) rotate(${-6 + i * 5})`}>
          <rect x="-56" y="-34" width="112" height="70" rx="6" fill="#fffaf3" opacity={0.6 + i * 0.2} />
          <rect x="-56" y="-34" width="112" height="18" rx="6" fill="#ef8a55" />
          <text x="0" y="22" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontWeight="800" fontSize={i === 2 ? 20 : 17} fill="#3a1f18">
            {t}
          </text>
        </g>
      ))}
    </Frame>
  );
}

function Goodnight() {
  return (
    <Frame label="The lander and Sojourner asleep under the stars of Mars, while a spacecraft passes high overhead">
      <MarsSky variant="night" stars={80} seed={72} />
      <SmallMoon cx={150} cy={170} r={14} fill="#cdb2a4" />
      <Orbiter x={0} y={260} s={0.9} panel="#5d3b8f" />
      <MarsGround y={560} seed={73} tone="night" rocks={22} />
      <PathfinderLander x={240} y={650} s={0.85} eyes="closed" dusty />
      <Sojourner x={460} y={706} s={1.5} eyes="closed" dusty />
      <Glow cx={320} cy={580} r={170} color="#ffd9b8" opacity={0.13} className="anim breathe" />
      <Zzz x={490} y={560} size={22} color="#fff1e4" />
    </Frame>
  );
}

export const sojournerScenes = {
  "sojourner-cover": Cover,
  "sojourner-asleep": Asleep,
  "sojourner-name": Name,
  "sojourner-bounce": Bounce,
  "sojourner-petals": Petals,
  "sojourner-rocks": Rocks,
  "sojourner-watching": Watching,
  "sojourner-longer": Longer,
  "sojourner-goodnight": Goodnight,
};
