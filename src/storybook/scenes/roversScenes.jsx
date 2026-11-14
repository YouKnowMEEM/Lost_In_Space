import React from "react";
import { Flame, Frame, Glow, Puffs, Zzz, useUid } from "./common";
import { Astronaut, Boulder, EagleLM, Footprints, MoonGround } from "./eagleParts";
import { Bubble, MoonSky, Question, Sparkle, Tag } from "./kit";
import { MoonBuggy } from "./machines";

/** Soft grey mountains along the horizon. */
function Mountains({ y = 520, tall = 1, tone = "#9a9eb3", far = "#6e7390" }) {
  return (
    <g>
      <path d={`M0 ${y} L60 ${y - 120 * tall} L140 ${y - 60 * tall} L230 ${y - 170 * tall} L330 ${y - 80 * tall} L420 ${y - 150 * tall} L520 ${y - 70 * tall} L600 ${y - 130 * tall} L600 ${y} Z`} fill={far} opacity="0.7" />
      <path d={`M0 ${y} L90 ${y - 70 * tall} L180 ${y - 30 * tall} L290 ${y - 110 * tall} L380 ${y - 40 * tall} L470 ${y - 90 * tall} L600 ${y - 30 * tall} L600 ${y} Z`} fill={tone} />
      <path d={`M290 ${y - 110 * tall} L320 ${y - 70 * tall} L300 ${y - 60 * tall}Z`} fill="#c9ccd9" opacity="0.6" />
    </g>
  );
}

/** Rooster tails of dust thrown up behind a wheel, falling in clean arcs. */
function DustArcs({ x, y, flip = false }) {
  const d = flip ? -1 : 1;
  return (
    <g stroke="#d5d7e2" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" className="anim ghost">
      <path d={`M${x} ${y} Q${x - 60 * d} ${y - 110} ${x - 130 * d} ${y + 10}`} />
      <path d={`M${x} ${y} Q${x - 40 * d} ${y - 80} ${x - 90 * d} ${y + 10}`} strokeDasharray="2 6" />
      <path d={`M${x} ${y} Q${x - 80 * d} ${y - 140} ${x - 170 * d} ${y + 10}`} strokeDasharray="1 9" />
    </g>
  );
}

/** Apollo 14's two-wheeled hand cart. */
function Cart({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="2" rx="50" ry="6" fill="#000" opacity="0.2" />
      <path d="M-40 -34 L40 -34 L34 -14 L-34 -14Z" fill="#d6d9e2" stroke="#8a93aa" strokeWidth="1.5" />
      <path d="M-20 -34 L-24 -60 M0 -34 L2 -64 M20 -34 L26 -58" stroke="#8a93aa" strokeWidth="3" strokeLinecap="round" />
      <path d="M40 -26 L92 -46" stroke="#b9bfce" strokeWidth="4" strokeLinecap="round" />
      <circle cx="-24" cy="-12" r="12" fill="#5b6276" />
      <circle cx="24" cy="-12" r="12" fill="#5b6276" />
    </g>
  );
}

function Cover() {
  return (
    <Frame label="Two astronauts driving the Moon buggy across the grey dust, its wire wheels throwing up arcs of dust, with the Earth in the sky">
      <MoonSky seed={5} earth={[470, 160, 40]} />
      <Mountains y={540} tall={0.8} />
      <MoonGround y={560} seed={6} tone="day" />
      <DustArcs x={200} y={640} />
      <g className="anim hover-soft">
        <MoonBuggy x={320} y={660} s={1.05} eyes="happy" riders={2} roll />
      </g>
      <Puffs x={170} y={668} w={140} color="#d5d7e2" opacity={0.5} seed={7} count={6} className="anim billow" />
    </Frame>
  );
}

