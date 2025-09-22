export type TrendRecord = {
  module: 'state' | 'fed' | 'sec' | 'vol' | 'intl';
  date: string; // ISO YYYY-MM-DD
  issuingBody: string;
  title: string;
  tags: {
    keyword: string[];
    implications: string[];
    impact: string[];
  };
};

export type TrendFilter = {
  module?: TrendRecord['module'];
  tagType?: 'keyword' | 'implications' | 'impact';
  tagValue?: string;
  issuingBody?: string; // includes state name for state module
  start?: string; // ISO date
  end?: string; // ISO date
};

export function filterTrends(data: TrendRecord[], filter: TrendFilter): TrendRecord[] {
  return data.filter((r) => {
    if (filter.module && r.module !== filter.module) return false;
    if (filter.tagType && filter.tagValue) {
      const set = new Set(r.tags[filter.tagType].map((v) => v.toLowerCase()));
      if (!set.has(filter.tagValue.toLowerCase())) return false;
    }
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

 