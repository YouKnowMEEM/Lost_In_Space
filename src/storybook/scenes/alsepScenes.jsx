import React from "react";
import { Earth, Frame, Glow, Zzz } from "./common";
import { Astronaut, Boulder, Crater, EagleLM, Footprints, MoonGround, Retroreflector, Seismometer } from "./eagleParts";
import { Bubble, MoonSky, Question, Sparkle, Tag } from "./kit";
import { Cable, Magnetometer, MoonSeismometer, QuakeRings, RTG, ScienceStation } from "./machines";

/** The whole station laid out on the ground: box, battery, seismometer and magnetometer, joined by cables. */
function Layout({ y = 640, eyes = "open", beam = false, s = 1, shake = false, glow = true }) {
  return (
    <g transform={`translate(300 ${y}) scale(${s}) translate(-300 ${-y})`}>
      <Cable from={[300, y - 4]} to={[120, y + 20]} sag={18} />
      <Cable from={[300, y - 4]} to={[470, y + 40]} sag={14} />
      <Cable from={[300, y - 4]} to={[520, y - 20]} sag={10} />
      <RTG x={120} y={y + 22} s={1} glow={glow} />
      <MoonSeismometer x={470} y={y + 42} s={1} shake={shake} />
      <Magnetometer x={528} y={y - 18} s={0.8} />
      <ScienceStation x={300} y={y} s={1.1} eyes={eyes} beam={beam} />
    </g>
  );
}

function Cover() {
  return (
    <Frame label="An Apollo science station on the Moon: a box with a roof on stilts and a face, its twisty antenna pointing at the Earth, with cables running to its instruments">
      <MoonSky seed={3} earth={[470, 170, 42]} />
      <MoonGround y={560} seed={4} tone="day" />
      <Layout y={650} eyes="happy" beam />
    </Frame>
  );
}

function Asleep() {
  return (
    <Frame label="The listening station asleep in the moonlit dust, its cables curling across the ground">
      <MoonSky seed={13} earth={[110, 150, 30]} />
      <MoonGround y={540} seed={14} />
      <Boulder x={530} y={600} s={0.8} />
      <Layout y={650} eyes="closed" glow={false} />
      <Glow cx={300} cy={580} r={160} color="#cfe0ff" opacity={0.15} className="anim breathe" />
      <Zzz x={346} y={500} size={26} />
    </Frame>
  );
}

function Why() {
  return (
    <Frame label="The lunar module leaving the Moon while a little science station stays behind, waving goodbye">
      <MoonSky seed={23} earth={[110, 150, 30]} />
      <MoonGround y={570} seed={24} tone="day" />
      <EagleLM x={460} y={620} s={0.55} part="descent" flag={false} />
      <g className="anim liftoff">
        <EagleLM x={460} y={600} s={0.55} part="ascent" eyes="happy" />
      </g>
      <Seismometer x={170} y={700} s={1.2} />
      <ScienceStation x={290} y={690} s={0.9} eyes="happy" />
      <Question x={170} y={330} s={0.8} />
      <Question x={300} y={270} s={1.0} delay={0.8} />
      <Question x={420} y={330} s={0.7} delay={1.6} />
      <Bubble x={250} y={430} text="I'll stay!" w={140} />
    </Frame>
  );
}

