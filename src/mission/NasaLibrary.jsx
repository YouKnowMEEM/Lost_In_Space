import React, { useCallback, useEffect, useRef, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { NASA_SEARCH_API } from "../lib/nasa";

/** Live search of NASA's Image and Video Library (public API, no key needed). */
export default function NasaLibrary({ initialQuery, onOpen }) {
  const [query, setQuery] = useState(initialQuery);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [state, setState] = useState("idle");
  const ctrl = useRef(null);

  const run = useCallback(async (q, p = 1) => {
    if (!q.trim()) return;
    ctrl.current?.abort();
    const controller = new AbortController();
    ctrl.current = controller;
    setState("loading");
    try {
      const url = `${NASA_SEARCH_API}?q=${encodeURIComponent(q.trim())}&media_type=image&page=${p}&page_size=18`;
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(String(res.status));
      const json = await res.json();
      const found = (json.collection?.items || [])
        .map((it) => {
          const d = it.data?.[0] || {};
          const thumb = it.links?.find((l) => l.render === "image" || /thumb/.test(l.href))?.href;
          return d.nasa_id && thumb
            ? { id: d.nasa_id, title: d.title, date: (d.date_created || "").slice(0, 10), center: d.center, thumb: thumb.replace(/^http:/, "https:") }
            : null;
        })
        .filter(Boolean);
      setItems((prev) => (p === 1 ? found : [...prev, ...found]));
      setTotal(json.collection?.metadata?.total_hits || 0);
      setPage(p);
      setState("done");
    } catch (e) {
      if (e.name !== "AbortError") setState("error");
    }
  }, []);

  useEffect(() => {
    const el = document.getElementById("library");
    if (!el || !("IntersectionObserver" in window)) {
      run(initialQuery);
      return undefined;
    }
    // Only call the API once the reader scrolls near this section.
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        run(initialQuery);
        io.disconnect();
      }
    }, { rootMargin: "300px" });
    io.observe(el);
    return () => {
      io.disconnect();
      ctrl.current?.abort();
    };
  }, [initialQuery, run]);

  return (
    <div className="mf-lib">
      <form
        className="mf-lib-form"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          run(query, 1);
        }}
      >
        <Search size={18} aria-hidden="true" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search NASA's Image and Video Library" placeholder="Search NASA images" />
        <button type="submit">Search</button>
      </form>
      {state === "error" && (
        <p className="mf-lib-note">
          The NASA library did not answer just now. You can{" "}
          <a href={`https://images.nasa.gov/search?q=${encodeURIComponent(query)}`} target="_blank" rel="noreferrer">
            search it directly at images.nasa.gov <ExternalLink size={13} aria-hidden="true" />
          </a>
          .
        </p>
      )}
      {state === "done" && items.length === 0 && <p className="mf-lib-note">No images found. Try a different word, like “lander” or “crater”.</p>}
      <ul className="mf-lib-grid" aria-busy={state === "loading"}>
        {items.map((it) => (
          <li key={it.id}>
            <button type="button" onClick={() => onOpen({ kind: "photo", nasa: it.id, caption: it.title, credit: `NASA${it.center ? ` / ${it.center}` : ""} · ${it.id}${it.date ? ` · ${it.date}` : ""}` })}>
              <img src={it.thumb} alt={it.title} loading="lazy" referrerPolicy="no-referrer" />
              <span>{it.title}</span>
            </button>
          </li>
        ))}
        {state === "loading" &&
          Array.from({ length: items.length ? 6 : 12 }, (_, i) => <li key={`s${i}`} className="mf-lib-skeleton" aria-hidden="true" />)}
      </ul>
      {state === "done" && items.length > 0 && items.length < total && (
        <button type="button" className="mf-btn mf-btn-ghost mf-lib-more" onClick={() => run(query, page + 1)}>
          Show more ({total.toLocaleString()} results)
        </button>
      )}
    </div>
  );
}
