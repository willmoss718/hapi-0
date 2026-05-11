export type TrendRecord = {
  module: 'state' | 'fed' | 'sec' | 'vol' | 'intl';
  date: string; // ISO YYYY-MM-DD
  issuingBody: string;
  title: string;
  tags: {
    keyword: string[];
    stakeholder: string[];
    impact: string[];
  };
};

export type TrendFilter = {
  modules?: TrendRecord['module'][];
  keywordTags?: string[];
  stakeholderTags?: string[];
  impactLevels?: string[];
  issuingBody?: string; // includes state name for state module
  start?: string; // ISO date
  end?: string; // ISO date
};

function matchesAny(recordValues: string[], selectedValues?: string[]): boolean {
  if (!selectedValues?.length) return true;
  const recordSet = new Set(recordValues.map((v) => v.toLowerCase()));
  return selectedValues.some((value) => recordSet.has(value.toLowerCase()));
}

export function filterTrends(data: TrendRecord[], filter: TrendFilter): TrendRecord[] {
  return data.filter((r) => {
    if (filter.modules?.length && !filter.modules.includes(r.module)) return false;
    if (!matchesAny(r.tags.keyword, filter.keywordTags)) return false;
    if (!matchesAny(r.tags.stakeholder, filter.stakeholderTags)) return false;
    if (!matchesAny(r.tags.impact, filter.impactLevels)) return false;
    if (filter.issuingBody) {
      if (r.issuingBody.toLowerCase() !== filter.issuingBody.toLowerCase()) return false;
    }
    if (filter.start && r.date < filter.start) return false;
    if (filter.end && r.date > filter.end) return false;
    return true;
  });
}

export function bucketByMonth(data: TrendRecord[]): { month: string; count: number }[] {
  const buckets = new Map<string, number>();
  for (const r of data) {
    const month = r.date.slice(0, 7);
    buckets.set(month, (buckets.get(month) || 0) + 1);
  }
  return Array.from(buckets.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
}
