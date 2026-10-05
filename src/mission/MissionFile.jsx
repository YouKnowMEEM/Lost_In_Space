import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, Maximize2, Play } from "lucide-react";
import NasaImage from "../storybook/NasaImage";
import Lightbox from "../storybook/Lightbox";
import SiteMap from "./SiteMap";
import VoyagerNow from "./VoyagerNow";
import NasaLibrary from "./NasaLibrary";
import { nasaVideo } from "../lib/nasa";
import "./mission.css";

const ModelViewer = lazy(() => import("./ModelViewer"));

/** The sections of a mission file and their labels in the sticky menu. */
function sectionsFor(mission) {
  return [
    ["overview", "Overview"],
    ["timeline", "Timeline"],
    ["spacecraft", "Spacecraft"],
    ["site", mission.where?.nav || "Landing site"],
    ["left-behind", mission.leftBehindNav || "Left behind"],
    ["gallery", "Photos & video"],
    ["library", "NASA library"],
    ["sources", "Sources"],
  ].filter(([id]) => id !== "gallery" || mission.gallery.length);
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

function Photo({ nasa, caption, credit, onOpen, size = "medium", className = "" }) {
  return (
    <button type="button" className={`mf-photo ${className}`} onClick={() => onOpen({ kind: "photo", nasa, caption, credit: credit || `NASA · ${nasa}` })}>
      <NasaImage id={nasa} size={size} alt={caption} />
      <span className="mf-photo-zoom" aria-hidden="true">
        <Maximize2 size={16} />
      </span>
    </button>
  );
}

export default function MissionFile({ mission, theme, storyPath, world, tone = "light" }) {
  const [viewer, setViewer] = useState(null);
  const [pick, setPick] = useState({ id: mission.model.parts[0].id, n: 0 });
  const choose = useCallback((id) => setPick((p) => ({ id, n: p.n + 1 })), []);
  const part = pick.id;
  const menu = useMemo(() => sectionsFor(mission), [mission]);
  const sections = useMemo(() => menu.map(([id]) => id), [menu]);
  const active = useActiveSection(sections);
  const subnavRef = useRef(null);

  // On narrow screens the section menu scrolls sideways: keep the current section in view.
  useEffect(() => {
    const bar = subnavRef.current;
    const link = bar?.querySelector(".is-active");
    if (!bar || !link || bar.scrollWidth <= bar.clientWidth) return;
    const left = link.offsetLeft - (bar.clientWidth - link.offsetWidth) / 2;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    bar.scrollTo({ left: Math.max(0, left), behavior: reduced ? "auto" : "smooth" });
  }, [active]);
  const open = useCallback((item) => setViewer(item), []);
  const partInfo = mission.model.parts.find((p) => p.id === part);
  const other = mission.next;
  const closeViewer = useCallback(() => setViewer(null), []);

  return (
    <main className={`mf mf-${theme}${tone === "light" ? " is-light" : ""}`}>
      {/* ------------------------------------------------ hero */}
      <header className="mf-hero">
        <div className="mf-hero-photo">
          <NasaImage id={mission.hero.nasa} size="large" alt="" eager style={{ objectPosition: mission.hero.focus }} />
        </div>
        <div className="mf-hero-inner">
          <p className="mf-kicker">{mission.kicker}</p>
          <h1>{mission.title}</h1>
          <p className="mf-lede">{mission.summary[0]}</p>
          <div className="mf-hero-actions">
            <Link className="mf-btn mf-btn-primary" to={storyPath}>
              <BookOpen size={18} aria-hidden="true" /> Read the storybook
            </Link>
            <a className="mf-btn mf-btn-ghost" href="#spacecraft">
              Explore the 3D model <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
        <dl className="mf-stats">
          {mission.stats.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>
                {s.value}
                <small>{s.sub}</small>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mf-hero-credit">{mission.hero.caption}</p>
      </header>

      <nav className="mf-subnav" aria-label="Sections of this mission file">
        <div className="mf-subnav-inner" ref={subnavRef}>
          {menu.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={active === id ? "is-active" : undefined} aria-current={active === id ? "true" : undefined}>
              {label}
            </a>
          ))}
        </div>
      </nav>

      <div className="mf-body">
        {/* ------------------------------------------------ overview */}
        <section id="overview" className="mf-section mf-overview">
          <div className="mf-prose">
            <h2>Overview</h2>
            {mission.summary.slice(1).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {mission.science && (
              <div className="mf-science">
                {mission.scienceTitle && <h3 className="mf-science-title">{mission.scienceTitle}</h3>}
                {mission.science.map((s) => (
                  <article key={s.title}>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
          <aside className="mf-factsheet" aria-labelledby="facts-title">
            <h2 id="facts-title">Fact sheet</h2>
            <dl>
              {mission.facts.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </section>

        {/* ------------------------------------------------ timeline */}
        <section id="timeline" className="mf-section">
          <h2>Timeline</h2>
          <p className="mf-section-intro">All times are Coordinated Universal Time (UTC).</p>
          <ol className="mf-timeline">
            {mission.timeline.map((t) => (
              <li key={t.when + t.title} className={t.upcoming ? "is-upcoming" : undefined}>
                <div className="mf-tl-when">
                  {t.when}
                  {t.upcoming && <span className="mf-tl-soon">Coming up</span>}
                </div>
                <div className="mf-tl-body">
                  <h3>{t.title}</h3>
                  <p>{t.text}</p>
                </div>
                {t.photo && <Photo nasa={t.photo} caption={`${t.title}: ${t.text}`} onOpen={open} size="small" className="mf-tl-photo" />}
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------ spacecraft */}
        <section id="spacecraft" className="mf-section">
          <h2>The spacecraft</h2>
          <p className="mf-section-intro">Drag to turn the real NASA 3D model, scroll or pinch to zoom, and pick a part to see what it did.</p>
          <div className="mf-model">
            <div className="mf-model-stage">
              <Suspense fallback={<div className="mf-model-canvas mf-model-loading">Loading the 3D model…</div>}>
                <ModelViewer model={mission.model} active={part} pickCount={pick.n} onPick={choose} />
              </Suspense>
              <span className="mf-model-credit">{mission.model.credit}</span>
            </div>
            <div className="mf-parts">
              <ol>
                {mission.model.parts.map((p, i) => (
                  <li key={p.id}>
                    <button type="button" className={part === p.id ? "is-active" : undefined} aria-pressed={part === p.id} onClick={() => choose(p.id)}>
                      <span className="mf-part-n">{i + 1}</span>
                      <span>{p.name}</span>
                    </button>
                  </li>
                ))}
              </ol>
              {partInfo && (
                <div className="mf-part-info" aria-live="polite">
                  <h3>{partInfo.name}</h3>
                  <p>{partInfo.text}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ site: where it sleeps, or where it is now */}
        <section id="site" className="mf-section">
          <h2>{mission.where?.title || "Where it sleeps"}</h2>
          {mission.where ? (
            <VoyagerNow where={mission.where} />
          ) : (
            <div className="mf-site">
              <div>
                <SiteMap site={mission.site} />
                <p className="mf-site-text">{mission.site.text}</p>
              </div>
              <figure className="mf-site-photo">
                <Photo nasa={mission.site.photo.nasa} caption={mission.site.photo.caption} credit={mission.site.photo.credit} onOpen={open} size="large" />
                <figcaption>
                  {mission.site.photo.caption} <span>{mission.site.photo.credit}</span>
                </figcaption>
              </figure>
            </div>
          )}
        </section>

        {/* ------------------------------------------------ left behind, or what it carries */}
        <section id="left-behind" className="mf-section">
          <h2>{mission.leftBehindTitle || "What was left behind"}</h2>
          <ul className="mf-inventory">
            {mission.leftBehind.map((item) => (
              <li key={item.name}>
                <h3>{item.name}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ------------------------------------------------ gallery */}
        <section id="gallery" className="mf-section">
          <h2>Real photos{mission.videos.length ? " and video" : ""}</h2>
          <p className="mf-section-intro">
            Every picture here comes from NASA's Image and Video Library and is in the public domain. Select one to see it larger.
          </p>
          {mission.videos.length > 0 && (
            <ul className="mf-videos">
              {mission.videos.map((v) => (
                <li key={v.nasa}>
                  <button type="button" onClick={() => open({ kind: "video", nasa: v.nasa, title: v.title, caption: v.caption, credit: `NASA · ${v.nasa}` })}>
                    <span className="mf-video-poster">
                      <img src={nasaVideo(v.nasa).poster} alt="" loading="lazy" referrerPolicy="no-referrer" />
                      <span className="mf-video-play" aria-hidden="true">
                        <Play size={22} />
                      </span>
                    </span>
                    <strong>{v.title}</strong>
                    <small>{v.caption}</small>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <ul className="mf-gallery">
            {mission.gallery.map((g) => (
              <li key={g.nasa}>
                <Photo nasa={g.nasa} caption={g.caption} onOpen={open} size="medium" />
                <span className="mf-gallery-cap">{g.caption}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ------------------------------------------------ live NASA library */}
        <section id="library" className="mf-section">
          <h2>Search NASA's library</h2>
          <p className="mf-section-intro">
            These results come live from NASA's open Image and Video Library API. {mission.libraryHint || "Try a mission, a planet or a part of a spacecraft."}
          </p>
          <NasaLibrary initialQuery={mission.libraryQuery} onOpen={open} />
        </section>

        {/* ------------------------------------------------ sources */}
        <section id="sources" className="mf-section">
          <h2>Sources</h2>
          <ul className="mf-sources">
            {mission.sources.map((s) => (
              <li key={s.url + s.title}>
                <a href={s.url} target="_blank" rel="noreferrer">
                  <span>
                    <strong>{s.title}</strong>
                    <small>{s.publisher}</small>
                  </span>
                  <ExternalLink size={16} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <footer className="mf-end">
          <Link className="mf-end-card" to={storyPath}>
            <BookOpen size={22} aria-hidden="true" />
            <span>
              <small>For young explorers</small>
              <strong>Read the {mission.name} storybook</strong>
            </span>
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
          {world && (
            <Link className="mf-end-card" to={world.path}>
              <ArrowLeft size={22} aria-hidden="true" />
              <span>
                <small>Where it belongs</small>
                <strong>Back to {world.label}</strong>
              </span>
            </Link>
          )}
          {other && (
            <Link className="mf-end-card" to={other.path}>
              <span>
                <small>Next mission file</small>
                <strong>{other.name}</strong>
              </span>
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
          )}
        </footer>
      </div>

      <Lightbox item={viewer} onClose={closeViewer} />
    </main>
  );
}
