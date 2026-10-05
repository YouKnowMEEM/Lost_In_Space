import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Pause, Play } from "lucide-react";
import { WORLDS } from "./homeData";

const TAU = Math.PI * 2;
const AUTOPLAY_MS = 5600;
const IDLE_AFTER_TOUCH = 7000;
const wrap = (v, n) => ((v % n) + n) % n;
/** Signed distance from position p to item i, the short way round a ring of n items. */
const offsetOf = (i, p, n) => {
  let d = wrap(i - p, n);
  if (d > n / 2) d -= n;
  return d;
};
/** 1 at the front of the ring, 0 at the back. */
const depthOf = (i, p, n) => (Math.cos((offsetOf(i, p, n) / n) * TAU) + 1) / 2;
const scaleAt = (z) => 0.3 + 0.7 * Math.pow(z, 2.1);

function RingItem({ item, index, n, pos, tick, geo, active, onPick }) {
  const at = (fn) => ([p]) => fn(p, geo.current);
  const x = useTransform([pos, tick], at((p, g) => Math.sin((offsetOf(index, p, n) / n) * TAU) * g.rx));
  const y = useTransform([pos, tick], at((p, g) => -(1 - depthOf(index, p, n)) * g.ry));
  const scale = useTransform([pos, tick], at((p) => scaleAt(depthOf(index, p, n))));
  const opacity = useTransform([pos, tick], at((p) => 0.08 + 0.92 * Math.pow(depthOf(index, p, n), 1.7)));
  const zIndex = useTransform([pos, tick], at((p) => Math.round(depthOf(index, p, n) * 100)));
  const filter = useTransform([pos, tick], at((p) => `brightness(${(0.32 + 0.68 * depthOf(index, p, n)).toFixed(3)})`));

  return (
    <motion.button
      type="button"
      className={`hp-ring-item${active ? " is-front" : ""}`}
      style={{ x, y, scale, opacity, zIndex, filter }}
      onClick={() => onPick(index)}
      tabIndex={-1}
      aria-hidden="true"
    >
      <img src={item.img} alt="" draggable={false} decoding="async" />
    </motion.button>
  );
}

/** The museum label for one object. The hidden copies size the label to the longest one. */
function Label({ item, live = false }) {
  return (
    <div className="hp-label-inner">
      <p className={`hp-status${item.status === "Still awake" ? " is-awake" : ""}`} style={{ "--accent": WORLDS[item.world].accent }}>
        <span className="hp-status-dot" aria-hidden="true" />
        {item.status}
      </p>
      <p className="hp-name">{item.name}</p>
      <p className="hp-kind">
        <span>{item.kind}</span>
        <span className="hp-place">
          <MapPin size={17} aria-hidden="true" />
          {item.place}
        </span>
      </p>
      <p className="hp-text">{item.text}</p>
      <div className="hp-actions">
        {item.links.map((l) =>
          live ? (
            <Link key={l.to} to={l.to} className={`hp-btn ${l.primary ? "hp-btn-primary" : "hp-btn-quiet"}`}>
              {l.label}
              {l.primary && <ArrowRight size={18} aria-hidden="true" />}
            </Link>
          ) : (
            <span key={l.to} className={`hp-btn ${l.primary ? "hp-btn-primary" : "hp-btn-quiet"}`}>
              {l.label}
              {l.primary && <ArrowRight size={18} aria-hidden="true" />}
            </span>
          )
        )}
      </div>
    </div>
  );
}

/**
 * The sleeping beauties on a slowly turning ring. Position is one spring-driven number,
 * so every object glides together; drag, swipe, arrow keys, the side buttons and the
 * thumbnails all move that same number.
 */
