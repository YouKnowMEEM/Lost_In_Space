# Storybook narration

The narrator is the open **Kokoro-82M** text-to-speech model (Apache 2.0), voice `af_heart`,
run locally through `kokoro-onnx`. Nothing is sent to an online service.

## Rebuild the audio after editing a story

1. Install the tools (Python 3.10+ and `ffmpeg` on your PATH):

   ```bash
   pip install kokoro-onnx==0.6.1 onnx soundfile numpy
   ```

2. Download `kokoro-v1.0.onnx` and `voices-v1.0.bin` from the
   [kokoro-onnx model release](https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0)
   into `tools/narration/models/` (this folder is ignored by git).

3. Patch the model once so it reports phoneme durations:

   ```bash
   python tools/narration/patch_model.py
   ```

4. Build one or more books (all pages, or only some):

   ```bash
   python tools/narration/build_narration.py eagle viking voyager
   PAGES=landed,step python tools/narration/build_narration.py eagle
   ```

This writes `public/audio/stories/<book>/NN-<page>.mp3` and the word timings in
`src/data/stories/<book>.timing.json`, which drive the highlighted read-along text.

Settings: `NARRATION_SPEED` (default `0.9`), `KOKORO_MODEL`, `KOKORO_VOICES`.

## Story markup

Inside `src/data/stories/<book>.json`, titles and paragraphs can say a word differently
from how it is shown:

- `[1202]{twelve-oh-two}` shows "1202" and says "twelve-oh-two".
- `[Chryse]{/kɹˈaɪsi/}` shows the word and speaks the IPA phonemes between slashes.

## Background music

The two lullabies are synthesized from scratch (no samples):

```bash
pip install numpy scipy soundfile
python tools/music/make_lullabies.py
```
