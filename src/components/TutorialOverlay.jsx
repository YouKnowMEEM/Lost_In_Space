import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Hand, X, ZoomIn } from "lucide-react";
import JourneyLanding from "./JourneyLanding";
import IntroVideo from "./IntroVideo";
import Beacon from "./Beacon";
import "./tutorial.css";

const TOUR_KEY = "sb-space-tour-seen";
const TOUR_AUDIO_KEY = "__sbTutorialAudio";
const TOUR_AUDIO_ACTIVE_KEY = "__sbTutorialAudioActive";
const TOUR_AUDIO_RESUME_KEY = "__sbTutorialAudioResume";
const INTRO_FILM = "/video/journey-intro.mp4";

function clearTutorialAudioResume() {
  const resume = window[TOUR_AUDIO_RESUME_KEY];
  if (!resume) return;
  window.removeEventListener("pointerdown", resume);
  window.removeEventListener("keydown", resume);
  delete window[TOUR_AUDIO_RESUME_KEY];
}

function startTutorialMusic() {
  if (!window[TOUR_AUDIO_KEY]) {
    const audio = new Audio("/audio/music/deep-lullaby.mp3");
    audio.loop = true;
    audio.volume = 0.45;
    window[TOUR_AUDIO_KEY] = audio;
  }

  const audio = window[TOUR_AUDIO_KEY];
  const resumeOnGesture = () => {
    clearTutorialAudioResume();
    window[TOUR_AUDIO_ACTIVE_KEY] = true;
    audio.play().then(() => {
      if (window[TOUR_AUDIO_ACTIVE_KEY]) window.dispatchEvent(new Event("sb:tutorial-audio-start"));
      else audio.pause();
    }).catch(() => {
      window[TOUR_AUDIO_ACTIVE_KEY] = false;
      window.dispatchEvent(new Event("sb:tutorial-audio-stop"));
    });
  };

  window[TOUR_AUDIO_ACTIVE_KEY] = true;
  audio.play().then(() => {
    if (window[TOUR_AUDIO_ACTIVE_KEY]) window.dispatchEvent(new Event("sb:tutorial-audio-start"));
    else audio.pause();
  }).catch(() => {
    if (!window[TOUR_AUDIO_ACTIVE_KEY]) return;
    window[TOUR_AUDIO_ACTIVE_KEY] = false;
    window.dispatchEvent(new Event("sb:tutorial-audio-stop"));
    window[TOUR_AUDIO_RESUME_KEY] = resumeOnGesture;
    window.addEventListener("pointerdown", resumeOnGesture, { once: true });
    window.addEventListener("keydown", resumeOnGesture, { once: true });
  });
}

function stopTutorialMusic() {
  clearTutorialAudioResume();
  window[TOUR_AUDIO_ACTIVE_KEY] = false;
  const audio = window[TOUR_AUDIO_KEY];
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  window.dispatchEvent(new Event("sb:tutorial-audio-stop"));
}

/* ---------- What the page is showing right now ---------- */
const $ = (selector) => document.querySelector(selector);
const marsSelected = () => $(".solar-explore-pop > strong")?.textContent.trim().toUpperCase() === "MARS";
const vikingDetailsOpen = () => Boolean($('.moon-equipment-sidebar[aria-label="Viking 1 Lander details"]'));
const marsSearch = () => ($(".moon-search input")?.value || "").toLocaleLowerCase();
const searchingViking = () => marsSearch().includes("viking");
// PlanetGlobe adds up how far the visitor has turned the globe by hand (in radians).
const globeTurned = () => (window.__sbGlobeTurn || 0) > 0.75;

/** The element a step points at; `targetText` picks one of several matches by its text. */
function findTarget(step) {
  if (!step.target) return null;
  if (!step.targetText) return $(step.target);
  return [...document.querySelectorAll(step.target)].find((el) => el.textContent.toLocaleLowerCase().includes(step.targetText)) || null;
}

