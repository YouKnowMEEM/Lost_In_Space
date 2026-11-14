import React, { useEffect, useMemo, useRef } from "react";
import { ArrowRight, Rocket, X } from "lucide-react";
import { ORDER } from "../storybook/library";
import "./journeyLanding.css";

/** A fixed, seeded star field so the sky looks the same on every visit. */
function starLayer(count, seed, maxSize) {
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  const shadows = [];
  for (let i = 0; i < count; i += 1) {
    const x = (rand() * 100).toFixed(2);
    const y = (rand() * 200).toFixed(2); // two screens tall, so the layer can drift upwards and loop
    const tint = rand() > 0.82 ? "255, 214, 170" : rand() > 0.6 ? "196, 214, 255" : "255, 255, 255";
    const alpha = (0.35 + rand() * 0.65).toFixed(2);
    const size = rand() * maxSize;
    shadows.push(`${x}vw ${y}vh 0 ${size.toFixed(1)}px rgba(${tint}, ${alpha})`);
  }
  return shadows.join(",");
}

const ORBITERS = [
  { src: "/images/objects/voyager.webp", angle: 0, label: "Voyager" },
  { src: "/images/objects/viking.webp", angle: 120, label: "Viking 1" },
  { src: "/images/objects/eagle.webp", angle: 240, label: "Eagle" },
];

/**
 * The first screen a new visitor sees: a cinematic invitation to start the guided journey.
 * `onStart` begins the journey (intro video), `onSkip` closes it and leaves the visitor on the home page.
 */
export default function JourneyLanding({ onStart, onSkip }) {
  const startRef = useRef(null);
  const stars = useMemo(() => [starLayer(170, 11, 0.6), starLayer(70, 23, 1.1), starLayer(26, 47, 1.7)], []);

  useEffect(() => {
    startRef.current?.focus({ preventScroll: true });
    const onKey = (event) => {
      if (event.key === "Escape") onSkip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSkip]);

  return (
    <div className="jl" role="dialog" aria-modal="true" aria-labelledby="jl-title" aria-describedby="jl-lede">
      <div className="jl-sky" aria-hidden="true">
        <i className="jl-nebula jl-nebula-a" />
        <i className="jl-nebula jl-nebula-b" />
        <i className="jl-nebula jl-nebula-c" />
        {stars.map((shadow, i) => (
          <span key={i} className={`jl-stars jl-stars-${i + 1}`} style={{ boxShadow: shadow }} />
        ))}
        <i className="jl-shooting jl-shooting-a" />
        <i className="jl-shooting jl-shooting-b" />
      </div>

      <div className="jl-system" aria-hidden="true">
        <div className="jl-world">
          <span className="jl-planet">
            <i className="jl-planet-map" />
            <i className="jl-planet-shade" />
          </span>
          <div className="jl-orbit">
            {ORBITERS.map((o) => (
              <span key={o.label} className="jl-slot" style={{ "--th": `${o.angle}deg` }}>
                <img className="jl-sat" src={o.src} alt="" decoding="async" style={{ "--th": `${o.angle}deg` }} />
              </span>
            ))}
          </div>
        </div>
        <span className="jl-moon">
          <i className="jl-moon-map" />
        </span>
        <img className="jl-astronaut" src="/images/happyAstronaut.png" alt="" decoding="async" />
      </div>

      <button type="button" className="jl-close" onClick={onSkip} aria-label="Close and explore on my own" title="Close">
        <X size={16} aria-hidden="true" />
      </button>

      <main className="jl-copy">
        <p className="jl-kicker">
          <span className="jl-kicker-dot" aria-hidden="true" />
          NASA Space Apps Challenge 2026
        </p>
        <h1 id="jl-title" className="jl-title">
          <span>Sleeping</span>
          <span>Beauties</span>
        </h1>
        <p className="jl-tagline">Abandoned, but not forgotten.</p>
        <p id="jl-lede" className="jl-lede">
          Some spacecraft finished their work and simply stayed where they stopped: on the Moon, on Mars and far out
          among the stars. Come and find them with me!
        </p>
        <div className="jl-actions">
          <button ref={startRef} type="button" className="jl-start" onClick={onStart}>
            <span className="jl-start-icon" aria-hidden="true">
              <Rocket size={20} />
            </span>
            Start the Journey!
          </button>
          <button type="button" className="jl-own" onClick={onSkip}>
            Explore on my own <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
        <ul className="jl-facts" aria-label="What is inside">
          <li><b>3</b> worlds</li>
          <li><b>{3 + ORDER.length}</b> storybooks</li>
          <li><b>3D</b> maps</li>
        </ul>
      </main>

      <p className="jl-team">
        Made with <span aria-label="love">♥</span> by Team <strong>Lost_In_Space</strong>
      </p>
    </div>
  );
}
