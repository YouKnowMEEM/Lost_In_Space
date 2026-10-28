import React, { Component, Suspense, lazy, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Each page loads on demand, so the homepage no longer downloads the 3D libraries up front.
const LandingPage = lazy(() => import("./pages/HomePage"));
const SpacePage = lazy(() => import("./pages/SpacePage"));
const MoonPage = lazy(() => import("./pages/MoonPage"));
const MarsPage = lazy(() => import("./pages/MarsPage"));
const EaglePage = lazy(() => import("./pages/EaglePage"));
const VikingPage = lazy(() => import("./pages/VikingPage"));
const VoyagerPage = lazy(() => import("./pages/VoyagerPage"));
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

export default function App() {
  const { pathname } = useLocation();
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </Boundary>
      <Suspense fallback={null}><TutorialOverlay startRequest={tutorialRequest} /></Suspense>
    </>
  );
}
