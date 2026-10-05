#!/usr/bin/env python3
"""
Two original, gentle background loops for the storybooks (no samples, pure synthesis):
  moon-lullaby.mp3  - music box over a soft pad, F major, for Eagle
  mars-lullaby.mp3  - warm kalimba over a soft pad, D lydian, for Viking 1
  deep-lullaby.mp3  - glassy bells over a wide pad, A aeolian, for Voyager 1

    python tools/music/make_lullabies.py            # all three
    python tools/music/make_lullabies.py deep       # just one
"""
import os
import subprocess
import tempfile

import numpy as np
import soundfile as sf
from scipy.signal import butter, fftconvolve, sosfilt

SR = 44100
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "public", "audio", "music")
NOTE = {n: i for i, n in enumerate(["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"])}
NOTE.update({"Db": 1, "Eb": 3, "Gb": 6, "Ab": 8, "Bb": 10})


def hz(name):
    """'F4' -> frequency. Supports sharps/flats like 'Bb3', 'F#5'."""
    pitch, octave = name[:-1], int(name[-1])
    midi = 12 * (octave + 1) + NOTE[pitch]
    return 440.0 * 2 ** ((midi - 69) / 12)


def lowpass(x, cutoff, order=2):
    return sosfilt(butter(order, cutoff, "low", fs=SR, output="sos"), x)


def pad_voice(freq, dur, attack=1.6, release=2.4, bright=0.18, rng=None):
    """Soft pad: sine + a little octave and fifth, gently chorused, slow swell."""
    n = int((dur + release) * SR)
    t = np.arange(n) / SR
    det = 1 + (rng.uniform(-2, 2) / 1200)
    vib = 1 + 0.0018 * np.sin(2 * np.pi * rng.uniform(0.15, 0.3) * t + rng.uniform(0, 6.28))
    phase = 2 * np.pi * freq * det * np.cumsum(vib) / SR
    x = np.sin(phase) + bright * np.sin(2 * phase) + 0.08 * np.sin(3 * phase)
    x += 0.5 * np.sin(2 * np.pi * freq * (1 - 1.5 / 1200) * t + 1.3)  # chorus twin
    env = np.ones(n)
    a = int(attack * SR)
    env[:a] = (1 - np.cos(np.linspace(0, np.pi, a))) / 2
    r0 = int(dur * SR)
    env[r0:] = np.exp(-np.linspace(0, 6, n - r0))
    env[r0:] *= env[r0 - 1] if r0 > 0 else 1
    return x * env


def music_box(freq, rng, decay=1.6):
    """Bright but soft music-box tine: fundamental, octave and an inharmonic bell partial."""
    dur = decay * 3.2
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = freq * (1 + rng.uniform(-3, 3) / 1200)
    x = (np.sin(2 * np.pi * f * t) * np.exp(-t / decay)
         + 0.32 * np.sin(2 * np.pi * 2.0 * f * t) * np.exp(-t / (decay * 0.42))
         + 0.10 * np.sin(2 * np.pi * 3.01 * f * t) * np.exp(-t / (decay * 0.25))
         + 0.05 * np.sin(2 * np.pi * 4.17 * f * t) * np.exp(-t / (decay * 0.16)))
    att = int(0.004 * SR)
    x[:att] *= np.linspace(0, 1, att)
    return lowpass(x, 5200)


def kalimba(freq, rng, decay=1.0):
    """Warm thumb-piano pluck: strong fundamental, quick woody overtone."""
    dur = decay * 3.5
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = freq * (1 + rng.uniform(-2, 2) / 1200)
    x = (np.sin(2 * np.pi * f * t) * np.exp(-t / decay)
         + 0.22 * np.sin(2 * np.pi * 5.4 * f * t) * np.exp(-t / 0.08)
         + 0.18 * np.sin(2 * np.pi * 2.0 * f * t) * np.exp(-t / (decay * 0.35)))
    att = int(0.006 * SR)
    x[:att] *= np.linspace(0, 1, att)
    return lowpass(x, 3800)


