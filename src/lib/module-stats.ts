export type ModuleStats = {
  totalPolicies: number;
  highImpactPolicies: number;
  firstPolicy: string;
  lastUpdated: string;
  issuingBodies: number | null;
};

type CsvRow = Record<string, string | undefined>;

const DATE_KEYS = [
  "Last Updated",
  "Updated",
  "Date Updated",
  "Date Issued/Significantly Updated",
  "Date Issued",
  "Date Passed",
  "Effective Date",
  "Date",
];

const FIRST_POLICY_DATE_KEYS = [
  "Date Issued/Significantly Updated",
  "Date Issued",
  "Date Passed",
  "Effective Date",
  "Date",
];

const ISSUING_BODY_KEYS = [
  "Issuing Body",
  "Agency",
  "Organization",
  "Organisation",
  "Body",
  "Country/Region",
];

export function getModuleStats(rows: CsvRow[], siteLastUpdated?: string): ModuleStats {
  const policyDates = rows
    .map((row) => parsePolicyDate(getFirstColumnValue(row, FIRST_POLICY_DATE_KEYS)))
    .filter((date): date is Date => Boolean(date));
  const fallbackUpdatedDates = rows
    .map((row) => parsePolicyDate(getFirstColumnValue(row, DATE_KEYS)))
    .filter((date): date is Date => Boolean(date));
  const issuingBodies = new Set(
    rows
      .map((row) => cleanCell(getFirstColumnValue(row, ISSUING_BODY_KEYS)))
      .filter(Boolean),
  );

  return {
    totalPolicies: rows.length,
    highImpactPolicies: rows.filter(isHighImpactPolicy).length,
    firstPolicy: formatYear(getEarliestDate(policyDates)),
    lastUpdated: siteLastUpdated || formatMonthYear(getLatestDate(fallbackUpdatedDates)),
    issuingBodies: issuingBodies.size || null,
  };
}

function isHighImpactPolicy(row: CsvRow) {
  const impact = cleanCell(
    getFirstColumnValue(row, ["Impact Level", "Impact", "Status"]),
  ).toLowerCase();

  return impact === "high" || impact === "high impact";
}

function getFirstColumnValue(row: CsvRow, keys: string[]) {
  for (const key of keys) {
    const exactValue = row[key];
    if (cleanCell(exactValue)) return exactValue;
  }

  const normalizedKeys = keys.map(normalizeColumnName);
  const matchedKey = Object.keys(row).find((key) =>
    normalizedKeys.includes(normalizeColumnName(key)),
  );

  return matchedKey ? row[matchedKey] : undefined;
}

function cleanCell(value: string | undefined) {
  return (value || "").trim();
}

function normalizeColumnName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function getEarliestDate(dates: Date[]) {
  if (dates.length === 0) return null;
  return new Date(Math.min(...dates.map((date) => date.getTime())));
}

function getLatestDate(dates: Date[]) {
  if (dates.length === 0) return null;
  return new Date(Math.max(...dates.map((date) => date.getTime())));
}

function parsePolicyDate(rawValue: string | undefined) {
  const raw = cleanCell(rawValue);
  if (!raw) return null;

  const isoMatch = raw.match(/^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?/);
  if (isoMatch) {
    const [, year, month, day = "1"] = isoMatch;
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  }

  const slashMatch = raw.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2}|\d{4}))?$/);
  if (slashMatch) {
    const [, month, day, rawYear] = slashMatch;
    if (!rawYear) return null;
    const year = rawYear.length === 2 ? `20${rawYear}` : rawYear;
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  }

  const yearMatch = raw.match(/\b(19\d{2}|20\d{2})\b/);
  if (yearMatch) {
    return new Date(Date.UTC(Number(yearMatch[1]), 0, 1));
  }

  const fallbackTimestamp = Date.parse(raw);
  if (!Number.isNaN(fallbackTimestamp)) {
    return new Date(fallbackTimestamp);
  }

  return null;
}

function formatYear(date: Date | null) {
  return date ? String(date.getUTCFullYear()) : "—";
}

function formatMonthYear(date: Date | null) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
