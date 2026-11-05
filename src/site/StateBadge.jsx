import React from "react";
import { STATES } from "../data/catalog";

/** A small label that says whether a machine is awake, asleep, crashed on purpose or adrift. The word, not just the colour, carries the meaning. */
export default function StateBadge({ state, inline = false }) {
  const s = STATES[state];
  if (!s) return null;
  return (
    <span className={`sx-state${inline ? " is-inline" : ""}`} style={{ "--state": s.color }} title={s.long}>
      <span className="sx-state-dot" aria-hidden="true" />
      {s.label}
    </span>
  );
}
