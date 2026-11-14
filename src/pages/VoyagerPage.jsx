import React from "react";
import BookRoute from "../storybook/BookRoute";
import { VOYAGER_PATHS } from "../storybook/books";
import { voyagerScenes } from "../storybook/scenes/voyagerScenes";
import story from "../data/stories/voyager.json";
import timing from "../data/stories/voyager.timing.json";
import { voyagerMission } from "../data/missions/voyager";

const config = {
  story,
  timing,
  scenes: voyagerScenes,
  music: "/audio/music/deep-lullaby.mp3",
  theme: "deep",
  paths: VOYAGER_PATHS,
  // Voyager 1 lives on the Space page of the main site.
  world: { label: "Space", short: "Space", path: "/space?object=voyager-1" },
  nextBook: { title: "Surveyor", path: "/stories/surveyor" },
  mission: voyagerMission,
};

/** /voyager-1 (storybook) and /voyager-1/mission (documentation). */
export default function VoyagerPage({ mode = "story" }) {
  return <BookRoute config={config} mode={mode} />;
}
