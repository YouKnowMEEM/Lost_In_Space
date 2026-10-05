import React from "react";

/** Where it sleeps: an equirectangular map of the Moon or Mars with a pin and a zoomed inset. */
const ZOOM = 7;

export default function SiteMap({ site }) {
  const x = ((site.lon + 180) / 360) * 100;
  const y = ((90 - site.lat) / 180) * 100;
  // Background position that puts the pin's point of the map at the centre of the square inset.
  const zx = ((0.5 - (x / 100) * ZOOM) / (1 - ZOOM)) * 100;
  const zy = ((0.5 - (y / 100) * (ZOOM / 2)) / (1 - ZOOM / 2)) * 100;
  const fmt = (v, pos, neg) => `${Math.abs(v).toFixed(2)}° ${v >= 0 ? pos : neg}`;
  return (
    <figure className="mf-map">
      <div className="mf-map-frame">
        <div
          className="mf-map-world"
          style={{ backgroundImage: `url(${site.texture})` }}
          role="img"
          aria-label={`Map of the ${site.body === "moon" ? "Moon" : "Mars"} with a pin at ${site.label}`}
        >
          <span className="mf-map-grid" aria-hidden="true" />
          <span className="mf-pin" style={{ left: `${x}%`, top: `${y}%` }} aria-hidden="true">
            <i />
          </span>
          <span className="mf-map-box" style={{ left: `${x}%`, top: `${y}%` }} aria-hidden="true" />
        </div>
        <div
          className="mf-map-zoom"
          style={{ backgroundImage: `url(${site.texture})`, backgroundSize: `${ZOOM * 100}% auto`, backgroundPosition: `${zx}% ${zy}%` }}
          aria-hidden="true"
        >
          <span className="mf-pin is-big" style={{ left: "50%", top: "50%" }}>
            <i />
          </span>
          <span className="mf-map-zoom-label">{site.label}</span>
        </div>
      </div>
      <figcaption>
        <strong>{site.label}</strong>
        <span>
          {fmt(site.lat, "N", "S")}, {fmt(site.lon, "E", "W")}
        </span>
      </figcaption>
    </figure>
  );
}
