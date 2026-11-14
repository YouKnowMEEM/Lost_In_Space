import React from "react";
import { Flame, Frame, Glow, Orbiter, Puffs, Zzz, useUid } from "./common";
import { MarsGround, SmallMoon } from "./vikingParts";
import { Bubble, MarsSky, Space, Sparkle, Sun, Tag } from "./kit";
import { PlanetCutaway, QuakeRings, RoundLander, SeismoDome, Snow } from "./machines";

/** The icy northern plains: pale ground with polygon cracks. */
function PolarGround({ y = 560, frost = false }) {
  return (
    <g>
      <path d={`M0 ${y} Q300 ${y - 20} 600 ${y} L600 760 L0 760Z`} fill={frost ? "#d8c6c0" : "#d27a50"} />
      <g stroke={frost ? "#b9a49c" : "#a63e1e"} strokeWidth="2.5" fill="none" opacity="0.6">
        <path d={`M0 ${y + 50} L120 ${y + 40} L200 ${y + 90} L330 ${y + 70} L420 ${y + 120} L600 ${y + 100}`} />
        <path d={`M120 ${y + 40} L100 ${y + 140} L200 ${y + 190}`} />
        <path d={`M330 ${y + 70} L310 ${y + 170} L440 ${y + 200}`} />
        <path d={`M420 ${y + 120} L520 ${y + 180}`} />
      </g>
      {frost && <path d={`M0 ${y} Q300 ${y - 20} 600 ${y} L600 ${y + 30} Q300 ${y + 10} 0 ${y + 30}Z`} fill="#ffffff" opacity="0.5" />}
    </g>
  );
}

/** A tiny CubeSat with two flat panels. */
function CubeSat({ x, y, label }) {
  return (
    <g className="anim hover" style={{ animationDelay: `${x / 300}s` }}>
      <g transform={`translate(${x} ${y})`}>
        <rect x="-12" y="-12" width="24" height="24" rx="3" fill="#d6d9e2" stroke="#8a93aa" strokeWidth="1.5" />
        <rect x="-44" y="-8" width="30" height="16" fill="#2c4a9a" stroke="#dfe6fa" strokeWidth="1" />
        <rect x="14" y="-8" width="30" height="16" fill="#2c4a9a" stroke="#dfe6fa" strokeWidth="1" />
        <circle cx="0" cy="0" r="4" fill="#1b2340" />
        <text x="0" y="34" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontWeight="700" fontSize="15" fill="#fff6dc">
          {label}
        </text>
      </g>
    </g>
  );
}

function Cover() {
  return (
    <Frame label="Phoenix, a lander with two round solar panels digging with its arm, and InSight, a lander listening to the ground through a little dome">
      <MarsSky variant="day" />
      <Sun cx={300} cy={260} r={11} />
      <MarsGround y={560} seed={4} rocks={20} />
      <g className="anim hover-soft">
        <RoundLander x={160} y={600} s={0.56} kind="phoenix" eyes="happy" arm="dig" />
      </g>
      <g className="anim hover-soft" style={{ animationDelay: "1s" }}>
        <RoundLander x={410} y={700} s={0.66} kind="insight" eyes="happy" />
      </g>
      <SeismoDome x={560} y={712} s={0.5} listen />
    </Frame>
  );
}

