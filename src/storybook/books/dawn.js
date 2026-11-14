// One storybook: its words (shared with the narration builder) and its illustrations.
import story from "../../data/stories/dawn.json";
import { dawnScenes as scenes } from "../scenes/dawnScenes";

// Read aloud by the browser's voice until recorded narration exists. After running
//   python tools/narration/build_narration.py dawn
// replace the next line with: import timing from "../../data/stories/dawn.timing.json";
const timing = null;

export { story, scenes, timing };
