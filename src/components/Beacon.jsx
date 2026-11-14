import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./beacon.css";

/**
 * A glowing, pulsing marker around a control so a child cannot miss it
 * (used for the Cosmic Library link and the Mission file button).
 * `selector` picks the element; the marker follows it while the page scrolls or resizes.
 */
export default function Beacon({ selector, label }) {
  const [rect, setRect] = useState(null);

  useEffect(() => {
    let raf = 0;
    let element = null;
    let last = "";
    const track = () => {
      const next = document.querySelector(selector);
      if (next !== element) {
        element?.classList.remove("sb-beacon-target");
        element = next;
        element?.classList.add("sb-beacon-target");
      }
      const box = element?.getBoundingClientRect();
      const visible = box && box.width > 0 && box.height > 0;
      const key = visible ? `${Math.round(box.left)},${Math.round(box.top)},${Math.round(box.width)},${Math.round(box.height)}` : "";
      if (key !== last) {
        last = key;
        setRect(visible ? { left: box.left, top: box.top, width: box.width, height: box.height } : null);
      }
      raf = requestAnimationFrame(track);
    };
    track();
    return () => {
      cancelAnimationFrame(raf);
      element?.classList.remove("sb-beacon-target");
    };
  }, [selector]);

  if (!rect) return null;
  const pad = 6;
  return createPortal(
    <div
      className="sb-beacon"
      aria-hidden="true"
      style={{ left: rect.left - pad, top: rect.top - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 }}
    >
      <i className="sb-beacon-ring" />
      <i className="sb-beacon-ring sb-beacon-ring-2" />
      <i className="sb-beacon-spark sb-beacon-spark-a">✦</i>
      <i className="sb-beacon-spark sb-beacon-spark-b">✦</i>
      <span className="sb-beacon-arrow">
        <svg viewBox="0 0 24 24" width="26" height="26"><path d="M12 3l7 9h-4.5v9h-5v-9H5z" fill="currentColor" /></svg>
        {label && <b>{label}</b>}
      </span>
    </div>,
    document.body
  );
}
