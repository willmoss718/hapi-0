export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <article className="prose prose-lg leading-tight my-8">
        <h1 className="text-4xl mt-8 font-medium md:mt-16">
          About the Health & AI Policy Index
        </h1>

        <p>
          The Health & AI Policy Index (HAPI) is a curated, research-oriented
          registry of policies relevant to artificial intelligence in
          healthcare. It is designed to help clinicians, health systems, payers,
          developers, and policymakers track meaningful developments across
          U.S. states, federal agencies, sector regulations, international
          frameworks, and voluntary standards.
        </p>

        <h2>Purpose & scope</h2>
        <ul>
          <li>
            <strong>Audience:</strong> clinicians, health system leaders,
            compliance/legal teams, developers, payers, lobbyists, and
            policymakers.
          </li>
          <li>
            <strong>Focus:</strong> policies that materially affect the
            development, evaluation, deployment, or oversight of AI in
            healthcare.
          </li>
          <li>
            <strong>Geographies:</strong> United States (state and federal), plus
            selected international frameworks with health relevance.
          </li>
        </ul>

        <h2>Inclusion criteria</h2>
        <p>
          An item is included when it meets at least one of the following:
        </p>
        <ul>
          <li>
            Directly regulates AI (e.g., safety, risk management, transparency,
            data governance, bias/equity).
          </li>
          <li>
            Indirectly constrains or enables AI in clinical or administrative
            settings (e.g., HIPAA/OCR guidance, CMS coverage/coding,
            liability/credentialing).
          </li>
          <li>
            Establishes widely referenced standards or guidance used by health
            organizations and vendors.
          </li>
        </ul>

        <h2>Data sources & curation</h2>
        <ul>
          <li>
            <strong>Primary sources:</strong> official statutes, bills,
            regulations, agency guidance, standards bodies, and public
            registers.
          </li>
          <li>
            <strong>Secondary validation:</strong> reputable summaries (e.g., law
            firm memos, industry associations) to corroborate
            status/interpretation.
          </li>
          <li>
            <strong>Curation:</strong> items are selected for clarity,
            materiality, and health relevance; marginal items may be excluded
            for signal-to-noise.
          </li>
        </ul>

        <h2>Fields & tags</h2>
        <p>
          Each entry includes a concise summary, healthcare implications, dates,
          jurisdiction, and link to the source text. Three tag families enable
          quick filtering:
        </p>
        <ul>
          <li>
            <strong>Keyword Tags:</strong> Safety & Risk; Privacy & Data;
            Transparency & Governance; Clinical Quality & Efficacy; Equity &
            Bias.
          </li>
          <li>
            <strong>Stakeholder Tags:</strong> Providers & Health Systems;
            Patients & Public; Payers & Purchasers; Developers & Vendors;
            Regulators & Government.
          </li>
          <li>
            <strong>Impact:</strong> High; Medium; Low.
          </li>
        </ul>

        <h2>Status & updates</h2>
        <ul>
          <li>
            <strong>Status:</strong> where available, items indicate
            proposal/adoption/effective phases or analogous lifecycle markers.
          </li>
          <li>
            <strong>Updates:</strong> the database is refreshed on a weekly
            basis.
          </li>
        </ul>
      </article>
    </div>
  );
}
