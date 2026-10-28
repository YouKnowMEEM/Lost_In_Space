import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import "./tutorial.css";

const TOUR_KEY = "sb-space-tour-seen";

// The tour follows real controls and waits for the visitor at each stop.
const TOUR = [
  { path: "/space", target: ".solar-search input", title: "Where's the Moon ?", text: "Search for the Moon\n to locate it in the solar system.", inputIncludes: "moon",avatar: "/images/astronaut.png" },
  { path: "/space", target: ".solar-search-results button", title: "Click the Moon", text: "There it is !!", avatar: "/images/astronautApollo11.png" },
  { path: "/space", target: ".solar-explore-pop button", title: "Visit the Moon :o", text: "Explore the Map.",avatar: "/images/happyAstronaut.png", delay: 3000 },
  { path: "/moon", target: ".moon-control-toggle", waitForSelector: '.moon-atlas[data-globe-ready="true"]', title: "Filters and Timeline", text: "Open the controls to see how you can filter missions and the timeline of respective missions. Watch out for Artemis IV.",avatar: "/images/astronautApollo11.png" },
  { path: "/moon", target: ".moon-search input", title: "Find Apollo 11 ;)", text: "Do you know its landing site ?", inputIncludes: "apollo 11", side: "left", compact: true, avatarSmall: true, avatar: "/images/astronaut.png" },
  { path: "/moon", target: ".moon-search-results button", title: "Click on the Apollo 11 marker", text: "Tap its marker to open the mission details.", side: "left", compact: true, avatar: "/images/astronautApollo11.png" },
  { path: "/moon", waitForEvent: "sb:tutorial-artifact-selected", eventId: "apollo-11", title: "Open the Apollo 11 details", text: "That's 1 small step for man, one giant leap for mankind.", side: "left", compact: true, avatar: "/images/happyAstronaut.png" },
  { path: "/moon", target: ".moon-read-more", title: "Read the Eagle story", text: "Check out the co-ordinates, launch time. Scroll down for the story !!", side: "left", compact: true },
  { path: "/eagle", target: '.sbk-modes a[href="/eagle/mission"]', title: "The Eagle storybook", text: "Enjoy the story :) then open its Mission File.", side: "right", compact: true, bubbleRaised: true, avatar: "/images/astronautApollo11.png" },
  { path: "/eagle/mission", target: 'a[href="#spacecraft"]', title: "Explore the 3D Eagle", text: "Jump to the interactive 3D model.", bubbleRaised: true },
  { path: "/eagle/mission", finishOnGallery: true, tailLowered: true, avatarLarge: true, title: "Take a look around", text: "Scroll through the photos and video. I will finish the tour :( once the top menu moves on to the Photos & Videos." },
];

