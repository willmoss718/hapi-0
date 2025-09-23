import neatCsv from "neat-csv";
import { getCsvData } from "@/lib/server-utils";
import { TrendRecord } from "@/lib/trends-shared";

function toIsoDate(raw: string): string | null {
  if (!raw) return null;
  const trimmed = String(raw).trim();
  if (!trimmed) return null;
  // Try YYYY-MM-DD, YYYY-MM, MM/DD/YY, M/D/YYYY, Month D, YYYY
  // Use Date parsing with fallback normalization
  const tryFormats = [
    (s: string) => s, // already ISO
    (s: string) => {
      // e.g., 8/12 or 8/12/25 -> normalize to YYYY-MM-DD (assume 20xx for 2-digit years)
      const parts = s.split("/");
      if (parts.length >= 2 && parts.length <= 3) {
        const m = parts[0].padStart(2, "0");
        const d = parts[1].padStart(2, "0");
        let y = parts[2];
        if (!y) return null;
        if (y.length === 2) y = String(2000 + Number(y));
        return `${y}-${m}-${d}`;
      }
      return null;
    },
  ];
  for (const f of tryFormats) {
    const candidate = f(trimmed);
    if (!candidate) continue;
    const dt = new Date(candidate);
    if (!isNaN(dt.getTime())) {
      const iso = dt.toISOString().slice(0, 10);
      return iso;
    }
  }
  // Last attempt with Date.parse
  const dt = new Date(trimmed);
  if (!isNaN(dt.getTime())) return dt.toISOString().slice(0, 10);
  return null;
}

async function readCsv(csvBaseName: string): Promise<Record<string, string>[]> {
  const csvStr = await getCsvData(csvBaseName);
  if (!csvStr) return [];
  return neatCsv(csvStr);
}

function splitTags(raw: unknown): string[] {
  if (!raw) return [];
  return String(raw)
    .split(";")
    .map((v) => v.trim())
    .filter(Boolean);
}

export async function loadAllTrends(): Promise<TrendRecord[]> {
  const [stateCsv, fedCsv, secCsv, volCsv, intlCsv] = await Promise.all([
    readCsv("state-policies").catch(() => []),
    readCsv("federal-policies").catch(() => []),
    readCsv("sector-specific-regulations").catch(() => []),
    readCsv("voluntary-standards").catch(() => []),
    readCsv("international-frameworks").catch(() => []),
  ]);

  const state: TrendRecord[] = stateCsv
    .map((row: Record<string, string>) => {
      const dateIntroduced = row["Date Introduced"] || row["Date Passed"] || "";
      const date = toIsoDate(dateIntroduced);
      if (!date) return null;
      return {
        module: "state",
        date,
        issuingBody: row["State"] || row["Issuing Body"] || "State",
        title:
          row["Policy Name/Number"] || row["Policy Name"] || "State Policy",
        tags: {
          keyword: splitTags(row["Keyword Tags"]),
          stakeholder: splitTags(row["Stakeholder Tags"]),
          impact: splitTags(row["Impact Level"]),
        },
      } as TrendRecord;
    })
    .filter(Boolean) as TrendRecord[];

  const fed: TrendRecord[] = fedCsv
    .map((row: Record<string, string>) => {
      const date = toIsoDate(row["Date Issued"]);
      if (!date) return null;
      return {
        module: "fed",
        date,
        issuingBody: row["Issuing Body"] || "Federal",
        title:
          row["Policy Name/Number"] || row["Policy Name"] || "Federal Policy",
        tags: {
          keyword: splitTags(row["Keyword Tags"]),
          stakeholder: splitTags(row["Stakeholder Tags"]),
          impact: splitTags(row["Impact Level"]),
        },
      } as TrendRecord;
    })
    .filter(Boolean) as TrendRecord[];

  const sec: TrendRecord[] = secCsv
    .map((row: Record<string, string>) => {
      const date = toIsoDate(row["Date Issued/Significantly Updated"]);
      if (!date) return null;
      return {
        module: "sec",
        date,
        issuingBody: row["Issuing Body"] || "",
        title: row["Regulation Name"] || "Sector Regulation",
        tags: {
          keyword: splitTags(row["Keyword Tags"]),
          stakeholder: splitTags(row["Stakeholder Tags"]),
          impact: splitTags(row["Impact Level"]),
        },
      } as TrendRecord;
    })
    .filter(Boolean) as TrendRecord[];

  const vol: TrendRecord[] = volCsv
    .map((row: Record<string, string>) => {
      const date = toIsoDate(row["Date Issued/Significantly Updated"]);
      if (!date) return null;
      return {
        module: "vol",
        date,
        issuingBody: row["Issuing Body"] || "",
        title: row["Standard Name/Number"] || "Voluntary Standard",
        tags: {
          keyword: splitTags(row["Keyword Tags"]),
          stakeholder: splitTags(row["Stakeholder Tags"]),
          impact: splitTags(row["Impact Level"]),
        },
      } as TrendRecord;
    })
    .filter(Boolean) as TrendRecord[];

  const intl: TrendRecord[] = intlCsv
    .map((row: Record<string, string>) => {
      const date = toIsoDate(row["Date Issued/Significantly Updated"]);
      if (!date) return null;
      return {
        module: "intl",
        date,
        issuingBody: row["Issuing Body"] || row["Country/Region"] || "",
        title: row["Policy Name/Title"] || "International Framework",
        tags: {
          keyword: splitTags(row["Keyword Tags"]),
          stakeholder: splitTags(row["Stakeholder Tags"]),
          impact: splitTags(row["Impact Level"]),
        },
      } as TrendRecord;
    })
    .filter(Boolean) as TrendRecord[];

  return [...state, ...fed, ...sec, ...vol, ...intl].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
}

export type TrendFilter = {
  module?: TrendRecord["module"];
  tagType?: "keyword" | "stakeholder" | "impact";
  tagValue?: string;
  issuingBody?: string; // includes state name for state module
  start?: string; // ISO date
  end?: string; // ISO date
};

export function filterTrends(
  data: TrendRecord[],
  filter: TrendFilter,
): TrendRecord[] {
  return data.filter((r) => {
    if (filter.module && r.module !== filter.module) return false;
    if (filter.tagType && filter.tagValue) {
      const set = new Set(r.tags[filter.tagType].map((v) => v.toLowerCase()));
      if (!set.has(filter.tagValue.toLowerCase())) return false;
    }
    if (filter.issuingBody) {
      if (r.issuingBody.toLowerCase() !== filter.issuingBody.toLowerCase())
        return false;
    }
    if (filter.start && r.date < filter.start) return false;
    if (filter.end && r.date > filter.end) return false;
    return true;
  });
}

export function bucketByMonth(
  data: TrendRecord[],
): { month: string; count: number }[] {
  const buckets = new Map<string, number>();
  for (const r of data) {
    const month = r.date.slice(0, 7);
    buckets.set(month, (buckets.get(month) || 0) + 1);
  }
  return Array.from(buckets.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
}
