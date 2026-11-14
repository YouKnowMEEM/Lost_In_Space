// One real NASA picture for each machine, so no two cards in the Cosmic Library share a photo.
// Every address comes from a NASA archive page: NSSDCA's spacecraft and image catalogs,
// NASA Science mission pages and the NASA Image and Video Library (all public domain).
// Each photo lists a few addresses; the page tries them in order and falls back to the
// machine's illustration if none loads. Machines without a verified photo keep their own
// illustration (none of those illustrations is shared any more).

const IA = "https://images-assets.nasa.gov/image";
const ia = (id, sizes = ["small", "medium", "large"]) => sizes.map((s) => `${IA}/${id}/${id}~${s}.jpg`);
const pia = (id) => ia(id, ["large", "orig", "medium"]);
// NASA Science's image service resizes on request, so cards download a small copy.
const dyn = (path, w = 800) => `https://assets.science.nasa.gov/dynamicimage/assets/science/${path}?w=${w}&h=${Math.round(w * 0.75)}&fit=clip`;
const imgcat = (name) => [
  `https://nssdc.gsfc.nasa.gov/imgcat/midres/${name}.gif`,
  `https://nssdc.gsfc.nasa.gov/imgcat/midres/${name}.jpg`,
  `https://nssdc.gsfc.nasa.gov/imgcat/hires/${name}.gif`,
  `https://nssdc.gsfc.nasa.gov/imgcat/hires/${name}.jpg`,
];
const nssdc = (path) => `https://nssdc.gsfc.nasa.gov/${path}`;

