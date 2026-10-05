#!/usr/bin/env python3
"""
Build the storybook narration (MP3 per page) and the read-along word timings.

    python tools/narration/build_narration.py eagle viking voyager

Reads   src/data/stories/<book>.json
Writes  public/audio/stories/<book>/<NN>-<page>.mp3
        src/data/stories/<book>.timing.json

Narration uses the open Kokoro-82M voice model (Apache-2.0) through kokoro-onnx.
The model is patched once so it also reports how long each phoneme lasts, which
gives exact word timings for the highlighted read-along text.

Story markup understood in titles and paragraphs:
    [1202]{twelve-oh-two}            show "1202", say "twelve-oh-two"
    [Chryse Planitia]{/kɹˈaɪsi …/}   show the words, speak these IPA phonemes
"""
import difflib
import json
import os
import re
import subprocess
import sys
import tempfile

import numpy as np
import soundfile as sf

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
MODELS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
MODEL = os.environ.get("KOKORO_MODEL", os.path.join(MODELS, "kokoro-dur.onnx"))
VOICES = os.environ.get("KOKORO_VOICES", os.path.join(MODELS, "voices-v1.0.bin"))
SR = 24000

SPEED = float(os.environ.get("NARRATION_SPEED", "0.9"))
SENTENCE_PAUSE = 0.48   # extra air after . ! ?
CLAUSE_PAUSE = 0.17     # after , ; :
TITLE_PAUSE = 0.95      # after the chapter title
PARAGRAPH_PAUSE = 0.8   # between paragraphs
LEAD_IN = 0.35
TAIL = 0.7

MARK = re.compile(r"\[([^\]]+)\]\{([^}]*)\}")
STRESS = str.maketrans("", "", "ˈˌː")
NOT_PHONE = re.compile(r"[\s!\"(),.:;?—“”…→↓↗↘̃-]")


def units_of(text):
    """Split text into units: plain words, or one markup group (several display words)."""
    units, pos = [], 0

    def plain(chunk):
        for w in chunk.split():
            units.append({"display": [w], "say": w})

    for m in MARK.finditer(text):
        plain(text[pos:m.start()])
        disp, spec = m.group(1), m.group(2)
        end = m.end()
        tail = re.match(r"[^\s\[]*", text[end:]).group(0)
        end += len(tail)
        words = disp.split()
        words[-1] += tail
        if spec.startswith("/") and spec.endswith("/"):
            units.append({"display": words, "ipa": spec[1:-1] + tail})
        else:
            units.append({"display": words, "say": spec + tail})
        pos = end
    plain(text[pos:])
    return units


def display_words(text):
    return [w for u in units_of(text) for w in u["display"]]


class Narrator:
    def __init__(self, voice):
        from kokoro_onnx import Kokoro

        self.k = Kokoro(MODEL, VOICES)
        assert self.k.has_timings, "the model must expose a 'duration' output"
        self.voice = voice

    def phonemes(self, text):
        return self.k.tokenizer.phonemize(text, "en-us")

    def unit_phonemes(self, unit):
        return unit["ipa"] if "ipa" in unit else self.phonemes(unit["say"])

    def sentence_phonemes(self, units):
        parts, run = [], []
        for u in units:
            if "ipa" in u:
                if run:
                    parts.append(self.phonemes(" ".join(run)))
                    run = []
                parts.append(u["ipa"])
            else:
                run.append(u["say"])
        if run:
            parts.append(self.phonemes(" ".join(run)))
        return " ".join(p for p in parts if p)

    def speak(self, text):
        """Synthesize one block of text. Returns audio and [start, end] per display word."""
        units = units_of(text)
        ph = self.sentence_phonemes(units)
        audio, sr, spoken = self.k.create_timed(
            ph, self.voice, speed=SPEED, is_phonemes=True, continuous=True,
            sentence_pause=SENTENCE_PAUSE, clause_pause=CLAUSE_PAUSE,
        )
        assert sr == SR
        return audio, self.align(units, spoken)

    def align(self, units, spoken):
        # A: phonemes of each unit spoken alone; B: what the model actually said.
        a_chars, a_unit = [], []
        for i, u in enumerate(units):
            for c in self.unit_phonemes(u).translate(STRESS):
                if not NOT_PHONE.match(c):
                    a_chars.append(c)
                    a_unit.append(i)
        b_chars, b_time = [], []
        for t in spoken:
            c = t.phoneme.translate(STRESS)
            if c and not NOT_PHONE.match(c):
                b_chars.append(c)
                b_time.append((t.start, t.end))
        span = [None] * len(units)
        sm = difflib.SequenceMatcher(None, "".join(a_chars), "".join(b_chars), autojunk=False)
        for block in sm.get_matching_blocks():
            for k in range(block.size):
                ui = a_unit[block.a + k]
                s, e = b_time[block.b + k]
                if span[ui] is None:
                    span[ui] = [s, e]
                else:
                    span[ui][0] = min(span[ui][0], s)
                    span[ui][1] = max(span[ui][1], e)
        # Units that found no match borrow the gap between their neighbours.
        for i in range(len(span)):
            if span[i] is None:
                prev_end = next((span[j][1] for j in range(i - 1, -1, -1) if span[j]), 0.0)
                nxt = next((span[j][0] for j in range(i + 1, len(span)) if span[j]), prev_end + 0.3)
                span[i] = [prev_end, max(prev_end + 0.05, nxt)]
        # Keep spans monotonic.
        for i in range(1, len(span)):
            if span[i][0] < span[i - 1][0]:
                span[i][0] = span[i - 1][0]
            if span[i][1] < span[i][0]:
                span[i][1] = span[i][0] + 0.05
        # Spread a multi-word unit over its display words by length.
        words = []
        for u, (s, e) in zip(units, span):
            lens = [max(1, len(w)) for w in u["display"]]
            total, acc = sum(lens), 0
            for w, n in zip(u["display"], lens):
                ws = s + (e - s) * acc / total
                acc += n
                words.append([round(ws, 3), round(s + (e - s) * acc / total, 3)])
        return words


