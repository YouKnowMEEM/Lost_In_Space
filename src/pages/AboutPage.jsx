import React from "react";
import { Link } from "react-router-dom";
import { Accessibility, BookOpen, Compass, Gamepad2, GraduationCap, Globe2, ShieldCheck } from "lucide-react";
import Page from "../site/SiteChrome";
import { CATALOG, STATES, withNotes, worldCounts } from "../data/catalog";

const CORRECTIONS = [
  { what: "Opportunity's map position", fix: "It was drawn about 11° east of its real landing place. It now sits at 1.95° S, 354.47° E (5.53° W)." },
  { what: "Lunar Prospector's impact site", fix: "It was plotted on the wrong side of the Moon's south pole. NASA-era references put it at 87.7° S, 42.1° E, inside Shoemaker crater." },
  { what: "Curiosity and Perseverance", fix: "Both were marked as resting machines. They are still working, so the map now shows them as awake." },
  { what: "Story links for Apollo 12 to 17, the Surveyors and the Mars rovers", fix: "These pointed to pages that did not exist. Every machine now opens its own page of field notes." },
];

export default function AboutPage() {
  const c = worldCounts();
  const notes = withNotes().length;
  return (
    <Page
      title="About, sources and accessibility · Sleeping Beauties"
      description="Who Sleeping Beauties is for, how the facts were checked, how it works for everyone, and where every photo, model and sound came from."
      className="ab"
    >
      <section className="ab-hero" aria-labelledby="ab-title">
        <p className="sx-eyebrow">About</p>
        <h1 id="ab-title">Abandoned, but not forgotten</h1>
        <p className="at-lede">
          Sleeping Beauties tells the stories of the machines NASA left behind: landers asleep on the Moon and Mars, rovers that outlived their plans, and probes still flying far beyond the planets. It was made for the NASA Space Apps Challenge 2026, and it is an independent project that NASA has not endorsed.
        </p>
      </section>

      <section className="ab-section" aria-labelledby="who-title">
        <h2 id="who-title">
          <Compass size={26} aria-hidden="true" /> Who it is for
        </h2>
        <p>
          Readers about 9 to 15 years old, and any curious grown-up reading along. Sentences are short, big words are explained, and every page teaches one clear idea. Nothing is scary and nothing needs an account.
        </p>
        <p>
          The central idea is that a machine's <em>engineering</em> and the <em>science</em> it made possible are one story. Viking could look for life because its arm could dig. Pioneer 10 could cross the asteroid belt because its radio was strong enough to hear it. Each field note shows that connection.
        </p>
      </section>

      <section className="ab-section" aria-labelledby="inside-title">
        <h2 id="inside-title">
          <Globe2 size={26} aria-hidden="true" /> What is inside
        </h2>
        <ul className="ab-grid">
          <li>
            <BookOpen size={24} aria-hidden="true" />
            <h3>3 narrated storybooks</h3>
            <p>
              <Link to="/eagle">Eagle</Link>, <Link to="/viking-1">Viking 1</Link> and <Link to="/voyager-1">Voyager 1</Link>, with a read-along voice, a fact on every page and real NASA photographs. Each has a deeper <em>mission file</em> with a 3D model, timeline and gallery.
            </p>
          </li>
          <li>
            <Compass size={24} aria-hidden="true" />
            <h3>
              {notes} field notes
            </h3>
            <p>
              Every other machine in the <Link to="/atlas">Atlas</Link> has its own page: its story in an imagined voice, why it was sent, what it discovered, how the hardware worked, and where it is now.
            </p>
          </li>
          <li>
            <Globe2 size={24} aria-hidden="true" />
            <h3>3 worlds to explore</h3>
            <p>
              Spin <Link to="/moon">the Moon</Link> ({c.moon} sites), <Link to="/mars">Mars</Link> ({c.mars}) and <Link to="/space">deep space</Link> ({c.deep} probes) in 3D. Search, filter and slide through time.
            </p>
          </li>
          <li>
            <Gamepad2 size={24} aria-hidden="true" />
            <h3>2 games</h3>
            <p>
              <Link to="/play">Signal Hunter</Link> on the Moon or Mars, and a riddle game, <Link to="/play#who">Who am I?</Link>, built from the machines' own stories.
            </p>
          </li>
        </ul>
        <p className="ab-small">
          The Atlas lists {CATALOG.length} machines in all. The words you see for status are: {Object.values(STATES).map((s) => s.label.toLowerCase()).join(", ")}.
        </p>
      </section>

      <section id="accuracy" className="ab-section" aria-labelledby="acc-title">
        <h2 id="acc-title">
          <ShieldCheck size={26} aria-hidden="true" /> How we checked the facts
        </h2>
        <ol className="ab-steps">
          <li>
            <strong>Start from NASA's own records.</strong> Dates, places and numbers were checked against NASA's Space Science Data Coordinated Archive, NASA Science mission pages, JPL and the NASA Photojournal.
          </li>
          <li>
            <strong>Say less when sources disagree.</strong> Where reliable references differ, the text says "about" or "more than" instead of choosing a number. Example: Viking's landing longitude is written two ways in NASA's own pages, because Mars longitude can be counted east or west.
          </li>
          <li>
            <strong>Label what is imagined.</strong> The "In its own words" sections give each machine a voice, but every event in them really happened. Feelings are a storyteller's device and are marked that way.
          </li>
          <li>
            <strong>Label what is estimated.</strong> Distances to deep-space probes change every second. They are shown as estimates for late 2026, with the signal travel time that follows from them. Voyager 1's one-light-day milestone is due on 18 November 2026.
          </li>
          <li>
            <strong>Fix mistakes in the open.</strong> Checking this project's own data turned up the errors below. They are fixed, and we list them here.
          </li>
        </ol>
        <h3 className="ab-h3">Corrections made while checking</h3>
        <ul className="ab-fixes">
          {CORRECTIONS.map((f) => (
            <li key={f.what}>
              <strong>{f.what}.</strong> {f.fix}
            </li>
          ))}
        </ul>
        <p className="ab-small">
          This site was last reviewed against NASA sources in November 2026. Missions change: Perseverance passed Opportunity's off-world driving record on 11 October 2026, and Voyager 1 lost another instrument in April 2026. Each page links to its NASA sources so you can check for yourself.
        </p>
      </section>

      <section id="access" className="ab-section" aria-labelledby="access-title">
        <h2 id="access-title">
          <Accessibility size={26} aria-hidden="true" /> Made to work for everyone
        </h2>
        <ul className="ab-list">
          <li>Reading uses Atkinson Hyperlegible Next, a typeface designed by the Braille Institute for maximum legibility.</li>
          <li>Every storybook page is read aloud, with the words highlighted. Field notes have a read-aloud button that uses your device's own voice.</li>
          <li>Everything works with a keyboard. A "Skip to the content" link is the first thing a screen reader finds, and focus is always visible.</li>
          <li>Each picture has a text description, and status is always written as a word, never only as a colour.</li>
          <li>Motion is calmer if your device is set to reduce motion.</li>
          <li>The 3D maps also offer a text search and lists of every machine.</li>
          <li>Nothing flashes, nothing plays sound unless you press play, and there are no accounts, ads or trackers.</li>
        </ul>
      </section>

      <section id="teachers" className="ab-section" aria-labelledby="teach-title">
        <h2 id="teach-title">
          <GraduationCap size={26} aria-hidden="true" /> For teachers and families
        </h2>
        <ul className="ab-list">
          <li><strong>Radio delay.</strong> A signal travels one astronomical unit in about 8.3 minutes. Using the distances in the Atlas, work out how long a message to each deep-space probe takes.</li>
          <li><strong>Engineering to science.</strong> Choose a machine and draw the link between one part (a drill, a laser, a seismometer) and one discovery it allowed.</li>
          <li><strong>Letter from a machine.</strong> After reading a field note, write a letter from the machine's point of view that uses only facts from its page.</li>
          <li><strong>Moon or Mars?</strong> Compare a Surveyor and a Viking. Why did a lander on Mars need a very different power source?</li>
          <li><strong>Spot the update.</strong> Missions change. Find something on a page that has changed since it was written, and check NASA for the newest news.</li>
        </ul>
      </section>

      <section id="credits" className="ab-section" aria-labelledby="credits-title">
        <h2 id="credits-title">Credits and licences</h2>
        <dl className="ab-credits">
          <div>
            <dt>Photographs and video</dt>
            <dd>
              <a href="https://images.nasa.gov/" target="_blank" rel="noreferrer">NASA Image and Video Library</a>. NASA media are generally not copyrighted. NASA does not endorse this project. Photos load from NASA's servers when you view them.
            </dd>
          </div>
          <div>
            <dt>3D models</dt>
            <dd>
              <a href="https://github.com/nasa/NASA-3D-Resources" target="_blank" rel="noreferrer">NASA 3D Resources</a>.
            </dd>
          </div>
          <div>
            <dt>Moon and Mars surface maps</dt>
            <dd>
              <a href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noreferrer">Solar System Scope</a> (CC BY 4.0).
            </dd>
          </div>
          <div>
            <dt>Narration</dt>
            <dd>
              <a href="https://huggingface.co/hexgrad/Kokoro-82M" target="_blank" rel="noreferrer">Kokoro-82M</a> (Apache 2.0), run locally to make the audio files.
            </dd>
          </div>
          <div>
            <dt>Music</dt>
            <dd>Original lullabies, synthesized for this project. No samples.</dd>
          </div>
          <div>
            <dt>Illustrations</dt>
            <dd>Storybook scenes and the machine portraits in the Atlas were drawn for this project.</dd>
          </div>
          <div>
            <dt>Typefaces</dt>
            <dd>Jost, Atkinson Hyperlegible Next, Fraunces and Literata, under the SIL Open Font License.</dd>
          </div>
          <div>
            <dt>Software</dt>
            <dd>React, Vite, three.js and React Three Fiber, and Lucide icons, all open source.</dd>
          </div>
        </dl>
        <p className="ab-small">
          Honest limits: the 3D maps need a browser with WebGL, photographs need an internet connection, and read-aloud voices differ from device to device.
        </p>
      </section>
    </Page>
  );
}
