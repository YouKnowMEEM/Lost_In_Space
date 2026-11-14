// One storybook: its words (shared with the narration builder) and its illustrations.
import story from "../../data/stories/kepler.json";
import { keplerScenes as scenes } from "../scenes/keplerScenes";

// Read aloud by the browser's voice until recorded narration exists. After running
//   python tools/narration/build_narration.py kepler
// replace the next line with: import timing from "../../data/stories/kepler.timing.json";
const timing = null;

export { story, scenes, timing };
