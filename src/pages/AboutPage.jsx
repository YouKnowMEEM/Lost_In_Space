import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Accessibility,
  BookOpen,
  Check,
  Compass,
  Copy,
  ExternalLink,
  FileText,
  Gamepad2,
  Globe2,
  GraduationCap,
  Library,
  Mail,
  Map as MapIcon,
  Orbit,
  Quote,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Page from "../site/SiteChrome";
import { CATALOG, NSSDC_URL, STATES, WORLDS, mapCounts } from "../data/catalog";
import { BOOK_SOURCES } from "../data/citations";
import { BOOKS, ORDER, storyPath } from "../storybook/library";
import { eagleMission } from "../data/missions/eagle";
import { vikingMission } from "../data/missions/viking";
import { voyagerMission } from "../data/missions/voyager";
import { PHOTOS as HOME_PHOTOS } from "../home/homeData";

const TEAM_EMAIL = "team.lostinspace.6@gmail.com";
const NSSDC = (id) => `https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=${id}`;

// NASA's resource list for the "Abandoned but not forgotten" challenge, and where each one lives on this site.
const RESOURCES = [
  { name: "Apollo Lunar Modules", where: "Moon", source: NSSDC("1969-059C"), ours: [["Eagle storybook", "/eagle"], ["Intrepid", "/object/apollo-12"], ["Antares", "/object/apollo-14"], ["Falcon", "/object/apollo-15"], ["Orion", "/object/apollo-16"], ["Challenger", "/object/apollo-17"]] },
  { name: "Lunar Roving Vehicles", where: "Moon", source: NSSDC("1971-063C"), ours: [["Three Moon Buggies", storyPath("lunar-rovers")]] },
  { name: "Apollo Lunar Surface Experiments Packages (ALSEP)", where: "Moon", source: NSSDC("1969-099C"), ours: [["The Listening Stations", storyPath("alsep")]] },
  { name: "Surveyor landers", where: "Moon", source: "https://science.nasa.gov/mission/surveyor-3/", ours: [["Surveyor", storyPath("surveyor")]] },
  { name: "Mars Pathfinder and Sojourner", where: "Mars", source: "https://science.nasa.gov/mission/mars-pathfinder/", ours: [["Sojourner", storyPath("sojourner")]] },
  { name: "Spirit and Opportunity", where: "Mars", source: "https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/", ours: [["Spirit & Opportunity", storyPath("spirit-and-opportunity")]] },
  { name: "Viking 1 and 2", where: "Mars", source: "https://science.nasa.gov/mission/viking-1/", ours: [["Viking 1 storybook", "/viking-1"], ["Viking 2", "/object/viking-2"]] },
  { name: "Phoenix and InSight", where: "Mars", source: "https://science.nasa.gov/mission/insight/", ours: [["Phoenix & InSight", storyPath("phoenix-and-insight")]] },
  { name: "Ingenuity Mars Helicopter", where: "Mars", source: "https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/", ours: [["Ingenuity", storyPath("ingenuity")]] },
  { name: "Dawn, in orbit around Ceres", where: "Deep space", source: "https://science.nasa.gov/mission/dawn/", ours: [["Dawn", storyPath("dawn")]] },
  { name: "NEAR Shoemaker, on asteroid 433 Eros", where: "Deep space", source: "https://science.nasa.gov/mission/near-shoemaker/", ours: [["NEAR Shoemaker", storyPath("near-shoemaker")]] },
  { name: "Pioneer 10 and 11", where: "Deep space", source: "https://science.nasa.gov/mission/pioneer-10/", ours: [["Pioneer 10 & 11", storyPath("pioneers")]] },
  { name: "Kepler, trailing the Earth", where: "Deep space", source: "https://science.nasa.gov/mission/kepler/", ours: [["Kepler", storyPath("kepler")]] },
];

// Every storybook, with the page it lives on.
const SHELF = [
  { slug: "eagle", title: "Eagle", path: "/eagle", world: "moon" },
  { slug: "viking", title: "Viking 1", path: "/viking-1", world: "mars" },
  { slug: "voyager", title: "Voyager 1", path: "/voyager-1", world: "deep" },
  ...ORDER.map((slug) => ({ slug, title: BOOKS[slug].title, path: storyPath(slug), world: BOOKS[slug].world })),
];

