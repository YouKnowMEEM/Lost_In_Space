import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

// The intro film is 1280 x 720. Captain Nova asks "Would you like to go to space with me?"
// at about 10 s and the speech bubble fades out at 11.75 s, so the film waits for the
// visitor's answer just before that.
const FILM_W = 1280;
const FILM_H = 720;
const ASK_AT = 11.45;

/**
 * Full-screen intro film. It pauses on Captain Nova's question and shows a
 * "Yes! I'd love to!" bubble exactly where the child's answer appears in the film;
 * tapping it continues the film. `onDone` runs when the film ends or is skipped.
 */
export default function IntroVideo({ src, onDone }) {
  const screenRef = useRef(null);
  const videoRef = useRef(null);
  const answerRef = useRef(null);
  const answeredRef = useRef(false);
  const [asking, setAsking] = useState(false);
  const [frame, setFrame] = useState({ w: 0, h: 0, fill: true });

  // The film fills wide screens (cropping a little at the sides) but is shown whole on tall
  // screens such as phones, where cropping would cut off Captain Nova's question.
  // An invisible box keeps the film's exact size and position, so the answer bubble
  // sits on the same spot as in the film on any screen.
  useLayoutEffect(() => {
    const screen = screenRef.current;
    if (!screen) return undefined;
    const measure = () => {
      const w = screen.clientWidth;
      const h = screen.clientHeight;
      const fill = w / h >= 1.42;
      const scale = fill ? Math.max(w / FILM_W, h / FILM_H) : Math.min(w / FILM_W, h / FILM_H);
      setFrame({ w: FILM_W * scale, h: FILM_H * scale, fill });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(screen);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    video.play()?.catch(() => {
      // If audible autoplay is blocked, keep the story moving with the film muted.
      video.muted = true;
      video.play().catch(() => {});
    });
    let raf = 0;
    const watch = () => {
      if (!answeredRef.current && video.currentTime >= ASK_AT) {
        video.pause();
        setAsking(true);
        return;
      }
      raf = requestAnimationFrame(watch);
    };
    raf = requestAnimationFrame(watch);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (asking) answerRef.current?.focus({ preventScroll: true });
  }, [asking]);

  const answer = () => {
    const video = videoRef.current;
    answeredRef.current = true;
    setAsking(false);
    if (!video) return;
    video.muted = false; // the tap is a user gesture, so sound can come back on
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });
  };

  return (
    <div ref={screenRef} className="tutorial-video-screen" role="dialog" aria-modal="true" aria-label="Space journey introduction">
      <video ref={videoRef} src={src} playsInline preload="auto" onEnded={onDone} style={{ objectFit: frame.fill ? "cover" : "contain" }} />
      <div className="tutorial-video-frame" style={{ width: frame.w, height: frame.h, "--fh": `${frame.h}px` }}>
        {asking && (
          <button ref={answerRef} type="button" className="tutorial-video-answer" onClick={answer}>
            Yes! I'd love to!
          </button>
        )}
      </div>
      <p className="tutorial-video-sr" aria-live="polite">
        {asking ? "Captain Nova asks: Would you like to go to space with me? Choose Yes! I'd love to! to continue." : ""}
      </p>
      <button type="button" className="tutorial-video-skip" onClick={onDone}>
        Skip
      </button>
    </div>
  );
}
