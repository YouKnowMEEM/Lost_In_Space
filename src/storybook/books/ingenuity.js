// One storybook: its words (shared with the narration builder) and its illustrations.
import story from "../../data/stories/ingenuity.json";
import { ingenuityScenes as scenes } from "../scenes/ingenuityScenes";

// Read aloud by the browser's voice until recorded narration exists. After running
//   python tools/narration/build_narration.py ingenuity
// replace the next line with: import timing from "../../data/stories/ingenuity.timing.json";
const timing = null;

export { story, scenes, timing };
