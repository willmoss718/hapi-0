import { FILES } from "@/assets/files";
import neatCsv from "neat-csv";
import { getCsvData } from "@/lib/server-utils";

export type StatePolicyPreview = {
  title: string;
  dateLabel: string;
  timestamp: number | null;
};

export type StateIntelligence = {
  code: string;
  name: string;
  totalPolicies: number;
  highImpactPolicies: number;
  firstPolicyDate: string | null;
  latestPolicyDate: string | null;
  recentPolicies: StatePolicyPreview[];
  regulatoryThemes: string[];
  stakeholderThemes: string[];
};

type CsvRow = Record<string, string | undefined>;

type ParsedPolicyDate = {
  label: string | null;
  timestamp: number | null;
};

export async function getTotalCsvPolicyCount() {
  const rowCounts = await Promise.all(
    FILES.map(async (file) => {
      const csvStr = await getCsvData(file.path);
      if (!csvStr) return 0;

      const rows = (await neatCsv(csvStr)) as CsvRow[];
      return rows.filter((row) => Object.values(row).some((value) => cleanCell(value))).length;
    })
  );

  return rowCounts.reduce((total, count) => total + count, 0);
}

export async function getStatePolicyIntelligence() {
  const csvStr = await getCsvData("state-policies");
  const summaries = createEmptyStateSummaries();

  if (!csvStr) {
    return summaries;
  }

  const rows = (await neatCsv(csvStr)) as CsvRow[];
  if (rows.length === 0) {
    return summaries;
  }

  const firstRow = rows[0];
  const stateKey = pickColumn(firstRow, [
    "State",
    "state",
    "Jurisdiction",
    "jurisdiction",
    "State / Territory",
    "State/ Territory",
  ]);
  const titleKey = pickColumn(firstRow, [
    "Policy Name/Number",
    "Policy Name",
    "Policy Title",
    "Title",
    "Name",
  ]);
  const dateKey = pickColumn(firstRow, [
    "Date Passed",
    "Date Enacted",
    "Policy Date",
    "Date",
    "Effective Date",
  ]);
  const impactKey = pickColumn(firstRow, ["Impact Level", "Impact", "High Impact"]);
  const keywordKey = pickColumn(firstRow, [
    "Keyword Tags",
    "Keywords",
    "Tags",
    "Category",
    "Categories",
    "Regulatory Themes",
  ]);
  const stakeholderKey = pickColumn(firstRow, [
    "Stakeholder Tags",
    "Stakeholders",
    "Stakeholder Groups",
    "Audience",
  ]);

  if (!stateKey) {
    return summaries;
  }

  const policyBuckets: Record<string, StatePolicyPreview[]> = {};
  const earliestDates: Record<string, ParsedPolicyDate> = {};
  const latestDates: Record<string, ParsedPolicyDate> = {};
  const regulatoryCounts: Record<string, Record<string, number>> = {};
  const stakeholderCounts: Record<string, Record<string, number>> = {};

  for (const row of rows) {
    const code = normalizeState(row[stateKey] || "");
    if (!code || !summaries[code]) continue;

    const summary = summaries[code];
    const parsedDate = parsePolicyDate(dateKey ? row[dateKey] : undefined);
    const title = cleanCell(titleKey ? row[titleKey] : undefined);

    summary.totalPolicies += 1;

    if (impactKey && cleanCell(row[impactKey]).toLowerCase() === "high") {
      summary.highImpactPolicies += 1;
    }

    if (parsedDate.timestamp !== null) {
      const currentEarliest = earliestDates[code];
      if (!currentEarliest || currentEarliest.timestamp === null || parsedDate.timestamp < currentEarliest.timestamp) {
        earliestDates[code] = parsedDate;
      }

      const currentLatest = latestDates[code];
      if (!currentLatest || currentLatest.timestamp === null || parsedDate.timestamp > currentLatest.timestamp) {
        latestDates[code] = parsedDate;
      }
    }

    if (title) {
      (policyBuckets[code] ||= []).push({
        title,
        dateLabel: parsedDate.label || "N/A",
        timestamp: parsedDate.timestamp,
      });
    }

    // Theme chips are derived only from structured CSV tag/category fields.
    addStructuredTagCounts(regulatoryCounts, code, keywordKey ? row[keywordKey] : undefined);
    addStructuredTagCounts(stakeholderCounts, code, stakeholderKey ? row[stakeholderKey] : undefined);
  }

  for (const code of Object.keys(summaries)) {
    summaries[code].firstPolicyDate = earliestDates[code]?.label || null;
    summaries[code].latestPolicyDate = latestDates[code]?.label || null;
    summaries[code].recentPolicies = (policyBuckets[code] || [])
      .sort((a, b) => (b.timestamp ?? -1) - (a.timestamp ?? -1))
      .slice(0, 5);
    summaries[code].regulatoryThemes = topStructuredTags(regulatoryCounts[code]);
    summaries[code].stakeholderThemes = topStructuredTags(stakeholderCounts[code]);
  }

  return summaries;
}

