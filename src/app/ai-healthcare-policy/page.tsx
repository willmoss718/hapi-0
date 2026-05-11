import Link from "next/link";

export default function AIHealthcarePolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-4xl font-medium md:text-5xl">
        AI Policy Overview
      </h1>

      <div className="space-y-5 text-base leading-8 text-slate-800 md:text-lg">
        <p>
          AI policy in healthcare is hard to follow because it does not come from one place.
          Some policies come from state governments. Others come from federal agencies,
          international bodies, professional organizations, or standards groups. Some are binding
          laws or regulations, while others are guidance documents, frameworks, or voluntary standards.
        </p>

        <p>
          Together, these policies shape how AI tools are developed, evaluated, deployed, and monitored
          in healthcare. They may affect clinical decision support, administrative automation, patient-facing
          tools, medical devices, health data, insurance decisions, or research.
        </p>

        <p>
          A major challenge is that the rules are fragmented. There is no single U.S. law that governs all
          uses of AI in healthcare, and there is no single regulator responsible for the entire field. Instead,
          health systems and developers often have to piece together expectations from many different sources.
        </p>

        <p>
          Many policies do not directly say whether a specific AI tool can or cannot be used. More often,
          they focus on the process around AI use: disclosure, documentation, risk management, human oversight,
          fairness, privacy, and governance. In practice, this means AI policy often shapes the systems and
          safeguards around a tool before it directly shapes the tool itself.
        </p>

        <p>
          HAPI was created to make this easier to navigate. The index brings healthcare AI policies into one
          place and organizes them by jurisdiction, issuing body, policy type, impact level, keyword theme,
          and stakeholder group. Each entry links back to source text where available.
        </p>

        <p>
          This resource is meant to be a starting point. It can help users see what exists, compare activity
          across jurisdictions, and identify policies that may be relevant to a particular health system,
          developer, policymaker, researcher, or member of the public.
        </p>
      </div>

      <section className="mt-10 border-t border-slate-200 pt-6">
        <h2 className="mb-4 text-2xl font-medium">Explore HAPI</h2>
        <p className="mb-4 leading-7 text-slate-700">
          The index is organized into five main policy modules:
        </p>

        <ul className="list-disc space-y-2 pl-6 text-slate-800">
          <li>
            <Link href="/data/state-policies" className="underline underline-offset-4">
              State Policies
            </Link>
          </li>
          <li>
            <Link href="/data/federal-policies" className="underline underline-offset-4">
              Federal Policies
            </Link>
          </li>
          <li>
            <Link href="/data/sector-specific-regulations" className="underline underline-offset-4">
              Sector-Specific Regulations
            </Link>
          </li>
          <li>
            <Link href="/data/international-frameworks" className="underline underline-offset-4">
              International Frameworks
            </Link>
          </li>
          <li>
            <Link href="/data/voluntary-standards" className="underline underline-offset-4">
              Voluntary Standards
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