function Asleep() {
  return (
    <Frame label="Three Moon buggies parked and asleep: one by a canyon, one in bright highlands, one in a deep mountain valley">
      <MoonSky seed={15} earth={[100, 140, 26]} />
      <Mountains y={480} tall={1} />
      <MoonGround y={500} seed={16} />
      <path d="M0 540 C120 520 160 560 260 548 C360 536 420 566 600 552" stroke="#4b4f66" strokeWidth="16" fill="none" opacity="0.6" />
      <MoonBuggy x={110} y={560} s={0.36} eyes="closed" shadow={false} />
      <MoonBuggy x={500} y={575} s={0.42} eyes="closed" shadow={false} />
      <MoonBuggy x={300} y={690} s={0.85} eyes="closed" />
      <Glow cx={300} cy={600} r={170} color="#cfe0ff" opacity={0.14} className="anim breathe" />
      <Zzz x={390} y={520} size={26} />
    </Frame>
  );
}

function Tired() {
  return (
    <Frame label="Two Apollo 14 astronauts pulling a little cart up a steep crater slope, tired and hot in their spacesuits">
      <MoonSky seed={25} earth={[480, 140, 28]} />
      <path d="M0 360 Q200 300 420 250 Q520 230 600 240 L600 760 L0 760Z" fill="#b5b8c8" />
      <path d="M0 470 Q240 420 600 330 L600 760 L0 760Z" fill="#a3a7ba" />
      <Boulder x={480} y={380} s={0.8} />
      <Boulder x={140} y={520} s={0.7} />
      <g transform="rotate(-14 300 560)">
        <Cart x={200} y={600} s={1.1} />
        <Astronaut x={330} y={590} s={1.05} pose="walk" />
        <Astronaut x={420} y={570} s={1.0} pose="walk" />
      </g>
      <g fill="#9fdcff" opacity="0.85">
        <path d="M352 455 q6 10 0 14 q-6 -4 0 -14Z" />
        <path d="M440 432 q6 10 0 14 q-6 -4 0 -14Z" />
      </g>
      <Question x={540} y={190} s={0.9} />
      <Bubble x={210} y={250} text="Too far!" w={140} />
    </Frame>
  );
}

function Folded() {
  return (
    <Frame label="The Moon buggy swinging down from the side of the lunar module and unfolding like a pop-up book, while an astronaut pulls a strap">
      <MoonSky seed={35} earth={[480, 150, 30]} />
      <MoonGround y={600} seed={36} tone="day" />
      <EagleLM x={230} y={640} s={0.75} eyes="happy" flag={false} />
      {/* the buggy, half unfolded, tipping out from the side of the lander */}
      <g transform="translate(330 560) rotate(-38)">
        <rect x="0" y="-12" width="150" height="16" rx="5" fill="#b8bdca" stroke="#8a93aa" strokeWidth="1.5" />
        <circle cx="30" cy="10" r="22" fill="#8d8a7e" stroke="#c9c3ae" strokeWidth="4" strokeDasharray="5 4" />
        <circle cx="120" cy="10" r="22" fill="#8d8a7e" stroke="#c9c3ae" strokeWidth="4" strokeDasharray="5 4" />
        <path d="M60 -12 L58 -40 M96 -12 L100 -36" stroke="#5b79c4" strokeWidth="5" strokeLinecap="round" />
      </g>
      <path d="M330 560 L470 640" stroke="#f2efe4" strokeWidth="2" strokeDasharray="3 4" />
      <Astronaut x={500} y={680} s={1.0} pose="walk" flip />
      <Sparkle x={420} y={470} delay={0.2} />
      <Sparkle x={470} y={520} s={0.7} delay={1} />
      <Tag x={430} y={300} text="pull... and pop!" />
    </Frame>
  );
}