export default function ObjectRing({ items }) {
  const n = items.length;
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const pos = useMotionValue(reduced ? 0 : -2.4);
  const tick = useMotionValue(0);
  const target = useRef(0);
  const anim = useRef(null);
  const drag = useRef(null);
  const lastTouch = useRef(0);
  const entering = useRef(!reduced);
  const wheel = useRef({ acc: 0, t: 0 });
  const stageRef = useRef(null);
  const rootRef = useRef(null);
  const geo = useRef({ w: 1000, h: 480, rx: 420, ry: 56, itemW: 340, itemH: 290, step: 300 });
  const [g, setG] = useState(geo.current);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [touched, setTouched] = useState(false);

  // Size the ring to its stage.
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const measure = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const narrow = w < 640;
      const itemW = Math.min(400, Math.max(172, w * (narrow ? 0.56 : 0.33)));
      const itemH = Math.min(h * 0.8, itemW * 0.88);
      const rx = Math.min(w * (narrow ? 0.4 : 0.41), 620);
      const next = { w, h, rx, ry: itemH * (narrow ? 0.14 : 0.17), itemW, itemH, step: Math.max(110, rx * 0.72) };
      geo.current = next;
      setG(next);
      tick.set(tick.get() + 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [tick]);

  useMotionValueEvent(pos, "change", (p) => {
    if (entering.current) return;
    const i = wrap(Math.round(p), n);
    if (i !== activeRef.current) {
      activeRef.current = i;
      setActive(i);
    }
  });

  const glide = useCallback(
    (to, extra, { entrance = false } = {}) => {
      if (!entrance) entering.current = false;
      target.current = to;
      anim.current?.stop();
      anim.current = animate(pos, to, reduced ? { duration: 0 } : { type: "spring", stiffness: 48, damping: 14.5, mass: 1, restDelta: 0.0005, ...extra });
    },
    [pos, reduced]
  );

  // One orchestrated entrance: the ring turns into place.
  useEffect(() => {
    if (reduced) {
      entering.current = false;
      anim.current?.stop();
      pos.set(target.current);
      return;
    }
    glide(
      0,
      {
        stiffness: 38,
        damping: 13,
        onComplete: () => {
          entering.current = false;
        },
      },
      { entrance: true }
    );
  }, [glide, reduced, pos]);

  const userMoved = useCallback(() => {
    entering.current = false;
    lastTouch.current = performance.now();
    setTouched(true);
  }, []);
  const next = useCallback(() => {
    userMoved();
    glide(target.current + 1);
  }, [glide, userMoved]);
  const prev = useCallback(() => {
    userMoved();
    glide(target.current - 1);
  }, [glide, userMoved]);
  const pick = useCallback(
    (i) => {
      userMoved();
      glide(target.current + offsetOf(i, target.current, n));
    },
    [glide, n, userMoved]
  );
  const onRingPick = useCallback(
    (i) => {
      if (drag.current?.moved) return;
      if (i === activeRef.current) navigate(items[i].links[0].to);
      else pick(i);
    },
    [items, navigate, pick]
  );

  // Checked at the moment of each turn, so a stale flag can never freeze the ring: a mouse
  // resting on a button or thumbnail, or keyboard focus on one, holds it still.
  const isHeld = useCallback(() => {
    const root = rootRef.current;
    if (!root) return false;
    const canHover = window.matchMedia?.("(hover: hover)").matches;
    if (canHover && root.querySelector(".hp-actions:hover, .hp-pips:hover")) return true;
    const el = document.activeElement;
    return Boolean(el && root.contains(el) && el.closest(".hp-actions, .hp-pips") && el.matches(":focus-visible"));
  }, []);

  // Turn by itself. Anything that should hold the ring still (a drag, a pointer resting on
  // the label, keyboard focus on a link, a hidden tab, a recent touch) only delays the next
  // turn: the timer always reschedules itself, so the ring can never stop for good unless
  // the reader presses pause.
  useEffect(() => {
    if (reduced || paused || !inView) return undefined;
    let timer = 0;
    const later = (ms) => {
      timer = window.setTimeout(turn, ms);
    };
    const turn = () => {
      const d = drag.current;
      if (d && performance.now() - d.t0 > 8000) drag.current = null;
      const sinceTouch = performance.now() - lastTouch.current;
      if (sinceTouch < IDLE_AFTER_TOUCH) return later(IDLE_AFTER_TOUCH - sinceTouch + 50);
      if (document.hidden || drag.current || isHeld()) return later(1200);
      glide(target.current + 1);
      return later(AUTOPLAY_MS);
    };
    later(AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [reduced, paused, inView, glide, isHeld]);

  // A drag that ends outside the page must not leave the ring thinking it is still held.
  useEffect(() => {
    const release = () => {
      const d = drag.current;
      if (d && !d.moved) drag.current = null;
    };
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    window.addEventListener("blur", release);
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("blur", release);
    };
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !("IntersectionObserver" in window)) return undefined;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Dragging and swiping.
  const onPointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    anim.current?.stop();
    const now = performance.now();
    drag.current = { id: e.pointerId, x0: e.clientX, p0: pos.get(), lastX: e.clientX, lastT: now, t0: now, v: 0, moved: false };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x0;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      stageRef.current?.setPointerCapture?.(e.pointerId);
      userMoved();
    }
    if (!d.moved) return;
    pos.set(d.p0 - dx / geo.current.step);
    const now = performance.now();
    const dt = now - d.lastT;
    if (dt > 0) {
      d.v = 0.6 * d.v + 0.4 * ((e.clientX - d.lastX) / dt);
      d.lastX = e.clientX;
      d.lastT = now;
    }
  };
  const endDrag = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    if (!d.moved) {
      drag.current = null;
      glide(target.current);
      return;
    }
    const velocity = (-d.v * 1000) / geo.current.step; // items per second
    const here = pos.get();
    const flung = Math.round(here + Math.max(-2.5, Math.min(2.5, velocity * 0.22)));
    glide(flung, { velocity });
    // Let the click that follows a drag pass without selecting anything.
    window.setTimeout(() => {
      drag.current = null;
    }, 0);
  };

  const onWheel = (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    const w = wheel.current;
    const now = performance.now();
    if (now - w.t > 400) w.acc = 0;
    w.t = now;
    w.acc += e.deltaX;
    if (Math.abs(w.acc) > 70) {
      if (w.acc > 0) next();
      else prev();
      w.acc = 0;
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  // The floor the objects stand on: traced through where each object's feet would be.
  const orbit = useMemo(() => {
    const pts = [];
    for (let k = 0; k <= 96; k += 1) {
      const a = (k / 96) * TAU;
      const z = (Math.cos(a) + 1) / 2;
      const x = Math.sin(a) * g.rx;
      const y = -(1 - z) * g.ry + 0.43 * g.itemH * scaleAt(z);
      pts.push(`${k ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return `${pts.join(" ")}Z`;
  }, [g]);

  const item = items[active];
  const accent = WORLDS[item.world].accent;

  return (
    <div
      ref={rootRef}
      className="hp-ring"
      role="region"
      aria-roledescription="carousel"
      aria-label="The sleeping beauties"
      style={{ "--accent": accent }}
      onKeyDown={onKeyDown}
    >
      <div
        ref={stageRef}
        className="hp-ring-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={onWheel}
      >
        <svg className="hp-ring-orbit" viewBox={`${-g.w / 2} ${-g.h / 2} ${g.w} ${g.h}`} aria-hidden="true">
          <defs>
            <linearGradient id="hp-orbit-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#c9d5ff" stopOpacity="0.05" />
              <stop offset="1" stopColor="#c9d5ff" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <path d={orbit} fill="none" stroke="url(#hp-orbit-fade)" strokeWidth="1.5" />
        </svg>
        <div className="hp-ring-glow" style={{ width: g.itemW * 1.15, height: g.itemW * 0.26, marginTop: g.itemH * 0.38 }} aria-hidden="true" />
        <div className="hp-ring-float" style={{ "--item-w": `${g.itemW}px`, "--item-h": `${g.itemH}px` }}>
          {items.map((it, i) => (
            <RingItem key={it.id} item={it} index={i} n={n} pos={pos} tick={tick} geo={geo} active={i === active} onPick={onRingPick} />
          ))}
        </div>
        <button type="button" className="hp-ring-arrow is-prev" onClick={prev} aria-label="Previous sleeping beauty">
          <ChevronLeft size={26} aria-hidden="true" />
        </button>
        <button type="button" className="hp-ring-arrow is-next" onClick={next} aria-label="Next sleeping beauty">
          <ChevronRight size={26} aria-hidden="true" />
        </button>
      </div>

      <div className="hp-label" aria-live={touched || paused ? "polite" : "off"}>
        <div className="hp-label-sizer" aria-hidden="true">
          {items.map((it) => (
            <Label key={it.id} item={it} />
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={item.id}
            className="hp-label-live"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.26, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <Label item={item} live />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="hp-pips">
        <div className="hp-pips-list" role="group" aria-label="Choose a sleeping beauty">
          {items.map((it, i) => (
            <button
              key={it.id}
              type="button"
              className={`hp-pip${i === active ? " is-on" : ""}`}
              style={{ "--pip": WORLDS[it.world].accent }}
              onClick={() => pick(i)}
              aria-label={it.name}
              aria-current={i === active ? "true" : undefined}
            >
              <img src={it.img} alt="" draggable={false} />
            </button>
          ))}
        </div>
        {!reduced && (
          <button
            type="button"
            className="hp-pause"
            onClick={() => {
              setPaused((v) => !v);
              userMoved();
            }}
            aria-label={paused ? "Turn the ring automatically" : "Stop turning the ring"}
            aria-pressed={paused}
          >
            {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
          </button>
        )}
      </div>
    </div>
  );
}
