import { useCallback, useEffect, useRef, useState } from "react";

// Storyteller voice: prefer natural/neural voices, skip novelty voices, speak a little slower and brighter.
// Voices come from the visitor's browser, so quality varies by device (Edge and Safari usually sound best).
const NOVELTY = /albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|hysterical|jester|organ|superstar|trinoids|whisper|wobble|zarvox/i;
const LIKED = [/natural|neural|online/i, /aria|jenny|samantha|karen|moira|serena|libby|sonia|hazel|zira|female/i, /google (us|uk) english/i];

export function pickVoice(voices = []) {
  let best = null;
  let top = -1;
  for (const v of voices) {
    if (!/^en[-_]/i.test(v.lang) || NOVELTY.test(v.name)) continue;
    let score = /^en[-_]us/i.test(v.lang) ? 1 : 0;
    LIKED.forEach((re, i) => {
      if (re.test(v.name)) score += 3 - i;
    });
    if (score > top) {
      top = score;
      best = v;
    }
  }
  return best;
}

export function useNarrator() {
  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  const [line, setLine] = useState(-1); // index of the sentence being spoken, -1 when silent
  const token = useRef(0); // bumped on every speak/stop so stale callbacks do nothing
  const voice = useRef(null);
  const keep = useRef(null); // Chrome can drop an utterance that nothing references

  useEffect(() => {
    if (!supported) return undefined;
    const synth = window.speechSynthesis;
    const load = () => {
      voice.current = pickVoice(synth.getVoices());
    };
    load(); // Chrome fills the list later and fires "voiceschanged"
    synth.addEventListener("voiceschanged", load);
    return () => {
      synth.removeEventListener("voiceschanged", load);
      token.current += 1;
      synth.cancel();
    };
  }, [supported]);

  const stop = useCallback(() => {
    token.current += 1;
    if (supported) window.speechSynthesis.cancel();
    setLine(-1);
  }, [supported]);

  const speak = useCallback(
    (sentences, onDone) => {
      if (!supported) return;
      const id = ++token.current;
      const synth = window.speechSynthesis;
      synth.cancel();
      const next = (i) => {
        if (id !== token.current) return;
        if (i >= sentences.length) {
          setLine(-1);
          if (onDone) onDone();
          return;
        }
        const u = new SpeechSynthesisUtterance(sentences[i]);
        if (voice.current) {
          u.voice = voice.current;
          u.lang = voice.current.lang;
        } else {
          u.lang = "en-US";
        }
        u.rate = 0.9;
        u.pitch = 1.15;
        u.onstart = () => {
          if (id === token.current) setLine(i);
        };
        u.onend = u.onerror = () => {
          if (id === token.current) setTimeout(() => next(i + 1), 380);
        };
        keep.current = u;
        synth.speak(u);
      };
      setTimeout(() => next(0), 80); // Chrome needs a beat after cancel()
    },
    [supported]
  );

  return { supported, line, speak, stop };
}
