export default function About() {
    return (
        <article className="prose leading-tight my-8">
            <h1 className="text-4xl mt-8 font-medium md:mt-16">About the Health & AI Policy Index</h1>
            <p>
                The Health & AI Policy Index (HAPI) is a curated, research-oriented registry of policies relevant to artificial intelligence in healthcare. It is designed to help clinicians, health systems, payers, developers, and policymakers track meaningful developments across U.S. states, federal agencies, sector regulations, international frameworks, and voluntary standards.
            </p>
            <h2>Purpose & scope</h2>
            <ul>
                <li>Audience: clinicians, health system leaders, compliance/legal teams, developers, payers, and policymakers.</li>
                <li>Focus: policies that materially affect the development, evaluation, deployment, or oversight of AI in healthcare.</li>
                <li>Geographies: United States (state and federal), plus selected international frameworks with health relevance.</li>
            </ul>
            <h2>Inclusion criteria</h2>
            <p>An item is included when it meets at least one of the following:</p>
            <ul>
                <li>Directly regulates AI (e.g., safety, risk management, transparency, data governance, bias/equity).</li>
                <li>Indirectly constrains or enables AI in clinical or administrative settings (e.g., HIPAA/OCR guidance, CMS coverage/coding, liability/credentialing).</li>
                <li>Establishes widely referenced standards or guidance used by health organizations and vendors.</li>
            </ul>
            <h2>Data sources & curation</h2>
            <ul>
                <li>Primary sources: official statutes, bills, regulations, agency guidance, standards bodies, and public registers.</li>
                <li>Secondary validation: reputable summaries (e.g., law firm memos, industry associations) to corroborate status/interpretation.</li>
                <li>Curation: items are selected for clarity, materiality, and health relevance; marginal items may be excluded for signal-to-noise.</li>
            </ul>
            <h2>Fields & tags</h2>
            <p>Each entry includes a concise summary, healthcare implications, dates, jurisdiction, and links to source text. Two tag families enable quick filtering:</p>
            <ul>
                <li>Keyword Tags: Safety & Risk; Privacy & Data; Transparency & Governance; Clinical Quality & Efficacy; Equity & Bias.</li>
                <li>Stakeholder Tags: Providers & Health Systems; Patients & Public; Payers & Purchasers; Developers & Vendors; Regulators & Government.</li>
            </ul>
            <h2>Status & updates</h2>
            <ul>
                <li>Status: where available, items indicate proposal/adoption/effective phases or analogous lifecycle markers.</li>
                <li>Updates: the database is periodically refreshed; “Last Updated” reflects the most recent editorial review of a specific entry.</li>
            </ul>
            <h2>Limitations</h2>
            <ul>
                <li>Summaries are for awareness and do not constitute legal advice.</li>
                <li>Coverage is selective; the index prioritizes clarity and practical relevance over exhaustiveness.</li>
            </ul>
            <h2>How to cite</h2>
            <p>
                Please cite as: <i>Health & AI Policy Index (HAPI)</i>, Department for AI and Human Health, Mount Sinai. Include the item permalink and “Last Updated” date.
            </p>
            <h2>Contact</h2>
            <p>
                Questions, corrections, or suggested additions? Contact the Department for AI and Human Health at Mount Sinai.
            </p>
        </article>
    )
}