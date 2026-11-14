import React from "react";
import { Frame, Glow, Puffs, Sky, Stars, Zzz, useUid, W, H } from "./common";
import { MarsGlobe, MarsGround, Rock, SmallMoon } from "./vikingParts";
import { Bubble, MarsSky, Sparkle, Sun, Tag } from "./kit";
import { AirbagBall, DustDevil, MarsRover } from "./machines";

/** Draws its children mirrored left-to-right around x. */
function Mirror({ x, children }) {
  return <g transform={`translate(${2 * x} 0) scale(-1 1)`}>{children}</g>;
}

/** A big crater bowl seen from its rim. */
function CraterBowl({ y = 560, color = "#a63e1e", rim = "#f39058" }) {
  return (
    <g>
      <ellipse cx="300" cy={y} rx="420" ry="80" fill={color} opacity="0.75" />
      <path d={`M-120 ${y} A420 80 0 0 1 720 ${y}`} stroke={rim} strokeWidth="6" fill="none" opacity="0.7" />
    </g>
  );
}

function Note({ x, y, delay = 0 }) {
  return (
    <g className="anim hover" style={{ animationDelay: `${delay}s` }}>
      <g transform={`translate(${x} ${y})`} fill="#ffe08a">
        <ellipse cx="-8" cy="14" rx="9" ry="7" transform="rotate(-20 -8 14)" />
        <path d="M-1 12 L-1 -26 L18 -18" stroke="#ffe08a" strokeWidth="4" fill="none" />
      </g>
    </g>
  );
}

function Cover() {
  return (
    <Frame label="The twin rovers Spirit and Opportunity standing side by side on Mars, each with a camera head on a tall neck">
      <MarsSky variant="day" />
      <Sun cx={300} cy={300} r={12} />
      <MarsGround y={560} seed={4} rocks={26} />
      <g className="anim hover-soft">
        <MarsRover x={160} y={660} s={0.9} who="spirit" eyes="happy" />
      </g>
      <g className="anim hover-soft" style={{ animationDelay: "1.2s" }}>
        <Mirror x={430}>
          <MarsRover x={445} y={672} s={0.9} who="opportunity" eyes="happy" />
        </Mirror>
      </g>
    </Frame>
  );
}

function Asleep() {
  const u = useUid();
  return (
    <Frame label="Two halves of Mars: Spirit asleep tilted in soft sand, and Opportunity asleep and dusty on the rim of a giant crater">
      <defs>
        <clipPath id={`${u}-l`}>
          <path d="M0 0 L330 0 L270 760 L0 760Z" />
        </clipPath>
        <clipPath id={`${u}-r`}>
          <path d="M330 0 L600 0 L600 760 L270 760Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${u}-l)`}>
        <MarsSky variant="dusk" stars={20} seed={11} />
        <MarsGround y={560} seed={12} tone="dusk" rocks={14} />
        <g transform="rotate(-8 150 660)">
          <MarsRover x={150} y={660} s={0.62} who="spirit" eyes="closed" stuck dusty={0.3} />
        </g>
        <Zzz x={170} y={440} size={22} color="#fff1e4" />
      </g>
      <g clipPath={`url(#${u}-r)`}>
        <MarsSky variant="night" stars={40} seed={13} />
        <CraterBowl y={580} color="#4f2418" rim="#b04a2c" />
        <MarsGround y={620} seed={14} tone="night" rocks={10} />
        <Mirror x={460}>
          <MarsRover x={460} y={700} s={0.6} who="opportunity" eyes="closed" dusty={0.55} />
        </Mirror>
        <Zzz x={470} y={500} size={22} color="#fff1e4" />
      </g>
      <path d="M330 0 L270 760" stroke="#fff1e4" strokeWidth="3" opacity="0.6" />
      <Tag x={140} y={150} text="Spirit" size={24} color="#fff1e4" />
      <Tag x={470} y={150} text="Opportunity" size={24} color="#fff1e4" />
    </Frame>
  );
}

