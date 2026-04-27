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
        The Health & AI Policy Index (HAPI) tracks laws, regulations, and standards shaping artificial intelligence in healthcare across U.S. states, federal agencies, and global frameworks. Explore policies, trends, and real-world implications for health systems, developers, and policymakers.
      </h2>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8 pr-8 my-8">
        
        {/* LEFT: MAP */}
        <div id="map" className="w-full h-full">
          <ServerMap />
        </div>

        {/* RIGHT PANEL */}
        <div
          id="about"
          className="w-full md:w-96 h-full flex flex-col gap-4"
        >
          <WhatsNew />

          {/* INSIGHTS (separate, clean placement) */}
          <div className="w-full">
            <InsightsCarousel />
          </div>
        </div>

      </div>
    </>
  );
}