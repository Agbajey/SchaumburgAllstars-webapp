import React from "react";

export default function Skeleton({ height = 14, radius = 12, style = {} }) {
  return (
    <div
      style={{
        height,
        borderRadius: radius,
        background:
          "linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.18), rgba(255,255,255,0.08))",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.1s ease-in-out infinite",
        ...style,
      }}
    />
  );
}