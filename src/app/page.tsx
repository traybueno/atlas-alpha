import Link from "next/link";
import Disclaimer from "@/components/Disclaimer";
import StatsCounter from "@/components/StatsCounter";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      {/* Hero */}
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-3xl mx-auto px-6 py-12 sm:py-16 text-center">
          {/* Overline */}
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-[0.2em] mb-5">
            Public Records Investigation
          </p>

          <h1 className="text-5xl sm:text-7xl font-black text-white mb-5 tracking-tight leading-[0.95]">
            The Epstein Atlas
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 mb-2">
            An interactive map of Jeffrey Epstein locations
          </p>
          <p className="text-sm text-gray-600 mb-10">
            Built from public government records. Every pin links to its source document.
          </p>

          <Link
            href="/map"
            className="group inline-flex items-center gap-2.5 bg-white text-gray-950 px-10 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-all shadow-lg shadow-white/10"
          >
            Explore the Map
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>

          <StatsCounter />

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 text-left">
            <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur">
              <div className="flex items-center gap-2.5 mb-2.5">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
                <h3 className="font-semibold text-gray-200 text-sm">Source-linked</h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Every pin links directly to the source document — court filings,
                FBI records, DOJ EFTA releases.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur">
              <div className="flex items-center gap-2.5 mb-2.5">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21" />
                </svg>
                <h3 className="font-semibold text-gray-200 text-sm">Public records only</h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Built exclusively from documents released under the Epstein Files
                Transparency Act (Pub. L. 119–38) and FOIA.
              </p>
            </div>
          </div>

          {/* Atlas Engine */}
          <a
            href="https://corners.world"
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-10 p-6 bg-gray-900 border border-gray-800 rounded-xl text-left hover:border-gray-700 hover:bg-gray-900/80 transition-colors"
          >
            <h2 className="text-sm font-semibold text-gray-300 mb-1.5">
              Built with Corners Engine
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              A pipeline for turning document dumps into navigable maps.
              Bring your own corpus — FOIA responses, court filings, corporate records.
            </p>
          </a>
        </div>
      </main>

      {/* Navigation */}
      <nav className="border-t border-gray-800 px-6 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-center gap-6 text-sm text-gray-500">
          <Link href="/map" className="hover:text-white transition-colors">
            Map
          </Link>
          <a
            href="https://corners.world"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            About
          </a>
          <Link href="/sources" className="hover:text-white transition-colors">
            Sources
          </Link>
        </div>
      </nav>

      {/* Disclaimer */}
      <Disclaimer />
    </div>
  );
}