def glass(freq, rng, decay=2.6):
    """Soft glass bell with a slow swell and a slight shimmer, for the deep-space book."""
    dur = decay * 3.0
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = freq * (1 + rng.uniform(-2, 2) / 1200)
    vib = 1 + 0.0016 * np.sin(2 * np.pi * 5.1 * t)
    phase = 2 * np.pi * f * np.cumsum(vib) / SR
    x = (np.sin(phase) * np.exp(-t / decay)
         + 0.24 * np.sin(2 * phase) * np.exp(-t / (decay * 0.5))
         + 0.06 * np.sin(3.0 * phase) * np.exp(-t / (decay * 0.3)))
    att = int(0.05 * SR)
    x[:att] *= np.linspace(0, 1, att) ** 2
    return lowpass(x, 4600)


def reverb_ir(seconds=3.6, rng=None):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = np.zeros((n, 2))
    for ch in range(2):
        noise = rng.standard_normal(n) * np.exp(-6.9 * t / seconds)
        ir[:, ch] = lowpass(noise, 4200 if ch == 0 else 3900)
    ir[: int(0.02 * SR)] *= np.linspace(0, 1, int(0.02 * SR))[:, None]
    return ir / np.abs(ir).sum(axis=0).max() * 9


def place(buf, sig, start, pan=0.0, gain=1.0):
    i = max(0, int(start * SR))
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    left, right = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[i:j, 0] += sig[: j - i] * gain * left
    buf[i:j, 1] += sig[: j - i] * gain * right


def render(song, name, seed):
    rng = np.random.default_rng(seed)
    beat = 60 / song["bpm"]
    bar = beat * 4
    loop = bar * len(song["chords"])
    tail = 6.0
    buf = np.zeros((int((loop + tail) * SR), 2))

    # Pad + soft bass, one chord per bar, overlapping release for smooth changes.
    for b, chord in enumerate(song["chords"]):
        start = b * bar
        for k, note in enumerate(chord):
            v = pad_voice(hz(note), bar + 0.3, rng=rng)
            place(buf, lowpass(v, 1500), start, pan=(k - 1.5) * 0.25, gain=0.055)
        bass = pad_voice(hz(song["bass"][b]), bar + 0.2, attack=0.9, bright=0.05, rng=rng)
        place(buf, lowpass(bass, 400), start, pan=0, gain=0.09)

    # Melody: (bar, beat, note, length_in_beats)
    voice = {"box": music_box, "kalimba": kalimba, "glass": glass}[song["lead"]]
    for (b, bt, note) in song["melody"]:
        place(buf, voice(hz(note), rng), b * bar + bt * beat + rng.uniform(-0.012, 0.012),
              pan=rng.uniform(-0.35, 0.35), gain=0.16 * rng.uniform(0.82, 1.0))

    # Faint twinkles: high, sparse, almost subliminal.
    for _ in range(int(loop / 3.5)):
        t0 = rng.uniform(0, loop)
        place(buf, music_box(hz(rng.choice(song["sparkle"])), rng, decay=0.9), t0,
              pan=rng.uniform(-0.8, 0.8), gain=0.035)

    wet = np.stack([fftconvolve(buf[:, c], reverb_ir(rng=rng)[:, c])[: len(buf)] for c in range(2)], axis=1)
    mix = 0.72 * buf + 0.42 * wet

    # Seamless loop: fold everything after the loop point back onto the start.
    n_loop = int(loop * SR)
    out = mix[:n_loop].copy()
    over = mix[n_loop:]
    out[: len(over)] += over
    out = lowpass(out.T, 9000).T
    out /= np.abs(out).max() / 0.6

    os.makedirs(OUT, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, "m.wav")
        sf.write(wav, out.astype(np.float32), SR, subtype="FLOAT")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-af", "loudnorm=I=-24:TP=-3:LRA=9",
                        "-ar", str(SR), "-codec:a", "libmp3lame", "-b:a", "112k",
                        os.path.join(OUT, f"{name}.mp3")], check=True)
    print(name, f"{loop:.1f}s")


