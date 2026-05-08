import Link from "next/link";
import whatsNew from "@/assets/Whats-New.json";
import ServerMap from "@/components/server-map";
import WhatsNew from "@/components/whats-new";

export default async function Home() {
  const policyCount = 270;

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

      <div className="flex flex-col md:flex-row gap-6 md:gap-8 pr-8 mt-8 mb-8">
        
        {/* LEFT: MAP */}
        <div id="map" className="w-full h-full">
          <ServerMap />

          {/* Strengthened but still controlled authorship line */}
          <Link href="/about" className="block mt-3">
            <p className="text-base text-gray-600 font-medium hover:underline">
              Created and maintained by Will Moss · Windreich Dept. of Artificial Intelligence and Human Health, Mount Sinai
            </p>
          </Link>
        </div>

        {/* RIGHT PANEL */}
        <div
          id="about"
          className="w-full md:w-96 h-full flex flex-col gap-4"
        >
          <WhatsNew />
        </div>

      </div>
    </>
  );
}
