"use client";

import { getConfidenceColor, getConfidenceTier, getConfidenceLabel } from "@/lib/data";

interface ConfidenceBadgeProps {
  score: number;
  breakdown?: {
    source_reliability: number;
    extraction_quality: number;
    geocoding_precision: number;
    temporal_precision: number;
    corroboration: number;
  };
  size?: "sm" | "md" | "lg";
}

export default function ConfidenceBadge({
  score,
  size = "md",
}: ConfidenceBadgeProps) {
  const tier = getConfidenceTier(score);
  const color = getConfidenceColor(score);
  const label = getConfidenceLabel(tier);

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses[size]}`}
      style={{
        backgroundColor: `${color}20`,
        color: color,
        border: `1px solid ${color}40`,
      }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      {(score * 100).toFixed(0)}% — {label}
    </span>
  );
}
