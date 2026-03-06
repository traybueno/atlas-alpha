"use client";

import { useEffect, useState } from "react";

interface FeedEntry {
  timestamp: string;
  location: string;
  doc_id: string;
  text: string;
}

function formatLogDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export default function InvestigationLog() {
  const [entries, setEntries] = useState<FeedEntry[]>([]);

  useEffect(() => {
    fetch("/data/feed.json", { cache: "no-store" })
      .then((r) => r.json())
      .then(setEntries)
      .catch(() => {});
  }, []);

  if (!entries.length) return null;

  return (
    <div className="mx-auto max-w-xl mt-6 mb-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-mono font-semibold text-gray-500 uppercase tracking-[0.2em]">
          Investigation Log
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          live
        </span>
      </div>

      {/* Log entries */}
      <div className="border border-gray-800 rounded-xl overflow-hidden bg-gray-950">
        {entries.map((entry, i) => (
          <div
            key={i}
            className={`px-4 py-3.5 ${
              i < entries.length - 1 ? "border-b border-gray-800/70" : ""
            }`}
          >
            {/* Meta row */}
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-mono text-gray-600">
                {formatLogDate(entry.timestamp)}
              </span>
              <span className="text-gray-700">·</span>
              <span className="text-xs font-mono text-emerald-700 bg-emerald-950/60 px-1.5 py-0.5 rounded">
                {entry.doc_id}
              </span>
            </div>
            {/* Location */}
            <p className="text-xs font-semibold text-gray-300 mb-0.5 truncate">
              {entry.location}
            </p>
            {/* Description */}
            <p className="text-xs text-gray-500 leading-relaxed">
              {entry.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
