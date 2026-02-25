"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GeoJSONFeature, SignificanceTier } from "@/lib/types";
import SignificanceSummary from "./SignificanceSummary";
import EventCards from "./EventCards";
import ConnectedLocations from "./ConnectedLocations";

interface LocationDetailProps {
  feature: GeoJSONFeature | null;
  allFeatures: GeoJSONFeature[];
  onClose: () => void;
  searchQuery?: string;
}

/** Normalize people from mixed formats (string[] | EventPerson[] | EnrichedPerson[]) */
function getAllPeople(events: GeoJSONFeature[]): string[] {
  const set = new Set<string>();
  for (const e of events) {
    const people = e.properties.people;
    if (!Array.isArray(people)) continue;
    for (const p of people) {
      const name = typeof p === "string" ? p : p.name;
      if (name) set.add(name);
    }
  }
  return Array.from(set).sort();
}

/** Infer significance tier */
function inferTier(
  feature: GeoJSONFeature,
  eventCount: number,
  peopleCount: number,
  srcTypeCount: number
): SignificanceTier {
  if (feature.properties.significance_tier) {
    return feature.properties.significance_tier;
  }
  const pt = feature.properties.property_type;
  if (
    pt &&
    ["mansion", "island", "ranch", "townhouse"].includes(pt) &&
    srcTypeCount >= 2
  ) {
    return "key_property";
  }
  if (eventCount >= 3 && peopleCount >= 1) return "documented_events";
  if (peopleCount >= 1 || eventCount >= 2) return "contact_network";
  return "single_mention";
}

/** Count unique source types */
function countSourceTypes(events: GeoJSONFeature[]): number {
  const types = new Set<string>();
  for (const e of events) {
    if (e.properties.sources_preview) {
      e.properties.sources_preview.split(",").forEach((s: string) => {
        const t = s.trim();
        if (t) types.add(t);
      });
    }
    if (e.properties.sources) {
      for (const s of e.properties.sources) {
        types.add(s.source_type);
      }
    }
    if (e.properties.citations) {
      for (const c of e.properties.citations) {
        types.add(c.source_type);
      }
    }
  }
  return types.size;
}

/** Property type display names */
const PROPERTY_TYPE_LABELS: Record<string, string> = {
  mansion: "🏠 Mansion",
  island: "🏝️ Island",
  ranch: "🐴 Ranch",
  townhouse: "🏘️ Townhouse",
  apartment: "🏢 Apartment",
  airport: "✈️ Airport",
  address: "📍 Address",
  office: "🏛️ Office",
  hotel: "🏨 Hotel",
};

export default function LocationDetail({
  feature,
  allFeatures,
  onClose,
  searchQuery = "",
}: LocationDetailProps) {
  // Show only the clicked feature's events — no merging with nearby pins
  const locationEvents = useMemo(() => {
    if (!feature) return [];
    return [feature];
  }, [feature]);

  // All unique people
  const allPeople = useMemo(
    () => getAllPeople(locationEvents),
    [locationEvents]
  );

  // Unique source types count
  const srcTypeCount = useMemo(
    () => countSourceTypes(locationEvents),
    [locationEvents]
  );

  if (!feature) return null;

  const p = feature.properties;
  const tier = inferTier(feature, locationEvents.length, allPeople.length, srcTypeCount);
  const propertyLabel = p.property_type
    ? PROPERTY_TYPE_LABELS[p.property_type] || p.property_type
    : null;

  return (
    <AnimatePresence>
      {/* Desktop: right side panel — wider & more prominent */}
      <motion.div
        key={p.canonical_name || p.display_name}
        initial={{ x: 500 }}
        animate={{ x: 0 }}
        exit={{ x: 500 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="
          absolute top-0 right-0 h-full z-20 flex-col overflow-hidden
          bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.12)]
          w-[460px] lg:w-[480px]
          hidden md:flex
        "
      >
        <PanelContent
          feature={feature}
          p={p}
          tier={tier}
          propertyLabel={propertyLabel}
          locationEvents={locationEvents}
          allPeople={allPeople}
          srcTypeCount={srcTypeCount}
          onClose={onClose}
          searchQuery={searchQuery}
        />
      </motion.div>

      {/* Mobile: bottom sheet — slides up, 80vh */}
      <motion.div
        key={`mobile-${p.canonical_name || p.display_name}`}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="
          fixed inset-x-0 bottom-0 z-30 flex-col overflow-hidden
          bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.15)] rounded-t-2xl
          h-[80vh]
          flex md:hidden
        "
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2.5 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>
        <PanelContent
          feature={feature}
          p={p}
          tier={tier}
          propertyLabel={propertyLabel}
          locationEvents={locationEvents}
          allPeople={allPeople}
          srcTypeCount={srcTypeCount}
          onClose={onClose}
          searchQuery={searchQuery}
        />
      </motion.div>
    </AnimatePresence>
  );
}

