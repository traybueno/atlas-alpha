export default function Disclaimer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <p className="text-[10px] text-gray-400 leading-relaxed">
          <strong>DISCLAIMER:</strong> Project Atlas is an independent research
          and accountability tool. It is not affiliated with, endorsed by, or
          connected to any government agency, law enforcement body, or the
          estates of any individuals referenced herein. All location data is
          extracted from publicly available documents including federal court
          records, FOIA releases, and materials published pursuant to the Epstein
          Files Transparency Act (Pub. L. 119–38).{" "}
          <strong>
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
      </div>
    </footer>
  );
}
