// One storybook: its words (shared with the narration builder) and its illustrations.
import story from "../../data/stories/lunar-rovers.json";
import { roversScenes as scenes } from "../scenes/roversScenes";

// Read aloud by the browser's voice until recorded narration exists. After running
//   python tools/narration/build_narration.py lunar-rovers
// replace the next line with: import timing from "../../data/stories/lunar-rovers.timing.json";
const timing = null;

export { story, scenes, timing };
