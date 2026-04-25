import ServerMap from "@/components/server-map";
import WhatsNew from "@/components/whats-new";

export default async function Home() {
  return (
    <>
      <h1 className="text-4xl mt-8 md:text-6xl font-medium md:mt-16">
        AI in Healthcare Policy: Laws, Regulations, and Standards (HAPI)
      </h1>
      <h2 className="text-lg mt-4 text-balance max-w-4xl">
        The Health & AI Policy Index (HAPI) tracks laws, regulations, and standards shaping artificial intelligence in healthcare across U.S. states, federal agencies, and global frameworks. Explore policies, trends, and real-world implications for health systems, developers, and policymakers.
      </h2>
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 pr-8 my-8">
        <div id="map" className="w-full h-full">
          <ServerMap />
        </div>
        <div
          id="about"
          className="w-full md:w-96 h-full flex flex-row gap-4 flex-wrap"
        >
          <WhatsNew />
        </div>
      </div>
    </>
  );
}
