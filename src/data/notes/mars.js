// Field notes for the machines on Mars. Facts were checked against NASA Science, NASA's NSSDCA
// records and NASA/JPL mission pages. "story" is the machine's imagined voice, built from real events.

export const MARS_NOTES = {
  "viking-2": {
    short: "Viking 2",
    mission: "Viking 2 lander",
    tagline: "The twin that watched frost form on Mars.",
    riddle: "I am the twin of the first lander that worked on Mars, and I landed far to the north, where I saw frost on the ground.",
    story: [
      "I am Viking 1's twin. We left Earth three weeks apart and landed seven weeks apart. While my brother sat in the Plains of Gold, I came down much farther north, in Utopia Planitia, a flat, rocky plain at 48 degrees north.",
      "One of my footpads landed on a rock, so I tilted a little. It did not matter. I dug trenches, tasted the soil in my laboratory and sent home pictures and weather data for more than three years.",
      "In my first Mars winter, something white appeared on the ground around me. It was frost, a thin layer of water ice, and my cameras took the first pictures of frost on the ground of another planet. My batteries failed in April 1980, and I fell silent.",
    ],
    whySent: "To repeat the Viking experiments at a second, colder site, so the results could be compared, and to see what a northern Mars winter was like.",
    discoveries: [
      { t: "Frost on Mars", d: "Thin layers of water-ice frost appeared on the ground during winter, proof that water moves between air and ground on Mars." },
      { t: "Same soil, same puzzle", d: "The biology experiments gave results like Viking 1's, so the mystery was not a fluke of one site." },
      { t: "Wind and seismic noise", d: "Its seismometer worked, but recorded mostly wind shaking the lander, not marsquakes." },
    ],
    how: [
      { t: "RTGs that never tire", d: "Two radioisotope generators turned the heat of decaying plutonium into electricity, day and night, summer and winter. That kept the lander powered through a long, dark northern winter." },
      { t: "A lander and an orbiter working as a team", d: "The Viking 2 orbiter mapped the planet and relayed signals from the lander. Together they gave scientists a view from above and from the ground." },
    ],
    numbers: [{ v: "3 Sep 1976", l: "landing" }, { v: "~1,300", l: "sols of work" }, { v: "48° N", l: "latitude: far north" }, { v: "Apr 1980", l: "last contact" }],
    left: "The lander, renamed the Gerald Soffen Memorial Station, in Utopia Planitia.",
    fun: "NASA's Mars Reconnaissance Orbiter photographed the lander from orbit in 2006.",
    library: "Viking 2 lander Utopia Planitia",
    nssdc: "1975-083C",
  },

  "pathfinder-sojourner": {
    short: "Pathfinder & Sojourner",
    mission: "Mars Pathfinder",
    tagline: "The lander that bounced, and the little rover that drove away.",
    riddle: "I bounced to a stop inside giant airbags, and then a rover the size of a microwave oven rolled out of me.",
    story: [
      "I arrived on 4 July 1997 inside a ball of airbags. After the parachute and rockets, my airbags dropped me from about 20 metres, and I bounced across the surface like a beach ball. When I stopped, the bag deflated, and my petals opened.",
      "Out of me rolled Sojourner, the first wheeled rover on Mars. It was about the size of a microwave oven, with six wheels and a solar panel on its back. It was designed to work for a week. It worked for almost three months.",
      "Sojourner nudged its sensor against rocks with names like Barnacle Bill and Yogi, and sent back chemical readings. It rarely went more than 12 metres from me. I was later renamed the Carl Sagan Memorial Station.",
    ],
    whySent: "To show that a low-cost mission could land on Mars and explore with a small rover, and to test new ways to get there.",
    discoveries: [
      { t: "Rocks that looked like Earth's", d: "Early readings suggested some rocks resembled Earth's andesite, hinting at a more complex geological past. Later studies found that dust on the rocks had influenced the first readings, a good example of science correcting itself." },
      { t: "Evidence for an ancient flood", d: "Pebbles and rounded rocks at Ares Vallis suggested ancient floods of water had washed over the plain." },
      { t: "16,500 pictures", d: "The lander returned about 16,500 images, and the rover about 550." },
    ],
    how: [
      { t: "Airbag landing", d: "Instead of landing on legs, Pathfinder was wrapped in airbags and bounced to a stop. The method was cheaper, and it was reused for Spirit and Opportunity." },
      { t: "A rover that talks through the lander", d: "Sojourner was too small for its own big radio. It sent its data to Pathfinder, and Pathfinder sent it to Earth." },
    ],
    numbers: [{ v: "4 Jul 1997", l: "landing" }, { v: "83 sols", l: "of work (planned: 7 to 30)" }, { v: "10.5 kg", l: "weight of Sojourner" }, { v: "~100 m", l: "driven by Sojourner" }],
    left: "The lander, now the Carl Sagan Memorial Station, the little rover, and the deflated airbags that cushioned the landing.",
    fun: "NASA's website was so popular during the mission that it set traffic records.",
    library: "Mars Pathfinder Sojourner",
    nssdc: "1996-068A",
  },

  "spirit-mer-a": {
    short: "Spirit",
    mission: "Mars Exploration Rover A",
    tagline: "The rover that found a hot spring by getting stuck.",
    riddle: "I was built to last 90 days, I broke a wheel, and the broken wheel dug up the best discovery of my mission.",
    story: [
      "I landed in Gusev Crater on 4 January 2004. Scientists suspected a lake had once been there, but the crater floor was covered in lava. So I drove east to a range of hills, the Columbia Hills, and climbed a hill of my own.",
      "In 2006 one of my front wheels stopped turning. I drove backwards, dragging it like a plough. In 2007 that wheel scraped up bright soil. It was nearly pure silica, the stuff of opal. On Earth it forms near hot springs and steam vents.",
      "In 2009 I broke through a crust and sank into soft sand. I could not escape, and my solar panels could not tilt to catch the weak winter Sun. My last message came in March 2010. NASA kept calling for more than a year.",
    ],
    whySent: "To look for rocks and soils that show Mars was once wetter and warmer, a place that might have supported life.",
    discoveries: [
      { t: "Hot springs on ancient Mars", d: "Silica-rich soil and a feature called Home Plate suggested hot water or steam once flowed there, an environment where microbes could live on Earth." },
      { t: "Water altered the rocks", d: "Rocks in the Columbia Hills had been changed by water, even though the floor of Gusev was dry lava." },
      { t: "Dust devils and weather", d: "Spirit photographed whirlwinds on the crater floor, and its panels were sometimes cleaned by wind." },
    ],
    how: [
      { t: "A robot geologist", d: "A robotic arm carried a rock-grinding tool, a microscope, and two spectrometers, a bit like a human geologist's hammer, hand lens and chemistry kit." },
      { t: "Six wheels with their own motors", d: "Each wheel had its own motor. When one failed, Spirit simply dragged it and kept going, which is what exposed the silica." },
    ],
    numbers: [{ v: "4 Jan 2004", l: "landing" }, { v: "6 years", l: "of work (planned: 90 days)" }, { v: "7.7 km", l: "driven" }, { v: "Mar 2010", l: "last message" }],
    left: "The rover, tilted in a sand trap near Home Plate, at the Columbia Memorial Station.",
    fun: "The landing site was named the Columbia Memorial Station, in honour of the crew of the space shuttle Columbia.",
    library: "Spirit rover Gusev Crater",
    nssdc: "2003-027A",
  },

  "opportunity-mer-b": {
    short: "Opportunity",
    mission: "Mars Exploration Rover B",
    tagline: "The rover that drove a marathon and outlasted a planet-wide storm.",
    riddle: "I was built for 90 days and worked for almost 15 years, until a dust storm covered my solar panels.",
    story: [
      "I landed on 25 January 2004 in Meridiani Planum, inside a small crater, a hole-in-one. On the first day, I saw bedrock sticking out of the crater wall. Within weeks I had found proof that water had soaked the rocks.",
      "I drove to bigger and bigger craters, and in 2015 I passed the length of a marathon. My little solar panels were wiped clean by wind again and again. My team called it the Energizer Bunny.",
      "In June 2018 a dust storm grew until it covered the entire planet. The sky went dark and my panels got no light. I sent one last message. More than a thousand commands later, in February 2019, NASA declared the mission complete.",
    ],
    whySent: "To land on a flat plain with the mineral hematite, which on Earth often forms in water, and find out whether water once soaked the ground.",
    discoveries: [
      { t: "Water soaked the rocks", d: "Layered sandstones, and small round pebbles called 'blueberries' showed that groundwater, salty and acidic, once soaked these rocks." },
      { t: "The first meteorite found on another planet", d: "In 2005 the rover found an iron meteorite, nicknamed 'Heat Shield Rock'." },
      { t: "Clay at Endeavour crater", d: "On the rim of a huge crater, it found clay minerals that form in less acidic water, a gentler place for life." },
    ],
    how: [
      { t: "Solar power on a dusty planet", d: "Dust slowly coated the panels, but wind gusts and dust devils cleaned them off. That is how Opportunity lasted more than 50 times its planned lifetime." },
      { t: "Rock Abrasion Tool", d: "A grinding wheel removed the dusty outside of rocks so instruments could look at fresh rock underneath." },
    ],
    numbers: [{ v: "25 Jan 2004", l: "landing" }, { v: "5,111 sols", l: "of work (planned: 90)" }, { v: "45.2 km", l: "driven" }, { v: "10 Jun 2018", l: "last message" }],
    left: "The rover, parked in Perseverance Valley on the rim of Endeavour crater, covered with dust.",
    fun: "Opportunity held the record for the longest drive on another world, 45.16 km, until Perseverance passed it on 11 October 2026.",
    library: "Opportunity rover Meridiani Planum",
    nssdc: "2003-032A",
  },

  "phoenix-lander": {
    short: "Phoenix",
    mission: "Phoenix Mars Lander",
    tagline: "The lander that tasted Martian ice.",
    riddle: "I landed near the north pole of Mars, dug a trench, and watched the white lumps I uncovered vanish in days.",
    story: [
      "I am built from the bones of an earlier mission that never got to fly, which is why I am named after a bird that rises from the ashes. I landed on 25 May 2008, near the north pole, on rockets and legs, not airbags.",
      "At that latitude the Sun does not set in summer. My two round solar panels drank light all day. My long arm dug into the ground, and under only a few centimetres of soil I found something bright. Within days, it was gone. It was ice, and it had turned to gas.",
      "I tasted the soil, found a salt called perchlorate, and watched snow fall from clouds. Then the Sun dipped lower, the days grew short and my panels starved. I stopped talking in November 2008, as polar winter closed in.",
    ],
    whySent: "To land near the north pole and test whether water ice lies under the surface, and whether the soil there could ever support life.",
    discoveries: [
      { t: "Water ice under the soil", d: "The robotic arm uncovered bright lumps that vanished in a few days, as ice turns to gas. A heated sample released water vapour: confirmed water ice." },
      { t: "Perchlorate in the soil", d: "A salt called perchlorate turned up in the soil. It may help explain Viking's puzzling biology results, because heating it can destroy organic molecules." },
      { t: "Snow falling from clouds", d: "A laser radar on the lander watched snow fall from clouds, though it evaporated before reaching the ground." },
    ],
    how: [
      { t: "Soft landing on rockets", d: "Phoenix used 12 small thrusters in the final seconds, so it could land on legs without bouncing." },
      { t: "A robotic arm with a scoop", d: "The 2.4 metre arm dug trenches and fed small samples into ovens and chemistry cells on the deck." },
    ],
    numbers: [{ v: "25 May 2008", l: "landing" }, { v: "~5 months", l: "of work" }, { v: "68° N", l: "latitude: near the pole" }, { v: "2.4 m", l: "robotic arm" }],
    left: "The lander, frozen under winter frost, in Green Valley, and the trenches it dug.",
    fun: "The Mars Reconnaissance Orbiter photographed Phoenix hanging from its parachute, the first time one spacecraft caught another one landing on another planet.",
    library: "Phoenix Mars Lander",
    nssdc: "2007-034A",
  },

  "curiosity-msl": {
    short: "Curiosity",
    mission: "Mars Science Laboratory",
    tagline: "The car-sized rover that found a lake bed.",
    riddle: "I was lowered to Mars on cables by a rocket-powered crane, and I am still driving up a mountain.",
    story: [
      "I am the size of a small car. I could not land on airbags, I was too heavy. So a rocket-powered 'sky crane' hovered above the ground and lowered me on cables, wheels first, on 6 August 2012. The people who built me called it seven minutes of terror.",
      "I landed in Gale Crater, beside a layered mountain about 5 kilometres tall called Mount Sharp. My first big find was Yellowknife Bay, an old lake bed. The water that filled it was fresh, and it held the chemical ingredients life needs.",
      "I am not asleep. I am still climbing, drilling rocks and reading ancient layers like pages in a book. My wheels have holes in them from the sharp rocks, and my nuclear power source keeps me going.",
    ],
    whySent: "To find out whether Mars ever had conditions suitable for microbial life, by climbing through the layers of a 5 km high mountain.",
    discoveries: [
      { t: "An ancient lake that could support life", d: "Yellowknife Bay's mudstones showed fresh water, the right chemicals, and a source of energy, enough to support life, had life been there." },
      { t: "Organic molecules", d: "Carbon-based molecules were found in 3-billion-year-old mudstones. They do not prove life, but they show building blocks survived." },
      { t: "Radiation measured for future explorers", d: "On the way to Mars and on the surface it measured radiation, data that future astronauts will need." },
    ],
    how: [
      { t: "A laser to read rocks from a distance", d: "ChemCam zaps a rock with a laser and reads the flash of light, to tell what it is made of from several metres away." },
      { t: "Sky crane", d: "A rocket platform hovered and lowered the rover on cables, then flew away to crash at a safe distance." },
    ],
    numbers: [{ v: "6 Aug 2012", l: "landing" }, { v: "899 kg", l: "weight" }, { v: "~38 km", l: "driven so far" }, { v: "Still working", l: "after more than 14 years" }],
    left: "Nothing yet. The rover is still working. It left behind its heat shield, sky crane and parachute.",
    fun: "In 2025, it found some of the largest organic molecules yet detected on Mars.",
    library: "Curiosity rover Gale Crater",
    nssdc: "2011-070A",
  },

  "insight-lander": {
    short: "InSight",
    mission: "InSight",
    tagline: "The lander that listened to the inside of Mars.",
    riddle: "I did not look at the sky or the rocks. I listened for rumbles deep inside the planet.",
    story: [
      "I do not roam, I do not drive. I sat on a flat plain called Elysium Planitia and listened. My seismometer, a sensitive ball set on the ground by my robot arm and covered by a little shield, felt the quiver of marsquakes.",
      "I heard more than 1,300 of them. The largest, in May 2022, had a magnitude of about 4.7. I also heard meteorites hitting the planet. From the way the waves travelled, scientists worked out how thick Mars's crust is, and the size of its liquid core.",
      "Dust crept over my solar panels and the power fell. I took a last selfie in April 2022. My final signal came in December 2022. I am still on that plain, my panels dusty and silent, while the wind slowly buries me in sand.",
    ],
    whySent: "To study the inside of Mars: its crust, mantle and core. How rocky planets form was one of the big open questions.",
    discoveries: [
      { t: "Mars's core is liquid and large", d: "Seismic waves showed a liquid core about 1,830 km in radius, bigger than expected, and so a little less dense." },
      { t: "More than 1,300 marsquakes", d: "The planet is quietly active, with quakes caused by faults and by cooling." },
      { t: "Meteorite impacts heard and seen", d: "The seismometer detected impacts, which orbiters later photographed as fresh craters." },
    ],
    how: [
      { t: "A seismometer under a tent", d: "A wind-and-thermal shield protected the seismometer from the wind and from the large day-night temperature swings, which would otherwise swamp tiny quakes." },
      { t: "Blowing the dust off", d: "Engineers trickled sand beside the solar panels so the wind would carry off dust, and the lander got a little more power." },
    ],
    numbers: [{ v: "26 Nov 2018", l: "landing" }, { v: "1,300+", l: "marsquakes heard" }, { v: "~1,830 km", l: "core radius found" }, { v: "21 Dec 2022", l: "mission declared over" }],
    left: "The lander, its solar panels covered in dust, with the seismometer on the ground beside it.",
    fun: "InSight was the first interplanetary mission launched from the west coast of the United States.",
    library: "InSight lander Mars seismometer",
    nssdc: "2018-042A",
  },

  "perseverance-mars-2020": {
    short: "Perseverance",
    mission: "Mars 2020",
    tagline: "The rover that is packing a suitcase for Earth.",
    riddle: "I am collecting rock samples in tubes and leaving some on the ground, hoping another spacecraft will pick them up.",
    story: [
      "I landed in Jezero Crater on 18 February 2021, in a place where a river once poured into a lake and built a delta. Clay and mud collect traces of life on Earth, and I came to look for traces on Mars.",
      "I seal samples of rock and soil in titanium tubes. In 2022 and 2023, I left ten of them on the ground at a place called Three Forks, a depot for a future mission to collect. It is a suitcase waiting on a platform.",
      "My microphones are the first to record the sounds of Mars: wind, my wheels, the zap of my laser. I carried a helicopter to Mars, and later I photographed it resting on the ground. I am still working. In October 2026 I drove farther than any machine has ever driven on another world, passing the record of my older cousin Opportunity.",
    ],
    whySent: "To look for signs of ancient life in an ancient lake, collect samples that a future mission could bring back to Earth, and test technology for future human missions.",
    discoveries: [
      { t: "A possible sign of ancient life", d: "A rock sampled in 2024, nicknamed Cheyava Falls, showed spots and chemistry that NASA called a potential biosignature. Non-living processes can make the same pattern, so labs on Earth must check." },
      { t: "Oxygen from Martian air", d: "The MOXIE experiment made about 122 grams of oxygen from carbon dioxide in the air, roughly what a small dog breathes in ten hours." },
      { t: "The sounds of Mars", d: "Microphones recorded wind and lasers, and showed that sound travels more slowly in Mars's thin air." },
    ],
    how: [
      { t: "Sample caching", d: "A drill takes a rock core, a robot arm puts it in a clean tube and seals it, so the sample is not contaminated by Earth." },
      { t: "Terrain-relative navigation", d: "On landing day, the rover's camera matched pictures of the ground to a map, so it could steer away from hazards." },
    ],
    numbers: [{ v: "18 Feb 2021", l: "landing" }, { v: "1,025 kg", l: "weight" }, { v: "10", l: "sample tubes left at Three Forks" }, { v: "45 km", l: "driven, a record for any world but Earth" }],
    left: "Sample tubes at the Three Forks depot, plus the parachute, heat shield and sky crane from landing day. The rover itself is still working.",
    fun: "Perseverance's name was chosen by Alexander Mather, a seventh-grader from Virginia, in a national student contest.",
    library: "Perseverance rover Jezero Crater",
    nssdc: "2020-052A",
  },

  "ingenuity-helicopter": {
    short: "Ingenuity",
    mission: "Mars Helicopter",
    tagline: "The first aircraft to fly on another planet.",
    riddle: "I was meant to fly five times. I flew 72 times, and I carry a piece of the first airplane.",
    story: [
      "The air of Mars is about one percent as thick as Earth's. Flying in it is like flying at 30 kilometres above Earth. My blades have to spin at about 2,400 turns a minute, many times faster than a helicopter's.",
      "On 19 April 2021 I rose three metres, hovered for half a minute and landed. It was the first powered, controlled flight on another planet. Tucked under my solar panel was a tiny piece of fabric from the Wright brothers' Flyer.",
      "I was planned for five flights in a month. I flew 72 times over almost three years, scouting for Perseverance. On my last flight in January 2024 my rotor blades were damaged. I will not fly again, but I proved that someone can.",
    ],
    whySent: "To test, as a technology demonstration, whether a helicopter could fly in the thin air of Mars.",
    discoveries: [
      { t: "Powered flight on Mars is possible", d: "The first flight lasted 39 seconds and reached 3 metres. Later flights climbed as high as 24 metres and flew as fast as 10 metres per second." },
      { t: "Scouting from the air", d: "Aerial pictures showed rocks and terrain that the rover could not see from the ground, helping to plan safe routes." },
      { t: "A new way to explore", d: "Ingenuity showed that future missions can carry aircraft to Mars." },
    ],
    how: [
      { t: "Two counter-rotating rotors", d: "Two sets of carbon-fibre blades spinning in opposite directions give enough lift in the thin air." },
      { t: "A phone-class brain", d: "It flew on its own, using a camera and a processor from a smartphone, because radio signals take too long for a pilot on Earth." },
    ],
    numbers: [{ v: "72", l: "flights (planned: 5)" }, { v: "~128 min", l: "total time in the air" }, { v: "~17 km", l: "total distance flown" }, { v: "1.8 kg", l: "weight" }],
    left: "The helicopter, parked at the last landing site, with damaged rotor blades.",
    fun: "Ingenuity carried a postage-stamp-sized piece of the Wright Flyer's wing fabric.",
    library: "Ingenuity Mars Helicopter",
    nssdc: "2020-052A",
  },
};

