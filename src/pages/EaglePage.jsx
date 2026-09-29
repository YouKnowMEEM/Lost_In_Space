import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Volume2, VolumeX } from "lucide-react";
import { NASA_URL, PAGES } from "../data/eagleStory";
import { useNarrator } from "../hooks/useNarrator";
import "./eagle.css";

const LAST = PAGES.length - 1;

// Eagle, drawn as a friendly character: two windows for eyes, four legs, a golden coat.
// The top half (.eg-up) and bottom half (.eg-down) move separately in the story.
function Eagle({ pose }) {
    return (
        <svg
            className={`eg-eagle eg-pose-${pose}`}
            viewBox="0 0 140 140"
            role="img"
            aria-label="Eagle, a little golden moon ship with four legs"
        >
            <g className="eg-down" stroke="#a97a22" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
                <path d="M40 92 14 126M100 92l26 34M57 98l-7 28M83 98l7 28" fill="none" strokeWidth="5" />
                <g fill="#f0b93d" strokeWidth="2.5">
                    <ellipse cx="14" cy="129" rx="11" ry="4" />
                    <ellipse cx="126" cy="129" rx="11" ry="4" />
                    <ellipse cx="50" cy="129" rx="10" ry="3.5" />
                    <ellipse cx="90" cy="129" rx="10" ry="3.5" />
                </g>
                <path d="M62 102 57 114h26l-5-12z" fill="#d79a2b" />
                <rect x="30" y="80" width="80" height="24" rx="9" fill="#ffc94d" />
                <g className="eg-sleepface" fill="none" stroke="#1e2a5a" strokeWidth="2.5">
                    <path d="M52 91q5 5 10 0M78 91q5 5 10 0M64 97q6 4 12 0" />
                </g>
            </g>
            <g className="eg-up" stroke="#a97a22" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
                <path d="M70 26V10" fill="none" />
                <circle cx="70" cy="9" r="3.5" fill="#ff6b6b" />
                <rect x="35" y="50" width="9" height="14" rx="3" fill="#e6a92f" />
                <rect x="96" y="50" width="9" height="14" rx="3" fill="#e6a92f" />
                <rect x="42" y="28" width="56" height="56" rx="20" fill="#ffe082" />
                <circle cx="70" cy="30" r="8" fill="#f0b93d" />
                <g className="eg-eyes" stroke="none">
                    <circle cx="58" cy="54" r="9" fill="#fff" />
                    <circle cx="82" cy="54" r="9" fill="#fff" />
                    <circle cx="60" cy="56" r="4.5" fill="#1e2a5a" />
                    <circle cx="84" cy="56" r="4.5" fill="#1e2a5a" />
                </g>
                <ellipse cx="47" cy="68" rx="4" ry="2.5" fill="#ff9aa8" stroke="none" />
                <ellipse cx="93" cy="68" rx="4" ry="2.5" fill="#ff9aa8" stroke="none" />
                <path d="M62 70q8 7 16 0" fill="none" stroke="#1e2a5a" strokeWidth="2.5" />
            </g>
        </svg>
    );
}

const Sparkles = () => (
    <>
        {Array.from({ length: 12 }, (_, i) => (
            <i key={i} className="eg-spark" style={{ "--x": (i * 37 + 8) % 92, "--y": (i * 53 + 6) % 58, "--i": i }} />
        ))}
    </>
);

