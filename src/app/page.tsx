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

      <div className="flex flex-col md:flex-row gap-6 md:gap-8 pr-8 my-8">
        
        {/* LEFT: MAP */}
        <div id="map" className="w-full h-full">
          <ServerMap />

          {/* Subtle authorship line */}
          <p className="text-sm text-muted-foreground mt-3">
            Created and maintained by{" "}
            <Link href="/about" className="hover:underline">
              Will Moss
            </Link>{" "}
            · Mount Sinai
          </p>
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