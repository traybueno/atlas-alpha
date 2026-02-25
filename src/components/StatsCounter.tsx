"use client";

import { useEffect, useState } from "react";

interface Stats {
  locations: number;
  events: number;
  evidence: number;
  docs_scanned: number;
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
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export default function StatsCounter() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/data/stats.json", { cache: "no-store" })
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {}); // fail silently — doesn't break the page
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
      {/* Last updated */}
      <p className="text-xs text-gray-400 mt-2 text-center">
        Last updated {formatDate(stats.last_updated)}
      </p>
    </div>
  );
}
