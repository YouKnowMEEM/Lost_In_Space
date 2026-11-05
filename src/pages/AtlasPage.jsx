import React, { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, BookOpen, Search } from "lucide-react";
import Page from "../site/SiteChrome";
import ObjectArt from "../site/Glyphs";
import StateBadge from "../site/StateBadge";
import { CATALOG, STATES, WORLDS, stateCounts } from "../data/catalog";

const SORTS = {
  oldest: { label: "Oldest first", fn: (a, b) => a.year - b.year || a.name.localeCompare(b.name) },
  newest: { label: "Newest first", fn: (a, b) => b.year - a.year || a.name.localeCompare(b.name) },
  name: { label: "A to Z", fn: (a, b) => a.short.localeCompare(b.short) },
};

const decade = (y) => `${Math.floor(y / 10) * 10}s`;
const FIRST = Math.min(...CATALOG.map((c) => c.year));
const LAST = new Date().getFullYear();

function Chip({ active, onClick, children, color }) {
  return (
    <button type="button" className={`sx-filter${active ? " is-active" : ""}`} aria-pressed={active} onClick={onClick} style={color ? { "--chip": color } : undefined}>
      {children}
    </button>
  );
}

/** Every machine on one line: the x-axis is the year it reached its world. Each dot is a link. */
function Timeline({ items }) {
  const stack = {};
  const dots = items.map((c) => {
    const k = c.year;
    stack[k] = (stack[k] || 0) + 1;
    return { c, row: stack[k] - 1 };
  });
  const ticks = [];
  for (let y = Math.ceil(FIRST / 10) * 10; y <= LAST; y += 10) ticks.push(y);
  const pos = (y) => ((y - FIRST) / (LAST - FIRST)) * 100;
  return (
    <div className="at-timeline" role="region" aria-label="Timeline of every machine, by year. Scroll sideways on small screens." tabIndex={0}>
      <div className="at-tl-inner">
        <ul className="at-tl-dots">
          {dots.map(({ c, row }) => (
            <li key={c.id} style={{ left: `${pos(c.year)}%`, bottom: `${row * 26}px` }}>
              <Link to={c.route} className="at-tl-dot" style={{ "--dot": WORLDS[c.world].accent }} aria-label={`${c.short}, ${c.year}`}>
                <span className="at-tl-tip">
                  <b>{c.short}</b> {c.year}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="at-tl-axis" aria-hidden="true">
          {ticks.map((y) => (
            <span key={y} style={{ left: `${pos(y)}%` }}>
              {y}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function AtlasCard({ c }) {
  const w = WORLDS[c.world];
  return (
    <li>
      <Link to={c.route} className="at-card" style={{ "--accent": w.accent }}>
        <div className="at-card-art">
          <ObjectArt item={c} alt="" />
          <span className="at-card-world">{w.short}</span>
        </div>
        <div className="at-card-body">
          <div className="at-card-top">
            <StateBadge state={c.state} />
            <span className="at-card-year">{c.year}</span>
          </div>
          <h3>{c.short}</h3>
          {c.mission !== c.short && <p className="at-card-mission">{c.mission}</p>}
          <p className="at-card-tag">{c.tagline}</p>
          <span className="at-card-go">
            {c.hasStorybook ? (
              <>
                <BookOpen size={16} aria-hidden="true" /> Storybook
              </>
            ) : (
              <>Field notes</>
            )}
            <ArrowRight size={16} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </li>
  );
}

export default function AtlasPage() {
  const [params, setParams] = useSearchParams();
  const world = params.get("world") || "all";
  const state = params.get("state") || "all";
  const sort = SORTS[params.get("sort")] ? params.get("sort") : "oldest";
  const q = params.get("q") || "";

  const set = (key, value, fallback) => {
    const next = new URLSearchParams(params);
    if (!value || value === fallback) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const counts = useMemo(stateCounts, []);
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return CATALOG.filter((c) => (world === "all" || c.world === world) && (state === "all" || c.state === state))
      .filter((c) => !needle || [c.name, c.short, c.mission, c.program, c.type, c.tagline].filter(Boolean).join(" ").toLowerCase().includes(needle))
      .sort(SORTS[sort].fn);
  }, [world, state, sort, q]);

  const grouped = sort !== "name";
  const groups = useMemo(() => {
    if (!grouped) return [{ title: null, items: list }];
    const out = [];
    list.forEach((c) => {
      const t = decade(c.year);
      const last = out[out.length - 1];
      if (last && last.title === t) last.items.push(c);
      else out.push({ title: t, items: [c] });
    });
    return out;
  }, [list, grouped]);

  const resting = counts.asleep + counts.impact;

  return (
    <Page
      title="The Atlas: every machine NASA left behind · Sleeping Beauties"
      description={`${CATALOG.length} NASA machines on the Moon, on Mars and in deep space: when they flew, what they found and whether they are still awake.`}
      className="at"
    >
      <section className="at-hero" aria-labelledby="at-title">
        <p className="sx-eyebrow">The Atlas</p>
        <h1 id="at-title">{CATALOG.length} machines, {LAST - FIRST} years</h1>
        <p className="at-lede">
          Every spacecraft in this project, in one place. Some are asleep where they landed, some crashed on purpose, a few are still awake, and some are far out in space, still flying. Pick one to read its story.
        </p>
        <dl className="at-stats">
          <div>
            <dt>Resting on worlds</dt>
            <dd>{resting}</dd>
          </div>
          <div>
            <dt>Still awake</dt>
            <dd>{counts.awake}</dd>
          </div>
          <div>
            <dt>Adrift in space</dt>
            <dd>{counts.adrift}</dd>
          </div>
          <div>
            <dt>First launched</dt>
            <dd>{FIRST}</dd>
          </div>
        </dl>
      </section>

      <section className="at-section" aria-labelledby="tl-title">
        <h2 id="tl-title" className="at-h2">
          The timeline
        </h2>
        <Timeline items={list.length ? list : CATALOG} />
        <ul className="at-legend" aria-label="Colour key">
          {Object.values(WORLDS).map((w) => (
            <li key={w.id}>
              <span className="sx-dot" style={{ background: w.accent }} aria-hidden="true" /> {w.name}
            </li>
          ))}
        </ul>
      </section>

      <section className="at-section" aria-labelledby="find-title">
        <h2 id="find-title" className="at-h2">
          Find a machine
        </h2>
        <div className="at-controls">
          <div className="at-search">
            <Search size={19} aria-hidden="true" />
            <input type="search" value={q} onChange={(e) => set("q", e.target.value, "")} placeholder="Search: rover, Apollo, Jupiter…" aria-label="Search the Atlas" />
          </div>
          <div className="at-filter-row" role="group" aria-label="Filter by world">
            <Chip active={world === "all"} onClick={() => set("world", "all", "all")}>
              All worlds
            </Chip>
            {Object.values(WORLDS).map((w) => (
              <Chip key={w.id} active={world === w.id} onClick={() => set("world", w.id, "all")} color={w.accent}>
                {w.short}
              </Chip>
            ))}
          </div>
          <div className="at-filter-row" role="group" aria-label="Filter by status">
            <Chip active={state === "all"} onClick={() => set("state", "all", "all")}>
              Any status
            </Chip>
            {Object.values(STATES).map((s) => (
              <Chip key={s.id} active={state === s.id} onClick={() => set("state", s.id, "all")} color={s.color}>
                {s.label} <small>{counts[s.id]}</small>
              </Chip>
            ))}
          </div>
          <label className="at-sort">
            <span>Sort</span>
            <select value={sort} onChange={(e) => set("sort", e.target.value, "oldest")}>
              {Object.entries(SORTS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="at-count" role="status" aria-live="polite">
          Showing {list.length} of {CATALOG.length} machines
          {state !== "all" && ` · ${STATES[state].long}`}
        </p>

        {list.length === 0 ? (
          <div className="at-empty">
            <p>No machines match that search.</p>
            <button type="button" className="hp-btn hp-btn-quiet" onClick={() => setParams({}, { replace: true })}>
              Clear the filters
            </button>
          </div>
        ) : (
          groups.map((g) => (
            <div key={g.title || "all"} className="at-group">
              {g.title && <h3 className="at-decade">{g.title}</h3>}
              <ul className="at-grid">
                {g.items.map((c) => (
                  <AtlasCard key={c.id} c={c} />
                ))}
              </ul>
            </div>
          ))
        )}
      </section>

      <section className="at-section at-key" aria-labelledby="key-title">
        <h2 id="key-title" className="at-h2">
          What the status words mean
        </h2>
        <ul className="at-key-grid">
          {Object.values(STATES).map((s) => (
            <li key={s.id} style={{ "--state": s.color }}>
              <StateBadge state={s.id} />
              <p>{s.long}</p>
            </li>
          ))}
        </ul>
      </section>
    </Page>
  );
}
