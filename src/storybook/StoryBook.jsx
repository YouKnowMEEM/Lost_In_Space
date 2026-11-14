import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronLeft, ChevronRight, Clapperboard, FileText, Gauge, Headphones, ListOrdered, Music2, Pause, Play, RotateCcw, Type, Video, X } from "lucide-react";
import NasaImage from "./NasaImage";
import { nasaImageCandidates } from "../lib/nasa";
import Lightbox from "./Lightbox";
import { useNarration } from "./useNarration";
import { speechSupported } from "./speechVoice";
import { displayText, displayWords } from "./text";
import { BOOK_SOURCES } from "../data/citations";

const FLIP_MS = 950;
const RATES = [1, 0.85, 1.15];
const RATE_LABEL = { 1: "Normal speed", 0.85: "Slower", 1.15: "Faster" };
const SIZES = ["m", "l", "xl"];

/** 65 → "1:05" for the eye, "1 minute 5 seconds" for screen readers. */
function readingTime(seconds) {
  const t = Math.max(1, Math.round(seconds || 0));
  const m = Math.floor(t / 60);
  const s = t % 60;
  const spoken = [m && `${m} minute${m === 1 ? "" : "s"}`, s && `${s} second${s === 1 ? "" : "s"}`].filter(Boolean).join(" ");
  return { short: `${m}:${String(s).padStart(2, "0")}`, spoken };
}
const SPREAD_QUERY = "(min-width: 980px) and (min-height: 560px) and (min-aspect-ratio: 6/5)";

