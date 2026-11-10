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
      <legend className="text-label text-muted-foreground">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option.value);

          return (
            <label
              key={option.value}
              className={cn(
                "inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-[2px] border px-3 py-1.5 text-sm transition-colors",
                "hover:border-[#7f9f95] hover:bg-background",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground hover:border-primary hover:bg-primary/90"
                  : "border-border bg-[#faf8f2] text-foreground/75",
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
                  isSelected ? "border-primary-foreground bg-primary-foreground" : "border-[#7f9f95] bg-background",
                )}
              >
                {isSelected && <span className="size-1.5 rounded-[1px] bg-primary" />}
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
      <div className="my-6 space-y-6 rounded-[2px] border border-[#aebbb4] bg-[#edf4f1]/55 p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(16rem,1fr)_minmax(18rem,auto)]">
          <div className="flex flex-col gap-1">
            <label className="text-label text-muted-foreground">Issuing Body</label>
            <select
              className="h-10 rounded-[2px] border border-border bg-background px-3 text-sm outline-none transition-shadow focus:border-ring focus:ring-2 focus:ring-ring/30"
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
              <label className="text-label text-muted-foreground">Start</label>
              <Input className="h-10 rounded-[2px] bg-background shadow-none" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-label text-muted-foreground">End</label>
              <Input className="h-10 rounded-[2px] bg-background shadow-none" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
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
      
      <div className="mb-4 flex items-center justify-end gap-2 pr-1">
        <label htmlFor="cumulative-switch" className="text-sm text-muted-foreground">
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
            <CartesianGrid stroke="#d8d5cc" strokeDasharray="3 3" />
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
            <Line type="monotone" dataKey="count" stroke="#287f73" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