def silence(seconds):
    return np.zeros(int(seconds * SR), dtype=np.float32)


def master(audio, out_mp3):
    """Gentle polish: rumble filter, a touch of warmth, soften sibilance, even loudness."""
    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, "in.wav")
        sf.write(wav, audio, SR, subtype="FLOAT")
        chain = ",".join([
            "highpass=f=70",
            "equalizer=f=220:t=q:w=0.9:g=1.2",
            "highshelf=f=7000:g=-2.5",
            "loudnorm=I=-18:TP=-1.5:LRA=11",
        ])
        subprocess.run([
            "ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-af", chain,
            "-ar", str(SR), "-ac", "1", "-codec:a", "libmp3lame", "-b:a", "64k", out_mp3,
        ], check=True)


def build(book_id, only=None):
    story_path = os.path.join(ROOT, "src", "data", "stories", f"{book_id}.json")
    story = json.load(open(story_path, encoding="utf-8"))
    out_dir = os.path.join(ROOT, "public", "audio", "stories", book_id)
    os.makedirs(out_dir, exist_ok=True)
    timing_path = os.path.join(ROOT, "src", "data", "stories", f"{book_id}.timing.json")
    timing = json.load(open(timing_path)) if os.path.exists(timing_path) else {"book": book_id, "pages": {}}
    narrator = Narrator(story.get("voice", "af_heart"))

    for n, page in enumerate(story["pages"]):
        if only and page["id"] not in only:
            continue
        name = f"{n:02d}-{page['id']}.mp3"
        parts, cursor = [silence(LEAD_IN)], LEAD_IN
        entry = {"audio": f"/audio/stories/{book_id}/{name}"}
        if page.get("kind") == "cover":
            audio, _ = narrator.speak(page["narration"])
            parts.append(audio)
            cursor += len(audio) / SR
        else:
            audio, words = narrator.speak(page["title"])
            entry["title"] = [[round(s + cursor, 3), round(e + cursor, 3)] for s, e in words]
            parts += [audio, silence(TITLE_PAUSE)]
            cursor += len(audio) / SR + TITLE_PAUSE
            entry["paras"] = []
            for p_i, para in enumerate(page["text"]):
                audio, words = narrator.speak(para)
                entry["paras"].append([[round(s + cursor, 3), round(e + cursor, 3)] for s, e in words])
                parts.append(audio)
                cursor += len(audio) / SR
                if p_i < len(page["text"]) - 1:
                    parts.append(silence(PARAGRAPH_PAUSE))
                    cursor += PARAGRAPH_PAUSE
        parts.append(silence(TAIL))
        full = np.concatenate(parts)
        master(full, os.path.join(out_dir, name))
        entry["duration"] = round(len(full) / SR, 2)
        timing["pages"][page["id"]] = entry
        print(f"{book_id}/{name}: {entry['duration']:.1f}s", flush=True)

    json.dump(timing, open(timing_path, "w"), indent=0, separators=(",", ":"))


if __name__ == "__main__":
    args = sys.argv[1:] or ["eagle", "viking", "voyager"]
    pages = os.environ.get("PAGES")
    for book in args:
        build(book, pages.split(",") if pages else None)
