import React, { Suspense, lazy, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowLeft, BookOpen, FileText, Home, Moon, Sun } from "lucide-react";
import StoryBook from "./StoryBook";
import "../styles/fonts.css";
import "./storybook.css";

const MissionFile = lazy(() => import("../mission/MissionFile"));

/**
 * One route shell for a sleeping beauty: the storybook for young readers,
 * and the mission file with the real documentation.
 */
export default function BookRoute({ config, mode = "story" }) {
  const { story, timing, scenes, music, theme, paths, nextBook, mission, world } = config;

  useEffect(() => {
    const previous = document.title;
    document.title =
      mode === "story"
        ? `${story.title}: ${story.subtitle} · Sleeping Beauties`
        : `${mission.name} mission file · Sleeping Beauties`;
    return () => {
      document.title = previous;
    };
  }, [mode, story, mission]);

  useEffect(() => {
    if (mode === "mission") window.scrollTo(0, 0);
  }, [mode]);

  // Mission files open in a bright reading mode; readers can switch to dark and it is remembered.
  const [tone, setTone] = useState(() => {
    try {
      return window.localStorage.getItem("sb-mission-tone") === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem("sb-mission-tone", tone);
    } catch {
      /* private mode: keep the choice for this visit only */
    }
  }, [tone]);

  // The mission file scrolls under the top bar, so the bar turns solid once the page moves.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (mode !== "mission") {
      setScrolled(false);
      return undefined;
    }
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mode]);

  return (
    <div className={`sbk sbk-${theme} sbk-mode-${mode}${mode === "mission" ? ` mf-tone-${tone}` : ""}`}>
      <header className={`sbk-top${scrolled ? " is-scrolled" : ""}`}>
        <nav className="sbk-back" aria-label="Where this object belongs">
          <Link className="sbk-home" to="/" aria-label="Sleeping Beauties home">
            <Home size={18} aria-hidden="true" />
          </Link>
          <Link className="sbk-world" to={world.path}>
            <ArrowLeft size={18} aria-hidden="true" />
            <span className="sbk-world-long">Back to {world.label}</span>
            <span className="sbk-world-short">{world.short}</span>
          </Link>
        </nav>
        <div className="sbk-name">
          <strong>{story.title}</strong>
          <span>{mode === "story" ? story.subtitle : mission.kicker}</span>
        </div>
        <div className="sbk-right">
          {mode === "mission" && (
            <button
              type="button"
              className="sbk-tone"
              onClick={() => setTone((t) => (t === "light" ? "dark" : "light"))}
              aria-label={tone === "light" ? "Switch to dark mode" : "Switch to light mode"}
              title={tone === "light" ? "Dark mode" : "Light mode"}
            >
              {tone === "light" ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
            </button>
          )}
          <nav className="sbk-modes" aria-label="Choose how to explore">
            <NavLink to={paths.story} end>
              <BookOpen size={16} aria-hidden="true" />
              <span className="sbk-mode-long">Storybook</span>
              <span className="sbk-mode-short">Story</span>
            </NavLink>
            <NavLink to={paths.mission}>
              <FileText size={16} aria-hidden="true" />
              <span className="sbk-mode-long">Mission file</span>
              <span className="sbk-mode-short">Mission</span>
            </NavLink>
          </nav>
        </div>
      </header>

      {mode === "story" ? (
        <StoryBook
          story={story}
          timing={timing}
          scenes={scenes}
          music={music}
          missionPath={paths.mission}
          nextBook={nextBook}
        />
      ) : (
        <Suspense fallback={<div className="mf-loading" role="status">Opening the mission file…</div>}>
          <MissionFile mission={mission} theme={theme} storyPath={paths.story} world={world} tone={tone} />
        </Suspense>
      )}
    </div>
  );
}
