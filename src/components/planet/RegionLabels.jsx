import React, { useMemo } from "react";
import lunarRegions from "../../data/lunar_regions.json";
import { latLngToVector3 } from "./EquipmentMarker";
import TextSprite from "./TextSprite";

function FeatureLabel({ region, radius, opacity, selected }) {
  const position = useMemo(() => latLngToVector3(region.lat, region.lon, radius), [region.lat, region.lon, radius]);
  return <TextSprite text={region.name} position={position} size={selected ? 0.13 : 0.09} opacity={selected ? 1 : opacity} selected={selected}/>;
}

export default function RegionLabels({ regions = lunarRegions, surfaceRadius = 3.2, opacity = 1, selectedRegion }) {
  return <>{regions.map((region) => <FeatureLabel key={region.id} region={region} radius={surfaceRadius + 0.035} opacity={opacity} selected={selectedRegion?.id === region.id}/>)}</>;
}
