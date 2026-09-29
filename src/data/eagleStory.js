// Eagle storybook content. Edit the words here: the page shows every line and the narrator reads the same lines.
// One sentence per line, so the sentence being spoken can be highlighted.
// eagle: pose of the little ship ("float" | "split" | "drop" | "land" | "lift" | "sleep"); icons: big emoji props;
// fx: motion for the icons ("rocket" | "hop" | "float"); sky: "dusk" for the bedtime page.

export const NASA_URL = "https://www.nasa.gov/mission/apollo-11/";

export const PAGES = [
  { id: "cover", title: "Eagle", sub: "The little ship that touched the Moon", eagle: "float", icons: [], lines: [] },
  {
    id: "odd",
    title: "A Very Odd Little Ship",
    eagle: "float",
    icons: [],
    lines: [
      "Once upon a time, there was a little ship named Eagle.",
      "He had no wings and no wheels.",
      "He had four skinny legs and a shiny golden coat.",
      "Some people said he looked like a spider, but spiders have eight legs and Eagle had only four!",
      "Can you count them?",
    ],
  },
  {
    id: "rocket",
    title: "Three Friends and a Giant Rocket",
    icons: ["🚀"],
    fx: "rocket",
    lines: [
      "Three brave astronauts were going to the Moon.",
      "Their names were Neil, Buzz, and Michael.",
      "On July sixteenth, nineteen sixty-nine, a giant rocket roared into the sky, with Eagle tucked safely inside.",
      "Three days later, the Moon looked big and close!",
    ],
  },
  {
    id: "halves",
    title: "Two Halves, One Brave Ship",
    eagle: "split",
    icons: [],
    lines: [
      "Eagle was made of two parts, like a sandwich.",
      "The top half was a cozy cabin with an engine to fly home.",
      "The bottom half had the legs and a landing engine.",
      "The bottom half would stay on the Moon.",
      "Watch the two halves wiggle apart!",
    ],
  },
  {
    id: "descent",
    title: "Down, Down, Down",
    eagle: "drop",
    icons: [],
    lines: [
      "Neil and Buzz climbed into Eagle, while Michael circled the Moon in a spaceship called Columbia.",
      "Down, down, down went Eagle.",
      "Beep, beep! The computer got very busy, but the team on Earth said, keep going, you are doing fine!",
      "Then Neil spotted big rocks below.",
      "So he took the controls and flew Eagle along, looking for a smooth place to land.",
    ],
  },
  {
    id: "touchdown",
    title: "Touchdown!",
    eagle: "land",
    icons: ["🎉"],
    fx: "float",
    lines: [
      "Gently, gently, gently... Eagle's four feet touched the Moon.",
      "It was July twentieth, nineteen sixty-nine.",
      "Neil told everyone on Earth, “Houston, Tranquility Base here. The Eagle has landed!”",
      "People all over the world cheered.",
    ],
  },
  {
    id: "steps",
    title: "Bouncy Moon Steps",
    icons: ["🧑‍🚀", "👣", "🏁"],
    fx: "hop",
    lines: [
      "Neil opened the door and climbed down the ladder.",
      "He took the very first step on the Moon!",
      "“That's one small step for man, one giant leap for mankind,” he said.",
      "Then Buzz joined him. On the Moon you weigh much less, so every step is a bouncy hop!",
      "They left footprints, planted a flag, and picked up moon rocks to bring home.",
    ],
  },
  {
    id: "home",
    title: "Time to Go Home",
    eagle: "lift",
    icons: [],
    lines: [
      "After about a day on the Moon, it was time to go home.",
      "The top half of Eagle fired its engine. Whoosh!",
      "It zoomed up, using the bottom half as a launch pad.",
      "The bottom half stayed behind, all alone.",
    ],
  },
  {
    id: "reunion",
    title: "Hello Again, Columbia!",
    icons: ["🛰️", "🧑‍🚀", "🌍"],
    fx: "float",
    lines: [
      "High above, Michael was waiting in Columbia.",
      "Eagle's top half found the spaceship and linked up with it.",
      "Neil and Buzz climbed back aboard, and the three friends were together again.",
      "Then they sailed home to Earth.",
    ],
  },
  {
    id: "goodnight",
    title: "Goodnight, Eagle",
    eagle: "sleep",
    icons: ["💤"],
    fx: "float",
    sky: "dusk",
    lines: [
      "And what about the little bottom half of Eagle?",
      "It is still there today, at a place called Tranquility Base.",
      "There is no wind or rain on the Moon to wake it, so it sleeps, and its footprints sleep beside it.",
      "Tonight, look up at the Moon and whisper, goodnight, Eagle.",
    ],
  },
];
