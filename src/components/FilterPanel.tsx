"use client";

import { useState } from "react";
import type { FilterState } from "@/lib/types";

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availablePeople: string[];
}

const NEXUS_OPTIONS = [
  { value: "direct", label: "Direct", description: "Epstein personally involved" },
  { value: "implied", label: "Implied", description: "Known associates, network context" },
  { value: "contextual", label: "Contextual", description: "Circumstantial connection" },
];

export default function FilterPanel({
  filters,
  onFiltersChange,
  availablePeople,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [peopleSearch, setPeopleSearch] = useState("");

  const activeFilterCount = [
    filters.nexusLevels.length > 0 ? 1 : 0,
    filters.people.length > 0 ? 1 : 0,
    filters.searchQuery ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const update = (partial: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...partial });
  };

  const toggleNexus = (level: string) => {
    const levels = filters.nexusLevels.includes(level)
      ? filters.nexusLevels.filter((l) => l !== level)
      : [...filters.nexusLevels, level];
    update({ nexusLevels: levels });
  };

  const togglePerson = (person: string) => {
    const people = filters.people.includes(person)
      ? filters.people.filter((p) => p !== person)
      : [...filters.people, person];
    update({ people });
  };

  const resetFilters = () => {
    onFiltersChange({ people: [], searchQuery: "", nexusLevels: [] });
  };

  const filteredPeople = availablePeople.filter((p) =>
    p.toLowerCase().includes(peopleSearch.toLowerCase())
  );

  return (
    <div className="absolute top-4 left-4 z-10">
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
                className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder-gray-500 text-gray-900"
              />
            </div>

            {/* Epstein Connection */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Epstein Connection
              </label>
              <div className="mt-2 space-y-1">
                {NEXUS_OPTIONS.map(({ value, label, description }) => (
                  <label
                    key={value}
                    className="flex items-start gap-2 py-1.5 cursor-pointer hover:bg-gray-50 rounded px-1"
                  >
                    <input
                      type="checkbox"
                      checked={filters.nexusLevels.includes(value)}
                      onChange={() => toggleNexus(value)}
                      className="mt-0.5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <div>
                      <span className="text-sm text-gray-700">{label}</span>
                      <p className="text-[11px] text-gray-400 leading-tight">{description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

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
                className="mt-1 w-full px-3 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder-gray-500 text-gray-900"
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
              <div className="mt-2 space-y-0.5 max-h-40 overflow-y-auto">
                {filteredPeople.map((person) => (
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
              </div>
            </div>

            {/* Reset */}
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
