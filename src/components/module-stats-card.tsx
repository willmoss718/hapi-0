import type { ModuleStats } from "@/lib/module-stats";

type ModuleStatsCardProps = {
  stats: ModuleStats;
};

const STAT_ITEMS = [
  ["Total", "totalPolicies"],
  ["High Impact", "highImpactPolicies"],
  ["First Policy", "firstPolicy"],
  ["Latest", "mostRecentPolicy"],
  ["Issuing Bodies", "issuingBodies"],
] as const;

export default function ModuleStatsCard({ stats }: ModuleStatsCardProps) {
  return (
    <aside className="w-full rounded-lg border border-gray-200 bg-gray-50/80 px-3.5 py-2.5 text-gray-950 shadow-sm md:w-[34rem] md:max-w-[34rem] lg:w-[38rem] lg:max-w-[38rem]">
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-3 md:grid-cols-5">
        {STAT_ITEMS.map(([label, key]) => (
          <div key={key} className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
              {label}
            </p>
            <p className="mt-0.5 whitespace-nowrap text-sm font-semibold leading-5 text-gray-950">
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
