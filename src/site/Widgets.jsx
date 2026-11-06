import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Pause, Volume2 } from "lucide-react";
import { NASA_SEARCH_API } from "../lib/nasa";
import { signalHours } from "../data/catalog";

/* ------------------------------------------------------------------ coordinates */

export function formatLatLon(lat, lon) {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(2)}° ${ns}, ${Math.abs(lon).toFixed(2)}° ${ew}`;
}

/**
 * A flat map of the Moon or Mars, drawn from the same texture as the 3D globe, with a pin where the
 * machine sleeps. Latitude and longitude use the same convention as the globe (east is positive).
 */
export function LocatorMap({ world, lat, lon, name, pinLabel }) {
  const src = world === "mars" ? "/models/2k_mars.jpeg" : "/models/2k_moon.jpeg";
  const left = ((lon + 180) / 360) * 100;
  const top = ((90 - lat) / 180) * 100;
  const body = world === "mars" ? "Mars" : "the Moon";
  return (
    <figure className="sx-locator">
      <div className="sx-locator-map" style={{ backgroundImage: `url(${src})` }} role="img" aria-label={`Flat map of ${body}. ${name} is at ${formatLatLon(lat, lon)}.`}>
        <span className="sx-locator-eq" aria-hidden="true" />
        <span className="sx-locator-pm" aria-hidden="true" />
        <span className="sx-pin" style={{ left: `${left}%`, top: `${top}%` }} aria-hidden="true">
          <span className="sx-pin-pulse" />
          <span className="sx-pin-dot" />
          <span className={`sx-pin-label${left > 70 ? " is-left" : ""}`}>{pinLabel || name}</span>
        </span>
      </div>
      <figcaption>
        <strong>{formatLatLon(lat, lon)}</strong>
        <span>Flat map. The line across the middle is the equator, the line down the middle is the prime meridian.</span>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ distance ruler */

const MARKS = [
  { au: 1, label: "Earth" },
  { au: 5.2, label: "Jupiter" },
  { au: 9.6, label: "Saturn" },
  { au: 19.2, label: "Uranus" },
  { au: 30.1, label: "Neptune" },
  { au: 39.5, label: "Pluto" },
  { au: 120, label: "Edge of the Sun's bubble" },
];
const AU_MIN = 0.7;
const AU_MAX = 200;
const place = (au) => ((Math.log10(au) - Math.log10(AU_MIN)) / (Math.log10(AU_MAX) - Math.log10(AU_MIN))) * 100;

/** How far a deep-space probe has gone, on a scale where each step is a multiple of the last. */
export function DistanceRuler({ au, name }) {
  const hours = signalHours(au);
  return (
    <figure className="sx-ruler">
      <div className="sx-ruler-track" role="img" aria-label={`${name} is about ${au} astronomical units from the Sun, beyond ${MARKS.filter((m) => m.au < au).map((m) => m.label).join(", ")}.`}>
        <span className="sx-ruler-line" aria-hidden="true" />
        {MARKS.map((m, i) => (
          <span key={m.label} className={`sx-ruler-mark${i % 2 ? " is-low" : ""}${m.au > 100 ? " is-edge" : ""}`} style={{ left: `${place(m.au)}%` }} aria-hidden="true">
            <i />
            <b>{m.label}</b>
          </span>
        ))}
        <span className="sx-ruler-probe" style={{ left: `${place(au)}%` }} aria-hidden="true">
          <span className="sx-pin-pulse" />
          <span className="sx-pin-dot" />
          <em>{name}</em>
        </span>
      </div>
      <figcaption>
        <strong>About {au} AU from the Sun</strong>
        <span>
          One AU is the distance from Earth to the Sun. A radio message from this probe needs about {hours < 24 ? `${Math.round(hours)} hours` : "a day"} to reach us. The scale is stretched so the nearby planets stay visible, and the distance is an estimate for late 2026.
        </span>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ read aloud */

/** Reads text aloud with the browser's built-in voice. Nothing is downloaded or sent anywhere. */
export function useSpeech(paragraphs) {
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const [speaking, setSpeaking] = useState(false);
  const text = useMemo(() => paragraphs.join(" "), [paragraphs]);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  const start = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => /^en[-_](US|GB)/i.test(v.lang) && /natural|google|samantha|daniel|serena|jenny/i.test(v.name)) || voices.find((v) => /^en/i.test(v.lang));
    if (voice) u.voice = voice;
    u.lang = voice?.lang || "en-US";
    u.rate = 0.94;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  }, [supported, text]);

  useEffect(() => stop, [stop]);
  return { supported, speaking, toggle: () => (speaking ? stop() : start()) };
}

export function ListenButton({ paragraphs }) {
  const { supported, speaking, toggle } = useSpeech(paragraphs);
  if (!supported) return null;
  return (
    <button type="button" className="hp-btn hp-btn-quiet sx-listen" onClick={toggle} aria-pressed={speaking}>
      {speaking ? <Pause size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
      {speaking ? "Stop reading" : "Read it aloud"}
    </button>
  );
}

/* ------------------------------------------------------------------ NASA photo strip */

/** A few real NASA photos found with the public NASA Image and Video Library search. */
export function PhotoStrip({ query, onOpen }) {
  const [state, setState] = useState("idle");
  const [items, setItems] = useState([]);
  const host = useRef(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return undefined;
    const ctrl = new AbortController();
    let started = false;
    const run = async () => {
      if (started) return;
      started = true;
      setState("loading");
      try {
        const res = await fetch(`${NASA_SEARCH_API}?q=${encodeURIComponent(query)}&media_type=image&page_size=18`, { signal: ctrl.signal });
        if (!res.ok) throw new Error(String(res.status));
        const json = await res.json();
        const found = (json.collection?.items || [])
          .map((it) => {
            const d = it.data?.[0] || {};
            const thumb = it.links?.find((l) => l.render === "image")?.href;
            return d.nasa_id && thumb ? { id: d.nasa_id, title: d.title, center: d.center, date: (d.date_created || "").slice(0, 4), thumb: thumb.replace(/^http:/, "https:") } : null;
          })
          .filter(Boolean)
          .slice(0, 8);
        setItems(found);
        setState("done");
      } catch (e) {
        if (e.name !== "AbortError") setState("error");
      }
    };
    if (!("IntersectionObserver" in window)) {
      run();
      return () => ctrl.abort();
    }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (run(), io.disconnect()), { rootMargin: "300px" });
    io.observe(el);
    return () => {
      io.disconnect();
      ctrl.abort();
    };
  }, [query]);

  const fallback = `https://images.nasa.gov/search?q=${encodeURIComponent(query)}`;
  return (
    <div ref={host} className="sx-photos">
      {state === "loading" && (
        <ul className="sx-photo-grid" aria-busy="true">
          {Array.from({ length: 4 }, (_, i) => (
            <li key={i} className="sx-photo-skel" aria-hidden="true" />
          ))}
        </ul>
      )}
      {state === "done" && items.length > 0 && (
        <ul className="sx-photo-grid">
          {items.map((it) => (
            <li key={it.id}>
              <button type="button" onClick={() => onOpen({ kind: "photo", nasa: it.id, title: it.title, caption: it.title, credit: `NASA${it.center ? ` / ${it.center}` : ""} · ${it.id}${it.date ? ` · ${it.date}` : ""}` })}>
                <img src={it.thumb} alt={it.title} loading="lazy" referrerPolicy="no-referrer" />
                <span>{it.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {(state === "error" || (state === "done" && items.length === 0)) && (
        <p className="sx-photo-note">NASA's photo library did not answer just now, but you can still browse the real pictures there.</p>
      )}
      <a className="sx-photo-more" href={fallback} target="_blank" rel="noreferrer">
        More photos at images.nasa.gov <ExternalLink size={15} aria-hidden="true" />
      </a>
    </div>
  );
}
