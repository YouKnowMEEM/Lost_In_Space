import React from "react";
import { ArrowUpRight, MapPin, X } from "lucide-react";
import { Link } from "react-router-dom";

function Detail({ label, children }) {
  return <div className="moon-detail"><span>{label}</span><strong>{children || "Not provided"}</strong></div>;
}

export default function EquipmentSidebar({ artifact, onClose, onSurfaceMode, equipmentHeading = "NASA LUNAR EQUIPMENT" }) {
  if (!artifact) return null;
  const story = artifact.storyPath;
  const readMore = artifact.readMoreUrl;
  return <>
    <button className="moon-sidebar-scrim" type="button" aria-label="Close equipment details" onClick={onClose}/>
    <aside className="moon-equipment-sidebar" aria-label={`${artifact.name} details`}>
      <div className="moon-sidebar-top"><span className="moon-program-badge">{artifact.program}</span><button type="button" className="moon-sidebar-close" aria-label="Close" onClick={onClose}><X size={18}/></button></div>
      <p className="moon-sidebar-kicker">{equipmentHeading}</p>
      <h2>{artifact.name}</h2>
      <div className={`moon-status status-${artifact.statusCategory}`}><i/>{artifact.status}</div>
      <p className="moon-sidebar-description">{artifact.description}</p>
      <div className="moon-details-grid">
        <Detail label="Agency">{artifact.agency}</Detail>
        <Detail label="Equipment type">{artifact.equipmentType}</Detail>
        <Detail label="Launch date">{artifact.launchDate}</Detail>
        <Detail label="Touchdown date">{artifact.landingDate}</Detail>
        <Detail label="Coordinates"><span className="coords"><MapPin size={12}/>{Number(artifact.lat).toFixed(2)}°, {Number(artifact.lon).toFixed(2)}°</span></Detail>
      </div>
      <div className="moon-hardware"><span>HARDWARE LEFT ON SURFACE</span><ul>{(artifact.hardwareList || []).map((item, i) => <li key={`${item}-${i}`}>{item}</li>)}</ul></div>
      <div className="moon-sidebar-actions">
        {story ? <Link className="moon-read-more" to={story}>Read the story <ArrowUpRight size={15}/></Link> : readMore ? <a className="moon-read-more" href={readMore} target="_blank" rel="noreferrer">Read more <ArrowUpRight size={15}/></a> : <button className="moon-read-more is-unavailable" type="button" disabled>Read more</button>}
        <button className="moon-surface-mode" type="button" onClick={onSurfaceMode}>View in 3D Surface Mode <ArrowUpRight size={15}/></button>
      </div>
    </aside>
  </>;
}