/*
 * The guided journey, one step at a time. Each step waits on its page (`path`) and moves on when
 * the visitor does the thing it asks for:
 *   next.button  - a button in the speech bubble
 *   next.click   - a click on the highlighted control
 *   next.when    - something becomes true on the page (Mars is selected, a panel opened…)
 *   next.after   - a number of milliseconds after the step appeared (a gentle fallback)
 *   next.path    - the visitor arrives on another page
 *   next.section / next.gallery - the visitor scrolls to a part of the mission file
 * `jumps` skip ahead when the visitor is quicker than the guide (e.g. finds Viking 1 by themselves).
 * `back` sends the visitor one step back if they undo what they just did.
 * `card` steps are a large welcome card instead of the astronaut's speech bubble; `tips` adds a
 * short list with icons to the bubble.
 * `hidden` steps only highlight a control (or let the page's own guide talk).
 * `restart` is the step to resume from if the visitor wanders off and comes back.
 */
const TOUR = [
  // Deep space: the journey opens with the whole solar system in view.
  { id: "welcome", path: "/space", restart: "welcome", ready: '.solar-home[data-scene-ready="true"]', delay: 900, card: true, label: "OUR SOLAR HOME",
    title: "Welcome to our solar home!",
    text: "That glowing ball in the middle is our Sun. Around it, the planets travel on their own paths, from little Mercury all the way out to Neptune and tiny Pluto. Somewhere out here, NASA’s sleeping machines are waiting to tell you their stories. Shall we go and find them?",
    next: { button: "Let’s explore!" } },
  { id: "library", path: "/space", restart: "library", target: '.topbar nav a[href="/library"]', beacon: true, avatar: "/images/astronautApollo11.png",
    title: "Every machine in one place", text: "Whenever you want to see all the machines together, open the Cosmic Library. Look, it’s glowing up there!",
    next: { button: "Got it!" },
    // Children will tap the glowing link: let them peek at the library, then bring them back.
    detour: { path: "/library", title: "Welcome to the Cosmic Library!", text: "Every machine we know of lives here, and you can come back whenever you like. Now, let’s carry on with our journey!", button: "Continue the journey" } },
  { id: "controls", path: "/space", restart: "controls", avatar: "/images/happyAstronaut.png",
    title: "Fly like an astronaut!", text: "You are the pilot now. Try it out:",
    tips: [
      { icon: ZoomIn, text: "Zoom in and out with your mouse wheel, or pinch with two fingers." },
      { icon: Hand, text: "Drag with your mouse or finger to turn left, right, up and down." },
    ],
    next: { button: "I’m ready!" } },
  { id: "find-mars", path: "/space", restart: "find-mars", target: ".solar-search input", avatar: "/images/astronaut.png",
    title: "Now, can you find Mars?", text: "Type “Mars” in the search bar, or look for the little red planet and tap it.",
    next: { when: marsSelected } },
  { id: "explore-mars", path: "/space", restart: "find-mars", target: ".solar-explore-pop button", avatar: "/images/happyAstronaut.png",
    title: "You found Mars!", text: "Tap “Explore” and we’ll fly down to it.",
    back: () => !marsSelected(), next: { path: "/mars" } },

  // Mars: first look around by hand, then learn the shortcut.
  { id: "find-viking", path: "/mars", restart: "find-viking", ready: '.moon-atlas[data-globe-ready="true"]', side: "left", compact: true, avatar: "/images/astronaut.png",
    title: "Can you find Viking 1?", text: "Drag Mars to turn it, and look for the glowing lights. Viking 1 is resting in the north, on a wide plain called Chryse Planitia.",
    jumps: [{ when: vikingDetailsOpen, to: "read-viking" }, { when: searchingViking, to: "pick-viking" }],
    next: { when: globeTurned, after: 30000 } },
  { id: "search-hint", path: "/mars", restart: "find-viking", target: ".moon-search input", side: "left", compact: true, avatar: "/images/astronautApollo11.png",
    title: "Here’s a shortcut!", text: "You can also search for it. Type “Viking” in the search bar.",
    jumps: [{ when: vikingDetailsOpen, to: "read-viking" }],
    next: { when: searchingViking } },
  { id: "pick-viking", path: "/mars", restart: "find-viking", target: ".moon-search-results button", targetText: "viking 1", side: "left", compact: true, avatar: "/images/astronautApollo11.png",
    title: "There it is!", text: "Tap “Viking 1 Lander” and we’ll fly straight to where it landed.",
    back: () => !searchingViking() && !vikingDetailsOpen(), next: { click: true, when: vikingDetailsOpen } },
  { id: "tap-viking", path: "/mars", restart: "find-viking", side: "left", compact: true, avatar: "/images/astronaut.png",
    title: "Tap the Viking 1 marker", text: "We’re above Chryse Planitia, the “Plains of Gold”. Tap the glowing marker in the middle to open Viking 1’s details.",
    next: { when: vikingDetailsOpen } },
  { id: "read-viking", path: "/mars", restart: "find-viking", target: ".moon-read-more", side: "left", compact: true, avatar: "/images/happyAstronaut.png",
    title: "Read Viking 1’s story", text: "Viking 1 has rested here since 1976. Tap “Read the story” to open its storybook.",
    back: () => !vikingDetailsOpen(), next: { path: "/viking-1" } },

  // Viking 1 storybook: the floating astronaut beside the book (StoryGuide) points to the Mission File.
  { id: "mission-file", path: "/viking-1", restart: "mission-file", hidden: true,
    allow: '.sbk-modes a[href="/viking-1/mission"], .bk-end-actions a[href="/viking-1/mission"]', next: { path: "/viking-1/mission" } },

  // Viking 1 mission file
  { id: "mf-3d", path: "/viking-1/mission", restart: "mf-3d", target: '.mf-btn[href="#spacecraft"], a[href="#spacecraft"]', raised: true, avatar: "/images/astronautApollo11.png",
    title: "Meet the real Viking 1", text: "Jump to the 3D model and spin the lander around.", next: { section: "#spacecraft" } },
  { id: "mf-photos", path: "/viking-1/mission", restart: "mf-photos", avatar: "/images/happyAstronaut.png",
    title: "Take a look around", text: "Keep scrolling for real photos and videos from Mars.", next: { gallery: true } },
];

