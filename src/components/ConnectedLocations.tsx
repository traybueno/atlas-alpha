"use client";

import type { GeoJSONFeature, ConnectedTravel } from "@/lib/types";

interface ConnectedLocationsProps {
  locationEvents: GeoJSONFeature[];
}

/** Collect all connected travel legs from events at this location */
function collectConnectedTravel(
  events: GeoJSONFeature[]
): ConnectedTravel[] {
  const seen = new Set<string>();
  const travels: ConnectedTravel[] = [];

  for (const e of events) {
    const ct = e.properties.connected_travel;
    if (!ct) continue;
    for (const leg of ct) {
      const key = `${leg.direction}-${leg.location}-${leg.date || ""}`;
      if (!seen.has(key)) {
        seen.add(key);
        travels.push(leg);
      }
    }
  }

  // Sort by date
  return travels.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date.localeCompare(b.date);
  });
}

export default function ConnectedLocations({
  locationEvents,
}: ConnectedLocationsProps) {
  const travels = collectConnectedTravel(locationEvents);

  if (travels.length === 0) return null;

  return (
    <section>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        Connected Locations
      </h3>
      <div className="space-y-1.5">
        {travels.slice(0, 10).map((leg, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded px-2.5 py-1.5"
          >
            <span className="text-gray-400 shrink-0">
              {leg.direction === "from" ? "→ From" : "← To"}
            </span>
            <span className="font-medium truncate">{leg.location}</span>
            {leg.date && (
              <span className="text-gray-400 shrink-0 ml-auto">
                {leg.date}
              </span>
            )}
          </div>
        ))}
        {travels.length > 10 && (
          <p className="text-[10px] text-gray-400">
            + {travels.length - 10} more connections
          </p>
        )}
      </div>
    </section>
  );
}