# --- Eagle: "Moon lullaby", F major, music box -------------------------------------------
F_CHORDS = [
    ["F3", "A3", "C4", "E4"], ["A3", "C4", "E4", "G4"], ["Bb3", "D4", "F4", "A4"], ["C4", "E4", "G4", "A4"],
    ["F3", "A3", "C4", "E4"], ["D3", "F3", "A3", "C4"], ["Bb3", "D4", "F4", "A4"], ["C4", "F4", "G4", "Bb4"],
    ["D3", "F3", "A3", "C4"], ["A3", "C4", "E4", "G4"], ["Bb3", "D4", "F4", "A4"], ["F3", "A3", "C4", "E4"],
    ["G3", "Bb3", "D4", "F4"], ["A3", "C4", "E4", "G4"], ["Bb3", "D4", "F4", "A4"], ["C4", "E4", "G4", "Bb4"],
]
F_BASS = ["F2", "A2", "Bb2", "C3", "F2", "D2", "Bb2", "C3", "D2", "A2", "Bb2", "F2", "G2", "A2", "Bb2", "C3"]
F_MOTIF_A = [(0, 0, "C5"), (0, 1.5, "A5"), (0, 3, "G5"), (1, 0, "E5"), (1, 2, "C5"), (2, 0, "D5"), (2, 1, "F5"),
             (2, 2.5, "A5"), (3, 0, "G5"), (3, 2, "E5"), (3, 3, "C5")]
F_MOTIF_B = [(0, 0, "A5"), (0, 1.5, "C6"), (0, 3, "A5"), (1, 0, "G5"), (1, 2, "E5"), (2, 0, "F5"), (2, 1.5, "D5"),
             (2, 3, "F5"), (3, 0, "E5"), (3, 2, "G5"), (3, 3.5, "C5")]
F_MOTIF_C = [(0, 0, "F5"), (0, 2, "A5"), (1, 0, "E5"), (1, 2, "C5"), (2, 0, "D5"), (2, 2, "F5"), (2, 3, "A5"),
             (3, 0, "G5"), (3, 1.5, "E5")]
F_MOTIF_D = [(0, 0, "D5"), (0, 1.5, "F5"), (0, 3, "G5"), (1, 0, "A5"), (1, 2, "G5"), (2, 0, "F5"), (2, 2, "D5"),
             (3, 0, "C5"), (3, 2, "E5"), (3, 3, "G5")]


def shift(motif, bars):
    return [(b + bars, bt, n) for b, bt, n in motif]


MOON = {
    "bpm": 64, "lead": "box", "chords": F_CHORDS, "bass": F_BASS,
    "melody": F_MOTIF_A + shift(F_MOTIF_B, 4) + shift(F_MOTIF_C, 8) + shift(F_MOTIF_D, 12),
    "sparkle": ["C7", "D7", "F7", "G7", "A6"],
}

# --- Viking: "Mars lullaby", D lydian, kalimba ---------------------------------------------
D_CHORDS = [
    ["D3", "F#3", "A3", "C#4"], ["E3", "G#3", "B3", "D4"], ["B2", "D3", "F#3", "A3"], ["G3", "B3", "D4", "F#4"],
    ["D3", "F#3", "A3", "C#4"], ["E3", "G#3", "B3", "D4"], ["F#3", "A3", "C#4", "E4"], ["G3", "B3", "D4", "F#4"],
    ["B2", "D3", "F#3", "A3"], ["G3", "B3", "D4", "F#4"], ["D3", "F#3", "A3", "C#4"], ["E3", "G#3", "B3", "D4"],
    ["B2", "D3", "F#3", "A3"], ["F#3", "A3", "C#4", "E4"], ["G3", "B3", "D4", "F#4"], ["A3", "C#4", "E4", "G#4"],
]
D_BASS = ["D2", "E2", "B1", "G2", "D2", "E2", "F#2", "G2", "B1", "G2", "D2", "E2", "B1", "F#2", "G2", "A2"]
D_MOTIF_A = [(0, 0, "A4"), (0, 1, "D5"), (0, 2, "F#5"), (1, 0, "G#5"), (1, 1.5, "F#5"), (1, 3, "E5"),
             (2, 0, "D5"), (2, 2, "F#5"), (3, 0, "A5"), (3, 1.5, "F#5"), (3, 3, "D5")]
