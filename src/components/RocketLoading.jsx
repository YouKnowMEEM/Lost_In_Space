import React from "react";
import "./rocket-loading.css";

/*
 * Shown while the next page loads. A little rocket flies through the stars toward the place the
 * visitor is going (the Moon, Mars, deep space, Earth...), and says where it is heading.
 * Everything is drawn here in SVG and moved with CSS, so it costs nothing to download.
 */

const STORY_WORLD = {
  surveyor: "moon",
  "lunar-rovers": "moon",
  alsep: "moon",
  sojourner: "mars",
  "spirit-and-opportunity": "mars",
  "phoenix-and-insight": "mars",
  ingenuity: "mars",
  "near-shoemaker": "deep",
  dawn: "deep",
  kepler: "deep",
  pioneers: "deep",
};

const TRIPS = {
  moon: { text: "Flying to the Moon", dest: "moon", sky: "moon" },
  mars: { text: "Flying to Mars", dest: "mars", sky: "mars" },
  deep: { text: "Flying into deep space", dest: "ringed", sky: "deep" },
  library: { text: "Opening the Cosmic Library", dest: "ringed", sky: "deep" },
  notes: { text: "Opening the field notes", dest: "ringed", sky: "deep" },
  play: { text: "Getting the games ready", dest: "earth", sky: "earth" },
  about: { text: "Opening the guide", dest: "earth", sky: "earth" },
  home: { text: "Flying home", dest: "earth", sky: "earth" },
  other: { text: "Launching", dest: "ringed", sky: "deep" },
};

