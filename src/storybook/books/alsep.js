// One storybook: its words (shared with the narration builder) and its illustrations.
import story from "../../data/stories/alsep.json";
import { alsepScenes as scenes } from "../scenes/alsepScenes";

// Read aloud by the browser's voice until recorded narration exists. After running
//   python tools/narration/build_narration.py alsep
// replace the next line with: import timing from "../../data/stories/alsep.timing.json";
const timing = null;

export { story, scenes, timing };
