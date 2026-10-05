import { useCallback, useEffect, useRef, useState } from "react";

// Smoothly ramps an <audio> element's volume (and pauses it at zero).
function fade(audio, target, ms = 700) {
  if (!audio) return;
  cancelAnimationFrame(audio.__fade || 0);
  const from = audio.volume;
  const start = performance.now();
  if (target > 0 && audio.paused) audio.play().catch(() => {});
  const step = (now) => {
    const k = Math.min(1, (now - start) / ms);
    audio.volume = Math.max(0, Math.min(1, from + (target - from) * k));
    if (k < 1) audio.__fade = requestAnimationFrame(step);
    else if (target === 0) audio.pause();
  };
  audio.__fade = requestAnimationFrame(step);
}

// A soft paper "swish", synthesized so no sound file is needed.
function pageTurnSound(ctx) {
  const now = ctx.currentTime;
  const dur = 0.5;
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    const t = i / data.length;
    data[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * Math.min(1, t * 3.2)) * (1 - t) ** 1.6;
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.Q.value = 0.7;
  band.frequency.setValueAtTime(2600, now);
  band.frequency.exponentialRampToValueAtTime(700, now + dur);
  const gain = ctx.createGain();
  gain.gain.value = 0.16;
  src.connect(band).connect(gain).connect(ctx.destination);
  src.start(now);
}

/**
 * Narration + background music for a storybook.
 * One <audio> element plays the page narration (so mobile browsers keep it unlocked after
 * the first tap), another loops the lullaby quietly underneath.
 */
export function useNarration(musicSrc) {
  const voiceRef = useRef(null);
  const musicRef = useRef(null);
  const ctxRef = useRef(null);
  const onEndRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [rate, setRateState] = useState(1);
  const [musicOn, setMusicOn] = useState(() => {
    try {
      return localStorage.getItem("sb-music") !== "off";
    } catch {
      return true;
    }
  });
  const [engaged, setEngaged] = useState(false); // has the reader pressed anything that may make sound?

  useEffect(() => {
    const voice = new Audio();
    voice.preload = "auto";
    const music = new Audio(musicSrc);
    music.loop = true;
    music.preload = "none";
    music.volume = 0;
    voiceRef.current = voice;
    musicRef.current = music;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      onEndRef.current?.();
    };
    voice.addEventListener("play", onPlay);
    voice.addEventListener("pause", onPause);
    voice.addEventListener("ended", onEnded);
    return () => {
      voice.removeEventListener("play", onPlay);
      voice.removeEventListener("pause", onPause);
      voice.removeEventListener("ended", onEnded);
      voice.pause();
      music.pause();
      voice.removeAttribute("src");
      music.removeAttribute("src");
      voice.load();
      if (ctxRef.current) ctxRef.current.close().catch(() => {});
      ctxRef.current = null;
    };
  }, [musicSrc]);

  // Music sits low under the voice and a little higher when the reader reads alone.
  useEffect(() => {
    const music = musicRef.current;
    if (!music) return;
    if (!engaged || !musicOn) fade(music, 0, 600);
    else fade(music, playing ? 0.2 : 0.32, 900);
  }, [engaged, musicOn, playing]);

  useEffect(() => {
    try {
      localStorage.setItem("sb-music", musicOn ? "on" : "off");
    } catch {
      /* private mode: the toggle still works for this visit */
    }
  }, [musicOn]);

  const engage = useCallback(() => {
    setEngaged(true);
    if (!ctxRef.current && typeof window !== "undefined") {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctxRef.current = new AC();
    }
    ctxRef.current?.resume?.().catch(() => {});
  }, []);

  const load = useCallback(
    (src) => {
      const voice = voiceRef.current;
      if (!voice || !src) return;
      if (voice.dataset.src !== src) {
        voice.src = src;
        voice.dataset.src = src;
      }
      voice.playbackRate = rate;
    },
    [rate]
  );

  const play = useCallback(async () => {
    engage();
    const voice = voiceRef.current;
    if (!voice) return false;
    voice.playbackRate = rate;
    try {
      await voice.play();
      return true;
    } catch {
      return false;
    }
  }, [engage, rate]);

  const pause = useCallback(() => voiceRef.current?.pause(), []);

  const seek = useCallback((t) => {
    const voice = voiceRef.current;
    if (voice) voice.currentTime = Math.max(0, t);
  }, []);

  const setRate = useCallback((r) => {
    setRateState(r);
    if (voiceRef.current) voiceRef.current.playbackRate = r;
  }, []);

  const turnSound = useCallback(() => {
    const ctx = ctxRef.current;
    if (ctx && engaged) {
      try {
        pageTurnSound(ctx);
      } catch {
        /* sound effects are decorative */
      }
    }
  }, [engaged]);

  const onEnd = useCallback((fn) => {
    onEndRef.current = fn;
  }, []);

  return {
    voiceRef,
    playing,
    rate,
    musicOn,
    engaged,
    setMusicOn,
    setRate,
    engage,
    load,
    play,
    pause,
    seek,
    turnSound,
    onEnd,
  };
}
