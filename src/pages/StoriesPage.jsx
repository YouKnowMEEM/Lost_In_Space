import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import BookRoute from "../storybook/BookRoute";
import { BOOKS, MUSIC, nextBookAfter, storyPath, worldOf } from "../storybook/library";
import { speechBook } from "../storybook/speechVoice";
import { PHOTOS } from "../data/photos";

// Pages name their real photo by catalog id ("of"); the address and credit come from PHOTOS.
function withPhotos(story) {
  const pages = story.pages.map((p) => {
    if (!p.photo?.of) return p;
    const known = PHOTOS[p.photo.of];
    if (!known) return { ...p, photo: undefined };
    return { ...p, photo: { ...known, ...p.photo } };
  });
  return { ...story, pages };
}

function Opening() {
  return (
    <div className="sbk-opening" role="status">
      <span className="sbk-opening-book" aria-hidden="true" />
      Opening the storybook…
    </div>
  );
}

/** /stories/:slug: storybooks for the machines in NASA's discarded-equipment list. */
export default function StoriesPage() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const meta = BOOKS[slug];
  const asked = params.get("for");
  const focus = meta && meta.objects.includes(asked) ? asked : meta?.objects[0];
  // The loaded book is stored with its slug, so turning to the next book never shows the
  // previous book's pages under the new title for even one frame.
  const [loaded, setLoaded] = useState({ slug: null, mod: null, failed: false });
  const mod = loaded.slug === slug ? loaded.mod : null;
  const failed = loaded.slug === slug && loaded.failed;

  useEffect(() => {
    if (!meta) return undefined;
    let alive = true;
    meta
      .load()
      .then((m) => alive && setLoaded({ slug, mod: m, failed: false }))
      .catch(() => alive && setLoaded({ slug, mod: null, failed: true }));
    return () => {
      alive = false;
    };
  }, [meta, slug]);

  const config = useMemo(() => {
    if (!mod || !meta) return null;
    const story = withPhotos(mod.story);
    const { scenes } = mod;
    // Recorded narration (from tools/narration) when the book has it; the browser's voice otherwise.
    const recorded = mod.timing || null;
    const { words, timing } = recorded ? { words: null, timing: recorded } : speechBook(story);
    const missionPath = `/object/${focus}`;
    return {
      story,
      timing,
      speechWords: words,
      scenes,
      music: MUSIC[story.theme],
      theme: story.theme,
      paths: { story: storyPath(slug), mission: missionPath },
      world: worldOf(slug),
      nextBook: nextBookAfter(slug),
      missionLabel: "Field notes", // these books link to their machine's field-notes page
      mission: null,
    };
  }, [mod, meta, slug, focus]);

  if (!meta) return <Navigate to="/library" replace />;
  if (failed) {
    return (
      <div className="sbk-opening" role="alert">
        This storybook could not be opened. Check your connection and try again.
        <button type="button" className="sbk-opening-retry" onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    );
  }
  if (!config) return <Opening />;
  return <BookRoute key={slug} config={config} mode="story" />;
}
