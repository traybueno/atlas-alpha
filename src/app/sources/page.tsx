import Link from "next/link";
import Disclaimer from "@/components/Disclaimer";

const SOURCES = [
  {
    name: "DOJ Epstein Page",
    url: "https://www.justice.gov/epstein",
    type: "Government",
    description: "Official Department of Justice release under the Epstein Files Transparency Act. 3M+ pages released Jan 30, 2026.",
    reliability: "Public Domain",
  },
  {
    name: "CBP FOIA Records",
    url: "https://www.cbp.gov/document/foia-record/jeffrey-epstein-records",
    type: "Government",
    description: "Customs and Border Protection travel records, TECS border crossing data, aircraft arrival reports.",
    reliability: "Public Domain",
  },
  {
    name: "FBI Vault",
    url: "https://vault.fbi.gov/jeffrey-epstein",
    type: "Government",
    description: "FBI investigative files released under FOIA.",
    reliability: "Public Domain",
  },
  {
    name: "dleerdefi/epstein-network-data",
    url: "https://github.com/dleerdefi/epstein-network-data",
    type: "Structured Dataset",
    description: "Neo4j graph database with 2,051 flights, 283 geocoded airports, 1,192 addresses, 4,951 person-flight relationships.",
    reliability: "Community-curated",
  },
  {
    name: "epstein-docs.github.io",
    url: "https://github.com/epstein-docs/epstein-docs.github.io",
    type: "Structured Dataset",
    description: "Pre-OCR'd documents with JSON entity extraction. ~29,000 pages with extracted people, locations, dates.",
    reliability: "Community-curated",
  },
  {
    name: "Court Documents (SDNY)",
    url: "https://www.courtlistener.com/?q=jeffrey+epstein&type=r",
    type: "Court Records",
    description: "Federal court filings from Southern District of New York. Giuffre v. Maxwell, USA v. Maxwell, USA v. Epstein.",
    reliability: "Public Record",
  },
];

export default function SourcesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-gray-900">
            The Epstein Atlas
          </Link>
          <nav className="flex gap-4 text-sm text-gray-500">
            <Link href="/map" className="hover:text-gray-900">Map</Link>
            <a href="https://corners.world" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">About</a>
            <Link href="/sources" className="text-gray-900 font-medium">Sources</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Data Sources</h1>
          <p className="text-gray-500 mb-8">
            All data displayed on the Atlas is extracted from publicly available documents.
            We do not host source documents — we link to official government URLs.
          </p>

          <div className="space-y-6">
            {SOURCES.map((source) => (
              <div key={source.name} className="border border-gray-200 rounded-lg p-5">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="font-semibold text-gray-900">{source.name}</h2>
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                      {source.type}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-green-50 rounded-full text-green-700">
                      {source.reliability}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">{source.description}</p>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                >
                  Visit source →
                </a>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h2 className="font-semibold text-gray-900 mb-2">Legal Basis</h2>
            <p className="text-sm text-gray-500">
              All primary sources are U.S. government works (17 USC § 105 — no copyright)
              or public court records. The Epstein Files Transparency Act (Pub. L. 119–38,
              signed Nov 19, 2025) mandates public release of all prosecution files.
            </p>
          </div>
        </div>
      </main>

      <Disclaimer />
    </div>
  );
}
