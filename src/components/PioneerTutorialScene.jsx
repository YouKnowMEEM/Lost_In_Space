import React, { useCallback, useEffect, useRef, useState } from "react";

export default function PioneerTutorialScene({ onComplete }) {
  const [stage, setStage] = useState("loading");
  const [flying, setFlying] = useState(false);
  const finishedRef = useRef(false);
  const timers = useRef([]);

  const changeView = (yaw) => {
    const boundedYaw = Math.max(-35, Math.min(35, yaw));
    window.dispatchEvent(new CustomEvent("sb:pioneer-intro-view", {
      detail: { yaw: boundedYaw },
    }));
  };

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const onReady = () => setStage((current) => current === "loading" ? "walk-message" : current);
    const onFlightComplete = () => finish();
    window.addEventListener("sb:pioneer-intro-ready", onReady);
    window.addEventListener("sb:pioneer-intro-complete", onFlightComplete);
    if (window.__sbPioneerIntroReady) onReady();
    return () => {
      window.removeEventListener("sb:pioneer-intro-ready", onReady);
      window.removeEventListener("sb:pioneer-intro-complete", onFlightComplete);
    };
  }, [finish]);

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);

  useEffect(() => {
    const nextStage = {
      "walk-message": "turn-left",
      "message-delay": "go-message",
    }[stage];
    if (!nextStage) return undefined;
    const delay = stage === "walk-message" ? 3000 : 900;
    const timer = window.setTimeout(() => setStage(nextStage), delay);
    timers.current.push(timer);
    return () => window.clearTimeout(timer);
  }, [stage]);

  useEffect(() => {
    if (!flying) return undefined;
    // Keep the tutorial moving if a browser does not report the GLB animation's end event.
    const timer = window.setTimeout(finish, 5000);
    return () => window.clearTimeout(timer);
  }, [flying, finish]);

  const turnLeft = () => {
    changeView(-22);
    setStage("turn-right");
  };
  const turnRight = () => {
    changeView(0);
    setStage("message-delay");
  };
  const startFlight = () => {
    setFlying(true);
    window.dispatchEvent(new Event("sb:pioneer-intro-flight"));
  };

  return (
    <main
      className={`tutorial-pioneer${flying ? " is-flying" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Deep space"
    >
      <div className="tutorial-pioneer-head" aria-live="polite">
        <span className="tutorial-signal-dot" />
        <span>DEEP SPACE</span>
      </div>

      {stage === "loading" && <p className="tutorial-look-hint">Floating out to deep space…</p>}
      {stage === "walk-message" && <p className="tutorial-look-hint">Can you walk in space? Well… you can always try!</p>}
      {stage === "turn-left" && (
        <>
          <p className="tutorial-look-hint">Click on the arrow to turn</p>
          <button type="button" className="tutorial-look-arrow left" onClick={turnLeft} aria-label="Turn left">
            <span aria-hidden="true">‹</span>
          </button>
        </>
      )}
      {stage === "turn-right" && (
        <>
          <p className="tutorial-look-hint">Now turn back the other way!</p>
          <button type="button" className="tutorial-look-arrow right" onClick={turnRight} aria-label="Turn right">
            <span aria-hidden="true">›</span>
          </button>
        </>
      )}

      {stage === "go-message" && !flying && (
        <section className="tutorial-transmission tutorial-transmission-short" aria-live="polite" aria-labelledby="pioneer-go-title">
          <div className="tutorial-transmission-label"><span className="tutorial-waveform" /> OUR SOLAR HOME</div>
          <h1 id="pioneer-go-title">Let’s explore more</h1>
          <p>See that bright little light far away? That’s our Sun, and all around it is our solar home. Let’s fly closer and see how many planets you can find!</p>
          <button type="button" className="tutorial-primary" onClick={startFlight}>Let’s go!</button>
        </section>
      )}

      {flying && <div className="tutorial-pioneer-fade" aria-hidden="true" />}
      <span className="tutorial-pioneer-caption">Use the glowing arrows to look around</span>
    </main>
  );
}