export default function TutorialOverlay({ startRequest = 0 }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState("closed");
  const [step, setStep] = useState(0);
  const [confirmSkip, setConfirmSkip] = useState(false);
  const [readyStep, setReadyStep] = useState(-1);
  const videoRef = useRef(null);
  const pendingAdvance = useRef(null);
  const current = TOUR[step];
  const isHome = location.pathname === "/";

  useEffect(() => {
    if (!isHome || mode !== "closed") return;
    try { if (!sessionStorage.getItem(TOUR_KEY)) setMode("welcome"); }
    catch { setMode("welcome"); }
  }, [isHome, mode]);

  useEffect(() => {
    if (startRequest > 0) {
      setConfirmSkip(false);
      setStep(0);
      setReadyStep(-1);
      setMode("video");
    }
  }, [startRequest]);

  useEffect(() => {
    if (!confirmSkip) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setConfirmSkip(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [confirmSkip]);

  useEffect(() => {
    if (mode !== "video" || !videoRef.current) return;
    const video = videoRef.current;
    const play = video.play();
    play?.catch(() => {
      // If audible autoplay is blocked, keep the tour moving with the video muted.
      video.muted = true;
      video.play().catch(() => {});
    });
  }, [mode]);

  const finish = () => {
    window.clearTimeout(pendingAdvance.current);
    pendingAdvance.current = null;
    setMode("finished");
    try { sessionStorage.setItem(TOUR_KEY, "1"); } catch { /* storage may be disabled */ }
  };

  const advanceAfterPause = () => {
    if (pendingAdvance.current !== null) return;
    pendingAdvance.current = window.setTimeout(() => {
      pendingAdvance.current = null;
      setStep((n) => n + 1);
    }, current?.delay ?? 400);
  };

  useEffect(() => {
    if (mode !== "tour" || !current) return undefined;
    let activeTarget = null;
    const findTarget = () => {
      const onPage = location.pathname === current.path;
      const pageReady = onPage && (!current.waitForSelector || document.querySelector(current.waitForSelector));
      if (pageReady) setReadyStep(step);
      const target = current.target && pageReady ? document.querySelector(current.target) : null;
      if (activeTarget !== target) {
        activeTarget?.classList.remove("tutorial-tour-target");
        activeTarget = target;
        activeTarget?.classList.add("tutorial-tour-target");
      }
    };
    const timer = window.setTimeout(() => {
      findTarget();
      if (location.pathname === current.path && current.path === "/eagle/mission" && current.target) {
        document.querySelector(current.target)?.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }, 350);
    const watch = new MutationObserver(findTarget);
    watch.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-globe-ready"] });

    const onClick = (event) => {
      if (!current.target || location.pathname !== current.path) return;
      const element = document.querySelector(current.target);
      if (element && (event.target === element || element.contains(event.target))) {
        advanceAfterPause();
      }
    };
    const onInput = (event) => {
      if ((!current.listenInput && !current.inputIncludes) || location.pathname !== current.path) return;
      const element = document.querySelector(current.target);
      if (current.inputIncludes && element === event.target && element.value.toLocaleLowerCase().includes(current.inputIncludes)) {
        advanceAfterPause();
      } else if (current.listenInput && element === event.target && element.value.trim()) {
        advanceAfterPause();
      }
    };
    const onTourEvent = (event) => {
      if (event.detail?.id === current.eventId) advanceAfterPause();
    };
    const onKeyDown = (event) => {
      if (event.key !== "Enter" || event.isComposing || event.target.closest?.(".tutorial-bubble")) return;
      if (current.waitForEvent) return;
      if (current.finishOnGallery) {
        event.preventDefault();
        finish();
        return;
      }
      if (!current.target) {
        event.preventDefault();
        advanceAfterPause();
        return;
      }
      const target = document.querySelector(current.target);
      if (!target || location.pathname !== current.path) return;
      if (target instanceof HTMLInputElement) {
        const value = target.value.trim().toLocaleLowerCase();
        if ((current.listenInput && value) || (current.inputIncludes && value.includes(current.inputIncludes))) {
          event.preventDefault();
          advanceAfterPause();
        }
        return;
      }
      if (target.matches("button, a, [role='button']")) {
        event.preventDefault();
        target.click();
      }
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("input", onInput, true);
    document.addEventListener("keydown", onKeyDown, true);
    if (current.waitForEvent) window.addEventListener(current.waitForEvent, onTourEvent);

    let navObserver;
    const sectionNav = current.finishOnGallery && location.pathname === current.path ? document.querySelector(".mf-subnav") : null;
    const finishAfterGallery = () => {
      const activeSection = sectionNav?.querySelector("a.is-active")?.getAttribute("href");
      if (activeSection === "#library" || activeSection === "#sources") finish();
    };
    if (sectionNav) {
      navObserver = new MutationObserver(finishAfterGallery);
      navObserver.observe(sectionNav, { attributes: true, attributeFilter: ["class"], subtree: true });
      window.addEventListener("scroll", finishAfterGallery, { passive: true });
    }

    return () => {
      window.clearTimeout(timer);
      watch.disconnect();
      navObserver?.disconnect();
      window.removeEventListener("scroll", finishAfterGallery);
      activeTarget?.classList.remove("tutorial-tour-target");
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("input", onInput, true);
      document.removeEventListener("keydown", onKeyDown, true);
      if (current.waitForEvent) window.removeEventListener(current.waitForEvent, onTourEvent);
    };
  }, [mode, step, current, location.pathname]);

  const skip = () => {
    window.clearTimeout(pendingAdvance.current);
    pendingAdvance.current = null;
    setMode("closed");
    try { sessionStorage.setItem(TOUR_KEY, "1"); } catch { /* storage may be disabled */ }
  };
  const begin = () => {
    window.clearTimeout(pendingAdvance.current);
    pendingAdvance.current = null;
    setMode("video");
  };
  const enterTour = () => { setStep(0); setReadyStep(-1); setMode("tour"); navigate("/space"); };

  if (mode === "closed") return null;
  if (mode === "welcome") return <div className="tutorial-shade"><section className="tutorial-card" role="dialog" aria-modal="true" aria-labelledby="tour-title"><img className="tutorial-astronaut" src="/images/astronaut.png" alt=""/><p className="tutorial-kicker">Lost in Space</p><h2 id="tour-title">New here? Take a space tour!</h2><p>Meet the worlds and discover what you can explore.</p><div className="tutorial-actions"><button className="tutorial-primary" onClick={begin}>Start Tutorial</button><button className="tutorial-skip" onClick={skip}>Skip</button></div></section></div>;
  if (mode === "video") return <div className="tutorial-video-screen" role="dialog" aria-modal="true" aria-label="Space tour introduction"><video ref={videoRef} src="/video/supersonic_freefall%20(1).mp4" autoPlay playsInline onEnded={enterTour}/></div>;
  if (mode === "finished") return <div className="tutorial-shade"><section className="tutorial-card" role="dialog" aria-modal="true" aria-labelledby="tour-finished-title"><img className="tutorial-astronaut" src="/images/astronaut.png" alt=""/><p className="tutorial-kicker">TOUR COMPLETED :D </p><h2 id="tour-finished-title">You are ready, explorer</h2><p>There is more waiting for you: explore Mars and Deep space and meet the other characters in their storybooks.</p><div className="tutorial-actions tutorial-finished-actions"><button className="tutorial-skip" onClick={() => setMode("closed")}>Close / Exit</button><button className="tutorial-primary" onClick={() => { setMode("closed"); navigate("/"); }}>Back to homepage</button></div></section></div>;

  if (current?.waitForSelector && readyStep !== step) return null;

  if (confirmSkip) return <div className="tutorial-shade tutorial-skip-confirm"><section className="tutorial-card" role="alertdialog" aria-modal="true" aria-labelledby="skip-tour-title" aria-describedby="skip-tour-warning"><h2 id="skip-tour-title">Skip the tutorial?</h2><p id="skip-tour-warning">Your tour progress will be stopped. You can start the tutorial again from the homepage.</p><div className="tutorial-actions"><button className="tutorial-primary" onClick={() => setConfirmSkip(false)}>Keep going</button><button className="tutorial-skip" onClick={skip}>Skip tutorial</button></div></section></div>;

  const canContinue = !current.target && !current.waitForEvent && !current.finishOnGallery;
  return <aside className={`tutorial-guide${current.side === "left" ? " tutorial-guide-left" : ""}${current.compact ? " tutorial-guide-compact" : ""}${current.raised ? " tutorial-guide-raised" : ""}${current.avatarLarge ? " tutorial-guide-avatar-large" : ""}${current.avatarSmall ? " tutorial-guide-avatar-small" : ""}`} aria-live="polite">
    <img className="tutorial-guide-astronaut" src={current.avatar || "/images/astronaut.png"} alt="Astronaut guide"/>
    <div key={step} className={`tutorial-bubble${current.bubbleRaised ? " tutorial-bubble-raised" : ""}${current.tailLowered ? " tutorial-bubble-tail-lowered" : ""}`}><button type="button" className="tutorial-close" aria-label="Skip tutorial" title="Skip tutorial" onClick={() => setConfirmSkip(true)}><X size={15}/></button><h2>{current.title}</h2><p>{current.text}</p>{canContinue && <button className="tutorial-primary" onClick={advanceAfterPause}>Continue</button>}{current.finishOnGallery && <button className="tutorial-primary" onClick={finish}>Finish tour</button>}</div>
  </aside>;
}
