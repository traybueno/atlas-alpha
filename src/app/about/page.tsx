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
          <div className="max-w-4xl mx-auto px-6 py-16">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">Powered by Valis</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight tracking-tight">
              Turn thousands of documents into<br />an interactive intelligence map.
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
                <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">Live example</p>
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
                  <div key={item.title} className="border border-gray-100 rounded-lg px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900 mb-0.5">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact / Interest Form */}
        <section>
          <div className="max-w-4xl mx-auto px-6 py-14">
            <div className="max-w-4xl">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">Get in touch</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Have a corpus that needs mapping?</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Whether you&apos;ve got a document corpus you want mapped, want to run your own instance,
                or just want to follow where this is going — drop us a line.
              </p>
              <ContactForm />
            </div>
          </div>
        </section>

      </main>

      <Disclaimer />
    </div>
  );
}
