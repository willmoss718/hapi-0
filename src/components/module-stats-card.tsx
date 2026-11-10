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
    <aside className="w-full rounded-[2px] border border-[#aebbb4] bg-[#edf4f1]/55 px-4 py-3 text-foreground md:w-[34rem] md:max-w-[34rem] lg:w-[38rem] lg:max-w-[38rem]">
      <div className="grid grid-cols-2 gap-y-3 sm:grid-cols-3 md:grid-cols-5 md:gap-y-0">
        {STAT_ITEMS.map(([label, key], index) => (
          <div key={key} className={`min-w-0 px-3 first:pl-0 last:pr-0 ${index > 0 ? "md:border-l md:border-[#aebbb4]/60" : ""}`}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {label}
            </p>
            <p className="font-editorial mt-1 whitespace-nowrap text-[0.95rem] font-semibold leading-5 text-foreground">
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
