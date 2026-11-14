// One storybook: its words (shared with the narration builder) and its illustrations.
import story from "../../data/stories/sojourner.json";
import { sojournerScenes as scenes } from "../scenes/sojournerScenes";

// Read aloud by the browser's voice until recorded narration exists. After running
//   python tools/narration/build_narration.py sojourner
// replace the next line with: import timing from "../../data/stories/sojourner.timing.json";
const timing = null;

export { story, scenes, timing };
