export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      <h1 className="text-4xl md:text-5xl font-medium mb-6">
        About the Health & AI Policy Index
      </h1>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Authorship</h2>
      <p className="text-lg mb-6">
        Will Moss leads HAPI as a public policy professional focused on AI governance in healthcare. His background includes government affairs experience at the state and federal levels, with a focus on AI health policy. Through HAPI, Will aims to make healthcare AI governance more accessible while supporting safer, more responsible policy development. He is interested in growing the project and collaborating with others working in this space.
      </p>

      <p className=" text-lg mb-6">
        For questions, feedback, or collaboration inquiries related to AI policy in healthcare, contact:{" "}
        <a href="mailto:william.moss@mssm.edu" className="underline">
          william.moss@mssm.edu
        </a>
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">About HAPI</h2>
      <p className="text-lg mb-6">
        The Health & AI Policy Index (HAPI) is a curated, research-oriented registry of policies relevant to artificial intelligence in healthcare. It is designed to help clinicians, health systems, payers, developers, and policymakers track meaningful developments across U.S. states, federal agencies, sector regulations, international frameworks, and voluntary standards.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Purpose & scope</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Audience: clinicians, health system leaders, compliance/legal teams, developers, payers, lobbyists, and policymakers.</li>
        <li>Focus: policies that materially affect the development, evaluation, deployment, or oversight of AI in healthcare.</li>
        <li>Geographies: United States (state and federal), plus selected international frameworks with health relevance.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Inclusion criteria</h2>
      <p className="mb-4">
        An item is included when it satisfies both of the following criteria:
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li>AI relevance (such as explicit regulation of artificial intelligence or machine-learning systems).</li>
        <li>Health relevance (including effects on health care delivery, public health operations, or health-related data, safety, or equity).</li>
      </ul>
      <p className="mb-6">
        Policies are excluded when AI is mentioned only in passing, duplicates an existing entry, or is expected to have an insignificant impact on health care.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Data sources & curation</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Primary sources: official statutes, bills, regulations, agency guidance, standards bodies, and public registers.</li>
        <li>Secondary validation: reputable summaries (e.g., law firm memos, industry associations) to corroborate status/interpretation.</li>
        <li>Curation: items are selected for clarity, materiality, and health relevance; marginal items may be excluded for signal-to-noise.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Fields & tags</h2>
      <p className="mb-4">
        Each entry includes a concise summary, healthcare implications, dates, jurisdiction, and links to source text. Three tag families enable quick filtering:
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li>Keyword Tags: Safety & Risk; Privacy & Data; Transparency & Governance; Clinical Quality & Efficacy; Equity & Bias.</li>
        <li>Stakeholder Tags: Providers & Health Systems; Patients & Public; Payers & Purchasers; Developers & Vendors; Regulators & Government.</li>
        <li>
          Impact: High; Medium; Low.
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>High Impact: directly governs, authorizes, or constrains AI in healthcare.</li>
            <li>Medium Impact: materially influences practice but indirectly.</li>
            <li>Low Impact: exploratory or advisory actions.</li>
          </ul>
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">State Policy (No Law)</h2>
      <p className="mb-6">
        This category includes formal state actions related to AI in healthcare such as resolutions, executive orders, or commissions. While these actions do not always create statutory law, they reflect policy intent and can shape future regulation.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Status & updates</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Status: where available, items indicate proposal, adoption, or effective phases.</li>
        <li>Updates: the database is refreshed weekly.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Limitations</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Summaries are for awareness and do not constitute legal advice.</li>
        <li>Coverage is selective and prioritizes clarity over exhaustiveness.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">How to cite</h2>
      <p className="mb-6">
        Please cite as: <em>Health & AI Policy Index (HAPI)</em>. Include the item permalink and “Last Updated” date.
      </p>

    </div>
  );
}