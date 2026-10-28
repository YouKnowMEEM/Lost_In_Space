import React from "react";

const lunarPrograms = ["All", "Apollo", "Mapping", "Modern Missions"];
const statuses = [["All", "all"], ["Active", "active"], ["Impact / Crashed", "impact"], ["Intact", "intact"], ["Future", "future"]];

function Chips({ label, options, value, onChange }) {
  return <div className="moon-filter-group" role="group" aria-label={label}>
    <span>{label}</span>
    <div>{options.map((item) => {
      const [text, key] = Array.isArray(item) ? item : [item, item];
      return <button type="button" key={key} className={value === key ? "active" : ""} aria-pressed={value === key} onClick={() => onChange(key)}>{text}</button>;
    })}</div>
  </div>;
}

export default function FilterBar({ program, status, setProgram, setStatus, programs = lunarPrograms }) {
  return <div className="moon-filter-bar">
    <Chips label="Program" options={programs} value={program} onChange={setProgram}/>
    <Chips label="Status" options={statuses} value={status} onChange={setStatus}/>
  </div>;
}
