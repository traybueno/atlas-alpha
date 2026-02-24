import Link from "next/link";
import Disclaimer from "@/components/Disclaimer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-gray-900">
            The Epstein Atlas
          </Link>
          <nav className="flex gap-4 text-sm text-gray-500">
            <Link href="/map" className="hover:text-gray-900">Map</Link>
            <Link href="/about" className="hover:text-gray-900">About</Link>
            <Link href="/sources" className="hover:text-gray-900">Sources</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
            <section>
              <h2 className="text-xl font-semibold text-gray-900">What Data We Display</h2>
              <p>
                Project Atlas displays names and locations extracted from publicly available
                government documents, including federal court records, FOIA releases, and
                materials published pursuant to the Epstein Files Transparency Act (Pub. L. 119–38).
              </p>
              <p>
                We display only: location names and coordinates, dates, names of convicted
                individuals and persons named in official proceedings, event type classifications,
                source document citations, and verbatim excerpts limited to location-relevant
                text (300 characters maximum).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">What We Never Display</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Victim names — only court-assigned pseudonyms (e.g., &ldquo;Jane Doe 1&rdquo;)</li>
                <li>Minor identifying information of any kind</li>
                <li>Explicit descriptions of abuse</li>
                <li>Raw document text beyond location-relevant excerpts</li>
                <li>Victim addresses or personal contact information</li>
                <li>Photos of any individual</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">Lawful Basis (GDPR)</h2>
              <p>
                We process personal data under Article 6(1)(f) of the GDPR — legitimate interests.
                Specifically, the legitimate interests of investigative journalism and public
                accountability. We also rely on the journalism exemption under GDPR Article 85.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">User Data</h2>
              <p>
                We do not collect user personal data. There are no user accounts, no login
                requirements, and no tracking cookies. We do not use analytics that collect
                personally identifiable information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">Data Subject Requests</h2>
              <p>
                If you believe your personal data is displayed on this site and you wish to
                exercise your rights under GDPR or other privacy legislation, please contact
                us at: privacy@atlas-engine.dev
              </p>
              <p>
                Each request will be assessed on a case-by-case basis, balancing your privacy
                rights against the public interest in accountability and transparency.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">Error Corrections</h2>
              <p>
                If you believe any information displayed is inaccurate, please contact us at
                corrections@atlas-engine.dev with the specific entry and supporting documentation.
                We are committed to correcting errors within 7 business days.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Disclaimer />
    </div>
  );
}
