"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  GeoJSONFeature,
  EventSource,
  EventPerson,
  EpsteinNexus,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// Event type visual config
// ---------------------------------------------------------------------------
// Event type labels removed from UI per directive
function getEventType(_t: string) {
  return { emoji: "", label: "", color: "#6b7280" };
}

// ---------------------------------------------------------------------------
// Backward-compat helpers
// ---------------------------------------------------------------------------

/** Normalize people from string[] | EventPerson[] | EnrichedPerson[] */
function normalizePeople(
  people: EventPerson[] | string[] | undefined
): EventPerson[] {
  if (!people || people.length === 0) return [];
  if (typeof people[0] === "string") {
    return (people as string[]).map((name) => ({ name, role: "documented" }));
  }
  return people as EventPerson[];
}

/** Get sources, preferring new `sources[]` then falling back to `citations[]` */
function getSources(feature: GeoJSONFeature): EventSource[] {
  const p = feature.properties;
  if (p.sources && p.sources.length > 0) {
    return p.sources;
  }
  if (p.citations && p.citations.length > 0) {
    return p.citations.map((c) => ({
      doc_id: c.source_id || "unknown",
      source_type: c.source_type,
      excerpt: c.excerpt || "",
      document_url: c.document_url,
    }));
  }
  return [];
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "Date uncertain";
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.substring(0, max).trimEnd() + "…";
}

// ---------------------------------------------------------------------------
// Nexus indicator
// ---------------------------------------------------------------------------

function NexusIndicator({ nexus }: { nexus: EpsteinNexus }) {
  if (nexus === "direct") return null;
  const label = nexus === "indirect" ? "Indirect" : "Contextual";
  const bg = nexus === "indirect" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500";
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${bg}`}>
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// EventRow
// ---------------------------------------------------------------------------

function EventRow({ feature }: { feature: GeoJSONFeature }) {
  const [expanded, setExpanded] = useState(false);

  const p = feature.properties;
  const eventType = getEventType(p.event_type);
  const people = normalizePeople(p.people);
  const sources = getSources(feature);
  const nexus = p.epstein_nexus as EpsteinNexus | undefined;

  const displayPeople = people.slice(0, 3);
  const extraPeople = people.length - 3;

  return (
    <div className="relative pl-7">
      {/* Timeline dot */}
      <div
        className="absolute left-0 top-[7px] w-3 h-3 rounded-full border-2 border-white shadow-sm z-10"
        style={{ backgroundColor: eventType.color }}
      />

      {/* Clickable row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left group"
      >
        {/* Top line: date */}
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-xs text-gray-400 font-medium">
            {formatDate(p.date_start)}
          </span>
        </div>

        {/* Summary line */}
        <p className="text-sm text-gray-700 mt-1 leading-snug group-hover:text-gray-900 transition-colors">
          {expanded ? p.event_description : truncate(p.event_description, 120)}
        </p>

        {/* People chips + source count */}
        <div className="flex items-center flex-wrap gap-1.5 mt-1.5">
          {displayPeople.map((person, i) => (
            <span
              key={`${person.name}-${i}`}
              className="text-[11px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md leading-none font-medium"
            >
              {person.name}
            </span>
          ))}
          {extraPeople > 0 && (
            <span className="text-[10px] text-gray-400">
              +{extraPeople} more
            </span>
          )}
          {sources.length > 0 && (
            <span className="text-[10px] text-gray-400 ml-auto flex items-center gap-0.5">
              📄 {sources.length} source{sources.length !== 1 ? "s" : ""}
              <motion.svg
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-3 h-3 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </span>
          )}
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-3 pb-1 space-y-4">
              {/* Full description (already shown above when expanded) */}

              {/* All people with roles */}
              {people.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    People
                  </h4>
                  <div className="space-y-0.5">
                    {people.map((person, i) => (
                      <div
                        key={`${person.name}-${i}`}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span className="text-gray-700 font-medium">
                          {person.name}
                        </span>
                        <span className="text-gray-400">— {person.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sources list */}
              {sources.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Sources
                  </h4>
                  <div className="space-y-3">
                    {sources.map((src, i) => (
                      <div key={`${src.doc_id}-${i}`} className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                            {src.doc_id}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {src.source_type.replace(/_/g, " ")}
                          </span>
                          {src.document_url && (
                            <a
                              href={src.document_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-blue-500 hover:text-blue-700"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View →
                            </a>
                          )}
                        </div>
                        {src.excerpt && (
                          <p className="text-xs italic text-gray-500 leading-relaxed border-l-2 border-amber-300 bg-amber-50/50 pl-3 py-1.5 rounded-r">
                            &ldquo;{src.excerpt}&rdquo;
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Corroboration count if available */}
              {p.corroboration_count != null && p.corroboration_count > 0 && (
                <div className="text-[10px] text-gray-400">
                  Corroborated by {p.corroboration_count} independent source{p.corroboration_count !== 1 ? "s" : ""}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// EventTimeline (main export)
// ---------------------------------------------------------------------------

interface EventTimelineProps {
  events: GeoJSONFeature[];
}

export default function EventTimeline({ events }: EventTimelineProps) {
  const sorted = useMemo(() => {
    return [...events].sort((a, b) => {
      const da = a.properties.date_start;
      const db = b.properties.date_start;
      // Nulls last
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return da.localeCompare(db);
    });
  }, [events]);

  if (sorted.length === 0) return null;

  return (
    <section>
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
        Event Timeline ({sorted.length})
      </h3>
      <div className="relative">
        {/* Timeline spine */}
        <div className="absolute left-[5px] top-2 bottom-2 w-px bg-gray-200" />

        {/* Events */}
        <div className="space-y-6">
          {sorted.map((event, i) => (
            <EventRow
              key={`${event.properties.id}-${i}`}
              feature={event}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
