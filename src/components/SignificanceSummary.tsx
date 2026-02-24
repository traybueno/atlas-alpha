"use client";

import type {
  GeoJSONFeature,
  SignificanceTier,
  ConfidenceBreakdown,
} from "@/lib/types";
import ConfidenceBadge from "./ConfidenceBadge";
import { getEvidenceTypeBadge } from "./EvidenceModal";

interface SignificanceSummaryProps {
  feature: GeoJSONFeature;
  locationEvents: GeoJSONFeature[];
}

/** Compute aggregated stats from all events at a location */
function computeLocationStats(events: GeoJSONFeature[]) {
  const allPeople = new Set<string>();
  const sourceTypes = new Set<string>();
  const evidenceTypes = new Map<string, number>(); // doc_type → count
  let minDate: string | null = null;
  let maxDate: string | null = null;
  let totalConfidence = 0;
  let totalSources = 0;

  for (const e of events) {
    const p = e.properties;
    // Collect people
    if (Array.isArray(p.people)) {
      for (const person of p.people) {
        const name = typeof person === "string" ? person : person.name;
        allPeople.add(name);
      }
    }
    // Collect source types (handle both old and new schemas)
    if (p.sources_preview) {
      p.sources_preview.split(",").forEach((s) => {
        const trimmed = s.trim();
        if (trimmed) sourceTypes.add(trimmed);
      });
    }
    if (p.sources) {
      for (const s of p.sources) {
        sourceTypes.add(s.source_type);
        totalSources++;
        // Collect evidence types (doc_type)
        const docType = s.doc_type;
        if (docType) {
          evidenceTypes.set(docType, (evidenceTypes.get(docType) || 0) + 1);
        }
      }
    }
    if (p.citations) {
      for (const c of p.citations) {
        sourceTypes.add(c.source_type);
      }
    }
    // Date range
    if (p.date_start) {
      if (!minDate || p.date_start < minDate) minDate = p.date_start;
      if (!maxDate || p.date_start > maxDate) maxDate = p.date_start;
    }
    totalConfidence += p.confidence;
  }

  return {
    peopleCount: allPeople.size,
    sourceTypeCount: sourceTypes.size,
    evidenceTypes,
    totalSources,
    dateRange: [minDate, maxDate] as [string | null, string | null],
    avgConfidence: events.length > 0 ? totalConfidence / events.length : 0,
    eventCount: events.length,
  };
}

/** Format year from date string */
function yearFromDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const year = dateStr.substring(0, 4);
  return year.match(/^\d{4}$/) ? year : null;
}

/** Infer tier from data when not explicitly set */
function inferTier(
  feature: GeoJSONFeature,
  stats: ReturnType<typeof computeLocationStats>
): SignificanceTier {
  if (feature.properties.significance_tier) {
    return feature.properties.significance_tier;
  }
  // Key properties: mansion, island, ranch with multiple sources
  const pt = feature.properties.property_type;
  if (
    pt &&
    ["mansion", "island", "ranch", "townhouse"].includes(pt) &&
    stats.sourceTypeCount >= 2
  ) {
    return "key_property";
  }
  // Documented events: has dates and people
  if (stats.eventCount >= 3 && stats.peopleCount >= 1) {
    return "documented_events";
  }
  // Contact network: has people but few events
  if (stats.peopleCount >= 1 || stats.eventCount >= 2) {
    return "contact_network";
  }
  return "single_mention";
}

const TIER_STYLES: Record<
  SignificanceTier,
  { border: string; bg: string; label: string }
> = {
  key_property: {
    border: "border-emerald-300",
    bg: "bg-emerald-50",
    label: "Key Property",
  },
  documented_events: {
    border: "border-blue-200",
    bg: "bg-blue-50/50",
    label: "Documented Events",
  },
  contact_network: {
    border: "border-gray-200",
    bg: "bg-gray-50",
    label: "Contact Network",
  },
  single_mention: {
    border: "border-gray-100",
    bg: "bg-gray-50/50",
    label: "Single Mention",
  },
};