function Asleep() {
  const u = useUid();
  return (
    <Frame label="Phoenix asleep under frost near the north pole, and InSight asleep under red dust on a flat plain">
      <defs>
        <clipPath id={`${u}-t`}>
          <path d="M0 0 H600 V330 L0 410Z" />
        </clipPath>
        <clipPath id={`${u}-b`}>
          <path d="M0 410 L600 330 V760 H0Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${u}-t)`}>
        <MarsSky variant="night" stars={60} seed={11} />
        <PolarGround y={300} frost />
        <RoundLander x={300} y={380} s={0.62} kind="phoenix" eyes="closed" frost shadow={false} />
        <Snow seed={12} count={30} top={0} bottom={360} />
        <Tag x={90} y={70} text="Phoenix" size={22} color="#fff1e4" anchor="start" />
      </g>
      <g clipPath={`url(#${u}-b)`}>
        <MarsSky variant="dusk" stars={10} seed={13} />
        <MarsGround y={560} seed={14} tone="dusk" rocks={14} />
        <RoundLander x={290} y={700} s={0.62} kind="insight" eyes="closed" dusty={0.55} />
        <SeismoDome x={470} y={712} s={0.5} />
        <Tag x={510} y={460} text="InSight" size={22} color="#fff1e4" anchor="end" />
      </g>
      <path d="M0 410 L600 330" stroke="#fff1e4" strokeWidth="3" opacity="0.6" />
      <Zzz x={330} y={230} size={20} color="#fff1e4" />
      <Zzz x={320} y={560} size={20} color="#fff1e4" />
    </Frame>
  );
}

function PhoenixScene() {
  return (
    <Frame label="Phoenix landing near the north pole on three legs and little rockets, with a glowing firebird in the sky behind it">
      <MarsSky variant="day" />
      <g className="anim breathe" opacity="0.5">
        <path d="M300 300 C220 200 120 210 60 160 C150 170 210 150 260 200 C240 140 260 90 300 60 C340 90 360 140 340 200 C390 150 450 170 540 160 C480 210 380 200 300 300Z" fill="#ffb36b" />
      </g>
      <Orbiter x={0} y={110} s={0.8} panel="#5d3b8f" />
      <PolarGround y={600} />
      <g className="anim hover">
        <RoundLander x={300} y={530} s={0.85} kind="phoenix" eyes="wide" shadow={false} />
        {[-30, 30].map((dx) => (
          <g key={dx} transform={`translate(${300 + dx * 1.3} ${530 - 64})`}>
            <Flame x={0} y={0} w={20} h={74} />
          </g>
        ))}
      </g>
      <Puffs x={300} y={620} w={300} color="#ffd395" opacity={0.6} seed={33} count={9} className="anim billow" />
      <Tag x={300} y={360} text="rising from the ashes" size={19} />
    </Frame>
  );
}

function Ice() {
  return (
    <Frame label="Phoenix's arm scraping a trench and uncovering bright white ice, which slowly vanishes over four days">
      <MarsSky variant="day" />
      <Sun cx={480} cy={420} r={10} />
      <PolarGround y={520} />
      <RoundLander x={200} y={650} s={0.86} kind="phoenix" eyes="wide" arm="dig" />
      <path d="M310 690 L470 690 L460 712 L320 712Z" fill="#7a3720" />
      <g>
        <path d="M340 696 l14 -6 l10 8 l-12 6Z M380 700 l18 -4 l6 8 l-20 4Z M420 694 l12 -2 l6 8 l-14 2Z" fill="#fbfbff" />
      </g>
      <Sparkle x={360} y={684} delay={0.2} color="#ffffff" />
      <Sparkle x={420} y={680} s={0.8} delay={1} color="#ffffff" />
      {/* day 1 and day 4 */}
      {[["day 1", true], ["day 4", false]].map(([t, chunks], i) => (
        <g key={t} transform={`translate(${170 + i * 260} 170)`}>
          <rect x="-100" y="-70" width="200" height="140" rx="10" fill="#fffaf3" />
          <rect x="-88" y="-58" width="176" height="104" fill="#c9542c" />
          <path d="M-70 10 L70 10 L60 40 L-60 40Z" fill="#7a3720" />
          {chunks && <path d="M-40 18 l16 -6 l10 8 l-14 8Z M0 22 l20 -4 l6 10 l-22 4Z M34 16 l12 -2 l6 8 l-14 2Z" fill="#fbfbff" />}
          <text x="0" y="64" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontWeight="800" fontSize="17" fill="#3a1f18">
            {t}
          </text>
        </g>
      ))}
      <Tag x={300} y={310} text="where did it go?" size={20} />
    </Frame>
  );
}

