"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GeoJSONFeature, AtlasEvent } from "@/lib/types";
import {
  formatDateShort,
  formatDate,
  getEventType,
  ConfidenceLabel,
} from "./EvidenceModal";

// ---------------------------------------------------------------------------
// Year separator
// ---------------------------------------------------------------------------

function YearSeparator({ year }: { year: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="text-lg font-black text-gray-300 tracking-tight tabular-nums">
        {year}
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Event Detail Modal — centered overlay with full info
// ---------------------------------------------------------------------------

function EventDetailModal({
  event,
  onClose,
}: {
  event: AtlasEvent;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const et = getEventType(event.event_type);
  const people = event.people || [];
  const evidence = event.evidence || [];

  const handleEscape = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  return (
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
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header — clean, no tags */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-gray-900 leading-snug">
                {event.event_title}
              </h2>
              <span className="text-xs text-gray-500 mt-1 block">
                {formatDate(event.date_start)}
                {event.date_end && event.date_end !== event.date_start && (
                  <> — {formatDate(event.date_end)}</>
                )}
              </span>
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

        {/* Content */}
        <div className="px-5 py-4 max-h-[60vh] overflow-y-auto overscroll-contain space-y-4">
          {/* Description */}
          <p className="text-sm text-gray-700 leading-relaxed">{event.description}</p>

          {/* People */}
          {people.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">People</div>
              <div className="flex flex-wrap gap-1">
                {people.map((p, i) => (
                  <span key={`${p.name}-${i}`} className="text-[11px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-medium">
                    {p.name}
                    {p.role && p.role !== "mentioned" && p.role !== "documented" && (
                      <span className="text-blue-400 ml-0.5 font-normal">({p.role})</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Evidence trail */}
          {evidence.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Evidence ({evidence.length})
              </div>
              <div className="space-y-2.5">
                {evidence.map((ev, i) => (
                  <div key={`${ev.file}-${i}`} className="pl-3 border-l-2 border-gray-200">
                    {ev.excerpt && (
                      <p className="text-xs italic text-gray-500 leading-relaxed mb-1">
                        &ldquo;{ev.excerpt.length > 300 ? ev.excerpt.slice(0, 300) + "…" : ev.excerpt}&rdquo;
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-gray-400">
                        {ev.file?.replace(".pdf", "")}
                      </span>
                      {ev.document_url && (
                        <a href={ev.document_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 hover:text-blue-700 font-medium">
                          View source ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nexus classification */}
          {event.epstein_nexus && (
            <div className="pt-1">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Epstein Connection
              </div>
              <div className="flex items-start gap-2">
                <span className={`text-[11px] px-2 py-0.5 rounded-md font-semibold shrink-0 ${
                  event.epstein_nexus === "direct" ? "bg-red-50 text-red-700" :
                  event.epstein_nexus === "implied" ? "bg-amber-50 text-amber-700" :
                  event.epstein_nexus === "contextual" ? "bg-blue-50 text-blue-600" :
                  "bg-gray-100 text-gray-500"
                }`}>
                  {event.epstein_nexus}
                </span>
                {event.nexus_reasoning && (
                  <p className="text-xs text-gray-500 leading-relaxed">{event.nexus_reasoning}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-gray-100 bg-gray-50/50">
          <p className="text-[10px] text-gray-400">
            Presence at a location does not imply wrongdoing. Verify against primary sources.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Card row — the clickable card in the sidebar list
// ---------------------------------------------------------------------------

/** Truncate text at a word boundary */
function truncateDesc(text: string, max = 120): string {
  if (!text || text.length <= max) return text;
  const cut = text.lastIndexOf(" ", max);
  return text.slice(0, cut > 60 ? cut : max) + "…";
}

function EventCardRow({
  event,
  index,
  onClick,
}: {
  event: AtlasEvent;
  index: number;
  onClick: () => void;
}) {
  const et = getEventType(event.event_type);
  const people = event.people || [];
  const evidence = event.evidence || [];

  return (
    <motion.div
      custom={index}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0, transition: { delay: Math.min(index * 0.03, 0.6), duration: 0.2 } }}
      className="rounded-xl border border-gray-200/80 bg-white hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="px-4 py-3.5 space-y-2">
        {/* Date */}
        <div className="text-xs text-gray-500">
          {formatDate(event.date_start)}
          {event.date_end && event.date_end !== event.date_start && (
            <> — {formatDate(event.date_end)}</>
          )}
        </div>

        {/* Title */}
        <div className="text-[13px] font-semibold text-gray-900 leading-snug">
          {event.event_title}
        </div>

        {/* Row 3: description preview */}
        {event.description && (
          <p className="text-xs text-gray-500 leading-relaxed">
            {truncateDesc(event.description)}
          </p>
        )}

        {/* Row 4: meta chips */}
        {(people.length > 0 || evidence.length > 0) && (
          <div className="flex items-center gap-3 text-[11px] text-gray-400 pt-0.5">
            {people.length > 0 && (
              <span>👥 {people.length} {people.length === 1 ? "person" : "people"}</span>
            )}
            {evidence.length > 0 && (
              <span>📄 {evidence.length} {evidence.length === 1 ? "source" : "sources"}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// EventCards — main export, used by LocationDetail sidebar
// ---------------------------------------------------------------------------

interface EventCardsProps {
  feature: GeoJSONFeature;
}

export default function EventCards({ feature }: EventCardsProps) {
  const [selectedEvent, setSelectedEvent] = useState<AtlasEvent | null>(null);

  const events: AtlasEvent[] = feature.properties.events || [];

  // Reset selection when feature changes
  useEffect(() => {
    setSelectedEvent(null);
  }, [feature]);

  // Sort chronologically, group by year
  const sortedWithYears = useMemo(() => {
    const sorted = [...events].sort((a, b) => {
      const da = a.date_start || "";
      const db = b.date_start || "";
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return da.localeCompare(db);
    });

    const items: Array<
      | { type: "year"; year: string }
      | { type: "event"; event: AtlasEvent; index: number }
    > = [];

    let lastYear = "";
    let eventIndex = 0;

    for (const event of sorted) {
      const year = event.date_start ? event.date_start.substring(0, 4) : "Unknown";
      if (year !== lastYear) {
        items.push({ type: "year", year });
        lastYear = year;
      }
      items.push({ type: "event", event, index: eventIndex++ });
    }

    return items;
  }, [events]);

  if (events.length === 0) return null;

  return (
    <section>
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
        Events ({events.length})
      </h3>

      <div className="space-y-2">
        {sortedWithYears.map((item, i) => {
          if (item.type === "year") {
            return <YearSeparator key={`year-${item.year}-${i}`} year={item.year} />;
          }
          return (
            <EventCardRow
              key={item.event.event_id}
              event={item.event}
              index={item.index}
              onClick={() => setSelectedEvent(item.event)}
            />
          );
        })}
      </div>

      {/* Modal overlay for selected event */}
      <AnimatePresence>
        {selectedEvent && (
          <EventDetailModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