function Made() {
  return (
    <Frame label="A robot geologist rover showing its tools: camera eyes, an arm with a magnifying glass, and a little rock grinder, with Mars waiting in the sky">
      <MarsSky variant="space" stars={90} seed={21} />
      <MarsGlobe cx={460} cy={210} r={110} />
      <g className="anim glowpulse">
        <circle cx="410" cy="200" r="8" fill="none" stroke="#9fdcff" strokeWidth="3" />
        <circle cx="510" cy="250" r="8" fill="none" stroke="#9fdcff" strokeWidth="3" />
      </g>
      <rect y="600" width={W} height={H - 600} fill="#2a2440" />
      <ellipse cx="270" cy="640" rx="230" ry="26" fill="#3d3560" />
      <MarsRover x={250} y={640} s={1.05} who="spirit" eyes="happy" arm="out" shadow={false} />
      <Tag x={110} y={380} text="camera eyes" to={[262, 430]} />
      <Tag x={470} y={470} text="magnifier + grinder" to={[400, 590]} />
      <Tag x={460} y={360} text="two places with water clues" size={16} />
    </Frame>
  );
}

function Landing() {
  return (
    <Frame label="Opportunity's airbag ball rolling straight into a tiny crater, like a perfect hole-in-one in golf">
      <MarsSky variant="day" />
      <MarsGround y={500} seed={32} rocks={18} />
      <ellipse cx="380" cy="640" rx="170" ry="38" fill="#a63e1e" />
      <ellipse cx="380" cy="646" rx="140" ry="26" fill="#7a3720" />
      <path d="M380 616 L380 520" stroke="#efebe4" strokeWidth="4" />
      <path d="M380 520 L430 536 L380 552Z" fill="#ff8d5c" className="anim wobble" />
      <path d="M60 470 Q130 380 190 520 Q240 450 290 580 Q320 560 350 610" stroke="#fff3df" strokeWidth="2.5" strokeDasharray="5 8" fill="none" opacity="0.8" />
      <AirbagBall x={330} y={600} s={0.75} className="anim hover-soft" />
      <Bubble x={200} y={250} text="Hole in one!" w={190} />
    </Frame>
  );
}

function Blueberries() {
  const r = [];
  let a = 7;
  for (let i = 0; i < 70; i += 1) {
    a = (a * 9301 + 49297) % 233280;
    const x = (a / 233280) * 600;
    a = (a * 9301 + 49297) % 233280;
    const y = 560 + (a / 233280) * 190;
    r.push([x, y, 3 + (i % 4)]);
  }
  return (
    <Frame label="Opportunity looking through its magnifier at thousands of tiny grey balls, nicknamed blueberries, scattered on layered rock">
      <MarsSky variant="day" />
      <rect y="520" width={W} height="240" fill="#dd6233" />
      {[540, 580, 620].map((y) => (
        <path key={y} d={`M0 ${y} Q300 ${y - 10} 600 ${y + 4}`} stroke="#f39058" strokeWidth="6" fill="none" opacity="0.6" />
      ))}
      {r.map(([x, y, s], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={s} fill="#6f7a96" />
          <circle cx={x - s * 0.3} cy={y - s * 0.3} r={s * 0.35} fill="#c7d0e6" />
        </g>
      ))}
      <Mirror x={470}>
        <MarsRover x={470} y={540} s={0.62} who="opportunity" eyes="wide" arm="out" shadow={false} />
      </Mirror>
      <g transform="translate(220 360)">
        <circle r="96" fill="#ffaa6b" stroke="#efebe4" strokeWidth="10" />
        {[[-40, -20, 16], [10, -40, 13], [40, 10, 18], [-20, 30, 14], [-50, 40, 10], [30, 50, 11]].map(([x, y, s]) => (
          <g key={`${x}${y}`}>
            <circle cx={x} cy={y} r={s} fill="#5f6a88" />
            <circle cx={x - s * 0.3} cy={y - s * 0.35} r={s * 0.35} fill="#c7d0e6" />
          </g>
        ))}
        <path d="M66 70 L120 130" stroke="#efebe4" strokeWidth="16" strokeLinecap="round" />
      </g>
      <Tag x={220} y={230} text="blueberries!" size={24} />
    </Frame>
  );
}

