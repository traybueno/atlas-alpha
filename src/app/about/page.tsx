import Link from "next/link";
import Disclaimer from "@/components/Disclaimer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-gray-900">
            The Epstein Atlas
          </Link>
          <nav className="flex gap-4 text-sm text-gray-500">
            <Link href="/map" className="hover:text-gray-900">Map</Link>
            <Link href="/sources" className="hover:text-gray-900">Sources</Link>
            <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">About Project Atlas</h1>

          <section className="prose prose-gray max-w-none space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Purpose</h2>
            <p className="text-gray-600 leading-relaxed">
              Project Atlas is an independent research and accountability tool. It synthesizes
              publicly available documents — released by the U.S. government, federal courts,
              and pursuant to the Epstein Files Transparency Act (Pub. L. 119–38) — into an
              accessible geographic visualization.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our purpose is to help researchers, journalists, and the public understand the
              geographic scope and documented connections of the Epstein network. We center
              accountability and factual accuracy. We do not speculate, entertain, or sensationalize.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8">Methodology</h2>
            <p className="text-gray-600 leading-relaxed">
              Every data point on the map was extracted from a specific public document using
              a multi-step pipeline:
            </p>
            <ol className="list-decimal pl-6 text-gray-600 space-y-2">
              <li>Source documents are downloaded from official government sources (DOJ, FBI Vault, CBP FOIA releases)</li>
              <li>Documents are OCR'd if scanned, then processed through entity extraction</li>
              <li>Locations are resolved using a combination of known alias dictionaries and geocoding services</li>
              <li>Each record receives a composite confidence score based on source reliability, extraction quality, geocoding precision, temporal precision, and corroboration</li>
              <li>Records are deduplicated and cross-referenced across sources</li>
            </ol>

            <h2 className="text-xl font-semibold text-gray-900 mt-8">Confidence Scoring</h2>
            <p className="text-gray-600 leading-relaxed">
              Every data point has a confidence score from 0 to 1, calculated as a weighted
              composite of five factors:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Source Reliability (30%)</strong> — Flight logs and government records score highest</li>
              <li><strong>Extraction Quality (20%)</strong> — Structured data beats OCR</li>
              <li><strong>Geocoding Precision (15%)</strong> — Exact addresses beat city-level</li>
              <li><strong>Temporal Precision (15%)</strong> — Exact dates beat approximate years</li>
              <li><strong>Corroboration (20%)</strong> — Multiple independent sources increase confidence</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8">Editorial Standards</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Every data point is sourced to a specific public document</li>
              <li>No speculation or inference — only explicitly stated facts</li>
              <li>Victim names are never displayed — court pseudonyms only</li>
              <li>Presence at a location does not imply criminal conduct</li>
              <li>No conspiracy theories — only documented facts from official sources</li>
              <li>Active error correction process</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8">Atlas Engine</h2>
            <p className="text-gray-600 leading-relaxed">
              The Epstein Atlas is built on the <strong>Atlas Engine</strong> — a reusable
              pipeline for turning unstructured document dumps into navigable geographic maps.
              The engine handles OCR, entity extraction, geocoding, confidence scoring, and
              map visualization. It can be applied to any document collection — FOIA responses,
              court filings, corporate records, leaked archives.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8">Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              For corrections, questions, or press inquiries: corrections@atlas-engine.dev
            </p>
          </section>
        </div>
      </main>

      <Disclaimer />
    </div>
  );
}
