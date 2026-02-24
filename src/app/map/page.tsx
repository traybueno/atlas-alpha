"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import type {
  GeoJSONFeatureCollection,
  GeoJSONFeature,
  FilterState,
} from "@/lib/types";
import {
  loadGeoJSON,
  filterFeatures,
  getUniquePeople,
} from "@/lib/data";
import LocationDetail from "@/components/LocationDetail";
import FilterPanel from "@/components/FilterPanel";
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
  people: [],
  searchQuery: "",
  nexusLevels: [],
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

  // Available filter options
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
          availablePeople={availablePeople}
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