function Hills() {
  return (
    <Frame label="Spirit on top of Husband Hill, looking over the crater while dust devils dance across the plain, dragging its broken wheel">
      <MarsSky variant="day" />
      <Sun cx={110} cy={200} r={11} />
      <MarsGround y={560} seed={42} rocks={10} />
      <path d="M0 520 L60 470 Q300 330 470 360 L600 420 L600 760 L0 760Z" fill="#d86a3f" />
      <path d="M0 560 Q300 400 600 470 L600 760 L0 760Z" fill="#dd6233" />
      <DustDevil x={110} y={620} s={0.5} />
      <DustDevil x={520} y={640} s={0.42} className="anim drift-away" />
      <g transform="rotate(-6 300 480)">
        <MarsRover x={300} y={480} s={0.72} who="spirit" eyes="happy" />
      </g>
      <path d="M380 492 C440 520 500 560 600 590" stroke="#a63e1e" strokeWidth="5" fill="none" opacity="0.6" />
      <Tag x={380} y={200} text="from the top of Husband Hill" size={18} />
      <Tag x={470} y={560} text="driving backwards!" size={17} />
    </Frame>
  );
}

function Silica() {
  return (
    <Frame label="Spirit's dragging wheel scraping away red soil to reveal bright white silica, a clue that hot springs once bubbled here">
      <MarsSky variant="day" />
      <MarsGround y={520} seed={52} rocks={18} />
      {/* the hot spring of long ago, drawn like a memory */}
      <g opacity="0.45" className="anim ghost">
        <ellipse cx="460" cy="330" rx="90" ry="22" fill="#8fd3ff" />
        <Puffs x={460} y={300} w={120} color="#ffffff" opacity={0.7} seed={53} count={6} className="anim billow" />
        <Tag x={460} y={240} text="long, long ago..." size={17} />
      </g>
      <path d="M40 690 C120 680 200 700 260 690" stroke="#fbfbff" strokeWidth="18" strokeLinecap="round" />
      <Sparkle x={90} y={676} delay={0.2} />
      <Sparkle x={170} y={690} s={0.8} delay={0.8} />
      <Sparkle x={230} y={680} s={1.1} delay={1.4} />
      <Mirror x={360}>
        <MarsRover x={380} y={700} s={1.0} who="spirit" eyes="wide" />
      </Mirror>
      <Bubble x={160} y={380} text="What's this?" w={170} />
    </Frame>
  );
}

function Stuck() {
  return (
    <Frame label="Spirit stuck up to its wheels in soft sand, with the low winter Sun far away">
      <MarsSky variant="dusk" stars={14} seed={61} />
      <Sun cx={510} cy={460} r={10} opacity={0.4} />
      <MarsGround y={560} seed={62} tone="dusk" rocks={8} />
      <g transform="rotate(-8 290 660)">
        <MarsRover x={300} y={670} s={1.08} who="spirit" eyes="sleepy" stuck />
      </g>
      {[600, 640, 690].map((y, i) => (
        <path key={y} d={`M${60 + i * 10} ${y} q30 -10 60 0 t60 0 t60 0`} stroke="#e6a77a" strokeWidth="3" fill="none" opacity="0.5" />
      ))}
      <Tag x={300} y={230} text="stuck!" size={28} />
    </Frame>
  );
}

function Marathon() {
  return (
    <Frame label="Opportunity crossing a finish-line ribbon on the rim of the giant Endeavour crater, with a medal for running a marathon">
      <MarsSky variant="day" />
      <Sun cx={480} cy={250} r={11} />
      <CraterBowl y={500} />
      <MarsGround y={580} seed={72} rocks={14} />
      <path d="M140 520 L140 690 M520 520 L520 690" stroke="#efebe4" strokeWidth="5" />
      <path d="M140 560 Q330 600 520 560" stroke="#ff8d5c" strokeWidth="6" fill="none" className="anim wobble" />
      <Mirror x={330}>
        <MarsRover x={330} y={700} s={1.0} who="opportunity" eyes="happy" roll />
      </Mirror>
      <g transform="translate(330 330)" className="anim hover-soft">
        <path d="M-20 -60 L0 -20 L20 -60" stroke="#5aa6ff" strokeWidth="8" fill="none" />
        <circle cx="0" cy="0" r="26" fill="#f2b640" stroke="#b07d22" strokeWidth="3" />
        <text x="0" y="8" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontWeight="800" fontSize="20" fill="#7a5520">
          42
        </text>
      </g>
      <Tag x={330} y={430} text="Endeavour crater" size={18} />
    </Frame>
  );
}

