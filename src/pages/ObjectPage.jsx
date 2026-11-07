import React, { Suspense, lazy, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, Lightbulb, MapPin, Wrench } from "lucide-react";
import Page from "../site/SiteChrome";
import ObjectArt from "../site/Glyphs";
import { DistanceRuler, ListenButton, LocatorMap, PhotoStrip } from "../site/Widgets";
import StateBadge from "../site/StateBadge";
import Lightbox from "../storybook/Lightbox";
import { BY_ID, NASA_LIBRARY_URL, NSSDC_URL, STATES, WORLDS, neighbours } from "../data/catalog";
import NotFoundPage from "./NotFoundPage";

const ModelViewer = lazy(() => import("../mission/ModelViewer"));
const FIELD_NOTE_MODELS = {
  "new-horizons": {
    src: "/models/New_Horizons.glb",
    label: "New Horizons",
  },
  "voyager-2": {
    src: "/models/voyager.glb",
    label: "Voyager 2",
  },
  "pioneer-10": {
    src: "/models/pioneer.glb",
    label: "Pioneer 10",
  },
  "pioneer-11": {
    src: "/models/pioneer.glb",
    label: "Pioneer 11",
  },
};

const makeFieldNoteModel = ({ src }) => ({
  src,
  fit: 3.1,
  yaw: -Math.PI / 4,
  floating: true,
  parts: [],
});

export const mapLink = (item) => {
  if (item.world === "deep") return `/space?probe=${item.id}`;
  return `${WORLDS[item.world].path}?focus=${item.id}`;
};

function Neighbour({ item, dir }) {
  if (!item) return null;
  return (
    <Link to={item.route} className={`ob-next-card is-${dir}`}>
      <span className="ob-next-dir">
        {dir === "prev" && <ArrowLeft size={16} aria-hidden="true" />}
        {dir === "prev" ? "Before" : "Next"}
        {dir === "next" && <ArrowRight size={16} aria-hidden="true" />}
      </span>
      <strong>{item.short}</strong>
      <small>{item.tagline || item.mission}</small>
    </Link>
  );
}

