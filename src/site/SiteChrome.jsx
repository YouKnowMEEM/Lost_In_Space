import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Gamepad2, Menu, X } from "lucide-react";
import "../styles/fonts.css";
import "../home/home.css";
import { worldCounts } from "../data/catalog";
import "./site.css";

/** A crescent Moon with a closed, sleeping eye. */
export function Mark() {
  return (
    <svg className="hp-mark" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M21.5 4.5A12.5 12.5 0 1 0 27.6 22 10 10 0 0 1 21.5 4.5Z" fill="currentColor" />
      <path d="M10.2 17.4c1.5 1.7 3.9 1.7 5.4 0" fill="none" stroke="#070b1a" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M11 19.6l-.8 1.3M12.9 20.2v1.5M14.8 19.6l.8 1.3" stroke="#070b1a" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

const COUNTS = worldCounts();
const WORLD_LINKS = [
  { to: "/moon", label: "The Moon", note: `${COUNTS.moon} resting places`, color: "var(--hp-moon)" },
  { to: "/mars", label: "Mars", note: `${COUNTS.mars} landers, rovers and a helicopter`, color: "var(--hp-mars)" },
  { to: "/space", label: "Deep space", note: `${COUNTS.deep} probes leaving the planets behind`, color: "var(--hp-deep)" },
];

/**
 * Header used on every page that is not a full-screen 3D world. On phones the links fold into a
 * menu button, so nothing is hidden. `onTutorial` adds the tutorial button (home page only).
 */
export function SiteHeader({ onTutorial }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [worlds, setWorlds] = useState(false);
  const wrap = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on navigation, on Escape and on a click outside.
  useEffect(() => {
    setOpen(false);
    setWorlds(false);
  }, [pathname]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setWorlds(false);
      }
    };
    const onDoc = (e) => {
      if (wrap.current && !wrap.current.contains(e.target)) setWorlds(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDoc);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDoc);
    };
  }, []);

  return (
    <header className={`hp-top sx-top${scrolled || open ? " is-scrolled" : ""}${open ? " is-menu-open" : ""}`}>
      <Link to="/" className="hp-brand">
        <Mark />
        <span>Sleeping Beauties</span>
      </Link>

      <button type="button" className="sx-burger" aria-expanded={open} aria-controls="sx-nav" aria-label={open ? "Close the menu" : "Open the menu"} onClick={() => setOpen((v) => !v)}>
        {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
      </button>

      <nav id="sx-nav" className={`sx-nav${open ? " is-open" : ""}`} aria-label="Main" ref={wrap}>
        <div className="sx-drop">
          <button type="button" className="sx-drop-btn" aria-expanded={worlds} aria-haspopup="true" onClick={() => setWorlds((v) => !v)}>
            Worlds <ChevronDown size={16} aria-hidden="true" className={worlds ? "is-flipped" : ""} />
          </button>
          <div className={`sx-drop-panel${worlds ? " is-open" : ""}`}>
            {WORLD_LINKS.map((w) => (
              <Link key={w.to} to={w.to} className="sx-drop-item">
                <span className="sx-dot" style={{ background: w.color }} aria-hidden="true" />
                <span>
                  <strong>{w.label}</strong>
                  <small>{w.note}</small>
                </span>
              </Link>
            ))}
          </div>
        </div>
        <NavLink to="/atlas">Atlas</NavLink>
        <Link to={{ pathname: "/", hash: "#storybooks" }}>Storybooks</Link>
        <NavLink to="/play" className="sx-nav-play">
          <Gamepad2 size={17} aria-hidden="true" /> Play
        </NavLink>
        <NavLink to="/about">About</NavLink>
        {onTutorial && (
          <button type="button" className="sx-tour" onClick={() => { setOpen(false); onTutorial(); }}>
            Tutorial
          </button>
        )}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="hp-foot">
      <div className="hp-foot-inner">
        <div className="hp-foot-about">
          <p className="hp-brand hp-foot-brand">
            <Mark />
            <span>Sleeping Beauties</span>
          </p>
          <p>Stories of the machines NASA left behind on the Moon, on Mars and in deep space. Made for the NASA Space Apps Challenge 2026. An independent project, not endorsed by NASA.</p>
        </div>
        <nav className="hp-foot-links" aria-label="Everything on this site">
          <div>
            <h2>Stories</h2>
            <Link to="/eagle">Eagle</Link>
            <Link to="/viking-1">Viking 1</Link>
            <Link to="/voyager-1">Voyager 1</Link>
            <Link to="/atlas">All {Object.values(COUNTS).reduce((a, b) => a + b, 0)} machines</Link>
          </div>
          <div>
            <h2>Worlds</h2>
            <Link to="/moon">The Moon</Link>
            <Link to="/mars">Mars</Link>
            <Link to="/space">Deep space</Link>
          </div>
          <div>
            <h2>More</h2>
            <Link to="/play">Play</Link>
            <Link to="/about">About and sources</Link>
            <Link to={{ pathname: "/about", hash: "#accuracy" }}>How we checked facts</Link>
          </div>
        </nav>
        <p className="hp-credits">
          Photos and videos: <a href="https://images.nasa.gov/">NASA Image and Video Library</a> (public domain). 3D models:{" "}
          <a href="https://github.com/nasa/NASA-3D-Resources">NASA 3D Resources</a>. Moon and Mars textures:{" "}
          <a href="https://www.solarsystemscope.com/textures/">Solar System Scope</a>. Typefaces: Jost, Atkinson Hyperlegible Next, Fraunces and Literata (SIL Open Font License).
          Full credits on the <Link to="/about#credits">About page</Link>.
        </p>
      </div>
    </footer>
  );
}

/** Sets the document title and description for a page, and restores them on leave. */
export function usePageMeta(title, description) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content");
    if (meta && description) meta.setAttribute("content", description);
    window.scrollTo({ top: 0 });
    return () => {
      document.title = prevTitle;
      if (meta && prevDesc != null) meta.setAttribute("content", prevDesc);
    };
  }, [title, description]);
}

/** Standard page: skip link, header, main landmark, footer. */
export default function Page({ title, description, children, className = "", onTutorial }) {
  usePageMeta(title, description);
  return (
    <div className={`hp sx ${className}`}>
      <a className="hp-skip" href="#sx-main">
        Skip to the content
      </a>
      <SiteHeader onTutorial={onTutorial} />
      <main id="sx-main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
