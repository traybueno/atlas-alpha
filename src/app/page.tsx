import Link from "next/link";
import Disclaimer from "@/components/Disclaimer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            The Epstein Atlas
          </h1>
          <p className="text-xl text-gray-500 mb-2">
            An interactive map of every confirmed Jeffrey Epstein location
          </p>
          <p className="text-lg text-gray-400 mb-10">
            Extracted from public government records. Every pin links to its
            source document.
          </p>

          <Link
            href="/map"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors shadow-lg"
          >
            Explore the Map
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>

          {/* Key stats */}
          <div className="grid grid-cols-3 gap-8 mt-16">
            <div>
              <div className="text-3xl font-bold text-gray-900">3,000+</div>
              <div className="text-sm text-gray-500 mt-1">Location events</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">100%</div>
              <div className="text-sm text-gray-500 mt-1">
                Source-documented
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">1991–2019</div>
              <div className="text-sm text-gray-500 mt-1">Date range</div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-6 mt-16 text-left">
            <div className="p-5 rounded-lg border border-gray-200 bg-white">
              <h3 className="font-semibold text-gray-900 mb-2">
                🔍 Source Traceability
              </h3>
              <p className="text-sm text-gray-500">
                Every map pin links directly to the source document — flight
                logs, CBP border crossing records, court filings, FBI documents.
              </p>
            </div>
            <div className="p-5 rounded-lg border border-gray-200 bg-white">
              <h3 className="font-semibold text-gray-900 mb-2">
                📊 Confidence Scoring
              </h3>
              <p className="text-sm text-gray-500">
                Each data point has a composite confidence score based on source
                reliability, extraction quality, geocoding precision, and
                corroboration.
              </p>
            </div>
            <div className="p-5 rounded-lg border border-gray-200 bg-white">
              <h3 className="font-semibold text-gray-900 mb-2">
                📅 Timeline Animation
              </h3>
              <p className="text-sm text-gray-500">
                Scrub through years to watch movement patterns emerge. The
                timeline shows event density and average confidence by year.
              </p>
            </div>
            <div className="p-5 rounded-lg border border-gray-200 bg-white">
              <h3 className="font-semibold text-gray-900 mb-2">
                ⚖️ Legally Grounded
              </h3>
              <p className="text-sm text-gray-500">
                Built exclusively from public records released under the Epstein
                Files Transparency Act (Pub. L. 119–38) and FOIA.
              </p>
            </div>
          </div>

          {/* Built with Atlas Engine */}
          <div className="mt-16 p-6 bg-gray-900 text-white rounded-xl">
            <h2 className="text-lg font-semibold mb-2">
              Built with Atlas Engine
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Atlas Engine is a reusable pipeline for turning unstructured
              document dumps into navigable geographic maps. Bring your own
              documents — FOIA responses, court filings, corporate records.
            </p>
            <a
              href="/about"
              className="text-sm text-white underline hover:text-gray-300"
            >
              Learn more about Atlas Engine →
            </a>
          </div>
        </div>
      </main>

      {/* Navigation */}
      <nav className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-6 text-sm text-gray-500">
          <Link href="/map" className="hover:text-gray-900">
            Map
          </Link>
          <Link href="/about" className="hover:text-gray-900">
            About
          </Link>
          <Link href="/sources" className="hover:text-gray-900">
            Sources
          </Link>
          <Link href="/privacy" className="hover:text-gray-900">
            Privacy
          </Link>
        </div>
      </nav>

      <Disclaimer />
    </div>
  );
}
