import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Clock3, FileText, Gamepad2, Headphones } from "lucide-react";
import ObjectRing from "../home/ObjectRing";
import PhotoCarousel from "../home/PhotoCarousel";
import { BEAUTIES, PHOTOS, STORYBOOKS } from "../home/homeData";
import { SiteFooter, SiteHeader } from "../site/SiteChrome";
import { CATALOG, stateCounts } from "../data/catalog";
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
        </ul>
        <div className="hp-book-actions">
          <Link to={book.story} className="hp-btn hp-btn-primary">
            <Headphones size={19} aria-hidden="true" /> Read and listen
          </Link>
          <Link to={book.mission} className="hp-btn hp-btn-quiet">
            <FileText size={18} aria-hidden="true" /> Mission file
          </Link>
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
              Snuggle up with the machines that stayed behind. A soft voice reads every page aloud, the words glow as they are
              spoken, and real NASA photographs are tucked between the pictures.
            </p>
          </div>
          <div className="hp-books">
            {STORYBOOKS.map((book) => (
              <Book key={book.id} book={book} />
            ))}
          </div>
        </section>

        <section id="atlas" className="hp-section" aria-labelledby="atlas-title">
          <div className="hp-section-head">
            <h2 id="atlas-title">Meet them all</h2>
            <p>Three storybooks are only the beginning. Every machine has its own page, and there are games for when you want to test what you have learned.</p>
          </div>
          <div className="hx-split">
            <div className="hx-panel hx-panel-atlas">
              <div className="hx-mini" aria-hidden="true">
                <img src="/images/objects/eagle.webp" alt="" loading="lazy" />
                <img src="/images/objects/opportunity.webp" alt="" loading="lazy" />
                <img src="/images/objects/ingenuity.webp" alt="" loading="lazy" />
                <img src="/images/objects/pioneer.webp" alt="" loading="lazy" />
              </div>
              <h3>The Atlas</h3>
              <p>All {CATALOG.length} machines on one timeline. Filter by world or by whether they are awake, then open field notes: a story in the machine's own voice, what it discovered and how its hardware made that possible.</p>
              <Link className="hp-btn hp-btn-primary" to="/atlas">
                Open the Atlas <ArrowRight size={18} aria-hidden="true" />
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
