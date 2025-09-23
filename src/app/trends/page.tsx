import { loadAllTrends } from "@/lib/trends";
import TrendsChart from "@/components/trends-chart";
import { FILES } from "@/assets/files";
import { getCsvData } from "@/lib/server-utils";
import neatCsv from "neat-csv";

export default async function TrendsPage() {
  const data = await loadAllTrends();

  const allCsvFiles = await Promise.all(FILES.map((file) => getCsvData(file.path))).then((files) => files.filter((file) => file != null));
  const allCsvData = await Promise.all(allCsvFiles.map((csv) => neatCsv(csv))).then((data) => data.flat());
  const allKeywordTags = Array.from(new Set(allCsvData.map((row) => row["Keyword Tags"]).flat().filter((tag) => tag != null)));
  const allStakeholderTags = Array.from(new Set(allCsvData.map((row) => row["Stakeholder Tags"]).flat().filter((tag) => tag != null)));
  const allImpactTags = Array.from(new Set(allCsvData.map((row) => row["Impact Level"]).flat().filter((tag) => tag != null)));

  return (
    <div className="mt-8 md:mt-16">
      <h1 className="text-4xl font-medium">Trends</h1>
      <h2 className="text-xl mt-4">
        Visualize policies over time by module, tags, and issuing body.
      </h2>
      <div className="my-8">
        <TrendsChart data={data} tagData={{ keyword: allKeywordTags, stakeholder: allStakeholderTags, impact: allImpactTags }} />
      </div>
    </div>
  );
}
