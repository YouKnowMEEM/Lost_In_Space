// One storybook: its words (shared with the narration builder) and its illustrations.
import story from "../../data/stories/pioneers.json";
import { pioneersScenes as scenes } from "../scenes/pioneersScenes";

// Read aloud by the browser's voice until recorded narration exists. After running
//   python tools/narration/build_narration.py pioneers
// replace the next line with: import timing from "../../data/stories/pioneers.timing.json";
const timing = null;

export { story, scenes, timing };