export default function EaglePage() {
    const [page, setPage] = useState(0);
    const [reading, setReading] = useState(false); // "Read to me" mode: read aloud, then turn the page
    const { supported, line, speak, stop } = useNarrator();
    const heading = useRef(null);
    const p = PAGES[page];

    const go = useCallback((n) => setPage(Math.max(0, Math.min(LAST, n))), []);

    // Light page chrome while the book is open; everything is restored on leave.
    useEffect(() => {
        const { body, documentElement: root } = document;
        const title = document.title;
        const bodyBg = body.style.background;
        const rootBg = root.style.background;
        document.title = "Eagle, the little ship that touched the Moon — Sleeping Beauties";
        body.style.background = "#dff3ff";
        root.style.background = "#dff3ff";
        return () => {
            document.title = title;
            body.style.background = bodyBg;
            root.style.background = rootBg;
        };
    }, []);

    // Move focus to the page title after every turn (keyboard and screen-reader friendly).
    useEffect(() => {
        if (heading.current) heading.current.focus({ preventScroll: true });
    }, [page]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "ArrowRight") go(page + 1);
            if (e.key === "ArrowLeft") go(page - 1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [page, go]);

    // Read this page aloud, wait a moment, then turn the page and keep going until the end.
    useEffect(() => {
        if (!reading || !PAGES[page].lines.length) return undefined;
        let turn = 0;
        speak(PAGES[page].lines, () => {
            turn = setTimeout(() => (page < LAST ? setPage(page + 1) : setReading(false)), 1100);
        });
        return () => {
            clearTimeout(turn);
            stop();
        };
    }, [reading, page, speak, stop]);

    return (
        <div className="eg">
            <header className="eg-top">
                <Link className="eg-btn sm" to="/moon">
                    <ArrowLeft size={18} /> Moon
                </Link>
                <Link className="eg-btn sm" to="/">
                    Home
                </Link>
                {supported && page > 0 && (
                    <button
                        type="button"
                        className="eg-btn sm eg-listen"
                        aria-pressed={reading}
                        onClick={() => setReading((r) => !r)}
                    >
                        {reading ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        {reading ? "Stop reading" : "Read to me"}
                    </button>
                )}
            </header>

            <main className="eg-book" key={p.id} aria-label={`Page ${page + 1} of ${PAGES.length}`}>
                <section className={`eg-stage ${p.sky || ""} ${p.fx ? `fx-${p.fx}` : ""}`}>
                    <Sparkles />
                    {p.eagle && <Eagle pose={p.eagle} />}
                    {p.icons.length > 0 && (
                        <div className="eg-icons">
                            {p.icons.map((icon, i) => (
                                <span key={i} className="eg-ic" style={{ "--i": i }} aria-hidden="true">
                  {icon}
                </span>
                            ))}
                        </div>
                    )}
                </section>

                <section className="eg-text">
                    {page === 0 ? (
                        <>
                            <h1 ref={heading} tabIndex={-1}>
                                {p.title}
                            </h1>
                            <p className="eg-sub">{p.sub}</p>
                            <p className="eg-note">A true story from July 1969</p>
                            <div className="eg-cta">
                                {supported && (
                                    <button
                                        type="button"
                                        className="eg-btn eg-primary"
                                        onClick={() => {
                                            go(1);
                                            setReading(true);
                                        }}
                                    >
                                        <Volume2 size={20} /> Read to me
                                    </button>
                                )}
                                <button type="button" className="eg-btn" onClick={() => go(1)}>
                                    {supported ? "Read it myself" : "Start the story"}
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 ref={heading} tabIndex={-1}>
                                {p.title}
                            </h2>
                            <p className="eg-story">
                                {p.lines.map((s, i) => (
                                    <span key={i} className={line === i ? "eg-on" : undefined}>
                    {s}{" "}
                  </span>
                                ))}
                            </p>
                            {page === LAST && (
                                <div className="eg-end">
                                    <span className="eg-the-end">The End</span>
                                    <Link className="eg-btn eg-primary" to="/moon">
                                        Visit the Moon
                                    </Link>
                                    <button type="button" className="eg-btn" onClick={() => go(0)}>
                                        Read again
                                    </button>
                                    <a href={NASA_URL} target="_blank" rel="noreferrer">
                                        Grown-ups: read the real story at NASA
                                    </a>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </main>

            <nav className="eg-nav" aria-label="Story pages">
                <button type="button" className="eg-btn" onClick={() => go(page - 1)} disabled={page === 0}>
                    <ArrowLeft size={20} /> Back
                </button>
                <div className="eg-dots">
                    {PAGES.map((x, i) => (
                        <button
                            key={x.id}
                            type="button"
                            className={i === page ? "on" : undefined}
                            aria-label={`Page ${i + 1}: ${x.title}`}
                            aria-current={i === page ? "page" : undefined}
                            onClick={() => go(i)}
                        />
                    ))}
                </div>
                <button type="button" className="eg-btn eg-primary" onClick={() => go(page + 1)} disabled={page === LAST}>
                    {page === 0 ? "Start" : "Next"} <ArrowRight size={20} />
                </button>
            </nav>
        </div>
    );
}