const MISSIONS = [
  { title: "Eagle", path: "/eagle/mission", world: "moon", sources: eagleMission.sources },
  { title: "Viking 1", path: "/viking-1/mission", world: "mars", sources: vikingMission.sources },
  { title: "Voyager 1", path: "/voyager-1/mission", world: "deep", sources: voyagerMission.sources },
];

const CORRECTIONS = [
  { what: "Opportunity's map position", fix: "It was drawn about 11° east of its real landing place. It now sits at 1.95° S, 354.47° E (5.53° W)." },
  { what: "Lunar Prospector's impact site", fix: "It was plotted on the wrong side of the Moon's south pole. NASA-era references put it at 87.7° S, 42.1° E, inside Shoemaker crater." },
  { what: "Curiosity and Perseverance", fix: "Both were marked as resting machines. They are still working, so the map now shows them as awake." },
  { what: "Story links for Apollo 12 to 17, the Surveyors and the Mars rovers", fix: "These pointed to pages that did not exist. Every machine now opens its own page of field notes." },
];

const JUMP = [
  ["guide", "How to explore"],
  ["who", "Who it is for"],
  ["accuracy", "How we check facts"],
  ["sources", "All citations"],
  ["access", "Accessibility"],
  ["teachers", "For teachers"],
  ["contact", "Contact us"],
];

/** Which section of the page is being read, so the jump bar can show where you are. */
function useCurrentSection(ids) {
  const [current, setCurrent] = useState(null);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;
    const seen = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting ? e.boundingClientRect.top : null));
        const visible = ids.filter((id) => seen.get(id) != null);
        if (visible.length) setCurrent(visible[0]);
        else if ((document.getElementById(ids[0])?.getBoundingClientRect().top ?? 0) > window.innerHeight * 0.45) setCurrent(null);
      },
      { rootMargin: "-30% 0px -55% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids]);
  return current;
}
const JUMP_IDS = JUMP.map(([id]) => id);

const SHORT_PUBLISHER = { "NASA Space Science Data Coordinated Archive": "NASA NSSDCA" };

