import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Beacon from "../components/Beacon";
import "./storyGuide.css";

const WIDE = 300; // room for the astronaut and the speech bubble side by side in the margin
const NARROW = 96; // room for the astronaut alone

/**
 * On phones there is no margin, so the astronaut waits just under the Mission File button instead.
 *
 * A small astronaut floats in the empty space to the right of the storybook and
 * points the reader to the Mission File, where the real science lives.
 * The Mission File button glows while the hint is open.
 */
export default function StoryGuide({ missionPath }) {
  const [place, setPlace] = useState(null);
  const [open, setOpen] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const tucked = useRef(false);
  const lastKey = useRef("");

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      // Two-page spread on wide screens, a single page on phones.
      const book = document.querySelector(".bk-book") || document.querySelector(".bk-single");
      const top = document.querySelector(".sbk-top")?.getBoundingClientRect().bottom ?? 70;
      const bottom = document.querySelector(".bk-controls")?.getBoundingClientRect().top ?? window.innerHeight;
      if (book) {
        const r = book.getBoundingClientRect();
        const vw = document.documentElement.clientWidth;
        const gutter = vw - r.right;
        const mode = gutter >= WIDE ? "wide" : gutter >= NARROW ? "narrow" : "tiny";
        const closed = book.classList.contains("is-closed") || Boolean(book.querySelector(".bk-cover"));
        // Once reading starts and the open book leaves little room beside it, tuck the bubble away (once).
        if (!closed && mode !== "wide" && !tucked.current) {
          tucked.current = true;
          setOpen(false);
        }
        const next = { left: Math.round(r.right), gutter: Math.round(gutter), top: Math.round(top), bottom: Math.round(bottom), mode };
        const key = JSON.stringify(next);
        if (key !== lastKey.current) {
          lastKey.current = key;
          setPlace(next);
        }
      }
      raf = requestAnimationFrame(measure);
    };
    raf = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!place || dismissed) return null;

  const style =
    place.mode === "tiny"
      ? { right: 8, top: place.top + 4 }
      : { left: place.left, width: place.gutter, top: place.top, height: Math.max(0, place.bottom - place.top) };

  return (
    <>
      {open && <Beacon selector={`.sbk-modes a[href="${missionPath}"]`} />}
      <aside className={`sg sg-${place.mode}${open ? " is-open" : ""}`} style={style} aria-label="Story guide">
        {open && (
          <div className="sg-bubble" role="status">
            <button type="button" className="sg-close" onClick={() => setDismissed(true)} aria-label="Hide the guide" title="Hide the guide">
              <X size={14} aria-hidden="true" />
            </button>
            <strong>Want the real science?</strong>
            <p>You can learn all the scientific details in the Mission File, glowing up there!</p>
            <button type="button" className="sg-ok" onClick={() => setOpen(false)}>
              Got it
            </button>
          </div>
        )}
        <button
          type="button"
          className="sg-astronaut"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Hide the astronaut's tip" : "Show the astronaut's tip about the Mission File"}
        >
          <img src="/images/astronautApollo11.png" alt="" decoding="async" />
        </button>
      </aside>
    </>
  );
}
