import Link from "next/link";
import Disclaimer from "@/components/Disclaimer";
import ContactForm from "@/components/ContactForm";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
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

        {/* Hero */}
        <section className="border-b border-gray-100 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 py-20">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">A Corners Intelligence Map</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
              Turn thousands of documents<br />into an interactive, sourced map.
            </h1>
            <p className="text-lg text-gray-500 max-w-4xl leading-relaxed">
              You have the documents. Corners extracts every person, location, and event,
              then maps them with source citations and confidence scores.
              Every claim is verifiable. Nothing is invented.
            </p>
          </div>
        </section>

        {/* Live Example: The Epstein Atlas */}
        <section className="border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="bg-gray-900 rounded-2xl p-8 sm:p-10">
              <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-3">Live Example</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">The Epstein Atlas</h2>
              <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-2xl">
                Built from public government records: FBI Vault releases, DOJ EFTA filings,
                and federal court documents. Every pin on the map links directly to its source.
              </p>

              <div className="grid grid-cols-3 gap-6 mb-8">
                {[
                  { stat: "23,000+", label: "Documents processed" },
                  { stat: "2,500+", label: "Events extracted" },
                  { stat: "400+", label: "Locations mapped" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-2xl sm:text-3xl font-bold text-white">{item.stat}</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">{item.label}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/map"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                Explore the map
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section className="border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-6 py-14">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">Who it&apos;s for</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">
              Built for people who work with large document sets.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  title: "Journalists",
                  desc: "Turn FOIA responses and leaked document sets into publishable, sourced maps. Surface the connections buried in thousands of pages.",
                },
                {
                  title: "Attorneys",
                  desc: "Map discovery documents at scale. Identify patterns across depositions, filings, and exhibits that manual review would miss.",
                },
                {
                  title: "Investigators",
                  desc: "Stop reading PDFs one at a time. Corners extracts entities, scores confidence, and maps everything with full source tracing.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="border border-gray-200 rounded-xl p-6 flex flex-col gap-3"
                >
                  <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact / Interest Form */}
        <section>
          <div className="max-w-4xl mx-auto px-6 py-16">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">Get in touch</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
              Have documents that need mapping?
            </h2>
            <p className="text-gray-500 mb-10 leading-relaxed max-w-2xl">
              Tell us about your document set and what you&apos;re trying to find.
              Whether you need a full build or want to explore running your own instance, we&apos;ll get back to you.
            </p>
            <ContactForm />
          </div>
        </section>

      </main>

      <Disclaimer />
    </div>
  );
}
