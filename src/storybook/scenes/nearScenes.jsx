import React from "react";
import { Earth, Frame, Glow, Puffs, Zzz, rng } from "./common";
import { FarSun, Jupiter, SignalWaves, SmallPlanet } from "./voyagerParts";
import { Bubble, PhotoCard, Space, Sparkle, Tag } from "./kit";
import { Eros, NearCraft } from "./machines";

/** A lumpy dark asteroid. */
function Rocky({ cx, cy, r, fill = "#6b6158", seed = 3, dark = false }) {
  const rr = rng(seed);
  const pts = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    const k = r * (0.82 + rr() * 0.3);
    return `${cx + Math.cos(a) * k} ${cy + Math.sin(a) * k * 0.85}`;
  });
  return (
    <g>
      <path d={`M${pts.join(" L")}Z`} fill={dark ? "#3a3532" : fill} />
      {Array.from({ length: Math.max(3, Math.round(r / 12)) }, (_, i) => {
        const x = cx + (rr() - 0.5) * r * 1.1;
        const y = cy + (rr() - 0.5) * r * 0.9;
        const s = r * (0.1 + rr() * 0.18);
        return <ellipse key={i} cx={x} cy={y} rx={s} ry={s * 0.75} fill="#000" opacity="0.25" />;
      })}
    </g>
  );
}

function Cover() {
  return (
    <Frame label="NEAR Shoemaker, a spacecraft shaped like a flower with a dish for a face, flying beside the peanut-shaped asteroid Eros">
      <Space variant="deep" stars={120} seed={3} milky />
      <FarSun cx={520} cy={150} r={8} halo={70} />
      <Eros cx={270} cy={600} s={1.15} rotate={-14} />
      <g className="anim hover">
        <NearCraft x={430} y={380} s={0.72} rotate={-8} eyes="happy" />
      </g>
    </Frame>
  );
}

function Asleep() {
  return (
    <Frame label="NEAR Shoemaker asleep on the dusty surface of the peanut-shaped asteroid Eros, tumbling slowly through space">
      <Space variant="night" stars={130} seed={13} milky milkyY={200} />
      <FarSun cx={90} cy={140} r={7} halo={60} />
      <g className="anim drift-away">
        <Eros cx={300} cy={470} s={1.35} rotate={8} landed={[10, -58, <NearCraft key="n" x={0} y={0} s={0.28} eyes="closed" />]} />
      </g>
      <Glow cx={340} cy={360} r={120} color="#cfe0ff" opacity={0.14} className="anim breathe" />
      <Zzz x={360} y={300} size={24} />
    </Frame>
  );
}

function Asteroids() {
  const r = rng(21);
  return (
    <Frame label="The Sun with the orbits of Earth, Mars and Jupiter, a ring of asteroids between Mars and Jupiter, and Eros wandering close to Earth">
      <Space variant="indigo" stars={80} seed={21} />
      <g transform="translate(300 400)">
        <circle r="70" fill="none" stroke="#9fdcff" strokeOpacity="0.35" strokeWidth="2" />
        <circle r="110" fill="none" stroke="#ffb38a" strokeOpacity="0.35" strokeWidth="2" />
        <circle r="250" fill="none" stroke="#f0d9b4" strokeOpacity="0.35" strokeWidth="2" />
        {Array.from({ length: 160 }, (_, i) => {
          const a = r() * Math.PI * 2;
          const d = 150 + r() * 60;
          return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={1 + r() * 2} fill="#c9b9a0" opacity={0.5 + r() * 0.5} />;
        })}
        <FarSun cx={0} cy={0} r={14} halo={80} rays={false} />
        <Earth cx={50} cy={-48} r={9} glow={false} />
        <circle cx={-80} cy={76} r={7} fill="#c4643b" />
        <Jupiter cx={-176} cy={-178} r={26} />
        <ellipse cx="0" cy="0" rx="96" ry="78" fill="none" stroke="#ffe08a" strokeWidth="2" strokeDasharray="5 6" transform="rotate(20)" />
        <g transform="rotate(20) translate(96 0)">
          <ellipse rx="9" ry="5" fill="#d9c9ae" />
        </g>
      </g>
      <Tag x={460} y={420} text="Eros" size={20} color="#ffe08a" />
      <Tag x={120} y={690} text="the asteroid belt" size={18} />
    </Frame>
  );
}

function Mathilde() {
  return (
    <Frame label="NEAR flying past Mathilde, a very dark asteroid covered in huge craters, taking its picture">
      <Space variant="deep" stars={110} seed={31} />
      <FarSun cx={520} cy={120} r={7} halo={60} />
      <Rocky cx={230} cy={460} r={190} seed={32} dark />
      <path d="M140 400 A60 40 0 0 0 250 420 M250 560 A50 30 0 0 0 330 560" stroke="#5a524d" strokeWidth="4" fill="none" />
      <g className="anim drift">
        <NearCraft x={450} y={260} s={0.55} eyes="wide" />
      </g>
      <g className="anim beep">
        <circle cx="430" cy="260" r="60" fill="#ffffff" opacity="0.25" />
      </g>
      <Tag x={230} y={720} text="Mathilde: darker than charcoal" size={18} />
    </Frame>
  );
}

