// One storybook: its words (shared with the narration builder) and its illustrations.
import story from "../../data/stories/spirit-and-opportunity.json";
import { twinsScenes as scenes } from "../scenes/twinsScenes";

// Read aloud by the browser's voice until recorded narration exists. After running
//   python tools/narration/build_narration.py spirit-and-opportunity
// replace the next line with: import timing from "../../data/stories/spirit-and-opportunity.timing.json";
const timing = null;

export { story, scenes, timing };
