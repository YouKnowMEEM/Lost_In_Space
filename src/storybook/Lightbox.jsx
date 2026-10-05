import React, { useEffect, useRef, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import NasaImage from "./NasaImage";
import { nasaDetailsUrl, nasaVideo } from "../lib/nasa";
import "./lightbox.css";

/**
 * Full-screen viewer for a real NASA photo or video.
 * item: { kind: "photo" | "video", nasa, caption, credit, title? }
 */
export default function Lightbox({ item, onClose, tone = "dark" }) {
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const [videoTry, setVideoTry] = useState(0);

  useEffect(() => {
    if (!item) return undefined;
    setVideoTry(0);
    const previous = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [item]);

  if (!item) return null;
  const video = item.kind === "video" ? nasaVideo(item.nasa) : null;

  return (
    <div className={`lb lb-${tone}`} role="dialog" aria-modal="true" aria-label={item.title || "Real NASA photo"}>
      <button type="button" className="lb-scrim" aria-label="Close" onClick={onClose} />
      <figure className="lb-frame">
        <div className="lb-media">
          {video ? (
            videoTry < video.sources.length ? (
              <video
                key={video.sources[videoTry]}
                src={video.sources[videoTry]}
                poster={video.poster}
                controls
                autoPlay
                playsInline
                preload="metadata"
                onError={() => setVideoTry((n) => n + 1)}
              />
            ) : (
              <a className="nasa-missing" href={nasaDetailsUrl(item.nasa)} target="_blank" rel="noreferrer">
                <span>This video could not load here. Watch it at NASA.</span>
              </a>
            )
          ) : (
            <NasaImage id={item.nasa} size="large" alt={item.caption} eager />
          )}
        </div>
        <figcaption className="lb-caption">
          {item.title && <strong>{item.title}</strong>}
          <span>{item.caption}</span>
          <span className="lb-meta">
            <span>{item.credit}</span>
            <a href={nasaDetailsUrl(item.nasa)} target="_blank" rel="noreferrer">
              View at NASA <ExternalLink size={14} aria-hidden="true" />
            </a>
          </span>
        </figcaption>
        <button ref={closeRef} type="button" className="lb-close" onClick={onClose} aria-label="Close viewer">
          <X size={22} />
        </button>
      </figure>
    </div>
  );
}
