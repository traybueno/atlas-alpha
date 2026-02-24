"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import type {
  GeoJSONFeatureCollection,
  GeoJSONFeature,
  FilterState,
  TimelineData,
} from "@/lib/types";
import {
  loadGeoJSON,
  filterFeatures,
  computeTimeline,
  getUniqueEventTypes,
  getUniqueEvidenceTypes,
  getUniquePeople,
} from "@/lib/data";
import LocationDetail from "@/components/LocationDetail";
import FilterPanel from "@/components/FilterPanel";
import TimelineScrubber from "@/components/TimelineScrubber";
import ContentWarning from "@/components/ContentWarning";
import Disclaimer from "@/components/Disclaimer";

// Dynamic import for map (no SSR - mapbox requires window)
const AtlasMap = dynamic(() => import("@/components/AtlasMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-3"></div>
        <p className="text-sm text-gray-500">Loading map...</p>
      </div>
    </div>
  ),
});

const DEFAULT_FILTERS: FilterState = {
  confidenceMin: 0.6,
  sourceTypes: [],
  dateRange: [null, null],
  eventTypes: [],
  evidenceTypes: [],
  people: [],
  searchQuery: "",
  showMinimalPins: false,
  showImplied: false,
};

export default function MapPage() {
  const [rawData, setRawData] = useState<GeoJSONFeatureCollection | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedFeature, setSelectedFeature] = useState<GeoJSONFeature | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data
  useEffect(() => {
    loadGeoJSON()
      .then((data) => {
        setRawData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load GeoJSON:", err);
        setError("Failed to load atlas data. Please try again.");
        setLoading(false);
      });
  }, []);

  // Filter features
  const filteredData = useMemo<GeoJSONFeatureCollection>(() => {
    if (!rawData) return { type: "FeatureCollection", features: [] };
    const filtered = filterFeatures(rawData.features, filters);
    return { type: "FeatureCollection", features: filtered };
  }, [rawData, filters]);

  // Timeline data (computed from all data, not filtered)
  const timelineData = useMemo<TimelineData[]>(() => {
    if (!rawData) return [];
    // Apply non-date filters for timeline context
    const nonDateFilters = { ...filters, dateRange: [null, null] as [string | null, string | null] };
    const features = filterFeatures(rawData.features, nonDateFilters);
    return computeTimeline(features);
  }, [rawData, filters]);

  // Available filter options
  const availableEventTypes = useMemo(
    () => (rawData ? getUniqueEventTypes(rawData.features) : []),
    [rawData]
  );
  const availableEvidenceTypes = useMemo(
    () => (rawData ? getUniqueEvidenceTypes(rawData.features) : []),
    [rawData]
  );
  const availablePeople = useMemo(
    () => (rawData ? getUniquePeople(rawData.features) : []),
    [rawData]
  );

  const handleFeatureClick = useCallback((feature: GeoJSONFeature) => {
    setSelectedFeature(feature);
  }, []);

  const handleLocationClick = useCallback(
    (locationName: string, features: GeoJSONFeature[]) => {
      if (features.length > 0) {
        setSelectedFeature(features[0]);
      }
    },
    []
  );

  const handleDateRangeChange = useCallback(
    (range: [string | null, string | null]) => {
      setFilters((prev) => ({ ...prev, dateRange: range }));
    },
    []
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading the Atlas...</p>
          <p className="text-gray-400 text-sm mt-1">
            Preparing location data from public records
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md">
          <p className="text-red-600 font-medium mb-2">{error}</p>
          <p className="text-gray-500 text-sm">
            Make sure NEXT_PUBLIC_MAPBOX_TOKEN is set in your .env.local file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <ContentWarning />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-gray-900">
            The Epstein Atlas
          </h1>
          <span className="text-xs text-gray-400 hidden sm:inline">
            Interactive location map from public records
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>
            {filteredData.features.length.toLocaleString()} locations · {filteredData.features.reduce((sum, f) => sum + (f.properties?.event_count ?? 0), 0).toLocaleString()} events
          </span>
          <a
            href="/about"
            className="hover:text-gray-900 transition-colors"
          >
            About
          </a>
          <a
            href="/methodology"
            className="hover:text-gray-900 transition-colors"
          >
            Methodology
          </a>
          <a
            href="/sources"
            className="hover:text-gray-900 transition-colors"
          >
            Sources
          </a>
        </div>
      </header>

      {/* Map area */}
      <div className="flex-1 relative">
        <AtlasMap
          data={filteredData}
          onFeatureClick={handleFeatureClick}
          onLocationClick={handleLocationClick}
        />

        {/* Filter panel overlay */}
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          availableEventTypes={availableEventTypes}
          availableEvidenceTypes={availableEvidenceTypes}
          availablePeople={availablePeople}
        />

        {/* Stats overlay — positioned above timeline widget */}
        <div className="absolute bottom-20 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-md px-3 py-2 text-xs text-gray-600">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              High (≥80%)
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              Moderate (60-79%)
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              Low (40-59%)
            </div>
            {/* Implied indicator removed */}
          </div>
        </div>

        {/* Timeline — compact floating widget at bottom of map */}
        <TimelineScrubber
          data={timelineData}
          dateRange={filters.dateRange}
          onDateRangeChange={handleDateRangeChange}
        />

        {/* Location detail panel — pass all raw features so detail can find all events at the location */}
        <LocationDetail
          feature={selectedFeature}
          allFeatures={rawData?.features ?? []}
          onClose={() => setSelectedFeature(null)}
        />
      </div>

      {/* Disclaimer */}
      <Disclaimer />
    </div>
  );
}
