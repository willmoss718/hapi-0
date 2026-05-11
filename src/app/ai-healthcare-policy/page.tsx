export default function AIHealthcarePolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl md:text-5xl font-medium mb-6">
        AI Policy Overview
      </h1>

      <div className="space-y-5 text-base md:text-lg leading-8 text-slate-800">
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
        <h2 className="text-2xl font-medium mb-4">Explore HAPI</h2>
        <p className="text-slate-700 leading-7 mb-4">
          The index is organized into five main policy modules:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-slate-800">
          <li><a href="/data/state-policies" className="underline underline-offset-4">State Policies</a></li>
          <li><a href="/data/federal-policies" className="underline underline-offset-4">Federal Policies</a></li>
          <li><a href="/data/sector-specific-regulations" className="underline underline-offset-4">Sector-Specific Regulations</a></li>
          <li><a href="/data/international-frameworks" className="underline underline-offset-4">International Frameworks</a></li>
          <li><a href="/data/voluntary-standards" className="underline underline-offset-4">Voluntary Standards</a></li>
        </ul>
      </section>
    </main>
  );
}