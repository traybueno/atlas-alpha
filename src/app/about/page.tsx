import Link from "next/link";
import Disclaimer from "@/components/Disclaimer";
import ContactForm from "@/components/ContactForm";

const DISCOVERIES = [
  {
    tag: "Membership Record",
    title: "Adult Video Warehouse Registration",
    date: "December 20, 2005",
    location: "North Palm Beach, Florida",
    desc: "A Palm Beach PD evidence log documents Epstein registering for a video club membership under the name JEFF EPSTEIN at 501 Northlake Blvd, listing a Pennsylvania address. Recovered as Exhibit 14-C.",
  },
  {
    tag: "Scheduling Email",
    title: "Woody Allen & Soon-Yi Dinner Confirmed",
    date: "September 15, 2017",
    location: "9 East 71st Street, Manhattan",
    desc: "Scheduling communications between Epstein's assistant and Soon-Yi Previn confirm a 7:00pm dinner at the townhouse. The meeting appears in the corpus as a routine calendar entry.",
  },
  {
    tag: "Immigration Record",
    title: "APIS Departure: JFK to Paris CDG",
    date: "May 30, 1998",
    location: "JFK International Airport",
    desc: "Advance Passenger Information System records confirm Epstein on Air France flight AF 8 to Paris Charles de Gaulle under passport 110708878. One of dozens of documented international crossings.",
  },
  {
    tag: "Flight Manifest",
    title: "Handwritten Age Notation on Passenger Log",
    date: "2001–2005",
    location: "Teterboro Airport, New Jersey",
    desc: "A Gulfstream IV flight manifest in the EFTA document set bears a handwritten annotation next to one passenger name: a phone number followed by 'age 16.' The manifest is among hundreds in the corpus.",
  },
];

