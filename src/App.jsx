import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/HomePage";
import SpacePage from "./pages/SpacePage";
import MoonPage from "./pages/MoonPage";
import MarsPage from "./pages/MarsPage";
import EaglePage from "./pages/EaglePage";

export default function App() {
  return <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/space" element={<SpacePage />} />
    <Route path="/moon" element={<MoonPage />} />
    <Route path="/mars" element={<MarsPage />} />
    <Route path="/eagle" element={<EaglePage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
