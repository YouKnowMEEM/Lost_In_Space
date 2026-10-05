import React, { useCallback, useMemo, useState } from "react";
import { nasaDetailsUrl, nasaImageCandidates } from "../lib/nasa";
import "./lightbox.css";

/**
 * A photo from NASA's Image and Video Library that tries the next size if one is missing.
 *
 * Loading state is derived from the address that actually finished loading, never reset
 * in an effect: a photo that is already in the browser cache can finish loading before
 * effects run, and resetting afterwards would leave it hidden.
 */
export default function NasaImage({ id, size = "large", alt = "", className = "", eager = false, ...rest }) {
  const candidates = useMemo(() => nasaImageCandidates(id, size), [id, size]);
  const key = `${id}|${size}`;
  const [failures, setFailures] = useState({ key, count: 0 });
  const [loadedSrc, setLoadedSrc] = useState(null);
  const attempt = failures.key === key ? failures.count : 0;
  const src = candidates[attempt];
  const loaded = src !== undefined && loadedSrc === src;

  // Catches images that were complete before React attached its listeners.
  const checkComplete = useCallback((img) => {
    if (img && img.complete && img.naturalWidth > 0) setLoadedSrc(img.getAttribute("src"));
  }, []);

  if (src === undefined) {
    return (
      <a className={`nasa-missing ${className}`} href={nasaDetailsUrl(id)} target="_blank" rel="noreferrer">
        <span>Open this photo at NASA</span>
      </a>
    );
  }

  return (
    <img
      key={src}
      ref={checkComplete}
      src={src}
      alt={alt}
      className={`${className} ${loaded ? "is-loaded" : "is-loading"}`}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      onLoad={(e) => setLoadedSrc(e.currentTarget.getAttribute("src"))}
      onError={() => setFailures({ key, count: attempt + 1 })}
      {...rest}
    />
  );
}
