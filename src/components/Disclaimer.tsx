export default function Disclaimer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[10px] text-gray-600 leading-relaxed flex-1">
          <strong className="text-gray-500">DISCLAIMER:</strong> Project Atlas is an independent research
          and accountability tool. It is not affiliated with, endorsed by, or
          connected to any government agency, law enforcement body, or the
          estates of any individuals referenced herein. All location data is
          extracted from publicly available documents including federal court
          records, FOIA releases, and materials published pursuant to the Epstein
          Files Transparency Act (Pub. L. 119–38).{" "}
          <strong className="text-gray-500">
            Presence at a location does not imply criminal conduct, guilt, or
            wrongdoing of any kind.
          </strong>{" "}
          Many individuals in these documents are witnesses, employees, or social
          contacts with no alleged criminal involvement. Every data point
          includes a confidence score and source citations. Users should verify
          all information against primary sources. If you believe any information
          is inaccurate, please contact corrections@atlas-engine.dev with the
          specific entry and supporting documentation.
        </p>
        <a href="/privacy" className="text-[10px] text-gray-600 hover:text-gray-400 whitespace-nowrap shrink-0">
          Privacy
        </a>
      </div>
    </footer>
  );
}
