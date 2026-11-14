// One storybook: its words (shared with the narration builder) and its illustrations.
import story from "../../data/stories/near-shoemaker.json";
import { nearScenes as scenes } from "../scenes/nearScenes";

// Read aloud by the browser's voice until recorded narration exists. After running
//   python tools/narration/build_narration.py near-shoemaker
// replace the next line with: import timing from "../../data/stories/near-shoemaker.timing.json";
const timing = null;

export { story, scenes, timing };