D_MOTIF_B = [(0, 0, "F#5"), (0, 1.5, "A5"), (1, 0, "B5"), (1, 2, "G#5"), (2, 0, "E5"), (2, 1, "C#5"),
             (2, 2.5, "E5"), (3, 0, "D5"), (3, 2, "F#5")]
D_MOTIF_C = [(0, 0, "D5"), (0, 1, "F#5"), (0, 2, "B5"), (1, 0, "A5"), (1, 2, "F#5"), (2, 0, "G#5"),
             (2, 1.5, "E5"), (3, 0, "F#5"), (3, 1.5, "D5"), (3, 3, "A4")]
D_MOTIF_D = [(0, 0, "B4"), (0, 1.5, "D5"), (1, 0, "E5"), (1, 2, "C#5"), (2, 0, "D5"), (2, 1, "F#5"),
             (2, 2, "A5"), (3, 0, "G#5"), (3, 2, "E5")]
MARS = {
    "bpm": 60, "lead": "kalimba", "chords": D_CHORDS, "bass": D_BASS,
    "melody": D_MOTIF_A + shift(D_MOTIF_B, 4) + shift(D_MOTIF_C, 8) + shift(D_MOTIF_D, 12),
    "sparkle": ["A6", "B6", "D7", "E7", "G#6"],
}

# --- Voyager: "Deep-space lullaby", A aeolian, glass bells ----------------------------------
A_CHORDS = [
    ["A3", "C4", "E4", "B4"], ["F3", "A3", "C4", "E4"], ["C4", "E4", "G4", "B4"], ["G3", "B3", "D4", "E4"],
    ["A3", "C4", "E4", "G4"], ["D3", "F3", "A3", "E4"], ["F3", "A3", "B3", "E4"], ["E3", "A3", "B3", "D4"],
    ["F3", "A3", "C4", "E4"], ["E3", "G3", "B3", "C4"], ["D3", "F3", "A3", "C4"], ["A3", "C4", "E4", "B4"],
    ["F3", "A3", "C4", "E4"], ["G3", "B3", "D4", "E4"], ["E3", "G3", "B3", "D4"], ["E3", "A3", "B3", "D4"],
]
A_BASS = ["A2", "F2", "C3", "G2", "A2", "D2", "F2", "E2", "F2", "E2", "D2", "A2", "F2", "G2", "E2", "E2"]
A_MOTIF_A = [(0, 0, "E5"), (0, 2, "A5"), (1, 0, "G5"), (1, 2.5, "E5"), (2, 0, "C5"), (2, 2, "D5"), (3, 0, "E5"), (3, 3, "G5")]
A_MOTIF_B = [(0, 0, "A5"), (0, 1.5, "C6"), (1, 0, "B5"), (1, 2, "G5"), (2, 0, "F5"), (2, 2, "A5"), (3, 0, "E5")]
A_MOTIF_C = [(0, 0, "C5"), (0, 2, "E5"), (1, 0, "D5"), (1, 2, "F5"), (2, 0, "E5"), (2, 1.5, "G5"), (2, 3, "A5"),
             (3, 0, "B4"), (3, 2, "E5")]
A_MOTIF_D = [(0, 0, "A5"), (0, 2, "G5"), (1, 0, "E5"), (1, 2, "D5"), (2, 0, "G5"), (2, 2, "B5"), (3, 0, "A5"), (3, 2, "E5")]
DEEP = {
    "bpm": 56, "lead": "glass", "chords": A_CHORDS, "bass": A_BASS,
    "melody": A_MOTIF_A + shift(A_MOTIF_B, 4) + shift(A_MOTIF_C, 8) + shift(A_MOTIF_D, 12),
    "sparkle": ["E7", "A6", "B6", "C7", "G6"],
}

if __name__ == "__main__":
    import sys

    songs = {"moon": (MOON, "moon-lullaby", 7), "mars": (MARS, "mars-lullaby", 11), "deep": (DEEP, "deep-lullaby", 23)}
    for key in sys.argv[1:] or list(songs):
        song, name, seed = songs[key]
        render(song, name, seed=seed)
