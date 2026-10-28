import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Clock3, FileText, Headphones } from "lucide-react";
import ObjectRing from "../home/ObjectRing";
import PhotoCarousel from "../home/PhotoCarousel";
import { BEAUTIES, PHOTOS, STORYBOOKS } from "../home/homeData";
import "../styles/fonts.css";
import "../home/home.css";

/** A crescent Moon with a closed, sleeping eye. */
function Mark() {
  return (
    <svg className="hp-mark" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M21.5 4.5A12.5 12.5 0 1 0 27.6 22 10 10 0 0 1 21.5 4.5Z" fill="currentColor" />
      <path d="M10.2 17.4c1.5 1.7 3.9 1.7 5.4 0" fill="none" stroke="#070b1a" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M11 19.6l-.8 1.3M12.9 20.2v1.5M14.8 19.6l.8 1.3" stroke="#070b1a" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const previous = document.title;
    document.title = "Sleeping Beauties: the spacecraft that stayed behind";
    return () => {
      document.title = previous;
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="hp">
      <a className="hp-skip" href="#hp-main">
        Skip to the content
      </a>
      <header className={`hp-top${scrolled ? " is-scrolled" : ""}`}>
        <Link to="/" className="hp-brand">
          <Mark />
          <span>Sleeping Beauties</span>
        </Link>
        <nav className="hp-nav" aria-label="Sections">
          <a href="#worlds">Worlds</a>
          <a href="#storybooks" aria-label="Storybooks">
            <span className="hp-nav-long">Storybooks</span>
            <span className="hp-nav-short">Stories</span>
          </a>
          <a href="#photos">Photos</a>
          <button type="button" className="hp-nav-tutorial" onClick={onStartTutorial}>
            Tutorial
          </button>
        </nav>
      </header>

      <main id="hp-main">
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

        <section id="photos" className="hp-section" aria-labelledby="photos-title">
          <div className="hp-section-head">
            <h2 id="photos-title">Lost in space</h2>
            <p>Real photographs from NASA's archive: the machines that stayed behind, and some of the last views they sent home.</p>
          </div>
          <PhotoCarousel photos={PHOTOS} />
        </section>
      </main>

      <footer className="hp-foot">
        <div className="hp-foot-inner">
          <div className="hp-foot-about">
            <p className="hp-brand hp-foot-brand">
              <Mark />
              <span>Sleeping Beauties</span>
            </p>
            <p>Made for the NASA Space Apps Challenge 2026. An independent project, not endorsed by NASA.</p>
          </div>
          <nav className="hp-foot-links" aria-label="Everything on this site">
            <div>
              <h2>Storybooks</h2>
              <Link to="/eagle">Eagle</Link>
              <Link to="/viking-1">Viking 1</Link>
              <Link to="/voyager-1">Voyager 1</Link>
            </div>
            <div>
              <h2>Mission files</h2>
              <Link to="/eagle/mission">Eagle</Link>
              <Link to="/viking-1/mission">Viking 1</Link>
              <Link to="/voyager-1/mission">Voyager 1</Link>
            </div>
            <div>
              <h2>Worlds</h2>
              <Link to="/moon">The Moon</Link>
              <Link to="/space">Deep space</Link>
              <Link to="/mars">Mars</Link>
            </div>
          </nav>
          <p className="hp-credits">
            Photos and videos: <a href="https://images.nasa.gov/">NASA Image and Video Library</a> (public domain). 3D models:{" "}
            <a href="https://github.com/nasa/NASA-3D-Resources">NASA 3D Resources</a>. Moon and Mars textures:{" "}
            <a href="https://www.solarsystemscope.com/textures/">Solar System Scope</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
