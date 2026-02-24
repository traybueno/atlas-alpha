"use client";

import { useState } from "react";
import type { FilterState } from "@/lib/types";
import { EVIDENCE_TYPE_BADGES, getEvidenceTypeBadge } from "./EvidenceModal";

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableEventTypes: string[];
  availableEvidenceTypes: string[];
  availablePeople: string[];
}

// Event type labels removed from UI per directive

export default function FilterPanel({
  filters,
  onFiltersChange,
  availableEventTypes,
  availableEvidenceTypes,
  availablePeople,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [peopleSearch, setPeopleSearch] = useState("");

  const activeFilterCount = [
    filters.confidenceMin > 0.6 ? 1 : 0,
    filters.eventTypes.length > 0 ? 1 : 0,
    filters.evidenceTypes.length > 0 ? 1 : 0,
    filters.people.length > 0 ? 1 : 0,
    filters.searchQuery ? 1 : 0,
    filters.showMinimalPins ? 1 : 0,
    filters.showImplied ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const update = (partial: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...partial });
  };

  const toggleEventType = (type: string) => {
    const types = filters.eventTypes.includes(type)
      ? filters.eventTypes.filter((t) => t !== type)
      : [...filters.eventTypes, type];
    update({ eventTypes: types });
  };

  const toggleEvidenceType = (type: string) => {
    const types = filters.evidenceTypes.includes(type)
      ? filters.evidenceTypes.filter((t) => t !== type)
      : [...filters.evidenceTypes, type];
    update({ evidenceTypes: types });
  };

  const togglePerson = (person: string) => {
    const people = filters.people.includes(person)
      ? filters.people.filter((p) => p !== person)
      : [...filters.people, person];
    update({ people });
  };

  const resetFilters = () => {
    onFiltersChange({
      confidenceMin: 0.6,
      sourceTypes: [],
      dateRange: [null, null],
      eventTypes: [],
      evidenceTypes: [],
      people: [],
      searchQuery: "",
      showMinimalPins: false,
      showImplied: false,
    });
  };

  const filteredPeople = availablePeople.filter((p) =>
    p.toLowerCase().includes(peopleSearch.toLowerCase())
  );

  return (
    <div className="absolute top-4 right-4 z-10">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white shadow-lg rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition-colors border border-gray-200"
      >
        <svg
          className="w-4 h-4 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <span className="text-sm font-medium text-gray-700">Filters</span>
        {activeFilterCount > 0 && (
          <span className="bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="mt-2 bg-white shadow-xl rounded-lg border border-gray-200 w-80 max-h-[70vh] overflow-y-auto">
          <div className="p-4 space-y-5">
            {/* Search */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Search
              </label>
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => update({ searchQuery: e.target.value })}
                placeholder="Search locations, events, people..."
                className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            {/* Confidence threshold */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Minimum Confidence
              </label>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={filters.confidenceMin * 100}
                  onChange={(e) =>
                    update({ confidenceMin: parseInt(e.target.value) / 100 })
                  }
                  className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-gray-900 [&::-webkit-slider-thumb]:rounded-full"
                />
                <span className="text-sm font-medium text-gray-700 w-10 text-right">
                  {(filters.confidenceMin * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Event type filters removed */}

            {/* Evidence Types (doc_type) */}
            {availableEvidenceTypes.length > 0 && (
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Evidence Types
                </label>
                <div className="mt-2 space-y-1 max-h-36 overflow-y-auto">
                  {availableEvidenceTypes.map((type) => {
                    const badge = getEvidenceTypeBadge(type);
                    return (
                      <label
                        key={type}
                        className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 rounded px-1"
                      >
                        <input
                          type="checkbox"
                          checked={filters.evidenceTypes.includes(type)}
                          onChange={() => toggleEvidenceType(type)}
                          className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                        />
                        <span className="text-sm text-gray-700">
                          {badge ? `${badge.emoji} ${badge.label}` : type}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* People */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                People
              </label>
              <input
                type="text"
                value={peopleSearch}
                onChange={(e) => setPeopleSearch(e.target.value)}
                placeholder="Filter people..."
                className="mt-1 w-full px-3 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              {filters.people.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {filters.people.map((person) => (
                    <button
                      key={person}
                      onClick={() => togglePerson(person)}
                      className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full flex items-center gap-1 hover:bg-blue-100"
                    >
                      {person}
                      <span>×</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-2 space-y-0.5 max-h-32 overflow-y-auto">
                {filteredPeople.slice(0, 20).map((person) => (
                  <label
                    key={person}
                    className="flex items-center gap-2 py-0.5 cursor-pointer hover:bg-gray-50 rounded px-1"
                  >
                    <input
                      type="checkbox"
                      checked={filters.people.includes(person)}
                      onChange={() => togglePerson(person)}
                      className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <span className="text-xs text-gray-700">{person}</span>
                  </label>
                ))}
                {filteredPeople.length > 20 && (
                  <p className="text-xs text-gray-400 pl-6">
                    + {filteredPeople.length - 20} more
                  </p>
                )}
              </div>
            </div>

            {/* Implied presence toggle removed */}

            {/* Quality filter */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Data Quality
              </label>
              <label className="flex items-center gap-2 mt-2 cursor-pointer hover:bg-gray-50 rounded px-1 py-1">
                <input
                  type="checkbox"
                  checked={filters.showMinimalPins}
                  onChange={(e) =>
                    update({ showMinimalPins: e.target.checked })
                  }
                  className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <div>
                  <span className="text-sm text-gray-700">
                    Show contact-network-only addresses
                  </span>
                  <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
                    Bare address pins with no documented events, people, or dates
                  </p>
                </div>
              </label>
            </div>

            {/* Reset */}
            <button
              onClick={resetFilters}
              className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