export default function ObjectPage() {
  const { id } = useParams();
  const item = BY_ID[id];
  const [viewer, setViewer] = useState(null);

  if (!item) return <NotFoundPage what="machine" />;
  if (item.hasStorybook) return <Navigate to={item.route} replace />;
  const n = item.note;
  if (!n) return <NotFoundPage what="machine" />;

  const world = WORLDS[item.world];
  const fieldNoteModel = FIELD_NOTE_MODELS[item.id];
  const { prev, next } = neighbours(item.id);
  const state = STATES[item.state];
  const year = item.year;

  return (
    <Page
      title={`${item.short}: ${n.tagline} · Sleeping Beauties`}
      description={`${n.mission} (${year}). ${n.tagline} Read its story, what it discovered and where it is now.`}
      className="ob"
    >
      <article style={{ "--accent": world.accent }}>
        <section className="ob-hero" aria-labelledby="ob-title">
          <div className="ob-hero-copy">
            <nav className="ob-crumbs" aria-label="Breadcrumb">
              <Link to="/atlas">Atlas</Link>
              <span aria-hidden="true">/</span>
              <Link to={world.path}>{world.name}</Link>
            </nav>
            <p className="ob-kicker">
              {n.mission} · {year}
            </p>
            <h1 id="ob-title">{item.short}</h1>
            <p className="ob-tagline">{n.tagline}</p>
            <div className="ob-badges">
              <StateBadge state={item.state} />
              {item.type && <span className="sx-chip">{item.type}</span>}
            </div>
            <div className="ob-actions">
              <a className="hp-btn hp-btn-primary" href="#story">
                <BookOpen size={19} aria-hidden="true" /> Read its story
              </a>
              <Link className="hp-btn hp-btn-quiet" to={mapLink(item)}>
                <MapPin size={19} aria-hidden="true" /> See it on the map
              </Link>
            </div>
          </div>
          <div className="ob-hero-art">
            <div className="ob-art-glow" aria-hidden="true" />
            {fieldNoteModel ? (
              <div className="ob-model-viewport" aria-label={`Interactive ${fieldNoteModel.label} 3D model`}>
                <Suspense fallback={<p className="ob-model-status">Loading 3D model…</p>}>
                  <ModelViewer model={makeFieldNoteModel(fieldNoteModel)} />
                </Suspense>
              </div>
            ) : <ObjectArt item={item} eager className="ob-art" />}
            {["apollo-12", "apollo-14", "apollo-15", "apollo-16", "apollo-17"].includes(item.id) && <p className="ob-art-note">Picture: Similar to Eagle lunar module with slight modification.</p>}
            {item.id === "viking-2" && <p className="ob-art-note">Picture: Viking 1, Viking 2's identical twin.</p>}
            {item.id === "spirit-mer-a" && <p className="ob-art-note">Picture: Opportunity, Spirit's identical twin.</p>}
            {(item.id === "pioneer-11" || item.id === "pioneer-10") && <p className="ob-art-note">Picture: a Pioneer probe. Pioneer 10 and 11 were twins.</p>}
            {fieldNoteModel && <p className="ob-art-note">NASA 3D model · Drag to rotate; scroll to zoom.</p>}
          </div>
        </section>

        <section className="ob-stats-wrap" aria-label="Key numbers">
          <dl className="ob-stats">
            {n.numbers.map((s) => (
              <div key={s.l}>
                <dt>{s.l}</dt>
                <dd>{s.v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="story" className="ob-section ob-story" aria-labelledby="story-title" tabIndex={-1}>
          <div className="ob-section-head">
            <h2 id="story-title">In its own words</h2>
            <p className="ob-note">An imagined voice, built from real events from NASA's mission records.</p>
          </div>
          <div className="ob-story-body">
            {n.story.map((p, i) => (
              <p key={i} className={i === 0 ? "ob-dropcap" : undefined}>
                {p}
              </p>
            ))}
          </div>
          <ListenButton paragraphs={n.story} />
        </section>

        <section className="ob-section ob-pair" aria-label="Purpose and legacy">
          <div className="ob-panel">
            <h2>
              <Lightbulb size={22} aria-hidden="true" /> Why it was sent
            </h2>
            <p>{n.whySent}</p>
          </div>
          <div className="ob-panel">
            <h2>
              <MapPin size={22} aria-hidden="true" /> What it left behind
            </h2>
            <p>{n.left}</p>
          </div>
        </section>

        <section className="ob-section" aria-labelledby="disc-title">
          <div className="ob-section-head">
            <h2 id="disc-title">What it discovered</h2>
            <p>The science this machine made possible.</p>
          </div>
          <ol className="ob-cards">
            {n.discoveries.map((d, i) => (
              <li key={d.t} className="ob-card">
                <span className="ob-card-n" aria-hidden="true">
                  {i + 1}
                </span>
                <h3>{d.t}</h3>
                <p>{d.d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="ob-section ob-how" aria-labelledby="how-title">
          <div className="ob-section-head">
            <h2 id="how-title">
              <Wrench size={26} aria-hidden="true" /> Engineering meets science
            </h2>
            <p>How the hardware made the discoveries possible.</p>
          </div>
          <div className="ob-how-grid">
            {n.how.map((h) => (
              <div key={h.t} className="ob-how-card">
                <h3>{h.t}</h3>
                <p>{h.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="ob-section" aria-labelledby="where-title">
          <div className="ob-section-head">
            <h2 id="where-title">Where it is now</h2>
            <p>
              <StateBadge state={item.state} inline /> {state.long}
            </p>
          </div>
          {item.world === "deep" ? <DistanceRuler au={item.au} name={item.short} /> : <LocatorMap world={item.world} lat={item.lat} lon={item.lon} name={item.short} />}
          <p className="ob-fun">
            <strong>Did you know?</strong> {n.fun}
          </p>
        </section>

        <section id="library" className="ob-section" aria-labelledby="photos-title">
          <div className="ob-section-head">
            <h2 id="photos-title">Real NASA photographs</h2>
            <p>Found live in NASA's public Image and Video Library. Tap a picture to enlarge it.</p>
          </div>
          <PhotoStrip query={n.library} onOpen={setViewer} />
        </section>

        <section className="ob-section ob-sources" aria-labelledby="src-title">
          <h2 id="src-title">Sources</h2>
          <ul>
            <li>
              <a href={NSSDC_URL(n.nssdc)} target="_blank" rel="noreferrer">
                NASA Space Science Data Coordinated Archive, record {n.nssdc} <ExternalLink size={14} aria-hidden="true" />
              </a>
            </li>
            <li>
              <a href={NASA_LIBRARY_URL(n.library)} target="_blank" rel="noreferrer">
                NASA Image and Video Library: {n.library} <ExternalLink size={14} aria-hidden="true" />
              </a>
            </li>
            {item.nasaUrl && (
              <li>
                <a href={item.nasaUrl} target="_blank" rel="noreferrer">
                  NASA mission page <ExternalLink size={14} aria-hidden="true" />
                </a>
              </li>
            )}
            <li>
              <Link to="/about#accuracy">How we checked the facts on this page</Link>
            </li>
          </ul>
        </section>

        <nav className="ob-next" aria-label="Keep exploring">
          <Neighbour item={prev} dir="prev" />
          <Neighbour item={next} dir="next" />
        </nav>
      </article>
      <Lightbox item={viewer} onClose={() => setViewer(null)} />
    </Page>
  );
}