function Wheels() {
  const u = useUid();
  return (
    <Frame label="The Moon buggy bouncing over bumps with all four wire wheels off the ground, throwing up perfect arcs of dust">
      <MoonSky seed={45} earth={[100, 150, 26]} />
      <MoonGround y={590} seed={46} tone="day" />
      {/* close-up of a wire wheel */}
      <defs>
        <pattern id={`${u}-mesh`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0 H10 M0 0 V10" stroke="#c9c3ae" strokeWidth="1.6" />
        </pattern>
      </defs>
      <g transform="translate(470 230)">
        <circle r="92" fill="#08091a" opacity="0.5" />
        <circle r="84" fill="#8d8a7e" />
        <circle r="84" fill={`url(#${u}-mesh)`} />
        {Array.from({ length: 16 }, (_, i) => (
          <rect key={i} x="-6" y="-88" width="12" height="16" rx="2" fill="#e3dfcf" transform={`rotate(${i * 22.5})`} />
        ))}
        <circle r="18" fill="#d6d9e2" stroke="#6c695f" strokeWidth="2" />
      </g>
      <Tag x={470} y={350} text="woven piano wire" />
      <DustArcs x={130} y={600} />
      <g className="anim hop">
        <MoonBuggy x={260} y={600} s={0.82} eyes="wide" riders={2} roll shadow={false} />
      </g>
      <ellipse cx="270" cy="670" rx="140" ry="9" fill="#000" opacity="0.18" />
    </Frame>
  );
}

function Hadley() {
  return (
    <Frame label="The first Moon buggy parked at the edge of Hadley Rille, a long winding canyon, below tall mountains, near a shining white rock">
      <MoonSky seed={55} earth={[480, 130, 30]} />
      <Mountains y={460} tall={1.25} />
      <MoonGround y={470} seed={56} tone="day" />
      {/* the canyon */}
      <path d="M-20 560 C100 520 180 600 300 570 C420 540 470 620 640 590 L640 640 C470 670 420 600 300 626 C180 650 100 580 -20 616Z" fill="#3d4058" />
      <path d="M-20 560 C100 520 180 600 300 570 C420 540 470 620 640 590" stroke="#e6e8ef" strokeWidth="3" fill="none" opacity="0.6" />
      <MoonBuggy x={300} y={720} s={0.78} eyes="up" riders={2} />
      <g transform="translate(110 700)">
        <path d="M-14 0 L-10 -14 L6 -18 L16 -6 L12 0Z" fill="#fbfbff" />
      </g>
      <Sparkle x={112} y={672} delay={0.3} />
      <Tag x={120} y={640} text="the Genesis Rock" size={17} />
    </Frame>
  );
}

function Highlands() {
  return (
    <Frame label="John Young's Grand Prix: the Moon buggy skidding and bouncing in the bright Descartes Highlands, high above the tiny lunar module">
      <MoonSky seed={65} earth={[110, 140, 26]} />
      <path d="M0 330 Q260 250 600 210 L600 760 L0 760Z" fill="#c9ccd9" />
      <path d="M0 470 Q300 380 600 350 L600 760 L0 760Z" fill="#dfe1ea" />
      <g transform="translate(470 420)">
        <EagleLM x={0} y={0} s={0.18} eyes="open" flag={false} />
      </g>
      <Puffs x={180} y={640} w={160} color="#eceef5" opacity={0.65} seed={66} count={7} className="anim billow" />
      <g transform="rotate(-8 300 620)" className="anim hover">
        <MoonBuggy x={300} y={640} s={0.92} eyes="happy" riders={1} roll shadow={false} />
      </g>
      <path d="M150 680 C210 660 260 700 330 684" stroke="#9a9eb3" strokeWidth="5" fill="none" strokeLinecap="round" />
      <g transform="translate(520 700) rotate(-10)">
        <rect x="-18" y="-12" width="36" height="24" rx="2" fill="#fffdf6" />
        <rect x="-14" y="-8" width="28" height="16" fill="#7aa3d6" />
        <circle cx="-6" cy="-1" r="3" fill="#f2d2b0" />
        <circle cx="4" cy="-2" r="3" fill="#f2d2b0" />
      </g>
      <Bubble x={430} y={250} text="Grand Prix!" w={170} />
    </Frame>
  );
}

function Fender() {
  return (
    <Frame label="The last Moon buggy with a fender made of maps, taped and clamped over its wheel, next to a patch of bright orange soil">
      <MoonSky seed={75} earth={[470, 140, 30]} />
      <Mountains y={500} tall={1.4} tone="#8f93a8" />
      <MoonGround y={510} seed={76} tone="day" />
      <ellipse cx="470" cy="680" rx="90" ry="20" fill="#ff9a3c" opacity="0.9" />
      <ellipse cx="470" cy="676" rx="60" ry="11" fill="#ffc06a" />
      <MoonBuggy x={250} y={680} s={0.9} eyes="happy" />
      {/* the map fender */}
      <g transform="translate(164 590)">
        <path d="M-46 22 Q-40 -18 0 -22 Q40 -18 46 22" fill="#fff6dc" stroke="#c9b98a" strokeWidth="1.5" />
        <path d="M-30 -10 L-20 10 M-8 -20 L-6 6 M14 -18 L18 8 M32 -8 L30 14" stroke="#7aa3d6" strokeWidth="1.5" />
        <rect x="-50" y="12" width="12" height="10" rx="2" fill="#7d8197" />
        <rect x="38" y="12" width="12" height="10" rx="2" fill="#7d8197" />
        <path d="M-12 -21 h24" stroke="#b9bfce" strokeWidth="6" opacity="0.8" />
      </g>
      <Astronaut x={420} y={690} s={0.95} pose="stand" flip />
      <Sparkle x={500} y={650} delay={0.5} color="#ffd59a" />
      <Tag x={250} y={330} text="maps + tape + clamps" />
    </Frame>
  );
}

function CameraScene() {
  return (
    <Frame label="The parked Moon buggy turning its camera up to watch the top half of the lunar module blast off into the black sky">
      <MoonSky seed={85} earth={[110, 150, 32]} />
      <MoonGround y={560} seed={86} tone="day" />
      <EagleLM x={430} y={630} s={0.62} part="descent" flag={false} />
      <g className="anim liftoff">
        <g transform="translate(430 470)">
          <Flame x={0} y={0} w={40} h={110} />
        </g>
        <EagleLM x={430} y={600} s={0.62} part="ascent" eyes="happy" />
      </g>
      <Puffs x={430} y={600} w={220} color="#ffe3b0" opacity={0.6} seed={87} count={8} className="anim billow" />
      <MoonBuggy x={170} y={690} s={0.7} eyes="up" />
      <g className="anim waves" stroke="#9fdcff" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <path d="M170 520 q-14 -16 -6 -36" />
        <path d="M160 500 q-22 -24 -10 -54" />
      </g>
      <Bubble x={210} y={330} text="Bye, friends!" w={170} />
    </Frame>
  );
}

function Goodnight() {
  return (
    <Frame label="A Moon buggy asleep where it was parked, its tracks curving behind it, under the glowing Earth">
      <MoonSky seed={95} earth={[450, 170, 48]} />
      <Mountains y={500} tall={0.9} />
      <MoonGround y={510} seed={96} />
      <path d="M-20 560 C120 600 160 640 230 650" stroke="#5f6378" strokeWidth="6" fill="none" strokeDasharray="10 6" opacity="0.7" />
      <path d="M-20 580 C110 620 150 660 220 672" stroke="#5f6378" strokeWidth="6" fill="none" strokeDasharray="10 6" opacity="0.7" />
      <MoonBuggy x={330} y={690} s={0.95} eyes="closed" />
      <Footprints points={[[480, 700], [500, 690], [520, 700], [540, 690]]} />
      <Glow cx={330} cy={590} r={170} color="#cfe0ff" opacity={0.15} className="anim breathe" />
      <Zzz x={420} y={480} size={28} />
    </Frame>
  );
}

export const roversScenes = {
  "rovers-cover": Cover,
  "rovers-asleep": Asleep,
  "rovers-tired": Tired,
  "rovers-folded": Folded,
  "rovers-wheels": Wheels,
  "rovers-hadley": Hadley,
  "rovers-highlands": Highlands,
  "rovers-fender": Fender,
  "rovers-camera": CameraScene,
  "rovers-goodnight": Goodnight,
};
