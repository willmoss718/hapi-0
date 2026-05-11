import whatsNew from "@/assets/Whats-New.json";
import HomeMapSection from "@/components/home-map-section";
import {
  getStatePolicyIntelligence,
  getTotalCsvPolicyCount,
} from "@/lib/state-policy-intelligence";

export default async function Home() {
  const [stateIntelligence, policyCount] = await Promise.all([
    getStatePolicyIntelligence(),
    getTotalCsvPolicyCount(),
  ]);

  return (
    <>
      <div className="relative">
        <h1 className="text-4xl mt-6 md:text-5xl font-medium md:mt-10">
          AI in Healthcare Policy: Laws, Regulations, and Standards
        </h1>

        <h2 className="text-lg mt-4 text-balance w-full">
          The Health & AI Policy Index (HAPI) is a curated, research-driven registry of laws, regulations, and standards shaping artificial intelligence in healthcare, with a focus on real-world implications for health systems, developers, and policymakers.
        </h2>

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-gray-500 md:absolute md:left-0 md:bottom-[-2rem] md:mt-0">
          <span>Last updated {whatsNew.lastUpdated}</span>
          <span aria-hidden="true">·</span>
          <span>{policyCount.toLocaleString()} policies tracked</span>
        </div>
      </div>

      <HomeMapSection stateIntelligence={stateIntelligence} />
    </>
  );
}
