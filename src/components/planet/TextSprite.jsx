import React, { useEffect, useMemo } from "react";
import * as THREE from "three";

function makeTextTexture(text, kind, selected, inactive) {
  const canvas = document.createElement("canvas");
  canvas.height = 64;
  const context = canvas.getContext("2d");
  const isOrbit = kind === "orbit";
  const font = `600 42px "Nunito Sans", Arial, sans-serif`;
  context.font = font;
  const textWidth = Math.ceil(context.measureText(text).width);
  canvas.width = Math.max(96, textWidth + (isOrbit ? 66 : 28));

  const ctx = canvas.getContext("2d");
  ctx.font = font;
  ctx.textBaseline = "middle";
  ctx.fillStyle = inactive ? "#87919c" : selected ? "#f4fbff" : isOrbit ? "#c4d0dc" : "#e5e8eb";
  ctx.shadowColor = "rgba(0, 0, 0, .95)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 2;
  if (isOrbit) {
    const cx = 20;
    const cy = 32;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = inactive ? "#707b86" : selected ? "#effbff" : "#a9c1d1";
    ctx.strokeStyle = inactive ? "#a0aab3" : selected ? "#ffffff" : "#d9e8f0";
    ctx.lineWidth = 3;
    ctx.fillRect(-7, -7, 14, 14);
    ctx.strokeRect(-7, -7, 14, 14);
    ctx.restore();
    ctx.fillStyle = inactive ? "#87919c" : selected ? "#f4fbff" : "#c4d0dc";
    ctx.fillText(text, 48, 33);
  } else {
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, 33);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

export default function TextSprite({ text, kind = "region", position = [0, 0, 0], size = 0.105, opacity = 1, selected = false, inactive = false, markerAnchor = false, onClick, onPointerOver, onPointerOut }) {
  const texture = useMemo(() => makeTextTexture(text, kind, selected, inactive), [text, kind, selected, inactive]);
  useEffect(() => () => texture.dispose(), [texture]);
  const aspect = texture.image.width / texture.image.height;
  const spritePosition = markerAnchor ? [position[0] + size * (aspect / 2 - 20 / 64), position[1], position[2]] : position;
  return <sprite
    position={spritePosition}
    scale={[size * aspect, size, 1]}
    onClick={onClick}
    onPointerOver={onPointerOver}
    onPointerOut={onPointerOut}
    renderOrder={12}
  >
    <spriteMaterial map={texture} transparent opacity={opacity} depthTest depthWrite={false} toneMapped={false}/>
  </sprite>;
}
