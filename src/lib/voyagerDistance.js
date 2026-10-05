// An estimate of where Voyager 1 is right now, good to a fraction of a percent.
//
// Anchored to NASA's published milestone: on 18 Nov 2026 at 10:16:07 UTC (2:16:07 a.m. PST)
// Voyager 1 is 25.902 billion km from Earth, one light-day. From there it moves straight out
// at about 17.0 km/s towards Ophiuchus (ecliptic longitude ~256.2°, latitude ~35.0°), and
// Earth's own position on its orbit is added back in with the standard low-precision solar
// formulae. Checked against NASA figures: 69.4 AU from the Sun on 17 Feb 1998, ~94 AU at the
// termination shock (Dec 2004), ~121.6 AU at the heliopause (Aug 2012) and a 22.5-hour
// one-way light time in April 2024.

export const AU_KM = 149_597_870.7;
export const LIGHT_SECONDS_PER_AU = 499.004784;
export const SPEED_KM_S = 17.0;

export const LIGHT_DAY_MOMENT = Date.UTC(2026, 10, 18, 10, 16, 7);
const LIGHT_DAY_AU = 25.902e9 / AU_KM;

const RAD = Math.PI / 180;
const DIR_LON = 256.2 * RAD;
const DIR_LAT = 35.0 * RAD;
const DIR = [Math.cos(DIR_LAT) * Math.cos(DIR_LON), Math.cos(DIR_LAT) * Math.sin(DIR_LON), Math.sin(DIR_LAT)];
const SPEED_AU_PER_MS = SPEED_KM_S / AU_KM / 1000;
const J2000 = Date.UTC(2000, 0, 1, 12, 0, 0);

/** Earth's heliocentric position (ecliptic, AU) at a moment in ms. */
function earthAt(ms) {
  const n = (ms - J2000) / 86_400_000;
  const g = (357.528 + 0.9856003 * n) * RAD;
  const sunLon = (280.46 + 0.9856474 * n) * RAD + (1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * RAD;
  const r = 1.00014 - 0.01671 * Math.cos(g) - 0.00014 * Math.cos(2 * g);
  const lon = sunLon + Math.PI; // Earth sits opposite the Sun's apparent position
  return [r * Math.cos(lon), r * Math.sin(lon), 0];
}

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

// Distance from the Sun at the anchor moment, solved so that the distance from Earth is one light-day.
const ANCHOR_SUN_AU = (() => {
  const e = earthAt(LIGHT_DAY_MOMENT);
  const ue = dot(DIR, e);
  return ue + Math.sqrt(LIGHT_DAY_AU * LIGHT_DAY_AU - dot(e, e) + ue * ue);
})();

/** Where Voyager 1 is at a given moment (defaults to now). */
export function voyagerAt(ms = Date.now()) {
  const sunAU = ANCHOR_SUN_AU + (ms - LIGHT_DAY_MOMENT) * SPEED_AU_PER_MS;
  const e = earthAt(ms);
  const v = DIR.map((c) => c * sunAU);
  const earthAU = Math.hypot(v[0] - e[0], v[1] - e[1], v[2] - e[2]);
  return {
    sunAU,
    earthAU,
    sunKm: sunAU * AU_KM,
    earthKm: earthAU * AU_KM,
    lightSeconds: earthAU * LIGHT_SECONDS_PER_AU,
  };
}

/** "25.8 billion km" */
export const billionKm = (km, digits = 1) => `${(km / 1e9).toFixed(digits)} billion km`;

/** "23 h 54 min" */
export function lightTime(seconds) {
  const total = Math.round(seconds / 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h} h ${String(m).padStart(2, "0")} min`;
}