/** Pick the best display name from a set of co-located events */
function pickBestDisplayName(events: GeoJSONFeature[]): string {
  if (events.length === 0) return "";
  // Prefer one with property_type set
  const withProp = events.find((e) => e.properties.property_type);
  if (withProp) return withProp.properties.display_name;
  // Otherwise pick the shortest non-empty display name (usually the cleanest)
  const names = events
    .map((e) => e.properties.display_name)
    .filter(Boolean)
    .sort((a, b) => a.length - b.length);
  return names[0] || events[0].properties.display_name;
}

/** Format a date string to short month + year (e.g. "Jul 2005") */
function shortMonthYear(dateStr: string): string {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const month = parseInt(dateStr.substring(5, 7), 10);
  const year = dateStr.substring(0, 4);
  if (month >= 1 && month <= 12) return `${months[month - 1]} ${year}`;
  return year;
}

/** Compute date range string for a set of events */
function computeDateRange(events: GeoJSONFeature[]): string | null {
  const dates = events
    .map((e) => e.properties.date_start)
    .filter(Boolean) as string[];
  if (dates.length === 0) return null;
  dates.sort();
  const first = dates[0];
  const last = dates[dates.length - 1];
  if (first === last) return shortMonthYear(first);
  const firstYear = first.substring(0, 4);
  const lastYear = last.substring(0, 4);
  if (firstYear === lastYear) {
    return `${shortMonthYear(first)} — ${shortMonthYear(last)}`;
  }
  return `${shortMonthYear(first)} — ${shortMonthYear(last)}`;
}

/** Shared panel content for desktop & mobile */
function PanelContent({
  feature,
  p,
  tier,
  propertyLabel,
  locationEvents,
  allPeople,
  srcTypeCount,
  onClose,
  searchQuery = "",
}: {
  feature: GeoJSONFeature;
  p: GeoJSONFeature["properties"];
  tier: SignificanceTier;
  propertyLabel: string | null;
  locationEvents: GeoJSONFeature[];
  allPeople: string[];
  srcTypeCount: number;
  onClose: () => void;
  searchQuery?: string;
}) {
  // Always use the clicked feature's own name — never merge names from nearby pins
  const bestName = p.display_name || p.location_name || pickBestDisplayName(locationEvents);
  const dateRange = computeDateRange(locationEvents);

  return (
    <>
      {/* Header — sticky, prominent */}
      <div className="shrink-0 px-6 pt-6 pb-4 border-b border-gray-200/80 bg-gradient-to-b from-gray-50 to-white">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-extrabold text-gray-900 leading-snug tracking-tight">
              {bestName}
            </h2>
            {p.location_description && (
              <div className="mt-2 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {p.location_description}
                </p>
              </div>
            )}
            {p.location_address && (
              <p className="text-xs text-gray-400 mt-2 font-medium">
                {p.location_address}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors shrink-0 -mt-1 -mr-1 sticky top-2"
            aria-label="Close location detail"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content — Scrollable with smooth scroll */}
      <div className="flex-1 overflow-y-auto scroll-smooth overscroll-contain px-6 py-6 space-y-7">
        {/* Significance Summary — only for key properties (mansion, island, ranch) */}
        {p.property_type && ["mansion", "island", "ranch", "townhouse"].includes(p.property_type) && (
          <div className="rounded-xl bg-amber-50/60 border border-amber-100/80 p-4 [&>div]:p-0 [&>div]:border-0 [&>div]:bg-transparent [&>div]:text-[15px] [&>div]:leading-relaxed">
            <SignificanceSummary
              feature={feature}
              locationEvents={locationEvents}
            />
          </div>
        )}

        {/* Event Timeline — reads events[] from the feature */}
        <EventCards feature={feature} searchQuery={searchQuery} />

        {/* Connected Locations */}
        <ConnectedLocations locationEvents={locationEvents} />
      </div>

      {/* Footer Disclaimer */}
      <div className="shrink-0 px-6 py-3 border-t border-gray-200/80 bg-gray-50/60">
        <p className="text-[10px] text-gray-400 leading-relaxed">
          {tier === "single_mention" || tier === "contact_network" ? (
            <>
              <strong>⚠️ Note:</strong> This address appears in Epstein&apos;s
              contact network but has{" "}
              {tier === "single_mention"
                ? "no documented events"
                : "limited documented events"}
              . Being listed does not imply wrongdoing by anyone associated
              with this address.
            </>
          ) : (
            <>
              <strong>Disclaimer:</strong> Presence at a location does not
              imply criminal conduct, guilt, or wrongdoing. Verify all
              information against{" "}
              <a href="/sources" className="underline">
                primary sources
              </a>
              .
            </>
          )}
        </p>
      </div>
    </>
  );
}

/** Small stat card for the At a Glance section */
function StatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
      <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">
        {icon} {label}
      </div>
      <div className="text-sm font-semibold text-gray-700 leading-snug">{value}</div>
    </div>
  );
}