const PAGE_NAMES = { "/space": "Deep Space", "/mars": "Mars", "/viking-1": "the Viking 1 storybook", "/viking-1/mission": "the Viking 1 mission file" };
const LEAVE_LINKS = ".topbar a, .topbar .nav-dropdown > button, .solar-story-link, .sbk-back a, .sbk-modes a, .moon-read-more, .bk-end-actions a";
const indexOf = (id) => TOUR.findIndex((step) => step.id === id);

export default function TutorialOverlay({ startRequest = 0 }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState("closed");
  const [step, setStep] = useState(0);
  const [shownStep, setShownStep] = useState(-1);
  const [drifted, setDrifted] = useState(false);
  const [confirmSkip, setConfirmSkip] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const stepRef = useRef(0);
  const pendingLeaveTarget = useRef(null);
  const deferredClickTarget = useRef(null);
  const current = TOUR[step];
  const isHome = location.pathname === "/";

  const goTo = useCallback((index) => {
    stepRef.current = index;
    setStep(index);
  }, []);

  // Other parts of the site keep their own pop-ups quiet while the journey is running.
  useEffect(() => {
    document.documentElement.toggleAttribute("data-tour", mode !== "closed");
    return () => document.documentElement.removeAttribute("data-tour");
  }, [mode]);

  useEffect(() => {
    if (!isHome || mode !== "closed") return;
    try { if (!sessionStorage.getItem(TOUR_KEY)) setMode("welcome"); }
    catch { setMode("welcome"); }
  }, [isHome, mode]);

  useEffect(() => {
    if (startRequest > 0) {
      setConfirmSkip(false);
      goTo(0);
      setShownStep(-1);
      setMode("video");
    }
  }, [startRequest, goTo]);

  useEffect(() => {
    if (!confirmSkip && !confirmLeave) return undefined;
    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      pendingLeaveTarget.current = null;
      setConfirmSkip(false);
      setConfirmLeave(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [confirmSkip, confirmLeave]);

  const finish = useCallback(() => {
    stopTutorialMusic();
    setMode("finished");
    try { sessionStorage.setItem(TOUR_KEY, "1"); } catch { /* storage may be disabled */ }
  }, []);

  const skip = useCallback(() => {
    stopTutorialMusic();
    setMode("closed");
    try { sessionStorage.setItem(TOUR_KEY, "1"); } catch { /* storage may be disabled */ }
  }, []);

  // Move on from step `from` by `delta`, but only if nothing else has moved the tour meanwhile.
  const advance = useCallback((from, delta = 1) => {
    if (stepRef.current !== from) return;
    const next = from + delta;
    if (next >= TOUR.length) {
      stepRef.current = next;
      finish();
      return;
    }
    goTo(Math.max(0, next));
  }, [finish, goTo]);

  // Skip ahead to a named step, again only if the tour is still where the caller saw it.
  const jump = useCallback((from, id) => {
    if (stepRef.current !== from) return;
    const index = indexOf(id);
    if (index >= 0) goTo(index);
  }, [goTo]);

  /* ---------- Watch the page for the current step ---------- */
  useEffect(() => {
    if (mode !== "tour" || !current) return undefined;
    const me = step;
    const onPage = location.pathname === current.path;
    let alive = true;
    let highlighted = null;
    let shownTimer = 0;
    let shownQueued = false;
    let shownAt = 0;

    if (current.next?.path && location.pathname === current.next.path) {
      advance(me);
      return undefined;
    }

    const evaluate = () => {
      if (!alive || stepRef.current !== me) return;
      // Read the live address: while a link is leaving this page the old page is still unmounting,
      // and its disappearing controls must not count as the visitor undoing the step.
      const stillHere = window.location.pathname === current.path;
      const pageReady = onPage && stillHere && (!current.ready || $(current.ready));
      if (pageReady && !shownQueued) {
        shownQueued = true;
        shownTimer = window.setTimeout(() => {
          if (!alive) return;
          shownAt = Date.now();
          setShownStep(me);
        }, current.delay || 0);
      }
      const target = pageReady && !current.beacon ? findTarget(current) : null;
      if (target !== highlighted) {
        highlighted?.classList.remove("tutorial-tour-target");
        highlighted = target;
        highlighted?.classList.add("tutorial-tour-target");
      }
      if (!pageReady) return;
      const shortcut = current.jumps?.find((rule) => rule.when());
      if (shortcut) jump(me, shortcut.to);
      else if (current.next?.when?.() || reachedSection() || waitedLongEnough()) advance(me);
      else if (current.back?.()) advance(me, -1);
    };
    const waitedLongEnough = () => Boolean(current.next?.after && shownAt && Date.now() - shownAt >= current.next.after);
    // Mission-file steps move on as the visitor scrolls through its sections (the page loads lazily,
    // so the section menu is looked up each time rather than once).
    const reachedSection = () => {
      if (!current.next?.section && !current.next?.gallery) return false;
      const active = $(".mf-subnav a.is-active")?.getAttribute("href");
      return (current.next.section && active === current.next.section) ||
        (current.next.gallery && ["#gallery", "#library", "#sources"].includes(active));
    };

    const watch = new MutationObserver(evaluate);
    watch.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true, attributeFilter: ["data-globe-ready", "class", "aria-label", "value"] });
    const poll = window.setInterval(evaluate, 400); // typing in an input does not always mutate the DOM
    const first = window.setTimeout(evaluate, 60);

    const onClick = (event) => {
      if (location.pathname !== current.path) return;
      const clicked = event.target instanceof Element ? event.target : null;
      if (!clicked || clicked.closest(".tutorial-guide, .tutorial-shade, .sg")) return;
      if (clicked === deferredClickTarget.current) {
        deferredClickTarget.current = null;
        return;
      }
      const target = findTarget(current);
      if (target && target.contains(clicked)) {
        // Move on before the page reacts to the click, so the step's own `back` check can't fire first.
        if (current.next?.click) advance(me);
        return;
      }
      if (current.allow && clicked.closest(current.allow)) return;
      const leaving = clicked.closest(LEAVE_LINKS);
      if (!leaving) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      pendingLeaveTarget.current = leaving;
      setConfirmLeave(true);
    };
    document.addEventListener("click", onClick, true);

    window.addEventListener("scroll", evaluate, { passive: true });

    return () => {
      alive = false;
      window.clearTimeout(shownTimer);
      window.clearTimeout(first);
      window.clearInterval(poll);
      watch.disconnect();
      window.removeEventListener("scroll", evaluate);
      highlighted?.classList.remove("tutorial-tour-target");
      document.removeEventListener("click", onClick, true);
    };
  }, [mode, step, current, location.pathname, advance, jump]);

  // If the visitor wanders to a page that is not on the journey, offer a way back.
  useEffect(() => {
    if (mode !== "tour" || !current || location.pathname === current.path || location.pathname === current.next?.path) {
      setDrifted(false);
      return undefined;
    }
    const timer = window.setTimeout(() => setDrifted(true), current.detour?.path === location.pathname ? 900 : 1400);
    return () => window.clearTimeout(timer);
  }, [mode, current, location.pathname]);

  // On a phone the guide stands at the bottom of the screen, where many buttons are. If the
  // button it is talking about is underneath it, the guide moves up to the top instead.
  const guideRef = useRef(null);
  const [guideTop, setGuideTop] = useState(false);
  useEffect(() => {
    if (mode !== "tour" || !current?.target || current.card || current.hidden) {
      setGuideTop(false);
      return undefined;
    }
    let shown = false;
    const check = () => {
      const guide = guideRef.current;
      const target = findTarget(current);
      if (!guide || !target) return;
      let t = target.getBoundingClientRect();
      // The first time, bring a button that is hidden lower in a panel into view.
      if (!shown && t.width > 0) {
        shown = true;
        if (t.top < 0 || t.bottom > window.innerHeight) {
          target.scrollIntoView({ block: "nearest", behavior: "auto" });
          t = target.getBoundingClientRect();
        }
      }
      const g = guide.getBoundingClientRect();
      const standsAt = window.innerHeight - 20 - g.height; // the guide's top edge when it is at the bottom
      const covers = t.width > 0 && t.bottom > standsAt && t.top < window.innerHeight && t.right > g.left && t.left < g.right;
      setGuideTop(covers);
    };
    check();
    const timer = window.setInterval(check, 300);
    window.addEventListener("resize", check);
    window.addEventListener("scroll", check, { capture: true, passive: true });
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("resize", check);
      window.removeEventListener("scroll", check, { capture: true });
    };
  }, [mode, current]);

  const returnToJourney = () => {
    const resume = indexOf(current.restart || current.id);
    setDrifted(false);
    setShownStep(-1);
    goTo(resume);
    navigate(TOUR[resume].path);
  };

  const leaveTutorial = () => {
    const target = pendingLeaveTarget.current;
    pendingLeaveTarget.current = null;
    deferredClickTarget.current = target;
    setConfirmLeave(false);
    skip();
    window.setTimeout(() => {
      if (target?.isConnected) target.click();
      else deferredClickTarget.current = null;
    }, 0);
  };

  const begin = () => setMode("video");
  const enterTour = () => {
    startTutorialMusic();
    goTo(0);
    setShownStep(-1);
    setMode("tour");
    navigate("/space");
  };

  if (mode === "closed") return null;
  if (mode === "welcome") return <JourneyLanding onStart={begin} onSkip={skip} />;
  if (mode === "video") return <IntroVideo src={INTRO_FILM} onDone={enterTour} />;
  if (mode === "finished") {
    return (
      <div className="tutorial-shade">
        <section className="tutorial-card" role="dialog" aria-modal="true" aria-labelledby="tour-finished-title">
          <img className="tutorial-astronaut" src="/images/happyAstronaut.png" alt="" />
          <p className="tutorial-kicker">JOURNEY COMPLETE</p>
          <h2 id="tour-finished-title">You did it, explorer!</h2>
          <p>There is so much more waiting for you: walk on the Moon, follow the deep-space probes, open the Cosmic Library to meet every machine, and read the other storybooks. Feeling brave? Try a game!</p>
          <div className="tutorial-actions tutorial-finished-actions">
            <button className="tutorial-primary" onClick={() => setMode("closed")}>Keep exploring</button>
          </div>
        </section>
      </div>
    );
  }

  if (confirmLeave) {
    return (
      <div className="tutorial-shade tutorial-skip-confirm tutorial-leave-confirm">
        <section className="tutorial-card" role="alertdialog" aria-modal="true" aria-labelledby="leave-tour-title" aria-describedby="leave-tour-warning">
          <h2 id="leave-tour-title">Leave the journey?</h2>
          <p id="leave-tour-warning">This link takes you off the guided journey. Do you want to leave the journey and go there?</p>
          <div className="tutorial-actions">
            <button className="tutorial-primary" onClick={() => { pendingLeaveTarget.current = null; setConfirmLeave(false); }}>Stay on the journey</button>
            <button className="tutorial-skip" onClick={leaveTutorial}>Leave</button>
          </div>
        </section>
      </div>
    );
  }

  if (confirmSkip) {
    return (
      <div className="tutorial-shade tutorial-skip-confirm">
        <section className="tutorial-card" role="alertdialog" aria-modal="true" aria-labelledby="skip-tour-title" aria-describedby="skip-tour-warning">
          <h2 id="skip-tour-title">End the journey?</h2>
          <p id="skip-tour-warning">The guide will stop here. You can start the journey again from the home page.</p>
          <div className="tutorial-actions">
            <button className="tutorial-primary" onClick={() => setConfirmSkip(false)}>Keep going</button>
            <button className="tutorial-skip" onClick={skip}>End journey</button>
          </div>
        </section>
      </div>
    );
  }

  if (drifted && current.detour?.path === location.pathname) {
    const detour = current.detour;
    return (
      <aside className="tutorial-guide" aria-live="polite">
        <img className="tutorial-guide-astronaut" src="/images/happyAstronaut.png" alt="Astronaut guide" />
        <div className="tutorial-bubble">
          <button type="button" className="tutorial-close" aria-label="End the journey" title="End the journey" onClick={() => setConfirmSkip(true)}><X size={15} /></button>
          <h2>{detour.title}</h2>
          <p>{detour.text}</p>
          <button className="tutorial-primary" onClick={returnToJourney}>{detour.button}</button>
        </div>
      </aside>
    );
  }

  if (drifted) {
    return (
      <aside className="tutorial-guide" aria-live="polite">
        <img className="tutorial-guide-astronaut" src="/images/astronaut.png" alt="Astronaut guide" />
        <div className="tutorial-bubble">
          <button type="button" className="tutorial-close" aria-label="End the journey" title="End the journey" onClick={() => setConfirmSkip(true)}><X size={15} /></button>
          <h2>Oops, we drifted!</h2>
          <p>{`Our journey continues on ${PAGE_NAMES[current.path] || "the next page"}.`}</p>
          <div className="tutorial-bubble-actions">
            <button className="tutorial-primary" onClick={returnToJourney}>Take me back</button>
            <button className="tutorial-link" onClick={skip}>End the journey</button>
          </div>
        </div>
      </aside>
    );
  }

  const visible = shownStep === step && location.pathname === current.path;
  if (!visible) return null;

  const beacon = current.beacon && current.target ? <Beacon selector={current.target} /> : null;
  if (current.hidden) return beacon;

  if (current.card) {
    return (
      <div className="tutorial-welcome">
        <section key={step} className="tutorial-transmission tutorial-welcome-card" role="dialog" aria-labelledby="tour-card-title" aria-describedby="tour-card-text">
          <button type="button" className="tutorial-close" aria-label="End the journey" title="End the journey" onClick={() => setConfirmSkip(true)}><X size={15} /></button>
          <div className="tutorial-transmission-label"><span className="tutorial-waveform" aria-hidden="true" /> {current.label}</div>
          <h1 id="tour-card-title">{current.title}</h1>
          <p id="tour-card-text">{current.text}</p>
          <button type="button" className="tutorial-primary" autoFocus onClick={() => advance(step)}>{current.next.button}</button>
        </section>
      </div>
    );
  }

  const classes = [
    "tutorial-guide",
    current.side === "left" && "tutorial-guide-left",
    current.compact && "tutorial-guide-compact",
    guideTop && "tutorial-guide-top",
  ].filter(Boolean).join(" ");

  return (
    <>
      {beacon}
      <aside className={classes} aria-live="polite" ref={guideRef}>
        <img className="tutorial-guide-astronaut" src={current.avatar || "/images/astronaut.png"} alt="Astronaut guide" />
        <div key={step} className={`tutorial-bubble${current.raised ? " tutorial-bubble-raised" : ""}${current.text ? "" : " is-title-only"}`}>
          <button type="button" className="tutorial-close" aria-label="End the journey" title="End the journey" onClick={() => setConfirmSkip(true)}><X size={15} /></button>
          <h2>{current.title}</h2>
          {current.text && <p>{current.text}</p>}
          {current.tips && (
            <ul className="tutorial-tips">
              {current.tips.map(({ icon: Icon, text }) => (
                <li key={text}><span aria-hidden="true"><Icon size={17} /></span>{text}</li>
              ))}
            </ul>
          )}
          {current.next?.button && <button className="tutorial-primary" onClick={() => advance(step)}>{current.next.button}</button>}
        </div>
      </aside>
    </>
  );
}
