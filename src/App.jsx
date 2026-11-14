import React, { Component, Suspense, lazy, useEffect, useRef, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Each page loads on demand, so the homepage no longer downloads the 3D libraries up front.
const LandingPage = lazy(() => import("./pages/HomePage"));
const SpacePage = lazy(() => import("./pages/SpacePage"));
const MoonPage = lazy(() => import("./pages/MoonPage"));
const MarsPage = lazy(() => import("./pages/MarsPage"));
const EaglePage = lazy(() => import("./pages/EaglePage"));
const VikingPage = lazy(() => import("./pages/VikingPage"));
const VoyagerPage = lazy(() => import("./pages/VoyagerPage"));
const StoriesPage = lazy(() => import("./pages/StoriesPage"));
const LibraryPage = lazy(() => import("./pages/LibraryPage"));
const ObjectPage = lazy(() => import("./pages/ObjectPage"));
const PlayPage = lazy(() => import("./pages/PlayPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const TutorialOverlay = lazy(() => import("./components/TutorialOverlay"));

const fill = {
  minHeight: "100dvh",
  display: "grid",
  placeItems: "center",
  background: "#02050b",
  color: "#cfe0ff",
  font: "16px system-ui, sans-serif",
  textAlign: "center",
};

// Catches a crash inside one page so the visitor gets a way back instead of a blank screen.
class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    console.error(error);
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div style={fill} role="alert">
        <div>
          <p>This page drifted off course.</p>
          <button type="button" onClick={() => window.location.reload()} style={{ padding: "10px 18px", cursor: "pointer" }}>
            Reload the page
          </button>
        </div>
      </div>
    );
  }
}

// The Cosmic Library used to be called the Atlas: old links (and their filters) still work.
function RenamedLibrary() {
  const { search } = useLocation();
  return <Navigate to={`/library${search}`} replace />;
}

function RocketLoading() {
  return (
    <div style={fill} role="status" aria-label="Loading page">
      <div className="rocket-loading">
        <div className="rocket-scene">
          <div className="rocket-smoke rocket-smoke-1" />
          <div className="rocket-smoke rocket-smoke-2" />
          <div className="rocket-smoke rocket-smoke-3" />
          <div className="rocket-body">
            <div className="rocket-nose" />
            <div className="rocket-fuselage" />
            <div className="rocket-window" />
            <div className="rocket-fin rocket-fin-left" />
            <div className="rocket-fin rocket-fin-right" />
            <div className="rocket-flame">
              <div className="flame-core" />
              <div className="flame-outer" />
            </div>
          </div>
          <div className="rocket-stars" />
        </div>
        <span className="rocket-status">Launching&hellip;</span>
      </div>
    </div>
  );
}

/**
 * Links such as /about#accuracy or /#storybooks open at their section. Pages load on demand,
 * so the section may not exist yet: keep looking for a moment, and stop as soon as the
 * visitor starts scrolling on their own.
 */
function useHashScroll() {
  const { pathname, hash, key } = useLocation();
  const lastPath = useRef(pathname);
  useEffect(() => {
    const samePage = lastPath.current === pathname;
    lastPath.current = pathname;
    if (!hash) return undefined;
    const id = decodeURIComponent(hash.slice(1));
    const calm = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let timer = 0;
    let tries = 0;
    let stopped = false;
    const stop = () => {
      stopped = true;
    };
    const attempt = () => {
      if (stopped) return;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ block: "start", behavior: samePage && !calm ? "smooth" : "auto" });
        return;
      }
      tries += 1;
      if (tries < 60) timer = window.setTimeout(attempt, 50);
    };
    const events = ["wheel", "touchstart", "keydown"];
    events.forEach((e) => window.addEventListener(e, stop, { passive: true, once: true }));
    timer = window.setTimeout(attempt, 0);
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, stop));
    };
  }, [pathname, hash, key]);
}

export default function App() {
  const { pathname } = useLocation();
  useHashScroll();
  const [tutorialRequest, setTutorialRequest] = useState(0);
  return (
    <>
      <Boundary key={pathname}>
        <Suspense fallback={<RocketLoading />}>
        <Routes>
          <Route path="/" element={<LandingPage onStartTutorial={() => setTutorialRequest((request) => request + 1)} />} />
          <Route path="/space" element={<SpacePage />} />
          <Route path="/moon" element={<MoonPage />} />
          <Route path="/mars" element={<MarsPage />} />
          <Route path="/eagle" element={<EaglePage />} />
          <Route path="/eagle/mission" element={<EaglePage mode="mission" />} />
          <Route path="/viking-1" element={<VikingPage />} />
          <Route path="/viking-1/mission" element={<VikingPage mode="mission" />} />
          <Route path="/viking" element={<Navigate to="/viking-1" replace />} />
          <Route path="/voyager-1" element={<VoyagerPage />} />
          <Route path="/voyager-1/mission" element={<VoyagerPage mode="mission" />} />
          <Route path="/voyager" element={<Navigate to="/voyager-1" replace />} />
          <Route path="/stories/:slug" element={<StoriesPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/atlas" element={<RenamedLibrary />} />
          <Route path="/object/:id" element={<ObjectPage />} />
          <Route path="/play" element={<PlayPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
      </Boundary>
      <Suspense fallback={null}><TutorialOverlay startRequest={tutorialRequest} /></Suspense>
    </>
  );
}
