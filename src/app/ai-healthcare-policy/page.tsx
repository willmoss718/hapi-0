import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

type ExploreLink = {
  name: string;
  path: string;
};

const exploreSections: Array<{ label: string; links: ExploreLink[] }> = [
  {
    label: "Policy Modules",
    links: [
      { name: "State Policies", path: "/data/state-policies" },
      { name: "Federal Policies", path: "/data/federal-policies" },
      { name: "Sector-Specific Regulations", path: "/data/sector-specific-regulations" },
      { name: "International Frameworks", path: "/data/international-frameworks" },
      { name: "Voluntary Standards", path: "/data/voluntary-standards" },
    ],
  },
  {
    label: "Operational Layer",
    links: [
      { name: "Operational Implications", path: "/operational-implications" },
    ],
  },
  {
    label: "Analysis",
    links: [
      { name: "AI Policy Overview", path: "/ai-healthcare-policy" },
      { name: "Trends", path: "/trends" },
      { name: "Insights", path: "/insights" },
    ],
  },
];

const aboutLink = { name: "About/Methodology", path: "/about" };

export default function AIHealthcarePolicyPage() {
  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[minmax(0,42rem)_22rem] lg:items-start lg:gap-14">
      <article>
        <h1 className="mb-6 text-4xl font-medium md:text-5xl">
          AI in Healthcare Policy: Laws, Regulations, and Standards
        </h1>

        <div className="space-y-5 text-base leading-8 text-slate-800 md:text-lg">
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
      </article>

      <aside className="w-full lg:sticky lg:top-6">
        <section className="w-full overflow-hidden rounded-lg border border-gray-200">
          <div className="px-6 py-5">
            <h2 className="text-2xl font-medium">Explore the Index</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Use the HAPI modules to explore healthcare AI policies by jurisdiction, policy type, issuing body, impact level, keyword theme, and stakeholder group.
            </p>
          </div>
          {exploreSections.map((section) => (
            <div key={section.label} className="border-t border-gray-100">
              <div className="px-6 pb-1.5 pt-3 text-[11px] font-medium uppercase tracking-wide text-gray-500">
                {section.label}
              </div>
              {section.links.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="group flex min-h-11 items-center justify-between px-6 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
                >
                  <span className="text-black">{item.name}</span>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gray-800" />
                </Link>
              ))}
            </div>
          ))}
          <Link
            href={aboutLink.path}
            className="group flex min-h-11 items-center justify-between border-t border-gray-100 px-6 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
          >
            <span className="text-black">{aboutLink.name}</span>
            <ArrowRightIcon className="h-4 w-4 text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gray-800" />
          </Link>
        </section>
      </aside>
    </main>
  );
}
