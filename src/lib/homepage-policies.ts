import { FILES } from "@/assets/files";
import { getCsvData } from "@/lib/server-utils";
import { execFileSync } from "node:child_process";
import neatCsv from "neat-csv";

type CsvRow = Record<string, string | undefined>;

export type HomepagePolicyUpdate = {
  title: string;
  date: string;
  moduleType: "State" | "Federal" | "Sector" | "Standard" | "International";
  state?: string;
  path: string;
};

type PolicyCandidate = HomepagePolicyUpdate & {
  timestamp: number;
  lastUpdatedTimestamp: number | null;
};

const MODULE_TYPES: Record<string, HomepagePolicyUpdate["moduleType"]> = {
  "state-policies": "State",
  "federal-policies": "Federal",
  "sector-specific-regulations": "Sector",
  "voluntary-standards": "Standard",
  "international-frameworks": "International",
};

const TITLE_KEYS = [
  "Policy Name/Number",
  "Policy Name/Title",
  "Policy Name",
  "Policy Title",
  "Regulation Name",
  "Standard Name/Number",
  "Title",
  "Name",
];

const POLICY_DATE_KEYS = [
  "Date Passed",
  "Passed Date",
  "Date Enacted",
  "Enacted Date",
  "Date Issued/Significantly Updated",
  "Date Issued",
  "Effective Date",
  "Policy Date",
  "Date",
];

const LAST_UPDATED_KEYS = [
  "Last Updated",
  "Last updated",
  "last updated",
  "Last Modified",
  "Modified",
  "Updated",
];

const LINK_KEYS = ["Link to Text", "Link to text", "Link To Bill", "Source", "URL"];

const EXCLUDED_STATUS_PATTERNS = [
  "proposed",
  "inactive",
  "failed",
  "draft",
  "in development",
  "comments open",
  "withdrawn",
  "repealed",
  "expired",
  "not enacted",
  "not passed",
];

export async function getHomepagePolicyData({ limit = 5 } = {}) {
  const { files, policies, lastUpdatedTimestamps } = await getHomepagePolicySourceData();
  const latestCsvCommitDate = getLatestCsvCommitDate(files.map((file) => file.path));

  return {
    updates: policies
      .sort((a, b) => b.timestamp - a.timestamp || a.title.localeCompare(b.title))
      .slice(0, limit)
      .map(toHomepagePolicyUpdate),
    lastUpdated: getHomepageLastUpdated(
      policies,
      lastUpdatedTimestamps,
      latestCsvCommitDate,
    ),
  };
}

export async function getNewestPolicies({ limit = 5 } = {}) {
  const { updates } = await getHomepagePolicyData({ limit });
  return updates;
}

function toHomepagePolicyUpdate(policy: PolicyCandidate): HomepagePolicyUpdate {
  return {
    title: policy.title,
    date: policy.date,
    moduleType: policy.moduleType,
    state: policy.state,
    path: policy.path,
  };
}

async function getHomepagePolicySourceData() {
  const files = FILES.filter((file) => MODULE_TYPES[file.path]);
  const rowsByFile = await Promise.all(
    files.map(async (file) => {
      const csv = await getCsvData(file.path);
      const rows = csv ? ((await neatCsv(csv)) as CsvRow[]) : [];
      return { file, rows };
    }),
  );

  return rowsByFile.reduce(
    (sourceData, { file, rows }) => {
      for (const row of rows) {
        const lastUpdatedTimestamp = parsePolicyDate(
          getFirstColumnValue(row, LAST_UPDATED_KEYS),
        )?.getTime();
        if (lastUpdatedTimestamp) {
          sourceData.lastUpdatedTimestamps.push(lastUpdatedTimestamp);
        }

        const moduleType = MODULE_TYPES[file.path];
        const title = cleanCell(getFirstColumnValue(row, TITLE_KEYS));
        const policyDate = parsePolicyDate(getFirstColumnValue(row, POLICY_DATE_KEYS));

        if (!moduleType || !title || !policyDate || isExcludedStatus(row)) {
          continue;
        }

        const sourceLink = cleanCell(getFirstColumnValue(row, LINK_KEYS));
        const path = title
          ? `/policies/${encodeURIComponent(title)}`
          : sourceLink;

        if (!path) continue;

        sourceData.policies.push({
          title,
          date: formatFullDate(policyDate),
          moduleType,
          state: moduleType === "State" ? cleanCell(row.State) : undefined,
          path,
          timestamp: policyDate.getTime(),
          lastUpdatedTimestamp: lastUpdatedTimestamp ?? null,
        });
      }

      return sourceData;
    },
    {
      policies: [] as PolicyCandidate[],
      lastUpdatedTimestamps: [] as number[],
      files,
    },
  );
}

