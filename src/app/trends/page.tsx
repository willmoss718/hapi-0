import { loadAllTrends } from "@/lib/trends";
import TrendsChart from "@/components/trends-chart";

export default async function TrendsPage() {
  const data = await loadAllTrends();
  return (
    <div className="mt-8 md:mt-16">
      <h1 className="text-4xl font-medium">Trends</h1>
      <h2 className="text-xl mt-4">Visualize policies over time by module, tags, and issuing body.</h2>
      <div className="mt-8">
        <TrendsChart data={data} />
      </div>
    </div>
  );
}


