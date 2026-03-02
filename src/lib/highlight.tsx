import React from "react";

/**
 * Highlight matching text segments with a yellow mark (search).
 * Returns plain string if no query or no match (safe for React rendering).
 */
export function highlightText(
  text: string,
  query: string
): React.ReactNode {
  if (!query || !text) return text;

  // Escape regex special chars in query
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  if (parts.length <= 1) return text;

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-yellow-200 text-yellow-900 rounded-sm px-0.5"
          >
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

/**
 * Highlight a person's name if it matches any of the selected people (blue).
 * Used for people-filter feedback in event cards.
 */
export function highlightPerson(
  name: string,
  selectedPeople: string[]
): React.ReactNode {
  if (!name || !selectedPeople.length) return name;
  const isSelected = selectedPeople.some(
    (p) => name.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(name.toLowerCase())
  );
  if (!isSelected) return name;
  return (
    <mark className="bg-blue-100 text-blue-800 rounded-sm px-0.5 font-medium">
      {name}
    </mark>
  );
}
