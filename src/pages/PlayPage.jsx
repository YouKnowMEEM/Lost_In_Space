import React from "react";
import { Link } from "react-router-dom";
import { Radio } from "lucide-react";
import Page from "../site/SiteChrome";
import WhoAmI from "../site/WhoAmI";

export default function PlayPage() {
  return (
    <Page
      title="Play: games about the machines NASA left behind · Sleeping Beauties"
      description="Hunt for a hidden spacecraft with radio pings, or guess which machine is speaking in a riddle."
      className="pl"
    >
      <section className="pl-hero" aria-labelledby="pl-title">
        <p className="sx-eyebrow">Play</p>
        <h1 id="pl-title">Learn by playing</h1>
        <p className="at-lede">Two games, both built from real missions. Every answer opens the story of a real machine.</p>
      </section>

      <section className="pl-section" aria-labelledby="sh-title">
        <div className="pl-card pl-signal">
          <div className="pl-card-icon" aria-hidden="true">
            <Radio size={34} />
          </div>
          <div className="pl-card-copy">
            <h2 id="sh-title">Signal Hunter</h2>
            <p>
              A machine has gone quiet somewhere on the surface. Spin the globe and send radio pings. The colder the signal, the farther away you are. Find five machines to finish a round.
            </p>
            <div className="pl-card-actions">
              <Link className="hp-btn hp-btn-primary" to="/moon?game=signal-hunter">
                Hunt on the Moon
              </Link>
              <Link className="hp-btn hp-btn-mars" to="/mars?game=signal-hunter">
                Hunt on Mars
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="who" className="pl-section" aria-labelledby="who-title">
        <div className="pl-head">
          <h2 id="who-title">Who am I?</h2>
          <p>A machine speaks in a riddle. Can you tell which one it is? Eight riddles each time, in a new order.</p>
        </div>
        <WhoAmI />
      </section>
    </Page>
  );
}
