import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink, Maximize2 } from "lucide-react";
import NasaImage from "../storybook/NasaImage";
import Lightbox from "../storybook/Lightbox";
import { nasaDetailsUrl, nasaImageCandidates } from "../lib/nasa";

const wrap = (v, n) => ((v % n) + n) % n;
const EASE = [0.2, 0.8, 0.2, 1];

/** "Lost in space": a carousel of real NASA photographs, one at a time, with its story beside it. */
export default function PhotoCarousel({ photos }) {
  const n = photos.length;
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [viewer, setViewer] = useState(null);
  const thumbsRef = useRef(null);
  const photo = photos[index];

  const go = useCallback(
    (to, d) => {
      setDir(d);
      setIndex(wrap(to, n));
    },
    [n]
  );
  const next = useCallback(() => go(index + 1, 1), [go, index]);
  const prev = useCallback(() => go(index - 1, -1), [go, index]);

  // Fetch the neighbours ahead of time so turning feels instant.
  useEffect(() => {
    [1, -1].forEach((d) => {
      const p = photos[wrap(index + d, n)];
      const img = new Image();
      img.referrerPolicy = "no-referrer";
      img.src = nasaImageCandidates(p.nasa, "large")[0];
    });
  }, [index, n, photos]);

  // Keep the current thumbnail in view without moving the page.
  useEffect(() => {
    const list = thumbsRef.current;
    const el = list?.children[index];
    if (!list || !el) return;
    const left = el.offsetLeft - list.clientWidth / 2 + el.clientWidth / 2;
    list.scrollTo({ left, behavior: reduced ? "auto" : "smooth" });
  }, [index, reduced]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  const slide = {
    enter: (d) => (reduced ? { opacity: 0 } : { opacity: 0, x: d * 60, scale: 1.015 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d) => (reduced ? { opacity: 0 } : { opacity: 0, x: d * -60, scale: 0.985 }),
  };

  return (
    <div className="hp-photos" role="region" aria-roledescription="carousel" aria-label="Real photos of missions left behind" onKeyDown={onKeyDown}>
      <div className="hp-photo-main">
        <div className="hp-photo-stage">
          <AnimatePresence initial={false} custom={dir}>
            <motion.figure
              key={photo.nasa}
              className="hp-photo-slide"
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reduced ? 0.15 : 0.6, ease: EASE }}
              drag={reduced ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.5}
              dragSnapToOrigin
              onDragEnd={(_, info) => {
                if (info.offset.x < -70 || info.velocity.x < -500) next();
                else if (info.offset.x > 70 || info.velocity.x > 500) prev();
              }}
            >
              <NasaImage id={photo.nasa} size="large" alt="" className="hp-photo-backdrop" aria-hidden="true" draggable={false} />
              <NasaImage id={photo.nasa} size="large" alt={photo.title} className="hp-photo-img" draggable={false} />
            </motion.figure>
          </AnimatePresence>
          <button
            type="button"
            className="hp-photo-zoom"
            onClick={() =>
              setViewer({ kind: "photo", nasa: photo.nasa, title: photo.title, caption: photo.text, credit: `NASA · ${photo.nasa}` })
            }
            aria-label={`See “${photo.title}” larger`}
          >
            <Maximize2 size={18} aria-hidden="true" />
          </button>
          <div className="hp-photo-nav">
            <button type="button" onClick={prev} aria-label="Previous photo">
              <ChevronLeft size={24} aria-hidden="true" />
            </button>
            <button type="button" onClick={next} aria-label="Next photo">
              <ChevronRight size={24} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="hp-photo-caption" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={photo.nasa}
              initial={{ opacity: 0, y: reduced ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <p className="hp-photo-count">
                Photo {index + 1} of {n}
              </p>
              <h3>{photo.title}</h3>
              <p className="hp-photo-where">
                {photo.where}, {photo.when}
              </p>
              <p className="hp-photo-text">{photo.text}</p>
              <div className="hp-photo-links">
                {photo.link && (
                  <Link to={photo.link.to} className="hp-btn hp-btn-primary hp-btn-small">
                    {photo.link.label} <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                )}
                <a href={nasaDetailsUrl(photo.nasa)} target="_blank" rel="noreferrer" className="hp-photo-source">
                  NASA photo {photo.nasa} <ExternalLink size={14} aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <ol className="hp-photo-thumbs" ref={thumbsRef} aria-label="All photos">
        {photos.map((p, i) => (
          <li key={p.nasa}>
            <button
              type="button"
              className={i === index ? "is-on" : undefined}
              onClick={() => go(i, i > index ? 1 : -1)}
              aria-label={p.title}
              aria-current={i === index ? "true" : undefined}
            >
              <NasaImage id={p.nasa} size="thumb" alt="" draggable={false} />
            </button>
          </li>
        ))}
      </ol>

      <Lightbox item={viewer} onClose={() => setViewer(null)} />
    </div>
  );
}
