import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Clapperboard, Clock3, FileText, Gamepad2, Headphones } from "lucide-react";
import ObjectRing from "../home/ObjectRing";
import PhotoCarousel from "../home/PhotoCarousel";
import { BEAUTIES, PHOTOS, STORYBOOKS } from "../home/homeData";
import { SiteFooter, SiteHeader } from "../site/SiteChrome";
import { CATALOG, stateCounts } from "../data/catalog";
import { BOOKS, ORDER, storyPath } from "../storybook/library";

// Every storybook on one shelf, grouped by world: the three narrated books lead each group.
const WORLD_SHELVES = [
  { world: "moon", short: "The Moon", title: "Stories from the Moon", text: "Landers, buggies and science stations, still resting in the grey dust." },
  { world: "mars", short: "Mars", title: "Stories from Mars", text: "Landers, rovers and a helicopter under the pink Martian sky." },
  { world: "deep", short: "Deep space", title: "Stories from deep space", text: "Explorers that flew past the planets, circled asteroids or watched the stars." },
];
const WORLD_TAG = { moon: "A story from the Moon", mars: "A story from Mars", deep: "A story from deep space" };
const FILMS = { eagle: "/eagle?film", viking: "/viking-1?film" };
const SHELF = [
  ...STORYBOOKS.map((b) => ({ ...b, world: b.theme, narrated: true, film: FILMS[b.id] })),
  ...ORDER.map((slug) => {
    const b = BOOKS[slug];
    return {
      id: slug,
      title: b.title,
      subtitle: b.subtitle,
      tagline: WORLD_TAG[b.world],
      blurb: b.blurb,
      cover: b.cover,
      theme: b.world,
      world: b.world,
      pages: b.pages,
      minutes: b.minutes,
      story: storyPath(slug),
      mission: `/object/${b.objects[0]}`,
      missionLabel: "Field notes",
    };
  }),
];
import "../styles/fonts.css";
import "../home/home.css";
import "../site/site.css";