export function getStatePolicyCounts(stateIntelligence: Record<string, StateIntelligence>) {
  return Object.fromEntries(
    Object.entries(stateIntelligence).map(([code, summary]) => [code, summary.totalPolicies])
  ) as Record<string, number>;
}

function createEmptyStateSummaries() {
  return Object.fromEntries(
    ALL_US_STATES.map((code) => [
      code,
      {
        code,
        name: STATE_NAMES[code],
        totalPolicies: 0,
        highImpactPolicies: 0,
        firstPolicyDate: null,
        latestPolicyDate: null,
        recentPolicies: [],
        regulatoryThemes: [],
        stakeholderThemes: [],
      } satisfies StateIntelligence,
    ])
  ) as Record<string, StateIntelligence>;
}

function pickColumn(row: CsvRow, candidates: string[]) {
  const keys = Object.keys(row);
  const normalizedCandidates = candidates.map(normalizeColumnName);
  return keys.find((key) => normalizedCandidates.includes(normalizeColumnName(key)));
}

function normalizeColumnName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function cleanCell(value: string | undefined) {
  return (value || "").trim();
}

function addStructuredTagCounts(
  countsByState: Record<string, Record<string, number>>,
  code: string,
  rawValue: string | undefined
) {
  const tags = splitStructuredTags(rawValue);
  if (tags.length === 0) return;

  const counts = (countsByState[code] ||= {});
  for (const tag of tags) {
    counts[tag] = (counts[tag] || 0) + 1;
  }
}

function splitStructuredTags(rawValue: string | undefined) {
  return cleanCell(rawValue)
    .split(/[;|]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function topStructuredTags(counts: Record<string, number> | undefined) {
  if (!counts) return [];

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 2)
    .map(([tag]) => tag);
}

function parsePolicyDate(rawValue: string | undefined): ParsedPolicyDate {
  const raw = cleanCell(rawValue);
  if (!raw) return { label: null, timestamp: null };

  const isoMatch = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    const timestamp = Date.UTC(Number(year), Number(month) - 1, Number(day));
    return { label: formatMonthYear(timestamp), timestamp };
  }

  const slashMatch = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
  if (slashMatch) {
    const [, month, day, rawYear] = slashMatch;
    const year = rawYear.length === 2 ? `20${rawYear}` : rawYear;
    const timestamp = Date.UTC(Number(year), Number(month) - 1, Number(day));
    return { label: formatMonthYear(timestamp), timestamp };
  }

  const yearMatch = raw.match(/\b(19\d{2}|20\d{2})\b/);
  if (yearMatch) {
    const timestamp = Date.UTC(Number(yearMatch[1]), 0, 1);
    return { label: yearMatch[1], timestamp };
  }

  const fallbackTimestamp = Date.parse(raw);
  if (!Number.isNaN(fallbackTimestamp)) {
    return { label: formatMonthYear(fallbackTimestamp), timestamp: fallbackTimestamp };
  }

  return { label: null, timestamp: null };
}

function formatMonthYear(timestamp: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(timestamp);
}

function normalizeState(raw: string): string | null {
  const trimmed = raw.trim();
  if (/^[A-Z]{2}$/.test(trimmed)) return trimmed;

  const parenMatch = trimmed.match(/\(([A-Z]{2})\)\s*$/);
  if (parenMatch) return parenMatch[1];

  const normalized = toTitleCase(trimmed);
  return STATE_ABBR[trimmed] || STATE_ABBR[normalized] || null;
}

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

const STATE_NAMES: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

const STATE_ABBR: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_NAMES).map(([code, name]) => [name, code])
);

const ALL_US_STATES = Object.keys(STATE_NAMES);