/** “a”, “b” and “c” (or “a”, “b” or “c”) */
const listOf = (items, word = "and") => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} ${word} ${items[items.length - 1]}`);
const NUMBER_WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const inWords = (n) => NUMBER_WORDS[n] || String(n);

/** The address on screen, a mail link and a copy button, so nobody has to type it. */
function EmailCard() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(TEAM_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard blocked: the address is on screen to copy by hand */
    }
  };
  return (
    <div className="ab-mail">
      <Mail size={30} aria-hidden="true" />
      <div>
        <a className="ab-mail-address" href={`mailto:${TEAM_EMAIL}?subject=${encodeURIComponent("Sleeping Beauties: a suggestion")}`}>
          {TEAM_EMAIL}
        </a>
        <p>Suggestions, corrections, questions and kind words are all welcome. We read every message.</p>
      </div>
      <div className="ab-mail-actions">
        <a className="hp-btn hp-btn-primary" href={`mailto:${TEAM_EMAIL}?subject=${encodeURIComponent("Sleeping Beauties: a suggestion")}`}>
          <Mail size={18} aria-hidden="true" /> Write to us
        </a>
        <button type="button" className="hp-btn hp-btn-quiet" onClick={copy}>
          {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />} {copied ? "Copied!" : "Copy address"}
        </button>
      </div>
      <span className="ab-sr" role="status" aria-live="polite">
        {copied ? "Email address copied" : ""}
      </span>
    </div>
  );
}

function SourceLink({ src }) {
  return (
    <>
      <a href={src.url} target="_blank" rel="noreferrer">
        {src.title}
      </a>
      <span className="ab-cite-pub">{SHORT_PUBLISHER[src.publisher] || src.publisher}</span>
    </>
  );
}

const GUIDE = [
  {
    icon: Sparkles,
    title: "Take the guided journey",
    text: "New here? Press “Tutorial” at the top of the home page. A short film starts the trip, and then a friendly astronaut shows you around: the solar system, the red planet Mars, Viking 1's storybook and its mission file.",
    links: [["Go to the home page", "/"]],
  },
  {
    icon: Orbit,
    title: "Fly through deep space",
    text: "Watch the Sun and the planets move. Scroll or pinch to zoom in and out, and drag to turn the view. Search for a planet or a probe, tap Mars or the Moon, then press “Explore” to fly down to it.",
    links: [["Deep space", "/space"]],
  },
  {
    icon: Globe2,
    title: "Spin the Moon and Mars",
    text: "Every machine is a light on the globe. Golden lights with a little book have a storybook. Open “Objects” in the menu to see every storybook on that world, or type a name into the search bar.",
    links: [["The Moon", "/moon"], ["Mars", "/mars"]],
  },
  {
    icon: BookOpen,
    title: "Read the storybooks",
    text: "Fourteen picture books: one for every group of machines on NASA's list, plus Voyager 1. Press “Read it to me” and each word lights up as it is spoken. Open “Chapters” to jump to any page. Eagle and Viking 1 also have our animated film: look for “Watch the film”.",
    links: [["All storybooks", { pathname: "/", hash: "#storybooks" }]],
  },
  {
    icon: FileText,
    title: "Open a mission file",
    text: "Eagle, Viking 1 and Voyager 1 each have a full mission file: a timeline, a real NASA 3D model you can turn, the landing site, photographs, videos and every source. The other books link to their machine's field notes.",
    links: [["Eagle", "/eagle/mission"], ["Viking 1", "/viking-1/mission"], ["Voyager 1", "/voyager-1/mission"]],
  },
  {
    icon: Library,
    title: "Browse the Cosmic Library",
    text: "Every machine on one timeline. Filter by world or by status, search by name, and open any machine's field notes: its story, what it discovered, how it worked and where it is now.",
    links: [["Cosmic Library", "/library"]],
  },
  {
    icon: Gamepad2,
    title: "Play and test yourself",
    text: "Send radio pings to find a lost lander on the Moon or Mars, or guess which machine is speaking in “Who am I?”",
    links: [["Play", "/play"]],
  },
];

export default function AboutPage() {
  const c = mapCounts();
  const current = useCurrentSection(JUMP_IDS);
  const jumpRef = useRef(null);
  // On a narrow screen the bar scrolls sideways: keep the highlighted section in view.
  useEffect(() => {
    const bar = jumpRef.current;
    const link = current && bar?.querySelector(`a[href="#${current}"]`);
    if (!link || bar.scrollWidth <= bar.clientWidth) return;
    bar.scrollTo({ left: link.offsetLeft - (bar.clientWidth - link.offsetWidth) / 2, behavior: "smooth" });
  }, [current]);
  const books = SHELF.length;
  const bookSourceCount = SHELF.reduce((n, b) => n + (BOOK_SOURCES[b.slug]?.length || 0), 0);
  const machines = [...CATALOG].sort((a, b) => ["moon", "mars", "deep"].indexOf(a.world) - ["moon", "mars", "deep"].indexOf(b.world) || a.year - b.year || a.name.localeCompare(b.name));

  return (
    <Page
      title="About Sleeping Beauties: how to explore, and every source · Sleeping Beauties"
      description="What Sleeping Beauties is, how to explore it, how every fact was checked, the full list of citations, and how to contact Team Lost_In_Space."
      className="ab"
    >
      {/* ------------------------------------------------ hero */}
      <section className="ab-hero" aria-labelledby="ab-title">
        <p className="sx-eyebrow">About this website</p>
        <h1 id="ab-title">Abandoned, but not forgotten</h1>
        <p className="at-lede">
          Sleeping Beauties is a free, interactive museum of the machines NASA left behind: landers asleep on the Moon and Mars, rovers that outlived their plans, and probes still sailing beyond the planets. Fly through the solar system, spin the Moon and Mars, listen to storybooks, and explore the real science behind every machine.
        </p>
        <dl className="ab-stats">
          <div>
            <dt>machines to meet</dt>
            <dd>{CATALOG.length}</dd>
          </div>
          <div>
            <dt>storybooks</dt>
            <dd>{books}</dd>
          </div>
          <div>
            <dt>worlds in 3D</dt>
            <dd>3</dd>
          </div>
          <div>
            <dt>sources cited</dt>
            <dd>{bookSourceCount}+</dd>
          </div>
        </dl>
        <p className="ab-team">
          Made by <strong>Team Lost_In_Space</strong> for the{" "}
          <a href="https://www.spaceappschallenge.org/" target="_blank" rel="noreferrer">
            NASA Space Apps Challenge 2026
          </a>{" "}
          (challenge: “Abandoned but not forgotten: NASA's discarded equipment storytelling”). An independent project: NASA has not endorsed it.
        </p>
        <div className="ab-hero-actions">
          <Link className="hp-btn hp-btn-primary" to="/space">
            <Compass size={19} aria-hidden="true" /> Start exploring
          </Link>
          <a className="hp-btn hp-btn-quiet" href="#contact">
            <Mail size={18} aria-hidden="true" /> Send a suggestion
          </a>
        </div>
      </section>

      <nav className="ab-jump" aria-label="On this page" ref={jumpRef}>
        {JUMP.map(([id, label]) => (
          <a key={id} href={`#${id}`} aria-current={current === id ? "location" : undefined}>
            {label}
          </a>
        ))}
      </nav>

      {/* ------------------------------------------------ guide */}
      <section id="guide" className="ab-section" aria-labelledby="guide-title">
        <h2 id="guide-title">
          <MapIcon size={26} aria-hidden="true" /> How to explore
        </h2>
        <p>Seven ways in. Start anywhere: everything links to everything else.</p>
        <ol className="ab-guide">
          {GUIDE.map(({ icon: Icon, title, text, links }, i) => (
            <li key={title}>
              <span className="ab-guide-n" aria-hidden="true">
                {i + 1}
              </span>
              <Icon size={26} aria-hidden="true" className="ab-guide-icon" />
              <h3>{title}</h3>
              <p>{text}</p>
              <p className="ab-guide-links">
                {links.map(([label, to]) => (
                  <Link key={label} to={to}>
                    {label} →
                  </Link>
                ))}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ------------------------------------------------ who */}
      <section id="who" className="ab-section" aria-labelledby="who-title">
        <h2 id="who-title">
          <Compass size={26} aria-hidden="true" /> Who it is for
        </h2>
        <p>
          Readers about 9 to 15 years old, and every curious grown-up reading along. Sentences are short, big words are explained, and each page teaches one clear idea. Nothing is scary, and you never need an account.
        </p>
        <p>
          The big idea is that a machine's <em>engineering</em> and the <em>science</em> it made possible are one story. Viking could search for life because its arm could dig. Pioneer 10 could cross the asteroid belt because Earth could still hear its radio. Every storybook and field note shows that link.
        </p>
      </section>

      {/* ------------------------------------------------ accuracy */}
      <section id="accuracy" className="ab-section" aria-labelledby="acc-title">
        <h2 id="acc-title">
          <ShieldCheck size={26} aria-hidden="true" /> How we check the facts
        </h2>
        <ol className="ab-steps">
          <li>
            <strong>Start from NASA's own records.</strong> Dates, places and numbers come from NASA Science mission pages, NASA's Space Science Data Coordinated Archive (NSSDCA), NASA's Jet Propulsion Laboratory, NASA History and the NASA Photojournal.
          </li>
          <li>
            <strong>Show the source next to the fact.</strong> Every storybook page lists the sources for its facts, the chapters panel lists the whole book's sources, every field-notes page and mission file ends with its sources, and every planet on the solar-system page links to NASA Science. All of them are collected below.
          </li>
          <li>
            <strong>Say less when sources disagree.</strong> Where reliable references differ, the text says “about” or “more than” instead of picking one number.
          </li>
          <li>
            <strong>Label what is imagined.</strong> The machines speak in the storybooks, and their feelings are a storyteller's device. Every event in the stories really happened.
          </li>
          <li>
            <strong>Label what is estimated.</strong> Deep-space probes move every second, so their distances are estimates for late 2026.
          </li>
          <li>
            <strong>Fix mistakes in the open.</strong> Checking turned up the errors below. They are fixed, and we list them here.
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
          Last checked against NASA sources in November 2026. Missions keep changing: Perseverance passed Opportunity's off-world driving record on 11 October 2026, and Voyager 1 switched off another instrument in April 2026.
        </p>
      </section>

      {/* ------------------------------------------------ citations */}
      <section id="sources" className="ab-section ab-cites" aria-labelledby="sources-title">
        <h2 id="sources-title">
          <Quote size={26} aria-hidden="true" /> All citations
        </h2>
        <p>
          Every fact, picture, sound and model on this website comes from the sources below, grouped by where you meet them. Each link opens the original page.
        </p>
        <nav className="ab-cite-jump" aria-label="Groups of citations">
          <a href="#cite-challenge">1. NASA's challenge resources</a>
          <a href="#cite-books">2. Storybooks</a>
          <a href="#cite-missions">3. Mission files</a>
          <a href="#cite-machines">4. Every machine</a>
          <a href="#cite-worlds">5. The 3D worlds</a>
          <a href="#credits">6. Media, type and code</a>
        </nav>

        <h3 id="cite-challenge" className="ab-cite-h">1. NASA's resource list for this challenge</h3>
        <p className="ab-cite-intro">NASA's Space Apps team listed thirteen groups of machines. Every one of them has a home on this website.</p>
        <ol className="ab-resources">
          {RESOURCES.map((r) => (
            <li key={r.name}>
              <span className="ab-res-where">{r.where}</span>
              <strong>{r.name}</strong>
              <span className="ab-res-links">
                <a href={r.source} target="_blank" rel="noreferrer">
                  NASA source <ExternalLink size={13} aria-hidden="true" />
                </a>
                <span aria-hidden="true"> · </span>
                <span className="ab-res-ours">
                  On this site:{" "}
                  {r.ours.map(([label, to], i) => (
                    <React.Fragment key={to}>
                      {i > 0 && ", "}
                      <Link to={to}>{label}</Link>
                    </React.Fragment>
                  ))}
                </span>
              </span>
            </li>
          ))}
        </ol>

        <h3 id="cite-books" className="ab-cite-h">2. Storybooks</h3>
        <p className="ab-cite-intro">
          Each book's sources, in the order they are first used. Inside a book, every page names the sources for its own facts. Photographs inside the books come from the NASA Image and Video Library, and each one shows its NASA number when you open it.
        </p>
        <div className="ab-cite-books">
          {SHELF.map((b) => (
            <article key={b.slug} className={`ab-cite-book is-${b.world}`} aria-labelledby={`cite-${b.slug}`}>
              <h4 id={`cite-${b.slug}`}>
                <Link to={b.path}>{b.title}</Link>
                <span>{WORLDS[b.world].short}</span>
              </h4>
              <ol>
                {(BOOK_SOURCES[b.slug] || []).map((src) => (
                  <li key={src.id}>
                    <SourceLink src={src} />
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>

        <h3 id="cite-missions" className="ab-cite-h">3. Mission files</h3>
        <div className="ab-cite-books">
          {MISSIONS.map((m) => (
            <article key={m.title} className={`ab-cite-book is-${m.world}`} aria-labelledby={`cite-mf-${m.title}`}>
              <h4 id={`cite-mf-${m.title}`}>
                <Link to={m.path}>{m.title} mission file</Link>
              </h4>
              <ol>
                {m.sources.map((src) => (
                  <li key={src.url + src.title}>
                    <SourceLink src={src} />
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>

        <h3 id="cite-machines" className="ab-cite-h">4. Every machine: data records, NASA pages and photographs</h3>
        <p className="ab-cite-intro">
          The maps, the field notes, the Cosmic Library and the games are built from these records. Positions on the Moon and Mars come from NASA's records of each landing or impact site.
        </p>
        <div className="ab-table-wrap" role="region" aria-label="Sources for every machine" tabIndex={0}>
          <table className="ab-table">
            <thead>
              <tr>
                <th scope="col">Machine</th>
                <th scope="col">NASA data record</th>
                <th scope="col">NASA page</th>
                <th scope="col">Photograph</th>
              </tr>
            </thead>
            <tbody>
              {machines.map((m) => {
                const photo = m.photo;
                const photoUrl = photo ? [].concat(photo.src)[0] : null;
                return (
                  <tr key={m.id}>
                    <th scope="row">
                      <Link to={m.hasMissionFile ? m.route : `/object/${m.id}`}>{m.short}</Link>
                      <small>{WORLDS[m.world].short}</small>
                    </th>
                    <td>
                      {m.nssdc ? (
                        <a href={NSSDC_URL(m.nssdc)} target="_blank" rel="noreferrer">
                          NSSDCA {m.nssdc}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      {m.nasaUrl ? (
                        <>
                          <a href={m.nasaUrl} target="_blank" rel="noreferrer">
                            {m.nasaUrl.includes("apollo_lrv") ? "Apollo Lunar Roving Vehicle" : m.nasaUrl.includes("/alsj") ? "Apollo Lunar Surface Journal" : "Mission page"}
                          </a>
                          <small className="ab-host">{new URL(m.nasaUrl).hostname.replace("www.", "")}</small>
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      {photoUrl ? (
                        <a href={photoUrl} target="_blank" rel="noreferrer">
                          {photo.credit}
                        </a>
                      ) : (
                        <span className="ab-muted">Drawing made for this website</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="ab-small">
          Each machine's status is one of {listOf(Object.values(STATES).map((s) => `“${s.label.toLowerCase()}”`), "or")}. The globes show {c.moon} machines on the Moon and {c.mars} on Mars. The Cosmic Library also lists the three Moon buggies, the listening stations and the {inWords(CATALOG.filter((m) => m.world === "deep").length)} deep-space explorers.
        </p>

        <h4 className="ab-cite-sub">Photographs on the home page</h4>
        <ol className="ab-cite-list">
          {HOME_PHOTOS.map((p) => (
            <li key={p.nasa}>
              <a href={`https://images.nasa.gov/details/${p.nasa}`} target="_blank" rel="noreferrer">
                {p.title}
              </a>
              <span className="ab-cite-pub">NASA Image and Video Library · {p.nasa.toUpperCase()}</span>
            </li>
          ))}
        </ol>

        <h3 id="cite-worlds" className="ab-cite-h">5. The 3D worlds</h3>
        <ol className="ab-cite-list">
          <li>
            <a href="https://nssdc.gsfc.nasa.gov/planetary/factsheet/" target="_blank" rel="noreferrer">
              Planetary Fact Sheets
            </a>
            <span className="ab-cite-pub">NASA NSSDCA · orbits, periods and tilts of the planets and Pluto on the solar-system page</span>
          </li>
          <li>
            <a href="https://science.nasa.gov/solar-system/" target="_blank" rel="noreferrer">
              Our Solar System
            </a>
            <span className="ab-cite-pub">NASA Science · the short facts about the Sun, each planet and Pluto (each pop-up links to its own page)</span>
          </li>
          <li>
            <a href="https://eyes.nasa.gov/apps/solar-system/" target="_blank" rel="noreferrer">
              NASA's Eyes on the Solar System
            </a>
            <span className="ab-cite-pub">NASA JPL · a true-scale view; our solar system is not drawn to scale</span>
          </li>
          <li>
            <a href="https://github.com/nasa/NASA-3D-Resources" target="_blank" rel="noreferrer">
              NASA 3D Resources
            </a>
            <span className="ab-cite-pub">NASA · 3D models of the Apollo Lunar Module, the Viking lander and Voyager, and the pictures of the machines on the home page</span>
          </li>
          <li>
            <a href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noreferrer">
              Solar System Scope textures
            </a>
            <span className="ab-cite-pub">Solar System Scope · surfaces of the Moon, Mars and the planets, CC BY 4.0</span>
          </li>
          <li>
            <a href="https://nssdc.gsfc.nasa.gov/" target="_blank" rel="noreferrer">
              NASA Space Science Data Coordinated Archive
            </a>
            <span className="ab-cite-pub">NASA · landing and impact coordinates for the markers on the Moon and Mars (see the table above)</span>
          </li>
        </ol>

        {/* ---------------------------------------------- credits */}
        <div id="credits" className="ab-cite-group">
        <h3 id="credits-title" className="ab-cite-h">6. Media, type and code</h3>
        <dl className="ab-credits">
          <div>
            <dt>Photographs and videos</dt>
            <dd>
              <a href="https://images.nasa.gov/" target="_blank" rel="noreferrer">NASA Image and Video Library</a>,{" "}
              <a href="https://nssdc.gsfc.nasa.gov/photo_gallery/" target="_blank" rel="noreferrer">NSSDCA Photo Gallery</a> and{" "}
              <a href="https://science.nasa.gov/" target="_blank" rel="noreferrer">NASA Science</a>. NASA media are generally not copyrighted (see{" "}
              <a href="https://www.nasa.gov/nasa-brand-center/images-and-media/" target="_blank" rel="noreferrer">NASA's media usage guidelines</a>). Photos load from NASA's servers when you view them.
            </dd>
          </div>
          <div>
            <dt>Our films</dt>
            <dd>The opening film of the guided journey and the Eagle and Viking 1 animations were made by Team Lost_In_Space, following NASA's mission timelines.</dd>
          </div>
          <div>
            <dt>Narration</dt>
            <dd>
              <a href="https://huggingface.co/hexgrad/Kokoro-82M" target="_blank" rel="noreferrer">Kokoro-82M</a> (Apache 2.0), run on our own computer, made the recorded voice of Eagle, Viking 1 and Voyager 1. The other books are read by the speech voice built into your browser.
            </dd>
          </div>
          <div>
            <dt>Music</dt>
            <dd>Three original lullabies (Moon, Mars and deep space), synthesized for this website. No samples.</dd>
          </div>
          <div>
            <dt>Illustrations</dt>
            <dd>The storybook pictures, their covers and the drawn machine portraits were made for this website.</dd>
          </div>
          <div>
            <dt>Typefaces</dt>
            <dd>
              Jost, <a href="https://www.brailleinstitute.org/freefont/" target="_blank" rel="noreferrer">Atkinson Hyperlegible Next</a> (Braille Institute), Fraunces and Literata, all under the SIL Open Font License.
            </dd>
          </div>
          <div>
            <dt>Software</dt>
            <dd>React, React Router, Vite, three.js, React Three Fiber, drei, Framer Motion and Lucide icons, all open source.</dd>
          </div>
        </dl>
        </div>
      </section>

      {/* ------------------------------------------------ accessibility */}
      <section id="access" className="ab-section" aria-labelledby="access-title">
        <h2 id="access-title">
          <Accessibility size={26} aria-hidden="true" /> Made to work for everyone
        </h2>
        <ul className="ab-list">
          <li>Reading uses Atkinson Hyperlegible Next, a typeface the Braille Institute designed to be as easy to read as possible.</li>
          <li>Every storybook page can be read aloud, with each word highlighted as it is spoken. You can slow the voice down, speed it up and make the words bigger.</li>
          <li>Everything works with a keyboard. “Skip to the content” is the first thing a screen reader finds, and focus is always visible.</li>
          <li>Every picture has a text description, and status is always written as a word, never shown only as a colour.</li>
          <li>Motion calms down when your device asks for reduced motion.</li>
          <li>The 3D maps also have a text search and a list of every machine.</li>
          <li>Nothing flashes, there are no accounts, no adverts and no trackers.</li>
        </ul>
      </section>

      {/* ------------------------------------------------ teachers */}
      <section id="teachers" className="ab-section" aria-labelledby="teach-title">
        <h2 id="teach-title">
          <GraduationCap size={26} aria-hidden="true" /> For teachers and families
        </h2>
        <ul className="ab-list">
          <li><strong>Radio delay.</strong> A radio signal crosses one astronomical unit in about 8.3 minutes. Using the distances in the Cosmic Library, work out how long a message to each deep-space probe takes.</li>
          <li><strong>Engineering to science.</strong> Choose a machine and draw the link between one part (a drill, a laser, a seismometer) and one discovery it made possible.</li>
          <li><strong>Letter from a machine.</strong> After reading a field note, write a letter from the machine that uses only facts from its page, and list your sources at the end.</li>
          <li><strong>Moon or Mars?</strong> Compare a Surveyor and a Viking lander. Why did the lander on Mars need a very different power source?</li>
          <li><strong>Check a source.</strong> Pick one fact from a storybook page, open its source, and find the sentence that supports it.</li>
        </ul>
      </section>

      {/* ------------------------------------------------ contact */}
      <section id="contact" className="ab-section" aria-labelledby="contact-title">
        <h2 id="contact-title">
          <Mail size={26} aria-hidden="true" /> Contact us
        </h2>
        <p>Have a suggestion or a comment, or did you spot a mistake? Write to Team Lost_In_Space by e-mail.</p>
        <EmailCard />
        <p className="ab-small">
          Sleeping Beauties is an independent project for the NASA Space Apps Challenge 2026. NASA has not endorsed it, and the NASA name and images are used under NASA's media guidelines.
        </p>
      </section>
    </Page>
  );
}