export const PHOTOS = {
  // The Moon
  "apollo-11": { src: [nssdc("planetary/image/ap11_lm_as11_40_5927.jpg"), ...ia("as11-40-5927")], caption: "Eagle at Tranquility Base, photographed during the first moonwalk, July 1969.", credit: "NASA · AS11-40-5927" },
  "apollo-12": { src: [nssdc("planetary/image/apollo12_lunar_module.jpg"), ...imgcat("a12_h_46_6749")], caption: "Intrepid on the Ocean of Storms, November 1969.", credit: "NASA / NSSDCA" },
  "apollo-14": { src: [...ia("as14-66-9306"), ...ia("GPN-2000-001144")], caption: "Antares on the Fra Mauro highlands, catching a starburst of sunlight, February 1971.", credit: "NASA · AS14-66-9306" },
  "apollo-15": { src: [nssdc("image/spacecraft/apollo_15_lm.jpg")], caption: "Falcon at Hadley, at the foot of the Apennine Mountains, July 1971.", credit: "NASA / NSSDCA" },
  "apollo-16": { src: [...ia("as16-115-18549"), ...ia("as16-113-18339")], caption: "The lunar module Orion at the Descartes Highlands, April 1972.", credit: "NASA / JSC" },
  "apollo-17": { src: ia("as17-134-20382"), caption: "Harrison Schmitt beside the flag at Taurus-Littrow, with Challenger and the lunar rover behind, December 1972.", credit: "NASA · AS17-134-20382" },
  "lrv-15": { src: [...imgcat("a15_h_85_11451"), ...ia("as15-85-11451")], caption: "An astronaut and the first lunar rover at the rim of Hadley Rille, 1971.", credit: "NASA · AS15-85-11451" },
  "lrv-16": { src: [...ia("as16-115-18559"), ...ia("as16-107-17436")], caption: "Apollo 16's lunar rover at the Descartes Highlands, April 1972.", credit: "NASA / JSC" },
  "lrv-17": { src: [...imgcat("a17_h_146_22294"), ...ia("as17-146-22367")], caption: "Harrison Schmitt at a giant split boulder, with the last lunar rover parked in front, December 1972.", credit: "NASA · AS17-146-22294" },
  alsep: { src: [...imgcat("a12_h_47_6921"), ...ia("as17-134-20501")], caption: "Pete Conrad sets up the very first ALSEP station, on Apollo 12, November 1969.", credit: "NASA · AS12-47-6921" },
  "surveyor-3": { src: [dyn("psd/solar/2023/07/as12-48-7134_1280.jpg"), ...imgcat("a12_h_48_7138")], caption: "Apollo 12's Pete Conrad visits Surveyor 3, with the lunar module Intrepid in the background.", credit: "NASA · AS12-48-7134" },
  "surveyor-5": { src: imgcat("su5_67_h_1340"), caption: "Surveyor 5's footpad, pressed into the soil of the Sea of Tranquility.", credit: "NASA / NSSDCA" },
  "surveyor-7": { src: imgcat("su7_68_h_40"), caption: "Seen by Surveyor 7: the boulder-strewn northern rim of Tycho crater.", credit: "NASA / NSSDCA" },
  "ranger-7": { src: imgcat("ra7_b001"), caption: "Ranger 7's first picture, the first image of the Moon taken by a U.S. spacecraft, 1964.", credit: "NASA / NSSDCA" },
  "ranger-8": { src: imgcat("ra8_b090"), caption: "The Sea of Tranquility from 11 km up, five seconds before Ranger 8 hit it, 1965.", credit: "NASA / NSSDCA" },
  "ranger-9": { src: imgcat("ra9_a060"), caption: "The central peak of Alphonsus crater, photographed by Ranger 9 on its way down, 1965.", credit: "NASA / NSSDCA" },

  // Mars
  "viking-1": { src: [dyn("psd/solar/2023/07/Viking_1_First_Image_From_Mars_1280.jpg"), ...pia("PIA00381")], caption: "The first photo taken on the surface of Mars: Viking 1's own footpad, 20 July 1976.", credit: "NASA / JPL" },
  "viking-2": { src: imgcat("vl2_p21873"), caption: "Seen by Viking 2: frost on the ground of Utopia Planitia.", credit: "NASA / JPL / NSSDCA" },
  "pathfinder-sojourner": { src: ["https://science.nasa.gov/wp-content/uploads/2017/12/pia00621-pathfinder-and-sojourner-with-airbags-deflated.jpg", ...pia("PIA00621")], caption: "Sojourner still riding on the Pathfinder lander, beside its deflated airbags, 4 July 1997.", credit: "NASA / JPL · PIA00621" },
  "spirit-mer-a": { src: ["https://science.nasa.gov/wp-content/uploads/2008/02/365-mer-1280-spirit.jpg"], caption: "Spirit, one of NASA's twin Mars Exploration Rovers.", credit: "NASA / JPL-Caltech" },
  "insight-lander": { src: [dyn("psd/mars/downloadable_items/3/8/38686_Mars-InSight-Solar-Panels-Open-pia196641.jpg")], caption: "InSight with its round solar panels spread wide, tested in a clean room before launch.", credit: "NASA / JPL-Caltech / Lockheed Martin" },
  "ingenuity-helicopter": { src: [dyn("psd/mars/downloadable_items/4/5/45954_PIA24581.jpg")], caption: "Ingenuity standing on the floor of Jezero Crater, photographed by Perseverance.", credit: "NASA / JPL-Caltech · PIA24581" },

  // Far from Earth
  "voyager-1": { src: pia("PIA00144"), caption: "Seen by Voyager 1: Jupiter with its moons Io and Europa, February 1979.", credit: "NASA / JPL · PIA00144" },
  "voyager-2": { src: imgcat("vg2_1129248"), caption: "Seen by Voyager 2: Neptune and its Great Dark Spot, 1989.", credit: "NASA / JPL / NSSDCA" },
  "pioneer-11": { src: [dyn("psd/solar/2023/09/7/739460main_ac79-9107.3.jpg"), dyn("psd/solar/internal_resources/730/Saturn_and_its_rings.jpeg")], caption: "Seen by Pioneer 11: Saturn, its rings and its moon Titan, 1 September 1979.", credit: "NASA / Ames" },
  dawn: { src: [dyn("psd/solar/internal_resources/2932/Dawn_Artists_Concept.jpeg")], caption: "Artist's concept of Dawn and its long solar wings.", credit: "NASA / JPL-Caltech" },
  "near-shoemaker": { src: [dyn("psd/solar/2023/07/nearspacecraft.jpg")], caption: "Illustration of NEAR Shoemaker at asteroid Eros.", credit: "NASA" },
  kepler: { src: pia("PIA18904"), caption: "Artist's concept of Kepler on its second mission, K2.", credit: "NASA / JPL-Caltech · PIA18904" },
};
