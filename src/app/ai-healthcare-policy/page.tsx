import Link from "next/link";

export default function AIHealthcarePolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl md:text-5xl font-medium mb-6">
        AI in Healthcare Policy: Laws, Regulations, and Standards
      </h1>

      <div className="space-y-5 text-base md:text-lg leading-8 text-slate-800">
        <p>
          Artificial intelligence is quickly becoming part of healthcare. It is being used in clinical decision support, imaging, documentation, operations, patient communication, research, and other areas of care delivery. As these tools become more common, policymakers, regulators, professional bodies, and health systems are trying to define how they should be developed, evaluated, monitored, and used.
        </p>

        <p>
          AI in healthcare policy does not refer to one law or one regulatory framework. It is better understood as a growing collection of state laws, federal actions, agency guidance, sector-specific rules, international frameworks, and voluntary standards. These policies often address related concerns, including safety, transparency, privacy, fairness, accountability, documentation, and oversight.
        </p>

        <p>
          This landscape is fragmented. In the United States, there is no single health AI regulator and no single national law governing all uses of AI in healthcare. Instead, oversight is emerging across many institutions at once. State legislatures may pass laws affecting health plans or clinical settings. Federal agencies may issue guidance for specific sectors. Standards organizations may publish voluntary frameworks. Health systems and developers then have to interpret these signals together when deciding how AI tools should be deployed.
        </p>

        <p>
          Much of the current policy activity does not directly say which AI tools may or may not be used in clinical care. Instead, many policies focus on the conditions around use. They may require disclosure, documentation, risk management, human oversight, governance processes, or performance monitoring. In practice, this means that healthcare AI policy often shapes the organizational systems around AI before it shapes the clinical use of a specific tool.
        </p>

        <p>
          This matters for health systems because AI adoption is becoming not only a technical decision, but also a governance and compliance decision. Hospitals and other healthcare organizations may need to know which policies apply to their state, which agencies are active in their area, what standards are becoming influential, and what expectations are emerging around oversight and accountability.
        </p>

        <p>
          It also matters for developers and vendors. As AI tools move into real-world healthcare settings, developers are increasingly expected to document how systems work, monitor performance, address safety and bias concerns, and align with evolving regulatory and professional expectations. Even when policies are not legally binding, they can still influence procurement decisions, institutional governance, and expectations for responsible deployment.
        </p>

        <p>
          The Health & AI Policy Index (HAPI) was created to make this landscape easier to navigate. HAPI organizes healthcare AI policies across states, federal agencies, sector-specific regulators, international bodies, and standards organizations. Each policy is structured with consistent metadata, including dates, issuing bodies, impact levels, keyword tags, stakeholder tags, summaries, healthcare implications, and links to source text.
        </p>

        <p>
          The goal is not to replace legal advice or detailed regulatory interpretation. Rather, HAPI is meant to provide a clearer starting point for understanding how healthcare AI governance is developing, where activity is concentrated, and which policies may be most relevant to health systems, developers, researchers, policymakers, and the public.
        </p>
      </div>

      <section className="mt-10 border-t border-slate-200 pt-6">
        <h2 className="text-2xl font-medium mb-4">Explore the index</h2>
        <p className="text-slate-700 leading-7 mb-4">
          Use the HAPI modules to explore healthcare AI policies by jurisdiction, policy type, issuing body, impact level, keyword theme, and stakeholder group.
        </p>

        <div className="grid gap-2 text-slate-800">
          <Link href="/data/state-policies" className="underline underline-offset-4">
            State Policies
          </Link>
          <Link href="/data/federal-policies" className="underline underline-offset-4">
            Federal Policies
          </Link>
          <Link href="/data/sector-specific-regulations" className="underline underline-offset-4">
            Sector-Specific Regulations
          </Link>
          <Link href="/data/international-frameworks" className="underline underline-offset-4">
            International Frameworks
          </Link>
          <Link href="/data/voluntary-standards" className="underline underline-offset-4">
            Voluntary Standards
          </Link>
        </div>
      </section>
    </main>
  );
}