function getHomepageLastUpdated(
  policies: PolicyCandidate[],
  lastUpdatedTimestamps: number[],
  latestCsvCommitDate: Date | null,
) {
  if (latestCsvCommitDate !== null) {
    return formatFullDate(latestCsvCommitDate, "America/New_York");
  }

  const newestLastUpdated = getNewestTimestamp(lastUpdatedTimestamps);

  if (newestLastUpdated !== null) {
    return formatFullDate(new Date(newestLastUpdated));
  }

  const newestPolicyDate = getNewestTimestamp(
    policies.map((policy) => policy.timestamp),
  );

  return newestPolicyDate === null ? "N/A" : formatFullDate(new Date(newestPolicyDate));
}

function getLatestCsvCommitDate(filePaths: string[]) {
  const csvPaths = filePaths.flatMap((path) => [
    `src/assets/${path}.csv`,
    `src/assets/${path}-supplement.csv`,
  ]);

  try {
    const latestCommitDate = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", ...csvPaths],
      {
        cwd: process.cwd(),
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      },
    ).trim();

    if (!latestCommitDate) return null;

    const date = new Date(latestCommitDate);
    return Number.isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

function isExcludedStatus(row: CsvRow) {
  const status = cleanCell(getFirstColumnValue(row, ["Status", "Policy Status"])).toLowerCase();
  if (!status) return false;

  return EXCLUDED_STATUS_PATTERNS.some((pattern) => status.includes(pattern));
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

function parsePolicyDate(rawValue: string | undefined) {
  const raw = cleanCell(rawValue);
  if (!raw) return null;

  const isoMatch = raw.match(/^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?/);
  if (isoMatch) {
    const [, year, month, day = "1"] = isoMatch;
    return createUtcDate(Number(year), Number(month), Number(day));
  }

  const slashMatch = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
  if (slashMatch) {
    const [, month, day, rawYear] = slashMatch;
    const year = rawYear.length === 2 ? `20${rawYear}` : rawYear;
    return createUtcDate(Number(year), Number(month), Number(day));
  }

  const yearMonthMatch = raw.match(/^(\d{4})-(\d{1,2})$/);
  if (yearMonthMatch) {
    const [, year, month] = yearMonthMatch;
    return createUtcDate(Number(year), Number(month), 1);
  }

  const fallbackTimestamp = Date.parse(raw);
  if (!Number.isNaN(fallbackTimestamp)) {
    return new Date(fallbackTimestamp);
  }

  const yearMatch = raw.match(/\b(19\d{2}|20\d{2})\b/);
  if (yearMatch) {
    return createUtcDate(Number(yearMatch[1]), 1, 1);
  }

  return null;
}

function createUtcDate(year: number, month: number, day: number) {
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return null;
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  return Number.isNaN(date.getTime()) ? null : date;
}

function getNewestTimestamp(timestamps: Array<number | null>) {
  const validTimestamps = timestamps.filter(
    (timestamp): timestamp is number =>
      typeof timestamp === "number" && Number.isFinite(timestamp),
  );

  return validTimestamps.length === 0 ? null : Math.max(...validTimestamps);
}

function formatFullDate(date: Date, timeZone = "UTC") {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone,
  }).format(date);
}

function cleanCell(value: string | undefined) {
  return (value || "").trim();
}

function normalizeColumnName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}
