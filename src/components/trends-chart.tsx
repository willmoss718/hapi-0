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
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const MODULE_LABELS: Record<TrendRecord["module"], string> = {
  state: "State",
  fed: "Federal",
  sec: "Sector-specific",
  vol: "Voluntary",
  intl: "International",
};

const MODULE_ORDER: TrendRecord["module"][] = ["state", "fed", "sec", "vol", "intl"];
const IMPACT_LEVELS = ["Low", "Medium", "High"];

type PillOption<T extends string> = {
  value: T;
  label: string;
};

function MultiSelectPills<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: PillOption<T>[];
  selected: T[];
  onToggle: (value: T) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-gray-700">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option.value);

          return (
            <label
              key={option.value}
              className={cn(
                "inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors",
                "hover:border-gray-400 hover:bg-gray-50",
                isSelected
                  ? "border-gray-900 bg-gray-900 text-white hover:border-gray-900 hover:bg-gray-800"
                  : "border-gray-200 bg-white text-gray-700",
              )}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={isSelected}
                onChange={() => onToggle(option.value)}
              />
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-3.5 items-center justify-center rounded-[3px] border",
                  isSelected ? "border-white bg-white" : "border-gray-400 bg-white",
                )}
              >
                {isSelected && <span className="size-1.5 rounded-[2px] bg-gray-900" />}
              </span>
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function TrendsChart({ data, tagData }: {
    data: TrendRecord[];
    tagData: {
        keyword: string[];
        stakeholder: string[];
        impact: string[];
    };
}) {
  const [modules, setModules] = useState<TrendRecord["module"][]>([]);
  const [keywordTags, setKeywordTags] = useState<string[]>([]);
  const [stakeholderTags, setStakeholderTags] = useState<string[]>([]);
  const [impactLevels, setImpactLevels] = useState<string[]>([]);
  const [issuingBody, setIssuingBody] = useState<string>("");
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [isCumulative, setIsCumulative] = useState<boolean>(false);

  const filtered = useMemo(() => {
    const f: TrendFilter = {
      modules,
      keywordTags,
      stakeholderTags,
      impactLevels,
      issuingBody: issuingBody || undefined,
      start: start || undefined,
      end: end || undefined,
    };
    return filterTrends(data, f);
  }, [data, modules, keywordTags, stakeholderTags, impactLevels, issuingBody, start, end]);

  const series = useMemo(() => bucketByMonth(filtered), [filtered]);
  
  const displayData = useMemo(() => {
    if (!isCumulative) return series;
    
    // Calculate cumulative values
    let cumulative = 0;
    return series.map(item => ({
      ...item,
      count: cumulative += item.count
    }));
  }, [series, isCumulative]);

  const issuingBodies = useMemo(() => {
    const set = new Set<string>();
    for (const r of data) set.add(r.issuingBody);
    return Array.from(set).sort();
  }, [data]);

  const moduleOptions = useMemo<PillOption<TrendRecord["module"]>[]>(() => {
    const availableModules = new Set(data.map((r) => r.module));

    return MODULE_ORDER.filter((value) => availableModules.has(value)).map((value) => ({
      value,
      label: MODULE_LABELS[value],
    }));
  }, [data]);

  function toggleSelected<T extends string>(
    value: T,
    selected: T[],
    setSelected: (next: T[]) => void,
  ) {
    setSelected(
      selected.includes(value)
        ? selected.filter((selectedValue) => selectedValue !== value)
        : [...selected, value],
    );
  }

  return (
    <div className="w-full">
      <div className="my-6 space-y-5 rounded-md border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(16rem,1fr)_minmax(18rem,auto)]">
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

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <MultiSelectPills
            label="Impact Level"
            options={IMPACT_LEVELS.map((level) => ({ value: level, label: level }))}
            selected={impactLevels}
            onToggle={(value) => toggleSelected(value, impactLevels, setImpactLevels)}
          />
          <MultiSelectPills
            label="Module"
            options={moduleOptions}
            selected={modules}
            onToggle={(value) => toggleSelected(value, modules, setModules)}
          />
          <MultiSelectPills
            label="Keyword Tags"
            options={tagData.keyword.map((tag) => ({ value: tag, label: tag }))}
            selected={keywordTags}
            onToggle={(value) => toggleSelected(value, keywordTags, setKeywordTags)}
          />
          <MultiSelectPills
            label="Stakeholder Tags"
            options={tagData.stakeholder.map((tag) => ({ value: tag, label: tag }))}
            selected={stakeholderTags}
            onToggle={(value) => toggleSelected(value, stakeholderTags, setStakeholderTags)}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-end mb-4 pr-4 gap-2">
        <label htmlFor="cumulative-switch" className="text-sm text-gray-600">
          Show Cumulative
        </label>
        <Switch
          id="cumulative-switch"
          checked={isCumulative}
          onCheckedChange={setIsCumulative}
        />
      </div>

      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayData} margin={{ left: 40, right: 16, top: 16, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis 
              allowDecimals={false} 
              tick={{ fontSize: 12 }}
              label={{ value: isCumulative ? 'Cumulative policies' : 'Number of policies introduced', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
            />
            <Tooltip
              formatter={(value: unknown) => [typeof value === 'number' ? value : Number(value), isCumulative ? 'Total policies' : 'Policies introduced']}
              labelFormatter={(l) => `Month: ${l}`}
            />
            <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
