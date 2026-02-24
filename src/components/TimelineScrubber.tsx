"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { TimelineData } from "@/lib/types";
import { getConfidenceColor } from "@/lib/data";

interface TimelineScrubberProps {
  data: TimelineData[];
  dateRange: [string | null, string | null];
  onDateRangeChange: (range: [string | null, string | null]) => void;
}

export default function TimelineScrubber({
  data,
  dateRange,
  onDateRangeChange,
}: TimelineScrubberProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1);
  const [rangeStart, setRangeStart] = useState(1990);
  const [rangeEnd, setRangeEnd] = useState(2025);
  const [expanded, setExpanded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  // Sync from props
  useEffect(() => {
    if (dateRange[0]) {
      const y = parseInt(dateRange[0].substring(0, 4));
      if (!isNaN(y)) setRangeStart(y);
    }
    if (dateRange[1]) {
      const y = parseInt(dateRange[1].substring(0, 4));
      if (!isNaN(y)) setRangeEnd(y);
    }
  }, [dateRange]);

  const emitRange = useCallback(
    (start: number, end: number) => {
      onDateRangeChange([`${start}-01-01`, `${end}-12-31`]);
    },
    [onDateRangeChange]
  );

  // Playback
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(
        () => {
          setRangeEnd((prev) => {
            if (prev >= 2025) {
              setIsPlaying(false);
              return 2025;
            }
            const next = prev + 1;
            emitRange(rangeStart, next);
            return next;
          });
        },
        2000 / playSpeed
      );
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, playSpeed, rangeStart, emitRange]);

  const handleStartChange = (val: number) => {
    const newStart = Math.min(val, rangeEnd);
    setRangeStart(newStart);
    emitRange(newStart, rangeEnd);
  };

  const handleEndChange = (val: number) => {
    const newEnd = Math.max(val, rangeStart);
    setRangeEnd(newEnd);
    emitRange(rangeStart, newEnd);
  };

  const togglePlay = () => {
    if (!isPlaying && rangeEnd >= 2025) {
      setRangeEnd(rangeStart);
      emitRange(rangeStart, rangeStart);
    }
    setIsPlaying(!isPlaying);
  };

  const resetRange = () => {
    setIsPlaying(false);
    setRangeStart(1990);
    setRangeEnd(2025);
    onDateRangeChange([null, null]);
  };

  const visibleData = data.filter(
    (d) => d.year >= rangeStart && d.year <= rangeEnd
  );
  const totalEvents = visibleData.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 w-[calc(100%-2rem)] max-w-3xl">
      <div className="bg-gray-900/80 backdrop-blur-md rounded-xl shadow-lg border border-white/10 text-white">
        {/* === Compact bar (always visible) === */}
        <div className="flex items-center gap-3 px-4 h-[52px]">
          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors shrink-0"
            title={isPlaying ? "Pause" : "Play timeline"}
          >
            {isPlaying ? (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
          </button>

          {/* Date range label */}
          <span className="text-xs font-semibold tabular-nums whitespace-nowrap shrink-0">
            {rangeStart} — {rangeEnd}
          </span>

          {/* Dual-thumb range slider area */}
          <div className="flex-1 relative h-5 flex items-center">
            {/* Mini density histogram (max 20px tall) */}
            <div className="absolute inset-x-0 bottom-1/2 flex items-end gap-[1px] h-[18px] pointer-events-none">
              {data.map((d) => {
                const height =
                  d.count > 0
                    ? Math.max((d.count / maxCount) * 100, 6)
                    : 0;
                const inRange = d.year >= rangeStart && d.year <= rangeEnd;
                const color =
                  d.count > 0 ? getConfidenceColor(d.avgConfidence) : "rgba(255,255,255,0.1)";
                return (
                  <div
                    key={d.year}
                    className="flex-1 rounded-t-[1px] transition-opacity duration-100"
                    style={{
                      height: `${height}%`,
                      backgroundColor: color,
                      opacity: inRange ? 0.8 : 0.15,
                    }}
                  />
                );
              })}
            </div>

            {/* Track background */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-white/15 rounded-full">
              <div
                className="h-1 bg-white/60 rounded-full"
                style={{
                  marginLeft: `${((rangeStart - 1990) / 35) * 100}%`,
                  width: `${((rangeEnd - rangeStart) / 35) * 100}%`,
                }}
              />
            </div>

            {/* Range inputs */}
            <input
              type="range"
              min={1990}
              max={2025}
              value={rangeStart}
              onChange={(e) => handleStartChange(parseInt(e.target.value))}
              className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none z-[2]
                [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:shadow-[0_0_4px_rgba(0,0,0,0.3)]
                [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3
                [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0
                [&::-moz-range-thumb]:cursor-pointer"
            />
            <input
              type="range"
              min={1990}
              max={2025}
              value={rangeEnd}
              onChange={(e) => handleEndChange(parseInt(e.target.value))}
              className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none z-[2]
                [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:shadow-[0_0_4px_rgba(0,0,0,0.3)]
                [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3
                [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0
                [&::-moz-range-thumb]:cursor-pointer"
            />
          </div>

          {/* Event count */}
          <span className="text-[11px] text-white/50 tabular-nums whitespace-nowrap shrink-0">
            {totalEvents.toLocaleString()} events
          </span>

          {/* Expand / settings toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors shrink-0"
            title={expanded ? "Hide settings" : "Timeline settings"}
          >
            <span className={`text-sm transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}>⚙️</span>
          </button>
        </div>

        {/* === Expanded controls (hidden by default) === */}
        {expanded && (
          <div className="border-t border-white/10 px-4 py-2.5 flex items-center gap-3 flex-wrap">
            <span className="text-[10px] text-white/40 uppercase tracking-wider">Speed</span>
            <div className="flex gap-1">
              {[0.5, 1, 2, 4].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaySpeed(speed)}
                  className={`px-2 py-0.5 text-[11px] rounded-md transition-colors ${
                    playSpeed === speed
                      ? "bg-white/25 text-white font-semibold"
                      : "bg-white/8 text-white/50 hover:bg-white/15 hover:text-white/70"
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            <div className="w-px h-4 bg-white/15 mx-1" />

            <button
              onClick={resetRange}
              className="px-2.5 py-0.5 text-[11px] rounded-md bg-white/8 text-white/50 hover:bg-white/15 hover:text-white/70 transition-colors"
            >
              Reset range
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
