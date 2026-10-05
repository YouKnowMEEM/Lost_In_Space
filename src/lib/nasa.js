// Helpers for NASA's Image and Video Library (images.nasa.gov), which is public domain.
// Files live at images-assets.nasa.gov/{image|video}/{id}/{id}~{size}.{ext}. Not every
// item has every size (JPL "PIA" items usually only have ~orig and ~thumb), so images are
// requested from a short list of candidates and fall back on error.

export const NASA_ASSETS = "https://images-assets.nasa.gov";

const ORDER = {
  large: ["large", "orig", "medium"],
  medium: ["medium", "large", "small", "orig"],
  small: ["small", "medium", "thumb", "orig"],
  thumb: ["thumb", "small", "medium"],
};

export function nasaImageCandidates(id, size = "large") {
  let order = ORDER[size] || ORDER.large;
  if (/^PIA\d/i.test(id) && size !== "thumb") {
    order = size === "small" ? ["small", "orig", "thumb"] : ["orig", ...order.filter((s) => s !== "orig")];
  }
  const seg = encodeURIComponent(id);
  return order.map((s) => `${NASA_ASSETS}/image/${seg}/${seg}~${s}.jpg`);
}

export function nasaVideo(id) {
  // Some NASA video IDs contain spaces, so each path segment is encoded.
  const seg = encodeURIComponent(id);
  const base = `${NASA_ASSETS}/video/${seg}/${seg}`;
  return {
    sources: [`${base}~medium.mp4`, `${base}~mobile.mp4`, `${base}~small.mp4`],
    poster: `${base}~medium.jpg`,
    thumb: `${base}~thumb.jpg`,
  };
}

export const nasaDetailsUrl = (id) => `https://images.nasa.gov/details/${encodeURIComponent(id)}`;

export const NASA_SEARCH_API = "https://images-api.nasa.gov/search";
