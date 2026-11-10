import HomeMapSection from "@/components/home-map-section";
import { getHomepagePolicyData } from "@/lib/homepage-policies";
import {
  getStatePolicyIntelligence,
  getTotalCsvPolicyCount,
} from "@/lib/state-policy-intelligence";

export default async function Home() {
  const [stateIntelligence, policyCount, homepagePolicyData] = await Promise.all([
    getStatePolicyIntelligence(),
    getTotalCsvPolicyCount(),
    getHomepagePolicyData({ limit: 5 }),
  ]);

  return (
    <>
      <div className="relative">
        <h1 className="font-editorial mt-5 text-4xl font-semibold leading-tight tracking-[-0.025em] md:mt-7">
          AI in Healthcare Policy: Laws, Regulations, and Standards
        </h1>

        <h2 className="mt-4 w-full text-balance text-lg leading-7 text-foreground/80">
          The Health & AI Policy Index (HAPI) is a curated, research-driven registry of laws, regulations, and standards shaping artificial intelligence in healthcare, with a focus on real-world implications for health systems, developers, and policymakers.
        </h2>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-muted-foreground md:absolute md:bottom-[-2rem] md:left-0 md:mt-0">
          <span>Last updated {homepagePolicyData.lastUpdated}</span>
          <span aria-hidden="true" className="text-border">
            ·
          </span>
          <span>{policyCount.toLocaleString()} policies tracked</span>
          <span aria-hidden="true" className="text-border">
            ·
          </span>
          <a
            href="https://doi.org/10.1038/s41746-026-02734-y"
            target="_blank"
            rel="noopener noreferrer"
            className="featured-publication-link underline decoration-primary/30 hover:decoration-primary"
          >
            Featured in <em>npj Digital Medicine</em> ↗
          </a>
        </div>
      </div>

      <HomeMapSection
        stateIntelligence={stateIntelligence}
        whatsNewUpdates={homepagePolicyData.updates}
      />
    </>
  );
}
