// One storybook: its words (shared with the narration builder) and its illustrations.
import story from "../../data/stories/phoenix-and-insight.json";
import { phoenixInsightScenes as scenes } from "../scenes/phoenixInsightScenes";

// Read aloud by the browser's voice until recorded narration exists. After running
//   python tools/narration/build_narration.py phoenix-and-insight
// replace the next line with: import timing from "../../data/stories/phoenix-and-insight.timing.json";
const timing = null;

export { story, scenes, timing };
