import { loadAllTrends } from "@/lib/trends";
import TrendsChart from "@/components/trends-chart";

const IMPACT_LEVELS = ["Low", "Medium", "High"];

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

export default async function TrendsPage() {
  const data = await loadAllTrends();

  const allKeywordTags = uniqueSorted(data.flatMap((record) => record.tags.keyword));
  const allStakeholderTags = uniqueSorted(data.flatMap((record) => record.tags.stakeholder));

  return (
    <div className="mt-6 md:mt-8">
      <h1 className="text-4xl font-medium">Trends</h1>
      <h2 className="mt-2.5 text-lg leading-7">
        Visualize policies over time by module, tags, and issuing body.
      </h2>
      <div className="my-8">
        <TrendsChart
          data={data}
          tagData={{
            keyword: allKeywordTags,
            stakeholder: allStakeholderTags,
            impact: IMPACT_LEVELS,
          }}
        />
      </div>
    </div>
  );
}