export function tripFor(pathname = "") {
  const p = String(pathname).toLowerCase();
  if (/^\/(moon|eagle)(\/|$)/.test(p)) return TRIPS.moon;
  if (/^\/(mars|viking)/.test(p)) return TRIPS.mars;
  if (/^\/(space|voyager)/.test(p)) return TRIPS.deep;
  const story = p.match(/^\/stories\/([^/?#]+)/);
  if (story) return TRIPS[STORY_WORLD[story[1]] || "deep"];
  if (/^\/(library|atlas)/.test(p)) return TRIPS.library;
  if (p.startsWith("/object/")) return TRIPS.notes;
  if (p.startsWith("/play")) return TRIPS.play;
  if (p.startsWith("/about")) return TRIPS.about;
  if (p === "/" || p === "") return TRIPS.home;
  return TRIPS.other;
}

function Destination({ kind }) {
  if (kind === "moon") {
    return (
      <g className="rl-dest">
        <circle r="46" fill="url(#rl-halo-moon)" />
        <circle r="30" fill="url(#rl-moon)" />
        <circle cx="-10" cy="-9" r="6.5" fill="#9aa3b8" opacity="0.5" />
        <circle cx="11" cy="5" r="8.5" fill="#9aa3b8" opacity="0.42" />
        <circle cx="-5" cy="15" r="4.2" fill="#9aa3b8" opacity="0.5" />
        <circle cx="14" cy="-14" r="3.2" fill="#9aa3b8" opacity="0.5" />
        <circle cx="-19" cy="6" r="2.6" fill="#9aa3b8" opacity="0.45" />
      </g>
    );
  }
  if (kind === "mars") {
    return (
      <g className="rl-dest">
        <circle r="46" fill="url(#rl-halo-mars)" />
        <circle r="30" fill="url(#rl-mars)" />
        <path d="M-24 -6 C-14 -12 -4 -4 6 -9 C14 -13 20 -6 26 -8 L27 -2 C18 0 10 -4 2 1 C-8 6 -16 -2 -26 3 Z" fill="#9c3a22" opacity="0.45" />
        <path d="M-16 13 C-8 9 2 15 10 11 C16 8 20 12 22 14 C14 21 -6 23 -16 13 Z" fill="#9c3a22" opacity="0.38" />
        <ellipse cx="0" cy="-26.5" rx="9" ry="3.4" fill="#fff4ee" opacity="0.9" />
      </g>
    );
  }
  if (kind === "earth") {
    return (
      <g className="rl-dest">
        <circle r="46" fill="url(#rl-halo-earth)" />
        <circle r="30" fill="url(#rl-earth)" />
        <path d="M-20 -12 C-12 -20 -2 -18 2 -10 C6 -2 -4 2 -10 0 C-16 -2 -22 -4 -20 -12 Z" fill="#5fbf73" />
        <path d="M6 4 C12 -2 22 0 24 8 C26 16 16 22 10 18 C6 15 2 10 6 4 Z" fill="#5fbf73" />
        <path d="M-26 6 C-16 2 -6 10 4 6" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7" />
        <path d="M-6 -24 C2 -26 10 -22 16 -24" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" fill="none" opacity="0.65" />
      </g>
    );
  }
  return (
    <g className="rl-dest">
      <circle r="50" fill="url(#rl-halo-ringed)" />
      <g transform="rotate(-18)">
        <path d="M-52 0 A52 13 0 0 1 52 0" stroke="#ffe2a1" strokeWidth="5" fill="none" opacity="0.7" />
      </g>
      <circle r="27" fill="url(#rl-ringed)" />
      <path d="M-25 -7 C-12 -3 12 -11 26 -6" stroke="#e48a3d" strokeWidth="3.2" fill="none" opacity="0.55" />
      <path d="M-26 6 C-10 10 10 2 25 7" stroke="#e48a3d" strokeWidth="2.6" fill="none" opacity="0.45" />
      <g transform="rotate(-18)">
        <path d="M-52 0 A52 13 0 0 0 52 0" stroke="#ffe2a1" strokeWidth="5" fill="none" />
      </g>
    </g>
  );
}

const SPEED_LINES = [
  { x: 40, len: 46, d: "0s", t: "0.95s" },
  { x: 66, len: 30, d: "0.45s", t: "1.15s" },
  { x: 28, len: 22, d: "0.8s", t: "1.3s" },
  { x: 200, len: 40, d: "0.2s", t: "1s" },
  { x: 176, len: 28, d: "0.65s", t: "1.2s" },
  { x: 214, len: 20, d: "0.95s", t: "1.35s" },
];

const PUFFS = [
  { dx: "-34px", d: "0s", s: 1 },
  { dx: "30px", d: "0.18s", s: 0.9 },
  { dx: "-12px", d: "0.36s", s: 1.15 },
  { dx: "18px", d: "0.54s", s: 1 },
  { dx: "-40px", d: "0.72s", s: 0.85 },
  { dx: "40px", d: "0.9s", s: 0.95 },
  { dx: "4px", d: "1.08s", s: 1.2 },
];

export default function RocketLoading({ pathname = "" }) {
  const trip = tripFor(pathname);
  return (
    <div className={`rl rl-sky-${trip.sky}`} role="status" aria-live="polite" aria-label={`Loading. ${trip.text}.`}>
      <div className="rl-stars rl-stars-far" aria-hidden="true" />
      <div className="rl-stars rl-stars-mid" aria-hidden="true" />
      <div className="rl-stars rl-stars-near" aria-hidden="true" />

      <div className="rl-stage">
        <svg className="rl-svg" viewBox="0 0 240 360" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="rl-body" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.45" stopColor="#f4eee2" />
              <stop offset="1" stopColor="#d4cab6" />
            </linearGradient>
            <linearGradient id="rl-nose" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#ff8f66" />
              <stop offset="1" stopColor="#e0503a" />
            </linearGradient>
            <linearGradient id="rl-fin" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#ff7c56" />
              <stop offset="1" stopColor="#c8432e" />
            </linearGradient>
            <radialGradient id="rl-glass" cx="0.35" cy="0.32" r="0.8">
              <stop offset="0" stopColor="#8cc2ff" />
              <stop offset="0.55" stopColor="#2c4c8c" />
              <stop offset="1" stopColor="#14224a" />
            </radialGradient>
            <linearGradient id="rl-flame-outer" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#ffb347" />
              <stop offset="0.5" stopColor="#ff6a2b" />
              <stop offset="1" stopColor="#ff4d1f" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="rl-flame-mid" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#fff3b0" />
              <stop offset="0.55" stopColor="#ffc23d" />
              <stop offset="1" stopColor="#ffa52a" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="rl-flame-core" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.6" stopColor="#fff6cf" />
              <stop offset="1" stopColor="#fff0c0" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="rl-glow">
              <stop offset="0" stopColor="#ff9b48" stopOpacity="0.6" />
              <stop offset="1" stopColor="#ff7a2f" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="rl-puff">
              <stop offset="0" stopColor="#f6f8fd" stopOpacity="0.95" />
              <stop offset="0.6" stopColor="#dfe6f2" stopOpacity="0.55" />
              <stop offset="1" stopColor="#c9d4e6" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="rl-moon" cx="0.38" cy="0.35" r="0.75">
              <stop offset="0" stopColor="#f4f6fb" />
              <stop offset="1" stopColor="#aeb6c8" />
            </radialGradient>
            <radialGradient id="rl-mars" cx="0.38" cy="0.35" r="0.75">
              <stop offset="0" stopColor="#ffa274" />
              <stop offset="1" stopColor="#c2462a" />
            </radialGradient>
            <radialGradient id="rl-earth" cx="0.38" cy="0.35" r="0.75">
              <stop offset="0" stopColor="#6fb2ff" />
              <stop offset="1" stopColor="#245fb8" />
            </radialGradient>
            <radialGradient id="rl-ringed" cx="0.38" cy="0.35" r="0.75">
              <stop offset="0" stopColor="#ffe3a0" />
              <stop offset="1" stopColor="#e0913f" />
            </radialGradient>
            <radialGradient id="rl-halo-moon">
              <stop offset="0.55" stopColor="#dfe7ff" stopOpacity="0.28" />
              <stop offset="1" stopColor="#dfe7ff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="rl-halo-mars">
              <stop offset="0.55" stopColor="#ff8a5c" stopOpacity="0.3" />
              <stop offset="1" stopColor="#ff8a5c" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="rl-halo-earth">
              <stop offset="0.55" stopColor="#7fc0ff" stopOpacity="0.32" />
              <stop offset="1" stopColor="#7fc0ff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="rl-halo-ringed">
              <stop offset="0.5" stopColor="#ffd88a" stopOpacity="0.26" />
              <stop offset="1" stopColor="#ffd88a" stopOpacity="0" />
            </radialGradient>
            <clipPath id="rl-hull">
              <path d="M120 78 C141 96 151 128 150 168 C149.5 186 148 203 145 218 Q144 222 140 222 L100 222 Q96 222 95 218 C92 203 90.5 186 90 168 C89 128 99 96 120 78 Z" />
            </clipPath>
          </defs>

          {/* where we are going */}
          <g transform="translate(192 46)">
            <g className="rl-approach">
              <Destination kind={trip.dest} />
            </g>
          </g>

          {/* rushing past */}
          <g className="rl-lines">
            {SPEED_LINES.map((l, i) => (
              <line
                key={i}
                x1={l.x}
                x2={l.x}
                y1={-l.len}
                y2="0"
                style={{ animationDelay: l.d, animationDuration: l.t }}
              />
            ))}
          </g>

          {/* exhaust clouds */}
          <g className="rl-puffs">
            {PUFFS.map((p, i) => (
              <circle
                key={i}
                cx="120"
                cy="270"
                r={13 * p.s}
                fill="url(#rl-puff)"
                style={{ "--dx": p.dx, animationDelay: p.d }}
              />
            ))}
          </g>

          <g className="rl-rise">
            <g className="rl-hover">
              <g className="rl-shake">
                {/* engine glow and flame */}
                <ellipse className="rl-glow" cx="120" cy="252" rx="40" ry="32" fill="url(#rl-glow)" />
                <g className="rl-flame">
                  <path className="rl-flame-outer" d="M120 231 C100 246 101 280 120 322 C139 280 140 246 120 231 Z" fill="url(#rl-flame-outer)" />
                  <path className="rl-flame-mid" d="M120 232 C107 244 108 268 120 297 C132 268 133 244 120 232 Z" fill="url(#rl-flame-mid)" />
                  <path className="rl-flame-core" d="M120 233 C113 241 113 256 120 273 C127 256 127 241 120 233 Z" fill="url(#rl-flame-core)" />
                </g>

                {/* fins behind the body */}
                <path d="M95 176 C80 185 70 204 67 238 C76 231 86 227 97 224 Z" fill="url(#rl-fin)" />
                <path d="M145 176 C160 185 170 204 173 238 C164 231 154 227 143 224 Z" fill="url(#rl-fin)" />

                {/* nozzle */}
                <path d="M104 221 L136 221 L132 233 L108 233 Z" fill="#8a94a6" />
                <ellipse cx="120" cy="233" rx="12" ry="2.6" fill="#4b5363" />

                {/* body */}
                <path d="M120 78 C141 96 151 128 150 168 C149.5 186 148 203 145 218 Q144 222 140 222 L100 222 Q96 222 95 218 C92 203 90.5 186 90 168 C89 128 99 96 120 78 Z" fill="url(#rl-body)" />
                <g clipPath="url(#rl-hull)">
                  <path d="M80 113 Q120 125 160 113 L160 60 L80 60 Z" fill="url(#rl-nose)" />
                  <path d="M80 199 Q120 208 160 199 L160 210 Q120 219 80 210 Z" fill="#f2c14e" />
                </g>
                <path d="M104 106 C98 126 96.5 151 97.5 178" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" fill="none" opacity="0.65" />

                {/* window */}
                <circle cx="120" cy="146" r="17" fill="#e3e9f3" stroke="#b6c1d3" strokeWidth="1.6" />
                <circle cx="120" cy="146" r="12.4" fill="url(#rl-glass)" />
                <path d="M113 140 A8.5 8.5 0 0 1 121.5 135" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" fill="none" opacity="0.9" />
                <circle cx="126" cy="152" r="1.7" fill="#ffffff" opacity="0.6" />

                {/* a gold star painted on the side */}
                <path
                  transform="translate(120 182)"
                  d="M0 -7.5 L2.2 -2.3 L7.6 -2.3 L3.3 1 L4.9 6.6 L0 3.5 L-4.9 6.6 L-3.3 1 L-7.6 -2.3 L-2.2 -2.3 Z"
                  fill="#f2c14e"
                />

                {/* the fin in front */}
                <path d="M116 201 L124 201 L124 238 Q120 243 116 238 Z" fill="#d34d36" />
              </g>
            </g>
          </g>
        </svg>

        <p className="rl-trip">
          {trip.text}
          <span className="rl-dots" aria-hidden="true">
            <i>.</i>
            <i>.</i>
            <i>.</i>
          </span>
        </p>
        <p className="rl-hold">Hold on tight!</p>
      </div>
    </div>
  );
}
