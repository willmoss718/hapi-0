import type { ModuleStats } from "@/lib/module-stats";

type ModuleStatsCardProps = {
  stats: ModuleStats;
};

const STAT_ITEMS = [
  ["Total Policies", "totalPolicies"],
  ["High Impact", "highImpactPolicies"],
  ["First Policy", "firstPolicy"],
  ["Most Recent Policy", "mostRecentPolicy"],
  ["Issuing Bodies", "issuingBodies"],
] as const;

export default function ModuleStatsCard({ stats }: ModuleStatsCardProps) {
  return (
    <aside className="w-full rounded-lg border border-gray-200 bg-gray-50/80 px-4 py-3 text-gray-950 shadow-sm md:w-[21rem] md:max-w-[21rem]">
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {STAT_ITEMS.map(([label, key]) => (
          <div key={key} className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
              {label}
            </p>
            <p className="mt-0.5 truncate text-base font-semibold leading-5 text-gray-950">
              {formatStatValue(stats[key])}
            </p>
          </div>
        ))}
      </div>
    </aside>
  );
}

function formatStatValue(value: string | number | null) {
  if (value === null || value === "") return "—";
  return typeof value === "number" ? value.toLocaleString() : value;
}
