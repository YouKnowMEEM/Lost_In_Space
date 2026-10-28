import React from "react";

const points = [[1959, "1959"], [1969, "1969"], [1972, "1972"], [2026, "Present"], [2028, "2028"], [2030, "Future"]];
export default function Timeline({ year, setYear }) {
  return <section className="moon-timeline" aria-label="Mission timeline">
    <div className="moon-timeline-heading"><span>MISSION TIMELINE</span><strong>{year === 2030 ? "Future · 2030" : year === 2026 ? "Present · 2026" : year}</strong></div>
    <input aria-label="Show equipment up to year" type="range" min="1959" max="2030" step="1" value={year} onChange={(event) => setYear(Number(event.target.value))}/>
    <div className="moon-timeline-points">{points.map(([value, label]) => <button type="button" key={value} className={year === value ? "active" : ""} onClick={() => setYear(value)}>{label}</button>)}</div>
  </section>;
}
