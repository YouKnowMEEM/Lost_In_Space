// Read-aloud for storybooks that have no recorded narration yet.
//
// SpeechVoice behaves like the <audio> element the storybook already drives (play, pause,
// currentTime, duration, ended and play/pause/ended events), but it speaks with the
// browser's own text-to-speech voice. "Time" is counted in words: word k of a page spans
// k .. k+0.9, so the read-along highlighting works exactly as it does with recorded audio.
// Long pages are spoken one sentence at a time, because some browsers stop a single long
// utterance after about 15 seconds.

import { displayText } from "./text";

const MARK = /\[([^\]]+)\]\{([^}]*)\}/g;

/** One entry per displayed word: what to say for it ("" when a hint covers several words). */
export function spokenWords(text = "") {
  const out = [];
  let last = 0;
  const plain = (chunk) => chunk.split(/\s+/).filter(Boolean).forEach((w) => out.push(w));
  text.replace(MARK, (m, shown, say, at) => {
    plain(text.slice(last, at));
    const words = shown.split(/\s+/).filter(Boolean);
    const sayIt = say.startsWith("/") ? null : say;
    words.forEach((w, i) => out.push(sayIt ? (i === 0 ? sayIt : "") : w));
    last = at + m.length;
    return m;
  });
  plain(text.slice(last));
  return out;
}

/** Word lists per page, and a timing table in "word time" for the storybook. */
export function speechBook(story) {
  const words = {};
  const timing = { book: story.id, speech: true, pages: {} };
  story.pages.forEach((p) => {
    if (p.kind === "cover") {
      const w = spokenWords(p.narration || `${story.title}. ${story.subtitle}.`);
      words[p.id] = w;
      timing.pages[p.id] = { audio: `speech:${p.id}`, duration: w.length, seconds: w.length / 2.5 };
      return;
    }
    const title = spokenWords(p.title);
    if (title.length) title[title.length - 1] = `${title[title.length - 1]}.`;
    const paras = (p.text || []).map(spokenWords);
    const all = [...title, ...paras.flat()];
    let k = 0;
    const span = () => {
      const t = [k, k + 0.9];
      k += 1;
      return t;
    };
    timing.pages[p.id] = {
      audio: `speech:${p.id}`,
      duration: all.length,
      seconds: all.length / 2.5,
      title: title.map(span),
      paras: paras.map((para) => para.map(span)),
    };
    words[p.id] = all;
  });
  return { words, timing };
}

function pickVoice(localOnly = false) {
  const synth = window.speechSynthesis;
  const voices = synth?.getVoices?.() || [];
  const english = voices.filter((v) => /^en(-|_|$)/i.test(v.lang) && (!localOnly || v.localService));
  const liked = [/Samantha/i, /Google UK English Female/i, /Microsoft (Aria|Jenny|Libby|Sonia)/i, /Karen|Moira|Tessa|Serena/i, /Female/i, /Google US English/i];
  for (const re of liked) {
    const v = english.find((x) => re.test(x.name));
    if (v) return v;
  }
  return english.find((v) => v.localService) || english[0] || null;
}

export class SpeechVoice extends EventTarget {
  constructor(lookup) {
    super();
    this.lookup = lookup;
    this.dataset = {};
    this.preload = "auto";
    this.volume = 1;
    this.playbackRate = 1;
    this.paused = true;
    this.ended = false;
    this.currentTime = 0;
    this.duration = 0;
    this.words = [];
    this._src = "";
    this._run = 0;
    this._localOnly = false; // set after an online voice fails, to fall back to one on the device
    try {
      window.speechSynthesis?.getVoices?.(); // starts loading the voice list early (Chrome loads it lazily)
    } catch {
      /* speech is optional */
    }
  }

  get src() {
    return this._src;
  }

  set src(value) {
    this._stop();
    this._src = value || "";
    this.words = (this._src && this.lookup(this._src.replace(/^speech:/, ""))) || [];
    this.duration = this.words.length || 1;
    this.currentTime = 0;
    this.ended = false;
    this.paused = true;
  }

  removeAttribute() {
    this._stop();
  }

  load() {}

  _stop() {
    this._run += 1;
    try {
      window.speechSynthesis?.cancel();
    } catch {
      /* speech is optional */
    }
  }

  play() {
    const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
    if (!synth || !this.words.length) {
      if (!synth) this.dispatchEvent(new Event("speecherror"));
      return Promise.reject(new Error("Speech is not available"));
    }
    this._stop();
    const run = this._run;
    // Seeking to a word sets the time just before it (k - 0.05), so round to the nearest word.
    const from = Math.max(0, Math.min(Math.floor(this.currentTime + 0.1), this.words.length - 1));
    const voice = pickVoice(this._localOnly);

    // Sentences: groups of words ending in . ! ? or after 24 words.
    const chunks = [];
    let cur = [];
    for (let i = from; i < this.words.length; i += 1) {
      cur.push(i);
      const w = this.words[i];
      if (/[.!?…]["'”’)]*$/.test(w) || cur.length >= 24) {
        chunks.push(cur);
        cur = [];
      }
    }
    if (cur.length) chunks.push(cur);

    const speakChunk = (n) => {
      if (run !== this._run) return;
      if (n >= chunks.length) {
        this.currentTime = this.duration;
        this.paused = true;
        this.ended = true;
        this.dispatchEvent(new Event("pause"));
        this.dispatchEvent(new Event("ended"));
        return;
      }
      const idx = chunks[n].filter((i) => this.words[i]);
      let text = "";
      const starts = [];
      idx.forEach((i) => {
        starts.push(text.length);
        text += `${this.words[i]} `;
      });
      if (!text.trim()) {
        speakChunk(n + 1);
        return;
      }
      const u = new SpeechSynthesisUtterance(text);
      if (voice) u.voice = voice;
      u.lang = voice?.lang || "en-US";
      u.rate = 0.92 * this.playbackRate;
      u.pitch = 1.05;
      this.currentTime = idx[0] + 0.05;
      u.onboundary = (e) => {
        if (run !== this._run || e.name === "sentence") return;
        let k = 0;
        while (k + 1 < starts.length && starts[k + 1] <= e.charIndex) k += 1;
        this.currentTime = idx[k] + 0.05;
      };
      u.onend = () => speakChunk(n + 1);
      u.onerror = (e) => {
        if (run !== this._run || e.error === "interrupted" || e.error === "canceled") return;
        // An online voice can fail without a connection: try once more with a voice on the device.
        if (voice && !voice.localService && !this._localOnly && e.error !== "not-allowed") {
          this._localOnly = true;
          this.currentTime = idx[0];
          this.play();
          return;
        }
        this.paused = true;
        this.dispatchEvent(new Event("pause"));
        // No usable voice on this device (or speech was blocked): let the book say so.
        this.dispatchEvent(new Event("speecherror"));
      };
      synth.speak(u);
    };

    this.paused = false;
    this.ended = false;
    this.dispatchEvent(new Event("play"));
    speakChunk(0);
    return Promise.resolve();
  }

  pause() {
    if (this.paused) return;
    this._stop();
    this.paused = true;
    this.dispatchEvent(new Event("pause"));
  }
}

export const speechSupported = () => typeof window !== "undefined" && "speechSynthesis" in window;
export { displayText };
