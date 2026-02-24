import type {
  GeoJSONFeatureCollection,
  GeoJSONFeature,
  FilterState,
  TimelineData,
  LocationSummary,
  ConfidenceTier,
  QualityTier,
} from "./types";

let cachedData: GeoJSONFeatureCollection | null = null;

export function getConfidenceTier(score: number): ConfidenceTier {
  if (score >= 0.8) return "high";
  if (score >= 0.6) return "moderate";
  if (score >= 0.4) return "low";
  return "very_low";
}

export function getConfidenceColor(score: number): string {
  if (score >= 0.8) return "#22c55e"; // green
  if (score >= 0.6) return "#eab308"; // yellow
  if (score >= 0.4) return "#f97316"; // orange
  return "#ef4444"; // red
}

export function getConfidenceLabel(tier: ConfidenceTier): string {
  switch (tier) {
    case "high":
      return "High Confidence";
    case "moderate":
      return "Moderate Confidence";
    case "low":
      return "Low Confidence";
    case "very_low":
      return "Very Low";
  }
}

/**
 * Infer quality tier when the data pipeline hasn't set it yet.
 * Backward-compatible: checks structural signals to detect minimal-quality pins.
 */
export function inferQualityTier(feature: GeoJSONFeature): QualityTier {
  const p = feature.properties;

  // If pipeline already set it, trust it
  if (p.quality_tier) return p.quality_tier;

  const people = p.people || [];
  const hasPeople = people.length > 0;
  const eventCount = p.event_count ?? 1;
  const desc = (p.event_description || "").toLowerCase();
  const hasDate = !!p.date_start;

  // Minimal: no people, no dates, <=1 event, generic "Address from/listed" description
  const isGenericAddress =
    desc.includes("address from") ||
    desc.includes("address listed") ||
    desc.includes("no specific events");

  if (!hasPeople && !hasDate && eventCount <= 1 && isGenericAddress) {
    return "minimal";
  }

  // Also minimal: only a single DOJ ref with no real content
  if (
    !hasPeople &&
    eventCount <= 1 &&
    desc.startsWith("referenced in document:")
  ) {
    return "minimal";
  }

  // Substantial: has people AND dates AND multiple events or high confidence
  if (hasPeople && hasDate && (eventCount >= 3 || p.confidence >= 0.8)) {
    return "substantial";
  }

  return "moderate";
}

export async function loadGeoJSON(): Promise<GeoJSONFeatureCollection> {
  if (cachedData) return cachedData;
  const res = await fetch("/data/atlas.geojson");
  cachedData = await res.json();
  return cachedData!;
}

export function filterFeatures(
  features: GeoJSONFeature[],
  filters: FilterState
): GeoJSONFeature[] {
  return features.filter((f) => {
    const p = f.properties;

    // Nexus filter
    if (filters.nexusLevels.length > 0) {
      if (!filters.nexusLevels.includes(p.epstein_nexus)) return false;
    }

    // People filter
    if (filters.people.length > 0) {
      const hasPerson = filters.people.some((person) =>
        p.people.some((pp) => {
          const name = typeof pp === "string" ? pp : pp.name;
          return name.toLowerCase().includes(person.toLowerCase());
        })
      );
      if (!hasPerson) return false;
    }

    // Search query
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const peopleNames = p.people.map((pp) =>
        typeof pp === "string" ? pp : pp.name
      );
      const searchable = [
        p.display_name,
        p.event_description,
        p.region,
        ...peopleNames,
      ]
        .join(" ")
        .toLowerCase();
      if (!searchable.includes(q)) return false;
    }

    return true;
  });
}

export function computeTimeline(features: GeoJSONFeature[]): TimelineData[] {
  const yearMap = new Map<number, { count: number; totalConf: number }>();

  for (const f of features) {
    const ds = f.properties.date_start;
    if (!ds) continue;
    const year = parseInt(ds.substring(0, 4));
    if (isNaN(year) || year < 1990 || year > 2025) continue;

    const entry = yearMap.get(year) || { count: 0, totalConf: 0 };
    entry.count++;
    entry.totalConf += f.properties.confidence;
    yearMap.set(year, entry);
  }

  const result: TimelineData[] = [];
  for (let y = 1990; y <= 2025; y++) {
    const entry = yearMap.get(y);
    result.push({
      year: y,
      count: entry?.count || 0,
      avgConfidence: entry ? entry.totalConf / entry.count : 0,
    });
  }
  return result;
}

export function computeLocationSummaries(
  features: GeoJSONFeature[]
): LocationSummary[] {
  const locMap = new Map<string, GeoJSONFeature[]>();

  for (const f of features) {
    const key = f.properties.canonical_name || f.properties.display_name;
    const arr = locMap.get(key) || [];
    arr.push(f);
    locMap.set(key, arr);
  }

  return Array.from(locMap.entries()).map(([key, feats]) => {
    const first = feats[0].properties;
    const eventTypes: Record<string, number> = {};
    const allPeople = new Set<string>();
    let totalConf = 0;
    let minDate: string | null = null;
    let maxDate: string | null = null;

    for (const feat of feats) {
      const p = feat.properties;
      eventTypes[p.event_type] = (eventTypes[p.event_type] || 0) + 1;
      p.people.forEach((pp) => allPeople.add(typeof pp === "string" ? pp : pp.name));
      totalConf += p.confidence;
      if (p.date_start) {
        if (!minDate || p.date_start < minDate) minDate = p.date_start;
        if (!maxDate || p.date_start > maxDate) maxDate = p.date_start;
      }
    }

    return {
      canonical_name: key,
      display_name: first.display_name,
      lat: feats[0].geometry.coordinates[1],
      lng: feats[0].geometry.coordinates[0],
      total_events: feats.length,
      event_types: eventTypes,
      date_range: [minDate, maxDate],
      avg_confidence: totalConf / feats.length,
      people: Array.from(allPeople),
      region: first.region,
      property_type: first.property_type,
    };
  });
}

export function getUniqueEventTypes(features: GeoJSONFeature[]): string[] {
  const types = new Set<string>();
  for (const f of features) {
    types.add(f.properties.event_type);
  }
  return Array.from(types).sort();
}

export function getUniqueEvidenceTypes(features: GeoJSONFeature[]): string[] {
  const types = new Set<string>();
  for (const f of features) {
    const sources = f.properties.sources || [];
    for (const s of sources) {
      const docType = s.doc_type;
      if (docType) types.add(docType);
    }
  }
  return Array.from(types).sort();
}

export function getUniquePeople(features: GeoJSONFeature[]): string[] {
  const people = new Set<string>();
  for (const f of features) {
    f.properties.people.forEach((p) => people.add(typeof p === "string" ? p : p.name));
  }
  return Array.from(people).sort();
}
