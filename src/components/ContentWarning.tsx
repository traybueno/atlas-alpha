"use client";

import { useState, useEffect } from "react";

export default function ContentWarning() {
  const [dismissed, setDismissed] = useState(true); // Start true to avoid flash

  useEffect(() => {
    const stored = localStorage.getItem("atlas-content-warning-dismissed");
    if (!stored) {
      setDismissed(false);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem("atlas-content-warning-dismissed", "true");
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">⚠️</span>
          <h2 className="text-xl font-semibold text-gray-900">
            Content Warning
          </h2>
        </div>

        <p className="text-gray-600 leading-relaxed mb-4">
          This site contains references to child sexual abuse, sex trafficking,
          and exploitation of minors. Materials are presented for accountability
          and investigative purposes only.
        </p>

        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          All data is extracted from publicly available government documents
          including federal court records, FOIA releases, and materials published
          pursuant to the Epstein Files Transparency Act (Pub. L. 119–38).
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={dismiss}
            className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            I Understand — Continue
          </button>
          <p className="text-xs text-gray-400 text-center">
            If you or someone you know needs help, contact{" "}
            <a
              href="https://www.rainn.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              RAINN
            </a>{" "}
            (1-800-656-4673) or the{" "}
            <a
              href="https://www.missingkids.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              National Center for Missing & Exploited Children
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
