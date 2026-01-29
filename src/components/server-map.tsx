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
  const statePolicies = await getParsedCsvData("state-policies");
  if (!statePolicies) return {};

  // Map full state names -> USPS abbreviations
  const STATE_ABBR: Record<string, string> = {
    Alabama: "AL",
    Alaska: "AK",
    Arizona: "AZ",
    Arkansas: "AR",
    California: "CA",
    Colorado: "CO",
    Connecticut: "CT",
    Delaware: "DE",
    Florida: "FL",
    Georgia: "GA",
    Hawaii: "HI",
    Idaho: "ID",
    Illinois: "IL",
    Indiana: "IN",
    Iowa: "IA",
    Kansas: "KS",
    Kentucky: "KY",
    Louisiana: "LA",
    Maine: "ME",
    Maryland: "MD",
    Massachusetts: "MA",
    Michigan: "MI",
    Minnesota: "MN",
    Mississippi: "MS",
    Missouri: "MO",
    Montana: "MT",
    Nebraska: "NE",
    Nevada: "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    Ohio: "OH",
    Oklahoma: "OK",
    Oregon: "OR",
    Pennsylvania: "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    Tennessee: "TN",
    Texas: "TX",
    Utah: "UT",
    Vermont: "VT",
    Virginia: "VA",
    Washington: "WA",
    "West Virginia": "WV",
    Wisconsin: "WI",
    Wyoming: "WY",
  };

  const counts: Record<string, number> = {};

  for (const row of statePolicies as any[]) {
    // Be forgiving about the header spelling
    const rawState =
      (row.State ||
        row.state ||
        row["State "] ||
        row["state "] ||
        "").trim();

    if (!rawState) continue;

    // Convert full name -> abbr if needed; if it's already "UT", "CA", etc.,
    // this keeps it as-is.
    const abbr = STATE_ABBR[rawState] || rawState.toUpperCase();

    counts[abbr] = (counts[abbr] || 0) + 1;
  }

  return counts;
}
