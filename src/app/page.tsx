import ServerMap from "@/components/server-map";
import WhatsNew from "@/components/whats-new";

export default async function Home() {
  return (
    <>
      <h1 className="text-4xl mt-8 md:text-6xl font-medium md:mt-16">About This Index</h1>
      <h2 className="text-lg mt-4 text-balance max-w-4xl">Health & AI Policy Index (HAPI) is a living, nonpartisan tracker for policies shaping AI in healthcare.</h2>
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 pr-8 mt-8">
        <div id="map" className="w-full h-full">
          <ServerMap />
        </div>
        <div id="about" className="w-full md:w-96 h-full flex flex-row gap-4 flex-wrap">
          <WhatsNew />
        </div>
      </div>
    </>
  );
}
