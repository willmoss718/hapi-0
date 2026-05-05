import neatCsv from "neat-csv";
import { getCsvData } from "@/lib/server-utils";
import StateHoverProxy from "@/components/state-hover-proxy";

type CsvRow = Record<string, string>;

export default async function StateHoverPreviewPage() {
  const csvStr = await getCsvData("state-policies");
  const rows = csvStr ? ((await neatCsv(csvStr)) as CsvRow[]) : [];

  const stateStats = getStateStats(rows);

  return (
    <>
      <h1 className="text-3xl mt-6 md:text-4xl font-medium md:mt-10">State Hover Tooltip Proxy Preview</h1>
      <p className="text-lg mt-4">Prototype-only page for testing hover content before production integration.</p>
      <StateHoverProxy stateStats={stateStats} />
    </>
  );
}

function getStateStats(rows: CsvRow[]) {
  const stats: Record<string, { policyCount: number; highImpactCount: number; lastUpdatedYear: string | null }> = {};

  for (const row of rows) {
    const abbr = normalizeState((row["State"] || "").trim());
    if (!abbr) continue;

    if (!stats[abbr]) {
      stats[abbr] = { policyCount: 0, highImpactCount: 0, lastUpdatedYear: null };
    }

    stats[abbr].policyCount += 1;

    // High-impact is inferred from Impact Level when explicit boolean flags are not present.
    if ((row["Impact Level"] || "").trim().toLowerCase() === "high") {
      stats[abbr].highImpactCount += 1;
    }

    // Last updated is based on the most recent policy date available for each state.
    const policyDate = parseDate(row["Date Passed"] || "") || parseDate(row["Effective Date"] || "");
    if (policyDate) {
      const current = stats[abbr].lastUpdatedYear ? Number(stats[abbr].lastUpdatedYear) : null;
      if (!current || policyDate.getUTCFullYear() > current) {
        stats[abbr].lastUpdatedYear = String(policyDate.getUTCFullYear());
      }
    }
  }

  return stats;
}

function parseDate(value: string): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeState(raw: string): string | null {
  if (/^[A-Z]{2}$/.test(raw)) return raw;
  return STATE_ABBR[raw] ?? null;
}

const STATE_ABBR: Record<string, string> = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA", Colorado: "CO",
  Connecticut: "CT", Delaware: "DE", Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID",
  Illinois: "IL", Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY", Louisiana: "LA", Maine: "ME",
  Maryland: "MD", Massachusetts: "MA", Michigan: "MI", Minnesota: "MN", Mississippi: "MS", Missouri: "MO",
  Montana: "MT", Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM",
  "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK", Oregon: "OR",
  Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", Tennessee: "TN",
  Texas: "TX", Utah: "UT", Vermont: "VT", Virginia: "VA", Washington: "WA", "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY",
};