/** Generate a contextual summary — uses property descriptor if available */
function generateContextualSummary(
  _events: GeoJSONFeature[],
  stats: ReturnType<typeof computeLocationStats>,
  dateRangeStr: string | null,
  p: GeoJSONFeature["properties"]
): string {
  // Use curated descriptor if available
  const descriptor = (p as Record<string, unknown>).location_descriptor as string | undefined;
  if (descriptor) return descriptor;

  // Simple fallback: event count + date range
  const parts: string[] = [];
  parts.push(
    `${stats.eventCount} documented event${stats.eventCount !== 1 ? "s" : ""} at this location` +
    (dateRangeStr ? `, spanning ${dateRangeStr}` : "")
  );
  return parts.join(". ") + ".";
}

export default function SignificanceSummary({
  feature,
  locationEvents,
}: SignificanceSummaryProps) {
  const p = feature.properties;
  const stats = computeLocationStats(locationEvents);
  const tier = inferTier(feature, stats);
  const style = TIER_STYLES[tier];

  const minYear = yearFromDate(stats.dateRange[0]);
  const maxYear = yearFromDate(stats.dateRange[1]);
  const dateRangeStr =
    minYear && maxYear
      ? minYear === maxYear
        ? minYear
        : `${minYear} — ${maxYear}`
      : null;

  // Get aggregate confidence breakdown if available on the primary feature
  const breakdown: ConfidenceBreakdown | undefined = p.confidence_breakdown;

  // For "single_mention" tier: minimal treatment — just location name, no evidence noise
  if (tier === "single_mention") {
    return (
      <div className={`rounded-lg border ${style.border} ${style.bg} p-3`}>
        <p className="text-xs text-gray-400 leading-relaxed">
          Limited data — this address appears in public records with no documented events or associated individuals.
        </p>
      </div>
    );
  }

  // For "contact_network" tier: compact, no detailed evidence section
  if (tier === "contact_network") {
    return (
      <div className={`rounded-lg border ${style.border} ${style.bg} p-3`}>
        {p.significance_summary ? (
          <p className="text-sm text-gray-600 leading-relaxed">
            {p.significance_summary}
          </p>
        ) : (
          <p className="text-xs text-gray-500 leading-relaxed">
            Address appears in records with{" "}
            {stats.eventCount} reference
            {stats.eventCount !== 1 ? "s" : ""}.
            {stats.peopleCount > 0 &&
              ` ${stats.peopleCount} person${stats.peopleCount !== 1 ? "s" : ""} associated.`}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-gray-400">
          {dateRangeStr && <span>📅 {dateRangeStr}</span>}
          {stats.peopleCount > 0 && (
            <span>👥 {stats.peopleCount} people</span>
          )}
          <span>
            📄 {stats.eventCount} event{stats.eventCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    );
  }

  // Full significance card for key_property and documented_events
  return (
    <div className={`rounded-lg border ${style.border} ${style.bg} p-3`}>
      {/* Tier label for key properties */}
      {tier === "key_property" && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {style.label}
          </span>
        </div>
      )}

      {/* Summary text */}
      {p.significance_summary ? (
        <p className="text-sm text-gray-700 leading-relaxed">
          {p.significance_summary}
        </p>
      ) : (
        <p className="text-sm text-gray-600 leading-relaxed">
          {generateContextualSummary(locationEvents, stats, dateRangeStr, p)}
        </p>
      )}

      {/* Evidence type badges */}
      {stats.evidenceTypes.size > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {Array.from(stats.evidenceTypes.entries()).map(([docType, count]) => {
            const badge = getEvidenceTypeBadge(docType);
            if (!badge) return null;
            return (
              <span
                key={docType}
                className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${badge.bg} ${badge.text}`}
              >
                {badge.emoji} {badge.label} ({count})
              </span>
            );
          })}
        </div>
      )}

      {/* Stats row */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
        {dateRangeStr && (
          <span className="flex items-center gap-1">
            <span>📅</span>
            {dateRangeStr}
          </span>
        )}
        {stats.peopleCount > 0 && (
          <span className="flex items-center gap-1">
            <span>👥</span>
            {stats.peopleCount}+ people
          </span>
        )}
        <span className="flex items-center gap-1">
          <span>📄</span>
          {stats.totalSources} source{stats.totalSources !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Confidence */}
      <div className="mt-2">
        <ConfidenceBadge
          score={stats.avgConfidence}
          breakdown={breakdown}
          size="sm"
        />
      </div>
    </div>
  );
}
