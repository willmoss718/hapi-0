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
        <h1 className="text-4xl mt-4 md:text-5xl font-medium md:mt-7">
          AI in Healthcare Policy: Laws, Regulations, and Standards
        </h1>

        <h2 className="text-lg mt-4 text-balance w-full">
          The Health & AI Policy Index (HAPI) is a curated, research-driven registry of laws, regulations, and standards shaping artificial intelligence in healthcare, with a focus on real-world implications for health systems, developers, and policymakers.
        </h2>

        <div className="mt-4 flex flex-wrap items-center gap-x-9 gap-y-2 text-base font-semibold text-gray-900 md:absolute md:left-0 md:bottom-[-2rem] md:mt-0 lg:flex-nowrap lg:gap-x-12">
          <span>Updated {homepagePolicyData.lastUpdated}</span>
          <span>{policyCount.toLocaleString()} policies tracked</span>
          <a
            href="https://doi.org/10.1038/s41746-026-02734-y"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 hover:underline"
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