function Missed() {
  return (
    <Frame label="NEAR zooming too fast past Eros, then coming back a year later on Valentine's Day">
      <Space variant="indigo" stars={100} seed={41} />
      <Eros cx={260} cy={470} s={0.9} rotate={10} />
      <g stroke="#cfe0ff" strokeWidth="3" strokeLinecap="round" opacity="0.6">
        <path d="M520 160 L600 120 M530 190 L620 160 M510 220 L600 200" />
      </g>
      <g className="anim drift">
        <NearCraft x={460} y={200} s={0.45} rotate={-24} eyes="wide" />
      </g>
      <g transform="translate(470 590)" className="anim hover-soft">
        <path d="M0 30 C-60 -10 -40 -60 0 -32 C40 -60 60 -10 0 30Z" fill="#ff8da1" />
        <text x="0" y="66" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontWeight="800" fontSize="18" fill="#fff6dc">
          14 February 2000
        </text>
      </g>
      <Bubble x={160} y={180} text="Whoops! Too fast!" w={210} />
    </Frame>
  );
}

function Orbit() {
  return (
    <Frame label="NEAR circling round and round Eros for a whole year, taking thousands of pictures and bouncing a laser off the ground">
      <Space variant="deep" stars={120} seed={51} milky />
      <FarSun cx={90} cy={110} r={7} halo={60} />
      <ellipse cx="300" cy="430" rx="270" ry="150" fill="none" stroke="#9fdcff" strokeWidth="2" strokeDasharray="6 8" opacity="0.6" transform="rotate(-10 300 430)" />
      <Eros cx={300} cy={440} s={1.05} rotate={-8} />
      <g className="anim hover">
        <NearCraft x={500} y={300} s={0.42} rotate={-20} eyes="happy" />
      </g>
      <path d="M480 320 L380 420" stroke="#ff7a7a" strokeWidth="2.5" strokeDasharray="6 6" className="anim laser" />
      <PhotoCard x={110} y={640} w={70} h={52} rotate={-8}>
        <ellipse cx="0" cy="0" rx="26" ry="14" fill="#a8916f" />
      </PhotoCard>
      <PhotoCard x={220} y={680} w={70} h={52} rotate={6} delay={0.6}>
        <circle cx="-8" cy="4" r="10" fill="#7a6650" />
      </PhotoCard>
      <Tag x={430} y={680} text="160,000 pictures!" size={20} />
    </Frame>
  );
}

function Landing() {
  return (
    <Frame label="NEAR sinking slowly down onto Eros, firing its little thrusters, with boulders and dust coming into view below">
      <Space variant="night" stars={90} seed={61} />
      <path d="M-20 560 Q160 500 340 530 T640 520 L640 760 L-20 760Z" fill="#a8916f" />
      <path d="M-20 600 Q200 560 640 590 L640 760 L-20 760Z" fill="#8c7659" />
      {[[90, 610, 28], [220, 650, 18], [480, 620, 34], [380, 690, 14], [540, 700, 20]].map(([x, y, s]) => (
        <g key={x}>
          <ellipse cx={x + 4} cy={y + 2} rx={s} ry={s * 0.3} fill="#000" opacity="0.25" />
          <path d={`M${x - s} ${y} Q${x - s * 0.8} ${y - s * 0.9} ${x} ${y - s} Q${x + s * 0.9} ${y - s * 0.8} ${x + s} ${y}Z`} fill="#6c5a44" />
        </g>
      ))}
      <g className="anim hover">
        <NearCraft x={300} y={350} s={0.7} eyes="wide" />
        <Puffs x={300} y={460} w={60} color="#e8eef9" opacity={0.6} seed={62} count={4} className="anim billow" />
      </g>
      <path d="M300 470 L300 560" stroke="#fff6dc" strokeWidth="2" strokeDasharray="4 6" opacity="0.6" />
      <Tag x={470} y={200} text="gently... gently..." size={20} />
    </Frame>
  );
}

function Listening() {
  return (
    <Frame label="NEAR resting on the ground of Eros, sniffing the rock beneath it and sending fainter and fainter messages home as the cold sets in">
      <Space variant="night" stars={110} seed={71} />
      <Earth cx={500} cy={150} r={14} glow={false} />
      <SignalWaves x={380} y={330} count={4} r={34} color="#9fdcff" rotate={-40} />
      <path d="M-20 520 Q300 470 640 510 L640 760 L-20 760Z" fill="#a8916f" />
      <path d="M-20 590 Q300 560 640 600 L640 760 L-20 760Z" fill="#8c7659" />
      <g transform="translate(300 520) rotate(18)">
        <NearCraft x={0} y={-30} s={0.65} eyes="sleepy" />
      </g>
      <Sparkle x={240} y={560} delay={0.2} color="#c6e8ff" />
      <Sparkle x={360} y={570} s={0.8} delay={1} color="#c6e8ff" />
      <Tag x={150} y={240} text="two more weeks!" size={22} />
    </Frame>
  );
}

function Goodnight() {
  return (
    <Frame label="Eros tumbling around the Sun with NEAR Shoemaker asleep on its surface, just south of the saddle in its middle">
      <Space variant="deep" stars={140} seed={81} milky milkyY={240} />
      <FarSun cx={500} cy={130} r={7} halo={60} />
      <SmallPlanet cx={90} cy={170} r={6} color="#8fb6ff" />
      <Eros cx={300} cy={470} s={1.4} rotate={-6} landed={[-10, 60, <NearCraft key="n" x={0} y={-18} s={0.26} eyes="closed" rotate={180} />]} />
      <Glow cx={290} cy={540} r={110} color="#cfe0ff" opacity={0.15} className="anim breathe" />
      <Zzz x={320} y={600} size={22} />
    </Frame>
  );
}

export const nearScenes = {
  "near-cover": Cover,
  "near-asleep": Asleep,
  "near-asteroids": Asteroids,
  "near-mathilde": Mathilde,
  "near-missed": Missed,
  "near-orbit": Orbit,
  "near-landing": Landing,
  "near-listening": Listening,
  "near-goodnight": Goodnight,
};