/** A crescent Moon with a closed, sleeping eye. */
function Book({ book }) {
  return (
    <article className={`hp-book is-${book.theme}`} aria-labelledby={`book-${book.id}`}>
      <Link to={book.story} className="hp-book-cover" tabIndex={-1} aria-hidden="true">
        <img src={book.cover} alt="" loading="lazy" decoding="async" width="720" height="913" />
        <span className="hp-book-cover-title">
          <strong>{book.title}</strong>
          <em>{book.subtitle}</em>
        </span>
      </Link>
      <div className="hp-book-text">
        <h3 id={`book-${book.id}`} className="hp-vh">
          {book.title}: {book.subtitle}
        </h3>
        <p className="hp-book-tag">{book.tagline}</p>
        <p className="hp-book-blurb">{book.blurb}</p>
        <ul className="hp-book-facts" aria-label="Book length">
          <li>
            <Clock3 size={16} aria-hidden="true" />
            {book.minutes} min
          </li>
          <li>
            <BookOpen size={16} aria-hidden="true" />
            {book.pages} pages
          </li>
          <li>
            <Headphones size={16} aria-hidden="true" />
            {book.narrated ? "Narrated" : "Read aloud"}
          </li>
        </ul>
        <div className="hp-book-actions">
          <Link to={book.story} className="hp-btn hp-btn-primary">
            <Headphones size={19} aria-hidden="true" /> Read and listen
          </Link>
          <Link to={book.mission} className="hp-btn hp-btn-quiet">
            <FileText size={18} aria-hidden="true" /> {book.missionLabel || "Mission file"}
          </Link>
          {book.film && (
            <Link to={book.film} className="hp-btn hp-btn-quiet hp-btn-film">
              <Clapperboard size={18} aria-hidden="true" /> Watch the Science
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

const WORLD_CARDS = [
  {
    kind: "moon",
    title: "The Moon",
    to: "/moon",
    text: "Fifteen resting places on one map, from the six Apollo landing sites to the Surveyor and Ranger robots.",
  },
  {
    kind: "deep",
    title: "Deep space",
    to: "/space",
    text: "Fly through the solar system and follow Voyager, Pioneer and New Horizons as they leave the planets behind.",
  },
  {
    kind: "mars",
    title: "Mars",
    to: "/mars",
    text: "Ten landers, rovers and a helicopter, from Viking 1 in 1976 to Perseverance, which is still exploring.",
  },
];

function World({ world }) {
  return (
    <Link to={world.to} className={`hp-world is-${world.kind}`}>
      <span className="hp-globe" aria-hidden="true">
        {world.kind === "deep" ? (
          <>
            <i className="hp-signal" />
            <i className="hp-signal" />
            <i className="hp-signal" />
            <img src="/images/objects/voyager.webp" alt="" loading="lazy" />
          </>
        ) : (
          <span className="hp-globe-map" />
        )}
      </span>
      <span className="hp-world-name">{world.title}</span>
      <span className="hp-world-text">{world.text}</span>
      <span className="hp-world-go">
        Explore {world.kind === "deep" ? "deep space" : world.title.replace("The ", "the ")} <ArrowRight size={18} aria-hidden="true" />
      </span>
    </Link>
  );
}

export default function HomePage({ onStartTutorial }) {
  const counts = stateCounts();
  const resting = counts.asleep + counts.impact;
  const firstYear = Math.min(...CATALOG.map((c) => c.year));

  useEffect(() => {
    const previous = document.title;
    document.title = "Sleeping Beauties: the spacecraft that stayed behind";
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <div className="hp">
      <a className="hp-skip" href="#hp-main">
        Skip to the content
      </a>
      <SiteHeader onTutorial={onStartTutorial} />

      <main id="hp-main" tabIndex={-1}>
        <section className="hp-hero" aria-labelledby="hp-title">
          <div className="hp-hero-copy">
            <h1 id="hp-title">Sleeping Beauties</h1>
            <p className="hp-lede">
              Spacecraft that finished their work and stayed where they stopped: on the Moon, on Mars and far out among the stars.
              Abandoned, but not forgotten.
            </p>
          </div>
          <ObjectRing items={BEAUTIES} />
        </section>

        <section className="hx-band-wrap" aria-label="The project at a glance">
          <dl className="hx-band">
            <div>
              <dt>machines to meet</dt>
              <dd>{CATALOG.length}</dd>
            </div>
            <div>
              <dt>resting on the Moon and Mars</dt>
              <dd>{resting}</dd>
            </div>
            <div>
              <dt>still awake and exploring</dt>
              <dd>{counts.awake}</dd>
            </div>
            <div>
              <dt>years, from {firstYear} until today</dt>
              <dd>{new Date().getFullYear() - firstYear}</dd>
            </div>
          </dl>
        </section>

        <section id="worlds" className="hp-section" aria-labelledby="worlds-title">
          <div className="hp-section-head">
            <h2 id="worlds-title">Choose a world</h2>
            <p>Visit the places where they sleep. Each world is an interactive map of the machines that landed or flew there.</p>
          </div>
          <ul className="hp-worlds">
            {WORLD_CARDS.map((w) => (
              <li key={w.kind}>
                <World world={w} />
              </li>
            ))}
          </ul>
        </section>

        <section id="storybooks" className="hp-section" aria-labelledby="books-title">
          <div className="hp-section-head">
            <h2 id="books-title">Storybooks</h2>
            <p>
              Snuggle up with the machines that stayed behind: {SHELF.length} picture books, one for every group of machines on NASA's list, plus Voyager 1. Each page
              is read aloud while the words glow, and real NASA photographs are tucked between the pictures.
            </p>
          </div>
          <nav className="hp-shelf-jump" aria-label="Storybooks by world">
            {WORLD_SHELVES.map((w) => (
              <a key={w.world} href={`#books-${w.world}`} className={`is-${w.world}`}>
                <span className="hp-shelf-dot" aria-hidden="true" /> {w.short}
                <small>{SHELF.filter((b) => b.world === w.world).length} books</small>
              </a>
            ))}
          </nav>
          {WORLD_SHELVES.map((w) => (
            <div key={w.world} id={`books-${w.world}`} className={`hp-shelf-group is-${w.world}`}>
              <div className="hp-shelf-head">
                <h3>
                  <span className="hp-shelf-dot" aria-hidden="true" /> {w.title}
                </h3>
                <p>{w.text}</p>
              </div>
              <div className="hp-books">
                {SHELF.filter((b) => b.world === w.world).map((book) => (
                  <Book key={book.id} book={book} />
                ))}
              </div>
            </div>
          ))}
        </section>

        <section id="library" className="hp-section" aria-labelledby="library-title">
          <div className="hp-section-head">
            <h2 id="library-title">Meet them all</h2>
            <p>The {SHELF.length} storybooks are only the beginning. Every machine has its own page, and there are games for when you want to test what you have learned.</p>
          </div>
          <div className="hx-split">
            <div className="hx-panel hx-panel-atlas">
              <div className="hx-mini" aria-hidden="true">
                <img src="/images/objects/eagle.webp" alt="" loading="lazy" />
                <img src="/images/objects/opportunity.webp" alt="" loading="lazy" />
                <img src="/images/objects/ingenuity.webp" alt="" loading="lazy" />
                <img src="/images/objects/pioneer.webp" alt="" loading="lazy" />
              </div>
              <h3>The Cosmic Library</h3>
              <p>All {CATALOG.length} machines on one timeline. Filter by world or by whether they are awake, then open field notes: a story in the machine's own voice, what it discovered and how its hardware made that possible.</p>
              <Link className="hp-btn hp-btn-primary" to="/library">
                Open the Cosmic Library <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <div className="hx-panel hx-panel-play">
              <div className="hx-mini" aria-hidden="true">
                <Gamepad2 size={54} />
              </div>
              <h3>Play</h3>
              <p>Send radio pings to hunt for a lost lander on the Moon or Mars, or answer riddles spoken by the machines themselves.</p>
              <Link className="hp-btn hp-btn-quiet" to="/play">
                Start playing <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section id="photos" className="hp-section" aria-labelledby="photos-title">
          <div className="hp-section-head">
            <h2 id="photos-title">Lost in space</h2>
            <p>Real photographs from NASA's archive: the machines that stayed behind, and some of the last views they sent home.</p>
          </div>
          <PhotoCarousel photos={PHOTOS} />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
