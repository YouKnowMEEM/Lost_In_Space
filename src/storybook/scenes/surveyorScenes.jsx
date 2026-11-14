import React from "react";
import { Earth, Frame, Glow, Puffs, Sky, Stars, Zzz, useUid } from "./common";
import { Astronaut, Boulder, Crater, EagleLM, Footprints, MoonGround } from "./eagleParts";
import { Bubble, MoonSky, PhotoCard, Question, Sparkle, Tag } from "./kit";
import { SurveyorLander } from "./machines";

function Cover() {
  return (
    <Frame label="A Surveyor lander, a little three-legged robot with a solar panel on a pole, standing on the Moon under the blue Earth">
      <MoonSky seed={3} earth={[470, 170, 40]} />
      <MoonGround y={590} seed={4} tone="day" />
      <Boulder x={110} y={640} s={0.9} />
      <g className="anim hover-soft">
        <SurveyorLander x={300} y={640} s={1.15} eyes="happy" />
      </g>
    </Frame>
  );
}

function Asleep() {
  const spots = [
    [90, 540, 0.34],
    [520, 520, 0.3],
    [200, 600, 0.42],
    [440, 610, 0.46],
  ];
  return (
    <Frame label="Five Surveyor landers asleep far apart on the grey hills of the Moon, under the stars">
      <MoonSky seed={11} earth={[110, 150, 26]} />
      <path d="M0 470 Q120 430 240 462 T480 452 T600 470 L600 760 L0 760Z" fill="#8a8ea3" opacity="0.6" />
      <MoonGround y={520} seed={12} />
      {spots.map(([x, y, s], i) => (
        <g key={i}>
          <SurveyorLander x={x} y={y} s={s} eyes="closed" shadow={false} />
        </g>
      ))}
      <SurveyorLander x={300} y={690} s={0.7} eyes="closed" />
      <Glow cx={300} cy={560} r={150} color="#cfe0ff" opacity={0.15} className="anim breathe" />
      <Zzz x={330} y={470} size={26} />
    </Frame>
  );
}