function Storm() {
  const u = useUid();
  return (
    <Frame label="A great dust storm darkening the sky over Opportunity, while a song drifts across from Earth">
      <Sky id={`${u}-s`} stops={[[0, "#2a160f"], [0.6, "#5a2c1c"], [1, "#7a3a22"]]} />
      <g className="anim drift" opacity="0.55">
        {[180, 260, 340, 430, 520].map((y, i) => (
          <path key={y} d={`M-60 ${y} C120 ${y - 40} 260 ${y + 30} 420 ${y - 10} S620 ${y - 30} 680 ${y}`} stroke={i % 2 ? "#b4673f" : "#8f4a2c"} strokeWidth={28 - i * 3} fill="none" strokeLinecap="round" />
        ))}
      </g>
      <g className="anim drift-away" opacity="0.35">
        {[220, 390, 480].map((y) => (
          <path key={y} d={`M-40 ${y} C160 ${y + 30} 300 ${y - 40} 640 ${y + 10}`} stroke="#d08a5e" strokeWidth="10" fill="none" strokeLinecap="round" />
        ))}
      </g>
      <MarsGround y={600} seed={83} tone="night" rocks={10} />
      <Mirror x={330}>
        <MarsRover x={330} y={700} s={1.02} who="opportunity" eyes="sleepy" dusty={0.6} />
      </Mirror>
      <Note x={130} y={250} />
      <Note x={190} y={190} delay={0.8} />
      <Note x={100} y={150} delay={1.6} />
      <Tag x={180} y={360} text="I'll Be Seeing You" size={19} color="#ffe08a" />
    </Frame>
  );
}

function Goodnight() {
  const u = useUid();
  return (
    <Frame label="Spirit and Opportunity asleep on opposite sides of Mars under the same stars">
      <Sky id={`${u}-s`} stops={[[0, "#0d0712"], [1, "#3a1f2c"]]} />
      <Stars seed={91} count={110} bottom={460} color="#fff1e4" />
      <SmallMoon cx={300} cy={140} r={12} fill="#cdb2a4" />
      <g transform="translate(300 900)">
        <circle r="460" fill="#8f3f24" />
        <circle r="460" fill="none" stroke="#e8a07a" strokeWidth="3" opacity="0.6" />
      </g>
      <g transform="rotate(-24 150 520)">
        <MarsRover x={150} y={520} s={0.6} who="spirit" eyes="closed" stuck shadow={false} />
      </g>
      <g transform="rotate(24 450 520)">
        <Mirror x={450}>
          <MarsRover x={450} y={520} s={0.6} who="opportunity" eyes="closed" shadow={false} dusty={0.5} />
        </Mirror>
      </g>
      <Glow cx={300} cy={520} r={220} color="#ffd9b8" opacity={0.12} className="anim breathe" />
      <Zzz x={160} y={380} size={22} color="#fff1e4" />
      <Zzz x={430} y={380} size={22} color="#fff1e4" />
      <Rock x={300} y={470} s={2} />
    </Frame>
  );
}

export const twinsScenes = {
  "twins-cover": Cover,
  "twins-asleep": Asleep,
  "twins-made": Made,
  "twins-landing": Landing,
  "twins-blueberries": Blueberries,
  "twins-hills": Hills,
  "twins-silica": Silica,
  "twins-stuck": Stuck,
  "twins-marathon": Marathon,
  "twins-storm": Storm,
  "twins-goodnight": Goodnight,
};
