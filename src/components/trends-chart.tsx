"use client";
import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { TrendFilter, TrendRecord, bucketByMonth, filterTrends } from "@/lib/trends-shared";
import { Input } from "@/components/ui/input";


export default function TrendsChart({ data, tagData }: {
    data: TrendRecord[];
    tagData: {
        keyword: string[];
        stakeholder: string[];
        impact: string[];
    };
}) {
  const [module, setModule] = useState<TrendFilter['module']>();
  const [tagType, setTagType] = useState<TrendFilter['tagType']>();
  const [tagValue, setTagValue] = useState<string>("");
  const [issuingBody, setIssuingBody] = useState<string>("");
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");

  const filtered = useMemo(() => {
    const f: TrendFilter = {
      module,
      tagType,
      tagValue: tagValue || undefined,
      issuingBody: issuingBody || undefined,
      start: start || undefined,
      end: end || undefined,
    };
    return filterTrends(data, f);
  }, [data, module, tagType, tagValue, issuingBody, start, end]);

  const series = useMemo(() => bucketByMonth(filtered), [filtered]);

  const issuingBodies = useMemo(() => {
    const set = new Set<string>();
    for (const r of data) set.add(r.issuingBody);
    return Array.from(set).sort();
  }, [data]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 my-6">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Module</label>
          <select
            className="border rounded px-2 py-1"
            value={module || ''}
            onChange={(e) => {
              const val = e.target.value as string;
              setModule((val === '' ? undefined : (val as TrendFilter['module'])));
            }}
          >
            <option value="">All</option>
            <option value="state">State</option>
            <option value="fed">Federal</option>
            <option value="sec">Sector-specific</option>
            <option value="vol">Voluntary</option>
            <option value="intl">International</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Tag Type</label>
          <select
            className="border rounded px-2 py-1"
            value={tagType || ''}
            onChange={(e) => {
              const val = e.target.value as string;
              setTagType((val === '' ? undefined : (val as TrendFilter['tagType'])));
            }}
          >
            <option value="">Any</option>
            <option value="keyword">Keyword</option>
            <option value="stakeholder">Stakeholder</option>
            <option value="impact">Impact</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Tag Value</label>
          <select
            className="border rounded px-2 py-1"
            value={tagValue}
            onChange={(e) => setTagValue(e.target.value)}
          >
            <option value="">Any</option>
            {(function render() {
              if (tagType) {
                return tagData[tagType].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ));
              } else {
                const allTags = Array.from(new Set([...tagData.keyword, ...tagData.stakeholder, ...tagData.impact]));
                return allTags.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ));
              }
            })()}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Issuing Body</label>
          <select
            className="border rounded px-2 py-1"
            value={issuingBody}
            onChange={(e) => setIssuingBody(e.target.value)}
          >
            <option value="">Any</option>
            {issuingBodies.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Start</label>
            <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">End</label>
            <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series} margin={{ left: 40, right: 16, top: 16, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis 
              allowDecimals={false} 
              tick={{ fontSize: 12 }}
              label={{ value: 'Number of policies introduced', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
            />
            <Tooltip
              formatter={(value: unknown) => [typeof value === 'number' ? value : Number(value), 'Policies introduced']}
              labelFormatter={(l) => `Month: ${l}`}
            />
            <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