const SOURCES = [
  {
    name: "DOJ EFTA Documents",
    abbr: "EFTA",
    desc: "Records released under the Epstein Files Transparency Act (Pub. L. 119–38). Includes flight manifests, scheduling emails, financial records, immigration logs, and personal correspondence.",
    docs: "22,400+",
  },
  {
    name: "FBI Vault Releases",
    abbr: "FBI",
    desc: "FOIA-released investigative files from the FBI's New York and Miami field offices. Includes evidence inventories, witness interview summaries, and surveillance logs.",
    docs: "5,800+",
  },
  {
    name: "Federal Court Records",
    abbr: "SDNY",
    desc: "Filings, depositions, and exhibits from United States v. Epstein and United States v. Maxwell in the Southern District of New York.",
    docs: "1,900+",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Triage",
    desc: "Every document is reviewed for geographic relevance. Does it place a named individual at a specific location? Non-geographic documents are filtered before extraction begins.",
  },
  {
    num: "02",
    title: "Extract",
    desc: "Qualifying documents are parsed for geographic fragments: exact locations, dates, people present, and what occurred. Each fragment carries a verbatim quote from the source.",
  },
  {
    num: "03",
    title: "Resolve",
    desc: "Fragments are matched against the existing event database. Duplicate incidents merge and accumulate corroborating evidence. New events are created when no match exists.",
  },
  {
    num: "04",
    title: "Map",
    desc: "Events are geocoded and published as a live, filterable intelligence map. Every pin links to its source document. Every claim is verifiable.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
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

      <main className="flex-1">

        {/* ─── Hero ─── */}
        <section className="bg-gray-950 px-6 py-24">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase mb-5">
              A Corners Intelligence Map
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              The Epstein Atlas
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl leading-relaxed mb-10">
              30,158 government documents. 2,910 events. 422 locations.<br />
              Every claim sourced. Nothing invented.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/map"
                className="inline-flex items-center gap-2 bg-emerald-500 text-white px-7 py-3.5 rounded-lg font-medium text-sm hover:bg-emerald-400 transition-colors"
              >
                Explore the map
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/sources"
                className="inline-flex items-center gap-2 border border-gray-700 text-gray-300 px-7 py-3.5 rounded-lg font-medium text-sm hover:border-gray-500 hover:text-white transition-colors"
              >
                View sources
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Stats bar ─── */}
        <section className="bg-gray-900 border-b border-gray-800 px-6 py-10">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "30,158", label: "Documents scanned" },
              { value: "2,910", label: "Events extracted" },
              { value: "422", label: "Locations geocoded" },
              { value: "100%", label: "Source-cited" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-white tracking-tight">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── What this is ─── */}
        <section className="px-6 py-20 border-b border-gray-100">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">What this is</p>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-5">
                A geographic record of the Epstein network, built from public documents.
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                The Epstein Atlas maps every confirmed location connected to Jeffrey Epstein
                and his network, extracted directly from government archives. Every pin on
                the map corresponds to a real, documented event — with the source document
                one click away.
              </p>
              <p className="text-gray-500 leading-relaxed">
                This is not journalism. It is a structured index of public record — the kind
                of analysis that takes years manually and weeks with the right tools.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "FBI Vault", detail: "Investigative files" },
                { label: "DOJ EFTA", detail: "Transparency Act docs" },
                { label: "SDNY Filings", detail: "Federal court records" },
                { label: "Flight Logs", detail: "CBP & APIS records" },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                  <p className="text-sm font-semibold text-gray-900">{s.label}</p>
                  <p className="text-xs text-gray-400 mt-1">{s.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── The Corpus ─── */}
        <section className="px-6 py-20 bg-gray-50 border-b border-gray-100">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">The Corpus</p>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-12">
              Three source datasets. All public record.
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {SOURCES.map((s) => (
                <div key={s.abbr} className="bg-white border border-gray-100 border-l-4 border-l-emerald-500 rounded-xl p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold tracking-widest uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      {s.abbr}
                    </span>
                    <span className="text-2xl font-bold text-gray-900">{s.docs}</span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{s.name}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── What the engine surfaced ─── */}
        <section className="px-6 py-20 border-b border-gray-100">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">Corpus Discoveries</p>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">
              What the engine surfaced.
            </h2>
            <p className="text-gray-500 mb-12 max-w-2xl leading-relaxed">
              These are not headlines. They are receipts, manifests, scheduling logs, and
              immigration records — the kind of evidence buried in 30,000 documents that
              only a corpus-scale analysis brings to the surface.
            </p>
            <div className="grid md:grid-cols-2 gap-5">
              {DISCOVERIES.map((d) => (
                <div key={d.title} className="bg-gray-950 rounded-xl p-7">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-semibold tracking-widest uppercase text-amber-400">
                      {d.tag}
                    </span>
                    <span className="text-xs text-gray-600">{d.date}</span>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">{d.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">{d.location}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Pipeline ─── */}
        <section className="px-6 py-20 bg-gray-50 border-b border-gray-100">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">How it was built</p>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-14">
              The Corners Engine pipeline.
            </h2>
            <div className="hidden md:block relative">
              <div className="absolute top-6 left-[12.5%] right-[12.5%] h-px bg-gray-200 z-0" />
              <div className="grid grid-cols-4 gap-4 relative z-10">
                {STEPS.map((step) => (
                  <div key={step.num} className="flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-950 text-white flex items-center justify-center text-sm font-bold shrink-0 ring-4 ring-gray-50">
                      {step.num}
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:hidden space-y-6">
              {STEPS.map((step) => (
                <div key={step.num} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-950 text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {step.num}
                    </div>
                    <div className="w-px flex-1 bg-gray-200 mt-2" />
                  </div>
                  <div className="pb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Corners Engine bridge ─── */}
        <section className="px-6 py-20 border-b border-gray-100">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gray-950 rounded-2xl p-10 sm:p-14 flex flex-col md:flex-row md:items-center gap-10">
              <div className="flex-1">
                <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase mb-4">Corners Engine</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
                  This map was built with Corners.
                </h2>
                <p className="text-gray-400 leading-relaxed max-w-xl">
                  Corners turns document corpora into interactive, evidence-backed intelligence maps.
                  FOIA releases, court filings, leaked archives, corporate records — if it&apos;s in
                  a document, Corners can surface, source, and map it.
                </p>
              </div>
              <div className="shrink-0">
                <a
                  href="https://corners.world"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-500 text-white px-7 py-3.5 rounded-lg font-medium text-sm hover:bg-emerald-400 transition-colors"
                >
                  Learn more at corners.world
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Contact ─── */}
        <section className="px-6 py-20">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">Get in touch</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-3">
              Have documents that need mapping?
            </h2>
            <p className="text-gray-500 mb-10 leading-relaxed max-w-2xl">
              Tell us about your corpus and what you&apos;re trying to find.
              No commitment, no pitch deck — just tell us what you&apos;ve got.
            </p>
            <div className="max-w-2xl">
              <ContactForm />
            </div>
          </div>
        </section>

      </main>

      <Disclaimer />
    </div>
  );
}