function Setup() {
  return (
    <Frame label="Astronauts carrying the station's two boxes on a pole like a barbell, then unpacking instruments in a circle">
      <MoonSky seed={33} earth={[480, 140, 28]} />
      <MoonGround y={560} seed={34} tone="day" />
      <EagleLM x={110} y={600} s={0.42} eyes="open" flag={false} />
      {/* the barbell carry */}
      <g className="anim hover-soft">
        <Astronaut x={300} y={640} s={1.05} pose="walk" />
        <path d="M244 576 L356 576" stroke="#b9bfce" strokeWidth="5" strokeLinecap="round" />
        <rect x="224" y="560" width="34" height="30" rx="4" fill="#e9ecf3" stroke="#8a93aa" strokeWidth="1.5" />
        <rect x="342" y="560" width="34" height="30" rx="4" fill="#e9ecf3" stroke="#8a93aa" strokeWidth="1.5" />
      </g>
      <Footprints points={[[150, 650], [180, 640], [210, 652], [240, 642]]} />
      <ScienceStation x={470} y={690} s={0.7} eyes="happy" />
      <Magnetometer x={540} y={640} s={0.55} />
      <Tag x={300} y={460} text="like a weightlifter!" />
    </Frame>
  );
}

function Battery() {
  return (
    <Frame label="Alan Bean tapping the stuck fuel case with a hammer, while the finned battery waits to glow warm through the long lunar night">
      <MoonSky seed={43} earth={[110, 150, 26]} />
      <MoonGround y={570} seed={44} />
      <RTG x={430} y={640} s={2.1} glow />
      <Tag x={430} y={420} text="warm all by itself" />
      {/* the fuel cask */}
      <g transform="translate(220 600) rotate(-20)">
        <rect x="-44" y="-16" width="88" height="32" rx="14" fill="#5b6276" stroke="#3a4052" strokeWidth="2" />
        <path d="M-30 -16 V16 M-14 -16 V16 M2 -16 V16 M18 -16 V16" stroke="#7a8196" strokeWidth="3" />
      </g>
      <g className="anim poke">
        <g transform="translate(270 560) rotate(30)">
          <rect x="-4" y="-4" width="8" height="54" rx="3" fill="#b9bfce" />
          <rect x="-14" y="-12" width="28" height="14" rx="3" fill="#8a93aa" />
        </g>
      </g>
      <Astronaut x={160} y={690} s={1.05} pose="stand" />
      <Tag x={250} y={490} text="tap! tap! tap!" size={22} />
    </Frame>
  );
}

function Bell() {
  return (
    <Frame label="The empty top half of Apollo 12's lander crashing into the Moon far away, and the Moon ringing like a bell for nearly an hour">
      <MoonSky seed={53} earth={[470, 140, 30]} />
      <MoonGround y={520} seed={54} />
      <g transform="translate(110 470)">
        <Glow cx={0} cy={0} r={60} color="#ffd59a" opacity={0.8} className="anim glowpulse" />
        <Sparkle x={0} y={0} s={1.4} color="#ffe3b0" />
      </g>
      <QuakeRings x={110} y={540} s={1.2} color="#ffe1c8" />
      <QuakeRings x={360} y={680} s={0.9} color="#cfe0ff" />
      <MoonSeismometer x={360} y={680} s={1.4} shake />
      <g transform="translate(470 300)">
        <path d="M-40 60 Q-40 -10 0 -24 Q40 -10 40 60 L50 70 L-50 70Z" fill="#f2c96a" stroke="#a9781f" strokeWidth="2" className="anim wobble" />
        <circle cx="0" cy="78" r="9" fill="#a9781f" />
      </g>
      <Tag x={330} y={250} text="ding... dong..." size={22} />
    </Frame>
  );
}

