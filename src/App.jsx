import React, { Component, Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Each page loads on demand, so the homepage no longer downloads the 3D libraries up front.
const LandingPage = lazy(() => import("./pages/HomePage"));
const SpacePage = lazy(() => import("./pages/SpacePage"));
const MoonPage = lazy(() => import("./pages/MoonPage"));
const MarsPage = lazy(() => import("./pages/MarsPage"));
const EaglePage = lazy(() => import("./pages/EaglePage"));

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

export default function App() {
  const { pathname } = useLocation();
  return (
    <Boundary key={pathname}>
      <Suspense fallback={<div style={fill} role="status">Loading…</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/space" element={<SpacePage />} />
          <Route path="/moon" element={<MoonPage />} />
          <Route path="/mars" element={<MarsPage />} />
          <Route path="/eagle" element={<EaglePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Boundary>
  );
}
