"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  GeoJSONFeature,
  AtlasEvent,
  EventPerson,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function normalizePeople(
  people: EventPerson[] | string[] | undefined
): EventPerson[] {
  if (!people || people.length === 0) return [];
  if (typeof people[0] === "string") {
    return (people as string[]).map((name) => ({ name, role: "documented" }));
  }
  return people as EventPerson[];
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "Date uncertain";
  if (/^\d{4}$/.test(dateStr)) return dateStr;
  if (/^\d{4}-\d{2}$/.test(dateStr)) {
    const [y, m] = dateStr.split("-");
    const d = new Date(+y, +m - 1, 1);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  }
  try {
    const d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function formatDateShort(dateStr: string | null | undefined): string {
  if (!dateStr) return "Unknown date";
  if (/^\d{4}$/.test(dateStr)) return dateStr;
  if (/^\d{4}-\d{2}$/.test(dateStr)) {
    const [y, m] = dateStr.split("-");
    const d = new Date(+y, +m - 1, 1);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  }
  try {
    const d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// Event type tags fully removed from UI per directive.
// getEventType kept as no-op stub for any remaining callers.
export const EVENT_TYPES: Record<string, { emoji: string; label: string; color: string; bg: string }> = {};
export function getEventType(_t: string) {
  return { emoji: "", label: "", color: "#6b7280", bg: "bg-gray-50" };
}

/** @deprecated */
export function ConfidenceLabel(_props: { confidence: number }) { return null; }
/** @deprecated */
export function ConfidenceStars(_props: { confidence: number; tier?: string }) { return null; }

// Legacy compat exports
export function getSources(feature: GeoJSONFeature) {
  return feature.properties.sources || [];
}
export const EVIDENCE_TYPE_BADGES: Record<string, { emoji: string; label: string; bg: string; text: string }> = {
  grand_jury_testimony:  { emoji: "⚖️",  label: "Grand Jury",     bg: "bg-amber-50",   text: "text-amber-700" },
  deposition:            { emoji: "📝",  label: "Deposition",     bg: "bg-orange-50",  text: "text-orange-700" },
  testimony:             { emoji: "🗣️",  label: "Testimony",      bg: "bg-amber-50",   text: "text-amber-700" },
  flight_log:            { emoji: "✈️",  label: "Flight Log",     bg: "bg-blue-50",    text: "text-blue-700" },
  email:                 { emoji: "📧",  label: "Email",          bg: "bg-green-50",   text: "text-green-700" },
  court_filing:          { emoji: "⚖️",  label: "Court Filing",   bg: "bg-indigo-50",  text: "text-indigo-700" },
  police_report:         { emoji: "🚔",  label: "Police Report",  bg: "bg-red-50",     text: "text-red-700" },
  fbi_document:          { emoji: "🔍",  label: "FBI Document",   bg: "bg-violet-50",  text: "text-violet-700" },
  doj_efta:              { emoji: "📄",  label: "DOJ Document",   bg: "bg-purple-50",  text: "text-purple-700" },
};
export function getEvidenceTypeBadge(docType: string | undefined) {
  if (!docType) return null;
  return EVIDENCE_TYPE_BADGES[docType] || {
    emoji: "📄",
    label: docType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    bg: "bg-gray-50",
    text: "text-gray-600",
  };
}

// ---------------------------------------------------------------------------
// Event Card — the core UI element
// ---------------------------------------------------------------------------

function EventCard({ event, isExpanded, onToggle }: {
  event: AtlasEvent;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`rounded-lg border transition-colors ${isExpanded ? "border-gray-300 bg-white shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"}`}>
      {/* Collapsed: title + date — clickable */}
      <button
        onClick={onToggle}
        className="w-full text-left px-4 py-3 flex items-center gap-3"
      >
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 leading-snug truncate">
            {event.event_title}
          </div>
        </div>
        <span className="text-xs text-gray-400 shrink-0 whitespace-nowrap">
          {formatDateShort(event.date_start)}
        </span>
        <svg
          className={`w-4 h-4 text-gray-300 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded: description → people → evidence trail */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
          {/* Date */}
          <div className="flex items-center gap-2 pt-3 flex-wrap">
            <span className="text-xs text-gray-500">
              {formatDate(event.date_start)}
              {event.date_end && event.date_end !== event.date_start && (
                <> — {formatDate(event.date_end)}</>
              )}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-700 leading-relaxed">
            {event.description}
          </p>

          {/* People */}
          {event.people.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">People</div>
              <div className="flex flex-wrap gap-1">
                {event.people.map((p, i) => (
                  <span key={`${p.name}-${i}`} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Evidence trail — simple excerpts with source links */}
          {event.evidence.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Evidence ({event.evidence.length})
              </div>
              <div className="space-y-2">
                {event.evidence.map((ev, i) => (
                  <div key={`${ev.file}-${i}`} className="pl-3 border-l-2 border-gray-200">
                    {ev.excerpt && (
                      <p className="text-xs italic text-gray-500 leading-relaxed mb-1">
                        &ldquo;{ev.excerpt.length > 250 ? ev.excerpt.slice(0, 250) + "…" : ev.excerpt}&rdquo;
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-gray-400">
                        {ev.file?.replace(".pdf", "")}
                      </span>
                      {ev.document_url && (
                        <a
                          href={ev.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-blue-500 hover:text-blue-700 font-medium"
                        >
                          View source ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// EvidenceModal — Pin → Location → Events
// ---------------------------------------------------------------------------

interface EvidenceModalProps {
  feature: GeoJSONFeature | null;
  onClose: () => void;
}

export default function EvidenceModal({ feature, onClose }: EvidenceModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  // Reset expansion when feature changes
  useEffect(() => {
    setExpandedId(null);
  }, [feature]);

  if (!feature) return null;

  const p = feature.properties;
  const events: AtlasEvent[] = p.events || [];
  const descriptor = (p as Record<string, unknown>).location_descriptor as string | undefined;

  return (
    <AnimatePresence>
      {feature && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-4 md:py-10"
          onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* ── Location Header (clean: name + descriptor only) ── */}
            <div className="px-5 pt-5 pb-4 border-b border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 leading-tight">
                    {p.location_name || p.display_name}
                  </h2>
                  {descriptor && (
                    <p className="text-sm text-gray-500 mt-1 leading-snug">
                      {descriptor}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-black/5 rounded-lg transition-colors shrink-0"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* ── Event List (chronological) ── */}
            <div className="px-5 py-4 max-h-[60vh] overflow-y-auto overscroll-contain">
              <div className="space-y-2">
                {events.map((event) => (
                  <EventCard
                    key={event.event_id}
                    event={event}
                    isExpanded={expandedId === event.event_id}
                    onToggle={() => setExpandedId(
                      expandedId === event.event_id ? null : event.event_id
                    )}
                  />
                ))}
              </div>

              {events.length === 0 && (
                <p className="text-sm text-gray-400 italic py-4 text-center">
                  No events at this location.
                </p>
              )}
            </div>

            {/* ── Footer ── */}
            <div className="px-5 py-2.5 border-t border-gray-100 bg-gray-50/50">
              <p className="text-[10px] text-gray-400">
                Presence at a location does not imply wrongdoing. Verify against primary sources.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