function Moonquakes() {
  return (
    <Frame label="A cut-away of the Moon showing deep moonquakes, a warm crack at sunrise and a falling space rock, all felt by the listening stations">
      <MoonSky seed={63} stars={60} />
      <g>
        <circle cx="300" cy="430" r="230" fill="#9ea2b6" />
        <circle cx="300" cy="430" r="200" fill="#7d8197" />
        <circle cx="300" cy="430" r="120" fill="#5f647d" />
        <circle cx="300" cy="430" r="46" fill="#e2a65a" className="anim glowpulse" />
        <path d="M300 200 V660" stroke="#4b4f66" strokeWidth="2" opacity="0.5" />
      </g>
      <g className="anim waves">
        <circle cx="240" cy="520" r="10" fill="#ffe1c8" />
        <circle cx="240" cy="520" r="24" fill="none" stroke="#ffe1c8" strokeWidth="2" />
      </g>
      <g className="anim waves" style={{ animationDelay: "0.7s" }}>
        <circle cx="400" cy="340" r="8" fill="#ffe1c8" />
        <circle cx="400" cy="340" r="20" fill="none" stroke="#ffe1c8" strokeWidth="2" />
      </g>
      <g className="anim drift-away">
        <circle cx="500" cy="150" r="9" fill="#b6a58a" />
        <path d="M509 146 L560 120" stroke="#ffd59a" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      </g>
      <ScienceStation x={210} y={232} s={0.38} eyes="wide" shadow={false} />
      <ScienceStation x={370} y={226} s={0.38} eyes="wide" shadow={false} />
      <Tag x={300} y={720} text="crust · mantle · core" />
    </Frame>
  );
}

function Trip() {
  return (
    <Frame label="An astronaut in big boots catching his foot on a cable, pulling it loose from the station with a snap">
      <MoonSky seed={73} earth={[480, 140, 28]} />
      <MoonGround y={560} seed={74} tone="day" />
      <ScienceStation x={170} y={650} s={0.95} eyes="wide" />
      <path d="M210 650 Q290 680 330 664" stroke="#d8c88e" strokeWidth="3" fill="none" />
      <path d="M352 662 Q420 650 470 680" stroke="#d8c88e" strokeWidth="3" fill="none" />
      <g stroke="#ffe08a" strokeWidth="3" strokeLinecap="round">
        <path d="M336 640 l-8 -14 M344 636 l2 -16 M352 640 l10 -12" />
      </g>
      <rect x="466" y="676" width="8" height="40" rx="3" fill="#b9bfce" />
      <g transform="rotate(10 380 650)">
        <Astronaut x={380} y={668} s={1.1} pose="walk" flip />
      </g>
      <Tag x={330} y={560} text="snap!" size={26} />
    </Frame>
  );
}

function Mirrors() {
  return (
    <Frame label="A laser beam from Earth bouncing off a mirror panel on the Moon and going straight back home">
      <MoonSky seed={83} stars={70} />
      <Earth cx={460} cy={170} r={60} />
      <path d="M440 200 L250 600" stroke="#7dff9a" strokeWidth="3" strokeDasharray="10 12" className="anim laser" />
      <path d="M262 600 L452 200" stroke="#7dff9a" strokeWidth="2" strokeDasharray="10 12" opacity="0.6" className="anim laser" />
      <MoonGround y={580} seed={84} tone="day" />
      <Retroreflector x={250} y={650} s={2.0} />
      <Sparkle x={250} y={600} s={1.1} color="#c6ffd2" />
      <Crater cx={470} cy={700} rx={70} />
      <Tag x={180} y={380} text="bounce!" size={24} />
      <Tag x={150} y={470} text="3.8 cm farther every year" size={17} />
    </Frame>
  );
}

function Goodnight() {
  return (
    <Frame label="The science station switched off and asleep, its antenna still pointing at the blue Earth">
      <MoonSky seed={93} earth={[450, 170, 50]} />
      <MoonGround y={540} seed={94} />
      <Layout y={650} eyes="closed" glow={false} />
      <Glow cx={300} cy={570} r={170} color="#cfe0ff" opacity={0.14} className="anim breathe" />
      <Zzz x={346} y={500} size={26} />
    </Frame>
  );
}

export const alsepScenes = {
  "alsep-cover": Cover,
  "alsep-asleep": Asleep,
  "alsep-why": Why,
  "alsep-setup": Setup,
  "alsep-battery": Battery,
  "alsep-bell": Bell,
  "alsep-moonquakes": Moonquakes,
  "alsep-trip": Trip,
  "alsep-mirrors": Mirrors,
  "alsep-goodnight": Goodnight,
};
