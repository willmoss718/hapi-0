import Link from "next/link";
import ServerMap from "@/components/server-map";
import WhatsNew from "@/components/whats-new";
import InsightsCarousel from "@/components/insights-carousel";

export default async function Home() {
  return (
    <>
      <h1 className="text-4xl mt-6 md:text-5xl font-medium md:mt-10">
        AI in Healthcare Policy: Laws, Regulations, and Standards
      </h1>

      <h2 className="text-lg mt-4 text-balance w-full">
        The Health & AI Policy Index (HAPI) is a curated, research-driven registry of laws, regulations, and standards shaping artificial intelligence in healthcare, with a focus on real-world implications for health systems, developers, and policymakers.
      </h2>

      <p className="text-sm mt-3 text-gray-600">
        Testing preview: <Link href="/proxy/state-hover-preview" className="underline">state hover panel proxy</Link>
      </p>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8 pr-8 my-8">
        
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

          {/* INSIGHTS */}
          <div className="w-full">
            <InsightsCarousel />
          </div>
        </div>

      </div>
    </>
  );
}
