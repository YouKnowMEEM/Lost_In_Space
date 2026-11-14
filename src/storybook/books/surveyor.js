// One storybook: its words (shared with the narration builder) and its illustrations.
import story from "../../data/stories/surveyor.json";
import { surveyorScenes as scenes } from "../scenes/surveyorScenes";

// Read aloud by the browser's voice until recorded narration exists. After running
//   python tools/narration/build_narration.py surveyor
// replace the next line with: import timing from "../../data/stories/surveyor.timing.json";
const timing = null;

export { story, scenes, timing };
