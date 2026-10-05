// Story text can carry pronunciation hints for the narrator:
//   [1202]{twelve-oh-two}            show "1202", the narrator says "twelve-oh-two"
//   [Chryse Planitia]{/kɹˈaɪsi …/}   show the words, the narrator uses these phonemes
// The page shows only the display text. Words are split exactly like the narration
// builder (tools/narration/build_narration.py) so each word lines up with its timing.

const MARK = /\[([^\]]+)\]\{([^}]*)\}/g;

export const displayText = (text = "") => text.replace(MARK, "$1");

export const displayWords = (text = "") => displayText(text).split(/\s+/).filter(Boolean);
