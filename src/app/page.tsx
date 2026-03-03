import Link from "next/link";
import Disclaimer from "@/components/Disclaimer";
import StatsCounter from "@/components/StatsCounter";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            The Epstein Atlas
          </h1>
          <p className="text-xl text-gray-500 mb-2">
            An interactive map of confirmed Jeffrey Epstein locations
          </p>
          <p className="text-lg text-gray-400 mb-10">
            Built from public government records. Every pin links to its source document.
          </p>

          <Link
            href="/map"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors shadow-lg"
          >
            Explore the Map
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

          <StatsCounter />

          {/* Features */}
          <div className="grid grid-cols-2 gap-5 mt-10 text-left">
            <div className="p-5 rounded-lg border border-gray-200 bg-white">
              <h3 className="font-semibold text-gray-900 mb-2">🔍 Source-linked</h3>
              <p className="text-sm text-gray-500">
                Every pin links directly to the source document — court filings,
                FBI records, DOJ EFTA releases.
              </p>
            </div>
            <div className="p-5 rounded-lg border border-gray-200 bg-white">
              <h3 className="font-semibold text-gray-900 mb-2">⚖️ Public records only</h3>
              <p className="text-sm text-gray-500">
                Built exclusively from documents released under the Epstein Files
                Transparency Act (Pub. L. 119–38) and FOIA.
              </p>
            </div>
          </div>

          {/* Atlas Engine */}
          <div className="mt-12 p-6 bg-gray-900 text-white rounded-xl text-left">
            <h2 className="text-base font-semibold mb-1">Built with Corners Engine</h2>
            <p className="text-gray-400 text-sm">
              A pipeline for turning document dumps into navigable maps.
              Bring your own corpus — FOIA responses, court filings, corporate records.
            </p>
          </div>
        </div>
      </main>

      {/* Navigation */}
      <nav className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-center gap-6 text-sm text-gray-500">
          <Link href="/map" className="hover:text-gray-900">Map</Link>
          <a href="https://corners.world" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">About</a>
          <Link href="/sources" className="hover:text-gray-900">Sources</Link>
        </div>
      </nav>

      <Disclaimer />
    </div>
  );
}
