import React, { useMemo } from "react";
import lunarRegions from "../../data/lunar_regions.json";
import { latLngToVector3 } from "./EquipmentMarker";
import TextSprite from "./TextSprite";

function FeatureLabel({ region, radius, opacity }) {
  const position = useMemo(() => latLngToVector3(region.lat, region.lon, radius), [region.lat, region.lon, radius]);
  return <TextSprite text={region.name} position={position} size={0.09} opacity={opacity}/>;
}

export default function RegionLabels({ regions = lunarRegions, surfaceRadius = 3.2, opacity = 1 }) {
  return <>{regions.map((region) => <FeatureLabel key={region.id} region={region} radius={surfaceRadius + 0.035} opacity={opacity}/>)}</>;
}