export const DEEP_NOTES = {
  "voyager-2": {
    short: "Voyager 2",
    mission: "Voyager 2",
    tagline: "The only spacecraft to visit all four giant planets.",
    riddle: "I am Voyager 1's twin, and I am the only spacecraft that has ever flown past Uranus and Neptune.",
    story: [
      "I was launched first, on 20 August 1977, but my twin took a faster path and reached Jupiter first, which is why it is Voyager 1 and I am Voyager 2. The giant planets were lined up like stepping stones, and I used each one's gravity to sling me on to the next.",
      "I reached Jupiter in 1979 and Saturn in 1981. Then I carried on to Uranus in 1986 and Neptune in 1989. No other spacecraft has visited these ice giants. I found new moons, rings, geysers on Triton and a huge storm.",
      "In 2018 I crossed into interstellar space. In 2023 a command pointed my antenna the wrong way. My team on Earth shouted a signal across the dark and I heard them. I am still working, carrying a golden record.",
    ],
    whySent: "To take advantage of a rare planetary alignment, and to visit not just Jupiter and Saturn but, if possible, Uranus and Neptune too.",
    discoveries: [
      { t: "Uranus up close", d: "Voyager 2 found ten new moons and two new rings at Uranus, and a magnetic field tilted far from its spin axis." },
      { t: "Neptune and Triton", d: "A Great Dark Spot, supersonic winds and nitrogen geysers erupting on the moon Triton." },
      { t: "Crossing into interstellar space", d: "On 5 November 2018 its instruments showed it had left the Sun's bubble, a second spacecraft to do so." },
    ],
    how: [
      { t: "Gravity assist", d: "Each flyby bent the spacecraft's path and increased its speed, so it needed little fuel. A single, long chain of flybys needed just the right alignment." },
      { t: "Plutonium power", d: "Three radioisotope generators power the spacecraft. They lose about 4 watts a year, so instruments are switched off one by one to save power." },
    ],
    numbers: [{ v: "20 Aug 1977", l: "launch" }, { v: "4", l: "giant planets visited" }, { v: "~145 AU", l: "distance now (estimate)" }, { v: "~20 h", l: "for a radio signal to reach Earth" }],
    left: "It is still flying. It carries a copy of the Golden Record. The nearby star Ross 248 is its next approach, in about 40,000 years.",
    fun: "Voyager 2 is expected to reach one light-day from Earth around 2035.",
    library: "Voyager 2 Neptune Uranus",
    nssdc: "1977-076A",
  },

  "pioneer-10": {
    short: "Pioneer 10",
    mission: "Pioneer 10",
    tagline: "The first to cross the asteroid belt, and the first to visit Jupiter.",
    riddle: "I carry a plaque with a drawing of a man and a woman, and my last whisper came in 2003.",
    story: [
      "I was launched on 2 March 1972, the first spacecraft sent to Jupiter. Many people thought the asteroid belt would destroy me. I flew through it without trouble. Then I passed Jupiter at about 130,000 kilometres, and measured radiation so intense it would harm electronics and be deadly to people.",
      "Jupiter's gravity threw me out of the Solar System, and I became the first spacecraft to leave it. On my side is a plaque showing a man and a woman, the Sun's location among pulsars, and our Solar System.",
      "My last faint signal reached Earth on 23 January 2003, from more than 12 billion kilometres away. I have been silent since, but I am still flying, towards the star Aldebaran, 68 light-years away. It will take more than two million years.",
    ],
    whySent: "To find out whether a spacecraft could survive the asteroid belt and the radiation near Jupiter, scouting the way for later missions.",
    discoveries: [
      { t: "The asteroid belt was safe to cross", d: "The belt was much emptier than feared, which made later missions to the outer planets possible." },
      { t: "Jupiter's radiation", d: "Pioneer 10 measured Jupiter's fierce radiation belts. Voyager's electronics were designed with that knowledge." },
      { t: "The first close pictures of Jupiter", d: "The first close-up pictures of the planet's clouds and Great Red Spot." },
    ],
    how: [
      { t: "A plaque for anyone out there", d: "Designed by Carl Sagan and Frank Drake, with artwork by Linda Salzman Sagan, it uses a hydrogen atom as a ruler and 14 pulsars as a map to the Sun." },
      { t: "The pull of its own heat", d: "For decades, Pioneer 10 and 11 seemed to be slowing a tiny bit more than expected. In 2012 scientists showed it was heat from the power source pushing the craft, like a tiny rocket." },
    ],
    numbers: [{ v: "2 Mar 1972", l: "launch" }, { v: "3 Dec 1973", l: "Jupiter flyby" }, { v: "23 Jan 2003", l: "last signal" }, { v: "~140 AU", l: "distance now (estimate)" }],
    left: "It is still flying, silent, towards Aldebaran. It carries a gold-anodized aluminium plaque.",
    fun: "Pioneer 10 was the first spacecraft to cross the asteroid belt.",
    library: "Pioneer 10 Jupiter plaque",
    nssdc: "1972-012A",
  },

  "pioneer-11": {
    short: "Pioneer 11",
    mission: "Pioneer 11",
    tagline: "The first spacecraft to visit Saturn.",
    riddle: "I was the first to visit Saturn, and I am heading for the constellation of the Eagle.",
    story: [
      "I was Pioneer 10's twin, launched on 5 April 1973. I flew past Jupiter, and its gravity threw me on a long arc across the Solar System to Saturn, which I reached on 1 September 1979.",
      "I flew between Saturn's rings and the planet's cloud tops, and I did not know whether I would survive. I did. I found a new ring, a new moon, and measured the temperature on Titan, which is very cold.",
      "My last signal arrived in late 1995. I am still flying, heading towards the constellation Aquila, the Eagle. Pioneer 10, my brother, is flying in roughly the opposite direction.",
    ],
    whySent: "To take a second look at Jupiter, then fly on to be the first to visit Saturn, and prove it was safe to approach the rings.",
    discoveries: [
      { t: "A new ring and a new moon", d: "Pioneer 11 discovered Saturn's F ring, and a small moon." },
      { t: "Saturn's magnetic field", d: "Saturn has a magnetic field, and Saturn has no solid surface to land on." },
      { t: "Jupiter's poles", d: "It was the first to view Jupiter's polar regions." },
    ],
    how: [
      { t: "A path-finder for Voyager", d: "Pioneer 11 showed it was safe to fly close to Saturn's rings. Voyager 1 and 2 used that knowledge to plan their routes." },
      { t: "A radio link across billions of kilometres", d: "For 22 years its dish kept Earth in view, so engineers could keep receiving measurements of the Sun's wind far beyond the planets." },
    ],
    numbers: [{ v: "5 Apr 1973", l: "launch" }, { v: "1 Sep 1979", l: "Saturn flyby" }, { v: "Late 1995", l: "last signal" }, { v: "~120 AU", l: "distance now (estimate)" }],
    left: "It is still flying, silent, with a plaque, towards Aquila.",
    fun: "Pioneer 11 is heading towards the constellation Aquila, which means 'the Eagle'.",
    library: "Pioneer 11 Saturn",
    nssdc: "1973-019A",
  },

  "new-horizons": {
    short: "New Horizons",
    mission: "New Horizons",
    tagline: "The explorer that gave Pluto a heart.",
    riddle: "I took nine and a half years to reach Pluto, then flew on to a snowman-shaped rock in the Kuiper Belt.",
    story: [
      "I was launched in January 2006, faster than any spacecraft before me. A year later, I swung past Jupiter, and its gravity sped me up. On 14 July 2015 I flew past Pluto at about 50,000 kilometres an hour. I had one chance.",
      "Pluto was not the dead, grey ball many expected. It had mountains of water ice, glaciers of nitrogen, blue haze and a pale heart-shaped plain. I recorded everything and then spent more than a year sending it home, slowly.",
      "On 1 January 2019, I visited Arrokoth, a rock shaped like a snowman, the farthest world explored up close. I am still going, studying the edge of the Sun's bubble. Inside me are the ashes of Clyde Tombaugh, who discovered Pluto.",
    ],
    whySent: "To make the first visit to Pluto, then to explore objects in the Kuiper Belt, the icy region beyond Neptune.",
    discoveries: [
      { t: "Pluto is geologically alive", d: "A huge plain of nitrogen ice, Sputnik Planitia, is being resurfaced. Pluto has water-ice mountains thousands of metres tall." },
      { t: "Arrokoth", d: "A 'contact binary' formed when two small bodies gently stuck together. A clue to how planets began." },
      { t: "Dust counted by students", d: "The Student Dust Counter, built by university students, measures dust in the outer Solar System." },
    ],
    how: [
      { t: "A lightweight nuclear battery", d: "Sunlight at Pluto is about 1,000 times weaker than at Earth, so New Horizons uses a radioisotope generator instead of solar panels." },
      { t: "Sleeping on the way", d: "For most of its 9.5-year journey, the spacecraft was put into hibernation to save wear, and it woke up every so often to check in." },
    ],
    numbers: [{ v: "19 Jan 2006", l: "launch" }, { v: "14 Jul 2015", l: "Pluto flyby" }, { v: "1 Jan 2019", l: "Arrokoth flyby" }, { v: "60+ AU", l: "distance now (estimate)" }],
    left: "It is still flying and working. It carries a small amount of Clyde Tombaugh's ashes.",
    fun: "The name 'Pluto' was suggested in 1930 by an 11-year-old girl in England, Venetia Burney.",
    library: "New Horizons Pluto",
    nssdc: "2006-001A",
  },
};
