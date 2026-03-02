import Link from "next/link";
import Disclaimer from "@/components/Disclaimer";

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
          <div className="max-w-4xl mx-auto px-6 py-16">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">Powered by Valis</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight tracking-tight">
              Large unstructured document sets →<br />interactive intelligence maps.
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl">
              You have thousands of documents. Valis turns them into an interactive,
              evidence-backed intelligence map — every person, every location, every event, sourced and verifiable.
            </p>
          </div>
        </section>

        {/* Proof + Audience side by side */}
        <section className="border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Portfolio */}
            <div className="bg-gray-900 rounded-xl p-7 flex flex-col justify-between gap-6">
              <div>
                <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">Proof of concept</p>
                <h2 className="text-xl font-bold text-white mb-2">The Epstein Atlas</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  23,000+ government documents — FBI Vault, DOJ EFTA, federal court records —
                  extracted, geocoded, and mapped. Every pin links to its source.
                </p>
              </div>
              <Link
                href="/map"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors self-start"
              >
                Explore the map
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Who it's for */}
            <div className="flex flex-col gap-4">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Who it&apos;s for</p>
              <p className="text-gray-700 text-base leading-relaxed">
                Built for journalists, attorneys, investigators, and anyone sitting on a document corpus that contains a story.
              </p>
              <div className="grid grid-cols-1 gap-3 mt-1">
                {[
                  { title: "Journalists", desc: "Turn FOIA responses into publishable, sourced maps." },
                  { title: "Attorneys", desc: "Surface patterns across discovery documents at scale." },
                  { title: "Investigators", desc: "Stop reading PDFs. Valis extracts, scores, and maps." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3 items-start">
                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0 mt-2" />
                    <p className="text-sm text-gray-600"><strong className="text-gray-900">{item.title}</strong> — {item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-8">Pricing</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { tier: "Free", price: "Free", sub: "30-min discovery call", cta: "Book a call", highlight: false },
                { tier: "Starter", price: "$2,500", sub: "Up to 5,000 docs", cta: "Get started", highlight: false },
                { tier: "Standard", price: "$7,500", sub: "Up to 50,000 docs", cta: "Get started", highlight: true },
                { tier: "Full Corpus", price: "Custom", sub: "50,000+ docs", cta: "Request a quote", highlight: false },
              ].map((item) => (
                <div
                  key={item.tier}
                  className={`rounded-xl p-5 flex flex-col gap-4 border ${
                    item.highlight ? "bg-gray-900 border-gray-900" : "bg-white border-gray-200"
                  }`}
                >
                  <div>
                    <p className={`text-xs font-semibold tracking-widest uppercase mb-1 ${item.highlight ? "text-gray-500" : "text-gray-400"}`}>{item.tier}</p>
                    <p className={`text-2xl font-bold ${item.highlight ? "text-white" : "text-gray-900"}`}>{item.price}</p>
                    <p className={`text-xs mt-1 ${item.highlight ? "text-gray-400" : "text-gray-500"}`}>{item.sub}</p>
                  </div>
                  <a
                    href="mailto:hello@valis.agency"
                    className={`mt-auto text-center px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      item.highlight ? "bg-white text-gray-900 hover:bg-gray-100" : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                  >
                    {item.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="max-w-4xl mx-auto px-6 py-14 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Ready to map your documents?</h2>
              <p className="text-gray-500">Start with a free 30-minute discovery call. No commitment.</p>
            </div>
            <a
              href="mailto:hello@valis.agency"
              className="shrink-0 inline-flex items-center gap-2 bg-gray-900 text-white px-7 py-3.5 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow"
            >
              Book a Discovery Call
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </section>

      </main>

      <Disclaimer />
    </div>
  );
}