function useMedia(query) {
  const get = () => typeof window !== "undefined" && window.matchMedia(query).matches;
  const [match, setMatch] = useState(get);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ text page */

function Words({ text, offset, onWord }) {
  return displayWords(text).map((w, i) => (
    <React.Fragment key={i}>
      <span className="bk-w" data-w={offset + i} onClick={onWord ? () => onWord(offset + i) : undefined}>
        {w}
      </span>{" "}
    </React.Fragment>
  ));
}

// Long publisher names, shortened for the small source line under each page.
const SHORT_PUBLISHER = {
  "NASA Space Science Data Coordinated Archive": "NASA NSSDCA",
  "Smithsonian National Air and Space Museum": "Smithsonian",
  "Apollo Lunar Surface Journal (NASA History)": "NASA History",
};

/** "Sources: …" under a page: where the facts on this page come from. */
function PageSources({ sources }) {
  if (!sources.length) return null;
  return (
    <p className="bk-src">
      <span className="bk-src-label">{sources.length > 1 ? "Sources:" : "Source:"}</span>{" "}
      {sources.map((src, i) => (
        <React.Fragment key={src.id}>
          {i > 0 && <span aria-hidden="true"> · </span>}
          <a href={src.url} target="_blank" rel="noreferrer">
            {src.title}
          </a>{" "}
          <span className="bk-src-pub">({SHORT_PUBLISHER[src.publisher] || src.publisher})</span>
        </React.Fragment>
      ))}
    </p>
  );
}

function TextPage({ story, page, number, total, live, onWord, onVideo, endActions, sources = [] }) {
  const titleCount = displayWords(page.title).length;
  let offset = titleCount;
  return (
    <article className="bk-text" data-live={live ? "true" : undefined}>
      <div className="bk-text-scroll">
        <header className="bk-head">
          <span className="bk-chapter" aria-hidden="true">
            {number}
          </span>
          <h2 className="bk-title" aria-label={displayText(page.title)}>
            <Words text={page.title} offset={0} onWord={onWord} />
          </h2>
        </header>
        <div className="bk-story">
          {page.text.map((para, i) => {
            const node = (
              <p key={i}>
                <Words text={para} offset={offset} onWord={onWord} />
              </p>
            );
            offset += displayWords(para).length;
            return node;
          })}
        </div>
        {(page.fact || page.video) && (
          <div className="bk-extras">
            {page.fact && (
              <aside className="bk-fact">
                <strong>Did you know?</strong>
                <span>{page.fact}</span>
              </aside>
            )}
            {page.video && (
              <button type="button" className={`bk-watch${page.video.poster ? " has-poster" : ""}`} onClick={() => onVideo(page.video)}>
                {page.video.poster ? (
                  <span className="bk-watch-thumb" aria-hidden="true">
                    <img src={page.video.poster} alt="" loading="lazy" />
                    <Play size={18} />
                  </span>
                ) : (
                  <span className="bk-watch-icon" aria-hidden="true">
                    <Video size={18} />
                  </span>
                )}
                <span>
                  <strong>{page.video.title}</strong>
                  <small>{page.video.label || "Real NASA footage"}</small>
                </span>
              </button>
            )}
          </div>
        )}
        <PageSources sources={sources} />
      </div>
      {/* Pinned under the text, so "Read again" and friends are always in view on the last page. */}
      {endActions}
      <footer className="bk-folio" aria-hidden="true">
        {number} · {total}
      </footer>
    </article>
  );
}

/* ----------------------------------------------------------------- scene page */

// Rendered in place of a photo that could not load anywhere: tells the page to hide its frame.
function PhotoGone({ onGone }) {
  useEffect(() => {
    onGone();
  }, [onGone]);
  return null;
}

function ScenePage({ page, scenes, live, onPhoto }) {
  const Scene = scenes[page.scene];
  const photoKey = page.photo ? `${page.id}|${[].concat(page.photo.src || page.photo.nasa).join("|")}` : "";
  const [gone, setGone] = useState("");
  const hide = useCallback(() => setGone(photoKey), [photoKey]);
  return (
    <div className={`bk-scene ${live ? "is-live" : ""}`}>
      {Scene ? <Scene /> : <div className="bk-scene-missing" />}
      {page.photo && gone !== photoKey && (
        <button
          type="button"
          className={`bk-polaroid at-${page.photo.pos || "br"}`}
          onClick={() => onPhoto(page.photo)}
          aria-label={`Open the real photo: ${page.photo.caption}`}
        >
          <span className="bk-tape" aria-hidden="true" />
          <NasaImage id={page.photo.nasa} src={page.photo.src} size="medium" alt="" eager onGiveUp={page.photo.src ? () => <PhotoGone onGone={hide} /> : undefined} />
          <span className="bk-polaroid-label">Real photo</span>
        </button>
      )}
    </div>
  );
}

function CoverPage({ story, scenes, live }) {
  const Scene = scenes[story.pages[0].scene];
  return (
    <div className={`bk-cover ${live ? "is-live" : ""}`}>
      {Scene && <Scene />}
      <div className="bk-cover-type">
        <span className="bk-series">Sleeping Beauties · Storybook {story.book}</span>
        <h1>{story.title}</h1>
        <p>{story.subtitle}</p>
      </div>
      <span className="bk-cover-tag">{story.tagline}</span>
    </div>
  );
}

/* --------------------------------------------------------------- the book */

export default function StoryBook({ story, timing, scenes, music, missionPath, nextBook, speechWords = null, missionLabel = "Mission file" }) {
  const pages = story.pages;
  const last = pages.length - 1;
  const spread = useMedia(SPREAD_QUERY);
  const narration = useNarration(music, speechWords);
  const { voiceRef, playing } = narration;
  // Books read by the browser's own voice: some browsers have no voice at all.
  const voiceless = Boolean(speechWords) && (!speechSupported() || narration.voiceError);

  const [index, setIndex] = useState(() => {
    const m = typeof window !== "undefined" && window.location.hash.match(/^#page-(\d+)$/);
    const n = m ? Number(m[1]) : 0;
    return n >= 0 && n <= last ? n : 0;
  });
  const [flip, setFlip] = useState(null); // { from, to, dir, run }
  const [slide, setSlide] = useState("none");
  const [listening, setListening] = useState(false);
  const [autoTurn, setAutoTurn] = useState(true);
  const [size, setSize] = useState("m");
  const [tocOpen, setTocOpen] = useState(false);
  const [viewer, setViewer] = useState(null);
  const [finished, setFinished] = useState(false);
  // Our own mission animation, if this book has one: offered on the cover, in the controls and the chapters.
  const film = useMemo(() => pages.find((p) => p.video?.src)?.video || null, [pages]);
  // Every fact has a source: each page lists its own, the chapters panel lists them all.
  const bookSources = BOOK_SOURCES[story.id] || [];
  const sourcesById = useMemo(() => Object.fromEntries((BOOK_SOURCES[story.id] || []).map((src) => [src.id, src])), [story.id]);
  const sourcesOf = (page) => (page.sources || []).map((id) => sourcesById[id]).filter(Boolean);

  const stageRef = useRef(null);
  const ringRef = useRef(null);
  const wordsRef = useRef([]);
  const timesRef = useRef([]);
  const activeRef = useRef(-1);
  const indexRef = useRef(index);
  const listeningRef = useRef(listening);
  const autoTurnRef = useRef(autoTurn);
  const flipRef = useRef(flip);
  const turnTimer = useRef(0);
  indexRef.current = index;
  listeningRef.current = listening;
  autoTurnRef.current = autoTurn;
  flipRef.current = flip;

  const page = pages[index];
  const pageTiming = timing.pages[page.id] || {};

  // Flattened [start, end] for every highlighted word on this page (title first).
  useEffect(() => {
    timesRef.current = pageTiming.title ? [...pageTiming.title, ...(pageTiming.paras || []).flat()] : [];
  }, [pageTiming]);

  const clearHighlight = useCallback(() => {
    const prev = wordsRef.current[activeRef.current];
    if (prev) prev.classList.remove("is-now");
    activeRef.current = -1;
  }, []);

  // Collect the word spans of the live text page after each render that changes the page.
  useEffect(() => {
    const root = stageRef.current?.querySelector('.bk-text[data-live="true"]');
    wordsRef.current = root ? Array.from(root.querySelectorAll(".bk-w")) : [];
    activeRef.current = -1;
  }, [index, flip, spread, size]);

  /* ---------- audio per page */

  const playPage = useCallback(
    (i) => {
      const t = timing.pages[pages[i].id];
      if (!t) return;
      narration.load(t.audio);
      narration.seek(0);
      narration.play();
    },
    [narration, pages, timing]
  );

  useEffect(() => {
    const t = timing.pages[page.id];
    if (t) narration.load(t.audio);
    try {
      const url = index > 0 ? `#page-${index}` : window.location.pathname + window.location.search;
      window.history.replaceState(window.history.state, "", url);
    } catch {
      /* ignore */
    }
    // Warm the cache for the next page's voice and photo.
    const next = pages[index + 1];
    const nt = next && timing.pages[next.id];
    if (nt && !nt.audio.startsWith("speech:")) fetch(nt.audio).catch(() => {});
    if (next?.photo) {
      const img = new Image();
      img.referrerPolicy = "no-referrer";
      img.src = next.photo.src ? [].concat(next.photo.src)[0] : nasaImageCandidates(next.photo.nasa, "medium")[0];
    }
    setFinished(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  /* ---------- page turning */

  const goTo = useCallback(
    (target, { fromAuto = false } = {}) => {
      const from = indexRef.current;
      if (flipRef.current || target === from || target < 0 || target > last) return;
      clearTimeout(turnTimer.current);
      narration.pause();
      clearHighlight();
      if (ringRef.current) ringRef.current.style.setProperty("--p", 0);
      narration.turnSound();
      const dir = target > from ? "next" : "prev";
      const continueListening = listeningRef.current;
      const afterTurn = () => {
        if (continueListening) playPage(target);
      };

      if (spread && !reducedMotion()) {
        setFlip({ from, to: target, dir, run: false });
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setFlip((f) => (f ? { ...f, run: true } : f)))
        );
        turnTimer.current = window.setTimeout(() => {
          setIndex(target);
          setFlip(null);
          window.setTimeout(afterTurn, fromAuto ? 350 : 200);
        }, FLIP_MS);
      } else {
        setSlide(dir);
        setIndex(target);
        if (!spread) stageRef.current?.scrollTo?.({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
        window.setTimeout(afterTurn, 380);
      }
    },
    [clearHighlight, last, narration, playPage, spread]
  );

  const next = useCallback(() => goTo(indexRef.current + 1), [goTo]);
  const prev = useCallback(() => goTo(indexRef.current - 1), [goTo]);

  // When a page finishes: turn it ourselves if the reader asked us to.
  useEffect(() => {
    narration.onEnd(() => {
      clearHighlight();
      if (ringRef.current) ringRef.current.style.setProperty("--p", 1);
      const i = indexRef.current;
      if (i === last) {
        setListening(false);
        setFinished(true);
        return;
      }
      if (autoTurnRef.current && listeningRef.current) {
        turnTimer.current = window.setTimeout(() => goTo(i + 1, { fromAuto: true }), i === 0 ? 700 : 1300);
      }
    });
  }, [clearHighlight, goTo, last, narration]);

  useEffect(() => () => clearTimeout(turnTimer.current), []);

  /* ---------- read-along highlighting */

  useEffect(() => {
    if (!playing) return undefined;
    let raf = 0;
    const tick = () => {
      const voice = voiceRef.current;
      const times = timesRef.current;
      if (voice) {
        const t = voice.currentTime;
        const duration = voice.duration || pageTiming.duration || 1;
        if (ringRef.current) ringRef.current.style.setProperty("--p", Math.min(1, t / duration));
        let lo = 0;
        let hi = times.length - 1;
        let found = -1;
        while (lo <= hi) {
          const mid = (lo + hi) >> 1;
          if (times[mid][0] <= t + 0.04) {
            found = mid;
            lo = mid + 1;
          } else hi = mid - 1;
        }
        if (found >= 0 && t > times[found][1] + 0.45) found = -1;
        if (found !== activeRef.current) {
          const words = wordsRef.current;
          words[activeRef.current]?.classList.remove("is-now");
          const el = words[found];
          if (el) {
            el.classList.add("is-now");
            const r = el.getBoundingClientRect();
            if (!spread) {
              const bottomLimit = window.innerHeight - 120;
              if (r.top < 70 || r.bottom > bottomLimit) el.scrollIntoView({ block: "center", behavior: "smooth" });
            } else {
              // A long page scrolls inside the book: keep the spoken word in view.
              const box = el.closest(".bk-text-scroll");
              const b = box?.getBoundingClientRect();
              if (b && box.scrollHeight > box.clientHeight + 4 && (r.bottom > b.bottom - 12 || r.top < b.top + 8)) {
                box.scrollTo({ top: box.scrollTop + (r.top - b.top) - b.height / 3, behavior: reducedMotion() ? "auto" : "smooth" });
              }
            }
          }
          activeRef.current = found;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, voiceRef, pageTiming, spread]);

  /* ---------- controls */

  const startListening = useCallback(() => {
    narration.engage();
    setListening(true);
    setAutoTurn(true);
    playPage(indexRef.current);
  }, [narration, playPage]);

  const readMyself = useCallback(() => {
    narration.engage();
    setListening(false);
    setAutoTurn(false);
    goTo(1);
  }, [goTo, narration]);

  const togglePlay = useCallback(() => {
    if (playing) {
      setListening(false);
      narration.pause();
      return;
    }
    narration.engage();
    setListening(true);
    const voice = voiceRef.current;
    if (voice && voice.ended) narration.seek(0);
    narration.play();
  }, [narration, playing, voiceRef]);

  const replay = useCallback(() => {
    narration.engage();
    setListening(true);
    playPage(indexRef.current);
  }, [narration, playPage]);

  const onWord = useCallback(
    (w) => {
      const t = timesRef.current[w];
      if (!t) return;
      narration.engage();
      setListening(true);
      narration.seek(Math.max(0, t[0] - 0.05));
      narration.play();
    },
    [narration]
  );

  const openPhoto = useCallback((photo) => setViewer({ kind: "photo", ...photo }), []);
  const openVideo = useCallback(
    (video) => {
      setListening(false);
      narration.pause();
      setViewer({ kind: "video", ...video });
    },
    [narration]
  );

  // Links such as /eagle?film open the animation straight away.
  useEffect(() => {
    if (film && new URLSearchParams(window.location.search).has("film")) openVideo(film);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [film]);

  useEffect(() => {
    const onKey = (e) => {
      if (viewer || tocOpen || e.target.closest?.("input, textarea, select")) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === " " && !e.target.closest?.("button, a")) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, togglePlay, viewer, tocOpen]);

  // Swipe to turn on touch screens.
  const swipe = useRef(null);
  const onPointerDown = (e) => {
    if (e.pointerType === "mouse") return;
    swipe.current = { x: e.clientX, y: e.clientY, t: performance.now() };
  };
  const onPointerUp = (e) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 64 && Math.abs(dx) > Math.abs(dy) * 1.6 && performance.now() - s.t < 700) {
      if (dx < 0) next();
      else prev();
    }
  };

  /* ---------- rendering helpers */

  const chapterNumber = (i) => i; // cover is 0, so the first chapter is 1
  const total = last;

  const endActions =
    index === last || flip?.to === last ? (
      <div className={`bk-end ${finished ? "is-shown" : ""}`}>
        <span className="bk-the-end">The End</span>
        <div className="bk-end-actions">
          <button type="button" className="bk-btn" onClick={() => goTo(0)}>
            <RotateCcw size={17} aria-hidden="true" /> Read again
          </button>
          <Link className="bk-btn" to={missionPath}>
            <FileText size={17} aria-hidden="true" /> {missionLabel}
          </Link>
          {nextBook && (
            <Link className="bk-btn bk-btn-primary" to={nextBook.path}>
              Next story: {nextBook.title} <ChevronRight size={17} aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    ) : null;

  const textPage = (i, live) => (
    <TextPage
      story={story}
      page={pages[i]}
      number={chapterNumber(i)}
      total={total}
      live={live}
      onWord={live ? onWord : undefined}
      onVideo={openVideo}
      endActions={i === last ? endActions : null}
      sources={sourcesOf(pages[i])}
    />
  );
  const leftOf = (i, live = false) =>
    i === 0 ? null : <ScenePage page={pages[i]} scenes={scenes} live={live} onPhoto={openPhoto} />;
  const rightOf = (i, live = false) =>
    i === 0 ? <CoverPage story={story} scenes={scenes} live={live} /> : textPage(i, live);

  const shownIndex = flip ? flip.to : index;
  const closed = spread && shownIndex === 0;

  const spreadView = () => {
    if (!flip) {
      return (
        <>
          <div className="bk-half bk-left">{leftOf(index, true)}</div>
          <div className="bk-half bk-right">{rightOf(index, true)}</div>
        </>
      );
    }
    const { from, to, dir, run } = flip;
    const base =
      dir === "next" ? (
        <>
          <div className="bk-half bk-left">{leftOf(from)}</div>
          <div className="bk-half bk-right">{rightOf(to)}</div>
        </>
      ) : (
        <>
          <div className="bk-half bk-left">{leftOf(to)}</div>
          <div className="bk-half bk-right">{rightOf(from)}</div>
        </>
      );
    return (
      <>
        {base}
        <div
          className={`bk-leaf is-${dir} ${run ? "is-running" : ""}`}
          style={{ "--flip": `${FLIP_MS}ms` }}
          aria-hidden="true"
        >
          <div className="bk-face bk-face-front">
            {dir === "next" ? rightOf(from) : leftOf(from)}
            <i className="bk-shade" />
          </div>
          <div className="bk-face bk-face-back">
            {dir === "next" ? leftOf(to) : rightOf(to)}
            <i className="bk-shade" />
          </div>
        </div>
        <i className={`bk-cast is-${dir} ${run ? "is-running" : ""}`} aria-hidden="true" />
      </>
    );
  };

  const singleView = () => (
    <div className={`bk-single slide-${slide}`} key={index}>
      {index === 0 ? (
        <CoverPage story={story} scenes={scenes} live />
      ) : (
        <>
          {leftOf(index, true)}
          {textPage(index, true)}
        </>
      )}
    </div>
  );

  const progress = index / last;

  return (
    <div className={`bk bk-size-${size} ${spread ? "is-spread" : "is-single"}`}>
      <main
        className="bk-stage"
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        aria-label={`${story.title}, page ${index} of ${last}`}
      >
        {spread ? (
          <div className={`bk-book ${closed ? "is-closed" : ""} ${flip ? "is-flipping" : ""}`}>
            <div className="bk-spread">{spreadView()}</div>
          </div>
        ) : (
          singleView()
        )}

        {shownIndex === 0 && !flip && (
          <div className="bk-start">
            {!voiceless && (
              <button type="button" className="bk-btn bk-btn-primary bk-btn-lg" onClick={startListening}>
                <Headphones size={20} aria-hidden="true" /> Read it to me
              </button>
            )}
            <button type="button" className={`bk-btn bk-btn-lg${voiceless ? " bk-btn-primary" : ""}`} onClick={readMyself}>
              <BookOpen size={20} aria-hidden="true" /> {voiceless ? "Start reading" : "I'll read it myself"}
            </button>
            {film && (
              <button type="button" className="bk-btn bk-btn-lg bk-btn-film" onClick={() => openVideo(film)}>
                <Clapperboard size={20} aria-hidden="true" /> Watch the film
              </button>
            )}
            <p className="bk-start-note">
              {voiceless ? "This browser cannot read aloud, so tonight you are the narrator!" : "Get cosy. Everything in this story really happened."}
            </p>
          </div>
        )}
        {voiceless && shownIndex > 0 && narration.voiceError && (
          <p className="bk-voice-note" role="status">
            Read-aloud is not available in this browser. You can still read along, or try another browser.
          </p>
        )}
      </main>

      <nav className="bk-controls" aria-label="Story controls">
        <div className="bk-controls-inner">
          <button type="button" className="bk-icon" onClick={() => setTocOpen(true)} aria-label="Chapters">
            <ListOrdered size={20} />
          </button>
          <div className="bk-progress" aria-hidden="true">
            <span style={{ transform: `scaleX(${progress})` }} />
          </div>
          <div className="bk-transport">
            <button type="button" className="bk-icon" onClick={prev} disabled={index === 0} aria-label="Previous page">
              <ChevronLeft size={24} />
            </button>
            <button
              type="button"
              className={`bk-play ${playing ? "is-playing" : ""}`}
              onClick={togglePlay}
              disabled={voiceless}
              title={voiceless ? "Read-aloud is not available in this browser" : undefined}
              aria-label={playing ? "Pause the narrator" : "Read this page aloud"}
              aria-pressed={playing}
            >
              <span className="bk-ring" ref={ringRef} aria-hidden="true" />
              {playing ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button type="button" className="bk-icon" onClick={next} disabled={index === last} aria-label="Next page">
              <ChevronRight size={24} />
            </button>
          </div>
          <span className="bk-pageno">
            {index === 0 ? "Cover" : `Page ${index} of ${last}`}
          </span>
          <div className="bk-toggles">
            {film && (
              <button type="button" className="bk-chip bk-chip-film" onClick={() => openVideo(film)} title={film.title}>
                <Clapperboard size={16} aria-hidden="true" /> <span>Film</span>
              </button>
            )}
            <button
              type="button"
              className={`bk-chip ${autoTurn ? "is-on" : ""}`}
              aria-pressed={autoTurn}
              onClick={() => setAutoTurn((v) => !v)}
              title="Turn the pages automatically while the narrator reads"
            >
              <BookOpen size={16} aria-hidden="true" /> <span>Turn pages for me</span>
            </button>
            <button
              type="button"
              className={`bk-chip ${narration.musicOn ? "is-on" : ""}`}
              aria-pressed={narration.musicOn}
              onClick={() => {
                narration.engage();
                narration.setMusicOn((v) => !v);
              }}
              title="Soft background music"
            >
              <Music2 size={16} aria-hidden="true" /> <span>Music</span>
            </button>
            <button
              type="button"
              className="bk-chip"
              onClick={() => narration.setRate(RATES[(RATES.indexOf(narration.rate) + 1) % RATES.length])}
              title="Narrator speed"
            >
              <Gauge size={16} aria-hidden="true" /> <span>{RATE_LABEL[narration.rate]}</span>
            </button>
            <button
              type="button"
              className="bk-chip"
              onClick={() => setSize((s) => SIZES[(SIZES.indexOf(s) + 1) % SIZES.length])}
              title="Text size"
              aria-label={`Text size: ${size === "m" ? "normal" : size === "l" ? "large" : "extra large"}`}
            >
              <Type size={16} aria-hidden="true" /> <span>{size === "m" ? "Aa" : size === "l" ? "Aa+" : "Aa++"}</span>
            </button>
            {index > 0 && (
              <button type="button" className="bk-chip" onClick={replay} title="Read this page again from the start">
                <RotateCcw size={16} aria-hidden="true" /> <span>Again</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {tocOpen && (
        <div className="bk-toc" role="dialog" aria-modal="true" aria-label="Chapters">
          <button type="button" className="bk-toc-scrim" aria-label="Close chapters" onClick={() => setTocOpen(false)} />
          <div className="bk-toc-panel">
            <div className="bk-toc-head">
              <h2>Chapters</h2>
              <button type="button" className="bk-icon" onClick={() => setTocOpen(false)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            {film && (
              <button
                type="button"
                className="bk-toc-film"
                onClick={() => {
                  setTocOpen(false);
                  openVideo(film);
                }}
              >
                <span className="bk-toc-film-thumb" aria-hidden="true">
                  <img src={film.poster} alt="" />
                  <Play size={18} />
                </span>
                <span>
                  <strong>{film.title}</strong>
                  <small>{film.label || "Our mission animation"}</small>
                </span>
              </button>
            )}
            <ol>
              {pages.map((p, i) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className={i === index ? "is-current" : ""}
                    aria-current={i === index ? "page" : undefined}
                    onClick={() => {
                      setTocOpen(false);
                      goTo(i);
                    }}
                  >
                    <span className="bk-toc-n">{i === 0 ? "★" : i}</span>
                    <span className="bk-toc-t">
                      {i === 0 ? "Cover" : displayText(p.title)}
                      {p.video && <Video size={15} className="bk-toc-video" aria-label="has a video" />}
                    </span>
                    {(() => {
                      const pt = timing.pages[p.id];
                      const d = readingTime(pt?.seconds ?? pt?.duration);
                      return (
                        <span className="bk-toc-d">
                          <span aria-hidden="true">{d.short}</span>
                          <span className="bk-sr">{d.spoken}</span>
                        </span>
                      );
                    })()}
                  </button>
                </li>
              ))}
            </ol>
            {bookSources.length > 0 && (
              <section className="bk-toc-sources" aria-labelledby="bk-toc-sources-title">
                <h3 id="bk-toc-sources-title">Where the facts come from</h3>
                <ol>
                  {bookSources.map((src) => (
                    <li key={src.id}>
                      <a href={src.url} target="_blank" rel="noreferrer">
                        {src.title}
                      </a>
                      <small>{src.publisher}</small>
                    </li>
                  ))}
                </ol>
                <p>Photos and videos come from the NASA Image and Video Library (public domain) unless their caption says otherwise. The pictures were drawn for this book.</p>
              </section>
            )}
          </div>
        </div>
      )}

      <Lightbox item={viewer} onClose={() => setViewer(null)} />
    </div>
  );
}
