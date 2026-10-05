import React from "react";
import BookRoute from "../storybook/BookRoute";
import { VIKING_PATHS, VOYAGER_PATHS } from "../storybook/books";
import { vikingScenes } from "../storybook/scenes/vikingScenes";
import story from "../data/stories/viking.json";
import timing from "../data/stories/viking.timing.json";
import { vikingMission } from "../data/missions/viking";

const config = {
  story,
  timing,
  scenes: vikingScenes,
  music: "/audio/music/mars-lullaby.mp3",
  theme: "mars",
  paths: VIKING_PATHS,
  world: { label: "Mars", short: "Mars", path: "/mars" },
  nextBook: { title: "Voyager 1", path: VOYAGER_PATHS.story },
  mission: vikingMission,
};

/** /viking-1 (storybook) and /viking-1/mission (documentation). */
export default function VikingPage({ mode = "story" }) {
  return <BookRoute config={config} mode={mode} />;
}