function Taste() {
  return (
    <Frame label="Phoenix dropping a scoop of soil into the tiny ovens on its deck, imagining asparagus growing in Martian soil">
      <MarsSky variant="day" />
      <PolarGround y={540} />
      <RoundLander x={270} y={660} s={1.0} kind="phoenix" eyes="happy" arm="place" />
      <g className="anim poke">
        <circle cx="452" cy="572" r="4" fill="#c9542c" />
        <circle cx="460" cy="584" r="3" fill="#c9542c" />
        <circle cx="448" cy="590" r="3.5" fill="#c9542c" />
      </g>
      {[200, 240, 280].map((x, i) => (
        <g key={x} transform={`translate(${x} 556)`}>
          <rect x="-12" y="-14" width="24" height="16" rx="3" fill="#d6d9e2" stroke="#8a93aa" strokeWidth="1.2" />
          <circle cx="0" cy="-6" r="3" fill={i === 1 ? "#ff8d5c" : "#9fdcff"} className="anim glowpulse" />
        </g>
      ))}
      <g transform="translate(470 330)">
        <circle r="78" fill="#fffaf3" opacity="0.9" />
        <path d="M-50 40 Q0 24 50 40 L50 54 L-50 54Z" fill="#dd6233" />
        {[-24, 0, 24].map((ax, i) => (
          <g key={ax} transform={`translate(${ax} 40)`}>
            <path d={`M0 0 L${i - 1} -60`} stroke="#6aa84f" strokeWidth="8" strokeLinecap="round" />
            <path d={`M${i - 1} -60 l-6 10 M${i - 1} -60 l6 10 M${i - 1} -48 l-6 10 M${i - 1} -48 l6 10`} stroke="#3f7a35" strokeWidth="3" strokeLinecap="round" />
          </g>
        ))}
      </g>
      <Tag x={470} y={450} text="asparagus? maybe!" size={18} />
    </Frame>
  );
}

function SnowScene() {
  return (
    <Frame label="At night, Phoenix's laser pointing straight up into the clouds, where snow is falling but vanishing before it reaches the ground">
      <MarsSky variant="night" stars={50} seed={51} />
      <SmallMoon cx={100} cy={140} r={10} fill="#cdb2a4" />
      <g className="anim drift" opacity="0.8">
        <ellipse cx="200" cy="170" rx="160" ry="36" fill="#d9c9d6" opacity="0.5" />
        <ellipse cx="420" cy="200" rx="180" ry="40" fill="#cdbccb" opacity="0.5" />
      </g>
      <Snow seed={52} count={60} top={200} bottom={420} />
      <path d="M282 494 L282 170" stroke="#7dff9a" strokeWidth="4" opacity="0.7" strokeDasharray="12 8" className="anim laser" />
      <PolarGround y={560} frost />
      <RoundLander x={300} y={690} s={1.0} kind="phoenix" eyes="up" frost />
      <Tag x={460} y={460} text="snow on Mars!" size={20} />
    </Frame>
  );
}

