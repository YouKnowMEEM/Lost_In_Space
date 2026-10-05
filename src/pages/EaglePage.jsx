import React from "react";
import BookRoute from "../storybook/BookRoute";
import { EAGLE_PATHS, VIKING_PATHS } from "../storybook/books";
import { eagleScenes } from "../storybook/scenes/eagleScenes";
import story from "../data/stories/eagle.json";
import timing from "../data/stories/eagle.timing.json";
import { eagleMission } from "../data/missions/eagle";

const config = {
  story,
  timing,
  scenes: eagleScenes,
  music: "/audio/music/moon-lullaby.mp3",
  theme: "moon",
  paths: EAGLE_PATHS,
  world: { label: "the Moon", short: "Moon", path: "/moon" },
  nextBook: { title: "Viking 1", path: VIKING_PATHS.story },
  mission: eagleMission,
};

/** /eagle (storybook) and /eagle/mission (documentation). */
export default function EaglePage({ mode = "story" }) {
  return <BookRoute config={config} mode={mode} />;
}
