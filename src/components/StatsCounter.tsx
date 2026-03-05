"use client";

import { useEffect, useState } from "react";

interface Stats {
  locations: number;
  events: number;
  evidence: number;
  docs_scanned: number;
  total_corpus: number;
  scan_pct: number;
  pipeline_active: boolean;
  last_updated: string;
}

function formatNum(n: number): string {
  return n.toLocaleString("en-US");
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function StatsCounter() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/data/stats.json", { cache: "no-store" })
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats) return null;

  return (
    <div className="mt-6 mb-2">
      {/* Stat pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
        <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-medium">
          📍 <span className="font-bold text-gray-900">{formatNum(stats.locations)}</span> locations
        </span>
        <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-medium">
          📅 <span className="font-bold text-gray-900">{formatNum(stats.events)}</span> events
        </span>
        <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-medium">
          📄 <span className="font-bold text-gray-900">{formatNum(stats.docs_scanned)}</span> documents scanned
        </span>
      </div>

      {/* Pipeline progress */}
      {stats.total_corpus > 0 && (
        <div className="mt-5 mx-auto max-w-md">
          <div className="border border-gray-200 bg-white rounded-xl px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                Live Investigation
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2.5 rounded-full transition-all duration-1000"
                style={{ width: `${Math.max(stats.scan_pct, 1.5)}%` }}
              />
            </div>

            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">
                {formatNum(stats.docs_scanned)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {formatNum(stats.total_corpus)}
              </span>{" "}
              documents processed
              <span className="text-gray-400 ml-1">
                ({stats.scan_pct}%)
              </span>
            </p>
            <p className="text-xs text-gray-400 mt-1.5">
              Pipeline is running — new locations added daily
            </p>
          </div>
        </div>
      )}

      {/* Last updated */}
      <p className="text-xs text-gray-400 mt-3 text-center">
        Last updated {formatDate(stats.last_updated)}
      </p>
    </div>
  );
}