function QuestionScene() {
  const u = useUid();
  return (
    <Frame label="A worried Surveyor wondering whether the Moon is covered in deep, soft dust that could swallow a spaceship">
      <MoonSky seed={21} earth={[480, 150, 30]} />
      <defs>
        <linearGradient id={`${u}-dust`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d3d5df" />
          <stop offset="1" stopColor="#7d8197" />
        </linearGradient>
      </defs>
      <path d="M0 560 Q150 530 300 556 T600 548 L600 760 L0 760Z" fill={`url(#${u}-dust)`} />
      {/* the imagined dust sea, with a ghostly sinking ship */}
      <g opacity="0.55" className="anim ghost">
        <path d="M60 620 q30 -14 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" stroke="#eef0f6" strokeWidth="3" fill="none" />
        <path d="M30 660 q30 -14 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" stroke="#eef0f6" strokeWidth="3" fill="none" />
        <SurveyorLander x={140} y={700} s={0.45} eyes="wide" shadow={false} />
      </g>
      <g className="anim hover-soft">
        <SurveyorLander x={380} y={600} s={0.82} eyes="wide" />
      </g>
      <Question x={250} y={260} s={1.3} />
      <Question x={520} y={330} s={0.9} delay={1.2} />
      <Bubble x={400} y={150} text="Is it safe?" w={170} />
    </Frame>
  );
}

function Landing() {
  return (
    <Frame label="Surveyor 1 coming down to land, its braking rocket roaring, then its three little engines puffing gently">
      <MoonSky seed={31} earth={[90, 140, 24]} />
      <MoonGround y={640} seed={32} tone="day" />
      {/* dropped braking rocket, tumbling away */}
      <g className="anim drift-away">
        <g transform="translate(110 360) rotate(-30)">
          <circle r="30" fill="#d9dce6" stroke="#8a93aa" strokeWidth="2" />
          <path d="M-12 26 L12 26 L18 42 L-18 42Z" fill="#5b6276" />
        </g>
      </g>
      <path d="M180 120 C220 220 280 300 300 420" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="2.5" strokeDasharray="5 9" fill="none" />
      <g className="anim hover">
        <SurveyorLander x={320} y={520} s={0.9} eyes="wide" shadow={false} />
        {[-27, 27].map((dx) => (
          <g key={dx} transform={`translate(${320 + dx} ${520 - 88 * 0.9})`}>
            <path className="anim flame" d="M-8 0 Q-10 40 0 70 Q10 40 8 0Z" fill="#ffd36b" opacity="0.85" />
          </g>
        ))}
      </g>
      <Puffs x={320} y={640} w={260} color="#d5d7e2" opacity={0.6} seed={33} count={9} className="anim billow" />
      <Tag x={470} y={300} text="slower... slower..." />
    </Frame>
  );
}

function Pictures() {
  return (
    <Frame label="Surveyor 1 standing firmly on the Moon, turning its camera mirror and sending pictures home to Earth">
      <MoonSky seed={41} earth={[470, 140, 34]} />
      <MoonGround y={600} seed={42} tone="day" />
      <Boulder x={480} y={660} s={1.1} />
      <SurveyorLander x={250} y={660} s={1.0} eyes="happy" />
      <PhotoCard x={110} y={260} rotate={-8}>
        <path d="M-48 20 Q-10 6 48 18 L48 36 L-48 36Z" fill="#8a8ea3" />
        <circle cx="-14" cy="22" r="8" fill="#6e7288" />
      </PhotoCard>
      <PhotoCard x={250} y={190} rotate={5} delay={0.8}>
        <ellipse cx="0" cy="18" rx="30" ry="9" fill="#9ea2b6" />
        <ellipse cx="0" cy="18" rx="20" ry="5" fill="#6e7288" />
      </PhotoCard>
      <PhotoCard x={370} y={280} rotate={-3} delay={1.6}>
        <ellipse cx="0" cy="22" rx="36" ry="8" fill="#e9ebf2" />
        <ellipse cx="-4" cy="20" rx="22" ry="5" fill="#b9bdcc" />
      </PhotoCard>
      <path d="M300 470 C340 380 420 260 460 180" stroke="#9fdcff" strokeWidth="2.5" strokeDasharray="4 8" fill="none" className="anim laser" />
      <Tag x={120} y={430} text="11,000 pictures!" />
    </Frame>
  );
}

function Scoop() {
  return (
    <Frame label="Surveyor 3, a little crooked on a crater slope, digging a trench with the scoop on its folding arm">
      <MoonSky seed={51} earth={[110, 140, 26]} />
      <MoonGround y={560} seed={52} tone="day" />
      <Crater cx={300} cy={690} rx={320} />
      <g transform="rotate(-7 330 650)">
        <SurveyorLander x={360} y={650} s={0.95} eyes="happy" arm="out" />
      </g>
      {/* trenches */}
      <path d="M168 655 L230 645" stroke="#5b5f74" strokeWidth="10" strokeLinecap="round" />
      <path d="M150 680 L210 674" stroke="#5b5f74" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
      <g className="anim poke">
        <circle cx="200" cy="630" r="3" fill="#c9ccd9" />
        <circle cx="214" cy="624" r="2.4" fill="#c9ccd9" />
        <circle cx="190" cy="622" r="2" fill="#c9ccd9" />
      </g>
      <Tag x={470} y={250} text="boing!" size={26} />
      <Tag x={420} y={190} text="boing!" size={20} />
      <path d="M520 150 Q470 110 440 180 Q420 240 400 300" stroke="#fff6dc" strokeWidth="2" strokeDasharray="4 6" fill="none" opacity="0.6" />
    </Frame>
  );
}

function Eclipse() {
  const u = useUid();
  return (
    <Frame label="From the Moon, the Earth passes in front of the Sun, leaving a thin glowing red ring around its edge">
      <Sky id={`${u}-s`} stops={[[0, "#02030a"], [1, "#0f1430"]]} />
      <Stars seed={61} count={120} bottom={560} />
      <Glow cx={300} cy={250} r={230} color="#ffcf9a" opacity={0.25} className="anim breathe" />
      <circle cx="300" cy="250" r="104" fill="none" stroke="#ff7a4a" strokeWidth="10" opacity="0.55" />
      <circle cx="300" cy="250" r="100" fill="none" stroke="#ffd2a6" strokeWidth="4" />
      <circle cx="300" cy="250" r="98" fill="#05060f" />
      <Sparkle x={210} y={180} s={1.2} delay={0.4} />
      <MoonGround y={600} seed={62} />
      <g transform="translate(300 665)">
        <SurveyorLander x={0} y={0} s={0.85} eyes="wide" />
      </g>
      <Tag x={300} y={420} text="the whole world's sunrises and sunsets" />
    </Frame>
  );
}

function Hop() {
  return (
    <Frame label="Surveyor 6 hopping into the air on its little engines and moving a few steps sideways">
      <MoonSky seed={71} earth={[480, 150, 30]} />
      <MoonGround y={610} seed={72} tone="day" />
      {/* where it first stood */}
      <g opacity="0.45">
        <ellipse cx="148" cy="652" rx="20" ry="6" fill="#5b5f74" />
        <ellipse cx="392" cy="652" rx="20" ry="6" fill="#5b5f74" />
        <ellipse cx="280" cy="640" rx="14" ry="4" fill="#5b5f74" />
      </g>
      <path d="M270 520 Q300 380 360 440" stroke="#fff6dc" strokeWidth="2.5" strokeDasharray="5 8" fill="none" opacity="0.7" />
      <g className="anim hop">
        <SurveyorLander x={340} y={560} s={0.82} eyes="happy" shadow={false} />
        {[-24, 24].map((dx) => (
          <g key={dx} transform={`translate(${340 + dx} ${560 - 88 * 0.82})`}>
            <path className="anim flame" d="M-7 0 Q-9 36 0 62 Q9 36 7 0Z" fill="#ffd36b" opacity="0.8" />
          </g>
        ))}
      </g>
      <ellipse cx="350" cy="662" rx="120" ry="10" fill="#000" opacity="0.18" />
      <Puffs x={300} y={660} w={300} color="#d5d7e2" opacity={0.55} seed={73} count={10} className="anim billow" />
      <Bubble x={160} y={230} text="Whee!" w={120} />
    </Frame>
  );
}

function Lasers() {
  return (
    <Frame label="Surveyor 7 among boulders near Tycho crater, looking up at the Earth where two tiny laser beams are shining">
      <MoonSky seed={81} stars={70} />
      <Earth cx={430} cy={170} r={56} />
      <g className="anim glowpulse">
        <circle cx="406" cy="150" r="5" fill="#7dff9a" />
        <circle cx="414" cy="166" r="5" fill="#7dff9a" />
      </g>
      <path d="M406 150 L270 470 M414 166 L282 474" stroke="#7dff9a" strokeWidth="2" strokeDasharray="10 12" opacity="0.7" className="anim laser" />
      <MoonGround y={570} seed={82} tone="day" />
      <Boulder x={90} y={640} s={1.3} />
      <Boulder x={520} y={630} s={1.1} />
      <Boulder x={460} y={700} s={0.8} />
      <Boulder x={160} y={700} s={0.7} />
      <SurveyorLander x={290} y={660} s={0.9} eyes="up" />
      <Sparkle x={280} y={470} s={0.8} color="#c6ffd2" />
    </Frame>
  );
}

function Visitors() {
  return (
    <Frame label="Two Apollo 12 astronauts visiting Surveyor 3 at the edge of its crater, with their lunar module standing behind">
      <MoonSky seed={91} earth={[110, 150, 28]} />
      <MoonGround y={540} seed={92} tone="day" />
      <g transform="translate(470 560)">
        <EagleLM x={0} y={0} s={0.42} eyes="happy" flag={false} />
      </g>
      <Crater cx={250} cy={700} rx={260} />
      <SurveyorLander x={220} y={650} s={0.78} eyes="wide" />
      <Astronaut x={380} y={666} s={1.0} pose="walk" flip />
      <Astronaut x={460} y={690} s={0.95} pose="stand" flip />
      <Footprints points={[[420, 700], [440, 690], [460, 682], [480, 672], [500, 660]]} />
      <Bubble x={150} y={270} text="Visitors!" w={150} />
    </Frame>
  );
}

function Goodnight() {
  return (
    <Frame label="Surveyor 3, without its camera, sleeping near Apollo 12's empty lander under the blue Earth">
      <MoonSky seed={101} earth={[450, 170, 46]} />
      <MoonGround y={560} seed={102} />
      <g transform="translate(140 610)">
        <EagleLM x={0} y={0} s={0.34} part="descent" eyes="closed" flag={false} />
      </g>
      <SurveyorLander x={340} y={680} s={1.0} eyes="closed" camera={false} />
      <Glow cx={340} cy={520} r={170} color="#cfe0ff" opacity={0.16} className="anim breathe" />
      <Zzz x={390} y={380} size={28} />
    </Frame>
  );
}

export const surveyorScenes = {
  "surveyor-cover": Cover,
  "surveyor-asleep": Asleep,
  "surveyor-question": QuestionScene,
  "surveyor-landing": Landing,
  "surveyor-pictures": Pictures,
  "surveyor-scoop": Scoop,
  "surveyor-eclipse": Eclipse,
  "surveyor-hop": Hop,
  "surveyor-lasers": Lasers,
  "surveyor-visitors": Visitors,
  "surveyor-goodnight": Goodnight,
};
