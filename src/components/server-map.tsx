import neatCsv from "neat-csv";
import Map from "./map";
import { getCsvData } from "@/lib/server-utils";

export default async function ServerMap() {
    const statePolicyCounts = await getStatePolicyCounts();

    return <Map statePolicyCounts={statePolicyCounts} />;
}

async function getParsedCsvData(csvPath: string) {
    const csvStr = await getCsvData(csvPath);
    if (!csvStr) return null;
    return await neatCsv(csvStr);
}

async function getStatePolicyCounts() {
    const statePolicies = await getParsedCsvData('state-policies');
    if (!statePolicies) return {};

    const counts: Record<string, number> = {};
    for (const row of statePolicies) {
        const state = row.State?.trim();
        if (state) {
            counts[state] = (counts[state] || 0) + 1;
        }
    }
    return counts;
}