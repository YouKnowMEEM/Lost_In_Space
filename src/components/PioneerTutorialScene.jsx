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
      "message-delay": "story-message",
      "go-delay": "go-message",
    }[stage];
    if (!nextStage) return undefined;
    const delay = stage === "walk-message" ? 3000 : stage === "message-delay" ? 900 : 650;
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
      aria-label="Pioneer 11 transmission"
    >
      <div className="tutorial-pioneer-head" aria-live="polite">
        <span className="tutorial-signal-dot" />
        <span>PIONEER 11 · DEEP SPACE SIGNAL</span>
      </div>

      {stage === "loading" && <p className="tutorial-look-hint">Tuning in to Pioneer 11…</p>}
      {stage === "walk-message" && <p className="tutorial-look-hint">Can you walk in Space? Well.. You can always try !</p>}
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
          <p className="tutorial-look-hint">Turn to find the signal.</p>
          <button type="button" className="tutorial-look-arrow right" onClick={turnRight} aria-label="Turn right">
            <span aria-hidden="true">›</span>
          </button>
        </>
      )}

      {stage === "story-message" && (
        <section className="tutorial-transmission" aria-live="polite" aria-labelledby="pioneer-message-title">
          <div className="tutorial-transmission-label"><span className="tutorial-waveform" /> INCOMING TRANSMISSION</div>
          <h1 id="pioneer-message-title">A signal from the pioneer</h1>
          <p>Look there, kiddo. That little probe was sent on a daring mission to Saturn more than 50 years ago. It crossed the plane of Saturn’s rings...and survived !</p>
          <p>It discovered two new moons and a new ring, then sent data back to Earth for 22 years, when its expected lifespan was 21 months. Now it’s drifting out here in the dark, a pioneer that refused to die.</p>
          <button type="button" className="tutorial-primary" onClick={() => setStage("go-delay")}>Continue</button>
        </section>
      )}

      {stage === "go-message" && (
        <section className="tutorial-transmission tutorial-transmission-short" aria-live="polite" aria-labelledby="pioneer-go-title">
          <div className="tutorial-transmission-label"><span className="tutorial-waveform" /> SIGNAL RECEIVED</div>
          <h1 id="pioneer-go-title">Let’s explore more</h1>
          <p>There’s a whole solar system waiting for us. Who needs thrusters when you have zero gravity? Ready, kiddo?</p>
          <button type="button" className="tutorial-primary" onClick={startFlight}>Go</button>
        </section>
      )}

      {flying && <div className="tutorial-pioneer-fade" aria-hidden="true" />}
      <span className="tutorial-pioneer-caption">Use the glowing arrows to look around</span>
    </main>
  );
}