function InsightScene() {
  const u = useUid();
  return (
    <Frame label="InSight flying to Mars, with two tiny CubeSats nicknamed WALL-E and EVE flying alongside">
      <Space variant="deep" stars={110} seed={61} />
      <g transform="translate(470 560)">
        <circle r="150" fill="#dd6233" />
        <circle r="150" fill="none" stroke="#e8a07a" strokeWidth="3" opacity="0.6" />
        <ellipse cx="60" cy="10" rx="120" ry="160" fill="#2b1552" opacity="0.4" />
      </g>
      <defs>
        <linearGradient id={`${u}-shell`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2efe9" />
          <stop offset="1" stopColor="#a69d91" />
        </linearGradient>
      </defs>
      <g className="anim hover">
        <g transform="translate(240 300) rotate(-16)">
          <path d="M-70 10 L70 10 L40 -40 L-40 -40Z" fill={`url(#${u}-shell)`} stroke="#8a93aa" strokeWidth="2" />
          <path d="M-74 10 Q0 50 74 10Z" fill="#8a5a3c" />
          <rect x="-26" y="-60" width="52" height="22" rx="4" fill="#d6d9e2" />
          <path d="M-120 -50 L-30 -50 M30 -50 L120 -50" stroke="#2c4a9a" strokeWidth="14" />
        </g>
      </g>
      <CubeSat x={110} y={220} label="WALL-E" />
      <CubeSat x={380} y={160} label="EVE" />
      <Tag x={300} y={620} text="first CubeSats to another planet" size={18} />
    </Frame>
  );
}

function Quakes() {
  return (
    <Frame label="InSight sitting still with its seismometer dome on the ground, feeling marsquakes ripple through the plain, while a space rock streaks down far away">
      <MarsSky variant="day" />
      <Sun cx={110} cy={240} r={11} />
      <g className="anim drift-away">
        <circle cx="480" cy="170" r="7" fill="#fff3df" />
        <path d="M486 164 L560 110" stroke="#fff3df" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
      </g>
      <MarsGround y={540} seed={72} rocks={12} />
      <QuakeRings x={450} y={700} s={1.1} />
      <RoundLander x={220} y={670} s={0.9} kind="insight" eyes="wide" />
      <SeismoDome x={450} y={700} s={0.9} listen />
      <Tag x={420} y={500} text="rumble... rumble..." size={20} />
    </Frame>
  );
}

function Inside() {
  return (
    <Frame label="Mars cut open like a fruit: a rocky crust, a thick mantle and a big glowing liquid metal core, with InSight sitting on top and its mole trying to dig in">
      <Space variant="indigo" stars={80} seed={81} />
      <PlanetCutaway cx={300} cy={470} r={220} />
      <g transform="translate(300 250)">
        <RoundLander x={0} y={0} s={0.28} kind="insight" eyes="happy" shadow={false} />
      </g>
      <Tag x={110} y={300} text="crust" to={[140, 330]} size={18} />
      <Tag x={90} y={440} text="mantle" to={[150, 470]} size={18} />
      <Tag x={190} y={610} text="liquid core" to={[260, 520]} size={18} />
      <g transform="translate(470 180)">
        <rect x="-60" y="-50" width="120" height="100" rx="12" fill="#fffaf3" />
        <rect x="-48" y="-38" width="96" height="60" fill="#dd6233" />
        <rect x="-6" y="-24" width="12" height="26" rx="4" fill="#d6d9e2" className="anim hop" />
        <text x="0" y="40" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontWeight="800" fontSize="15" fill="#3a1f18">
          the mole
        </text>
      </g>
    </Frame>
  );
}

function Goodnight() {
  return (
    <Frame label="InSight asleep at sunset with dusty panels and its seismometer beside it, while far away on the horizon Phoenix sleeps under frost">
      <MarsSky variant="dusk" stars={40} seed={91} />
      <Sun cx={300} cy={470} r={10} halo="#9cc4ff" opacity={0.5} />
      <MarsGround y={540} seed={92} tone="dusk" rocks={16} />
      <RoundLander x={110} y={520} s={0.18} kind="phoenix" eyes="closed" frost shadow={false} />
      <RoundLander x={280} y={700} s={0.92} kind="insight" eyes="closed" dusty={0.6} />
      <SeismoDome x={520} y={716} s={0.6} />
      <Glow cx={300} cy={600} r={180} color="#ffd9b8" opacity={0.14} className="anim breathe" />
      <Zzz x={330} y={520} size={24} color="#fff1e4" />
      <Bubble x={150} y={380} text="Goodnight!" w={150} />
    </Frame>
  );
}

export const phoenixInsightScenes = {
  "pi-cover": Cover,
  "pi-asleep": Asleep,
  "pi-phoenix": PhoenixScene,
  "pi-ice": Ice,
  "pi-taste": Taste,
  "pi-snow": SnowScene,
  "pi-insight": InsightScene,
  "pi-quakes": Quakes,
  "pi-inside": Inside,
  "pi-goodnight": Goodnight,
};
