// src/components/server-map.tsx

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
  return (await neatCsv(csvStr)) as any[];
}

async function getStatePolicyCounts() {
  const rows = await getParsedCsvData("state-policies");
  if (!rows || rows.length === 0) {
    return {};
  }

  const counts: Record<string, number> = {};

  // Try to detect which column is the "state" column based on common names
  const firstRow = rows[0] as Record<string, string>;
  const candidateKeys = [
    "State",
    "state",
    "Jurisdiction",
    "jurisdiction",
    "State ",
    "state ",
    "State / Territory",
    "State/ Territory",
  ];

  let stateKey: string | undefined = candidateKeys.find((k) => k in firstRow);

  // Fallback: if none of the above, just use the first column
  if (!stateKey) {
    const keys = Object.keys(firstRow);
    stateKey = keys.length > 0 ? keys[0] : undefined;
  }

  if (!stateKey) {
    // Nothing we can do if there are literally no columns
    return {};
  }

  for (const row of rows as any[]) {
    const raw = (row[stateKey] || "").trim();
    if (!raw) continue;

    const abbr = normalizeState(raw);
    if (!abbr) continue;

    counts[abbr] = (counts[abbr] || 0) + 1;
  }

  return counts;
}

// --- helpers ---

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

function normalizeState(raw: string): string | null {
  const trimmed = raw.trim();

  // If it's already a 2-letter uppercase code like "TX"
  if (/^[A-Z]{2}$/.test(trimmed)) {
    return trimmed;
  }

  // Things like "Texas (TX)" → grab the "(TX)" part
  const parenMatch = trimmed.match(/\(([A-Z]{2})\)\s*$/);
  if (parenMatch) {
    return parenMatch[1];
  }

  // Full name matches
  if (STATE_ABBR[trimmed]) {
    return STATE_ABBR[trimmed];
  }

  // Try with normalized spacing / capitalization, just in case
  const normalized = toTitleCase(trimmed);
  if (STATE_ABBR[normalized]) {
    return STATE_ABBR[normalized];
  }

  return null;
}

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}
