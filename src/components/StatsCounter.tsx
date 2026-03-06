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

interface FeedEntry {
  date: string;
  text: string;
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
  const [feed, setFeed] = useState<FeedEntry[]>([]);

  useEffect(() => {
    fetch("/data/stats.json", { cache: "no-store" })
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
    fetch("/data/feed.json", { cache: "no-store" })
      .then((r) => r.json())
      .then(setFeed)
      .catch(() => {});
  }, []);

  if (!stats) return null;

  return (
    <div className="mt-12 mb-2">
      {/* Pipeline Dashboard */}
      {stats.total_corpus > 0 && (
        <div className="mx-auto max-w-xl">
          <div className="relative bg-gray-950 border border-gray-800 rounded-2xl px-6 sm:px-8 py-8 shadow-2xl overflow-hidden">
            {/* Subtle grid background */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            <div className="relative z-10">
              {/* Status header */}
              <div className="flex items-center gap-3 mb-6">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-bold text-emerald-400 uppercase tracking-[0.15em]">
                  Live Investigation
                </span>
              </div>

              {/* Hero numbers */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-4xl sm:text-5xl font-black text-white tabular-nums tracking-tight">
                    {formatNum(stats.docs_scanned)}
                  </span>
                  <span className="text-lg sm:text-xl text-gray-500 font-medium">
                    of {formatNum(stats.total_corpus)}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  government documents scanned
                </p>
              </div>

              {/* Progress bar */}
              <div className="mb-2">
                <div className="w-full bg-gray-800 rounded-full h-5 overflow-hidden border border-gray-700">
                  <div
                    className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 h-5 rounded-full transition-all duration-1000 relative"
                    style={{ width: `${Math.max(stats.scan_pct, 2)}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-8">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 tabular-nums">
                  {stats.scan_pct}%
                </span>
                <span className="text-xs text-gray-500 text-right max-w-[180px]">
                  Pipeline is running — new locations surface daily
                </span>
              </div>

              {/* Recent Finds Feed */}
              {feed.length > 0 && (
                <div className="mb-8">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-[0.15em] mb-3">
                    Recent Finds
                  </p>
                  <ul className="space-y-2">
                    {feed.map((entry, i) => (
                      <li key={i} className="flex gap-2.5 text-left">
                        <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                        <span className="text-sm text-gray-400 leading-snug">
                          {entry.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Secondary stats row */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-800">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                    {formatNum(stats.locations)}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-wider">
                    Locations
                  </p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                    {formatNum(stats.events)}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-wider">
                    Events
                  </p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                    {formatNum(stats.evidence)}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-wider">
                    Evidence
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Last updated */}
          <p className="text-xs text-gray-500 mt-4 text-center">
            Last updated {formatDate(stats.last_updated)}
          </p>
        </div>
      )}
    </div>
  );
}
