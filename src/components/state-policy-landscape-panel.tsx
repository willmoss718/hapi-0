import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import type { StatePolicyLandscapeStats } from "@/lib/state-policy-intelligence";

type StatePolicyLandscapePanelProps = {
  stats: StatePolicyLandscapeStats;
};

export default function StatePolicyLandscapePanel({
  stats,
}: StatePolicyLandscapePanelProps) {
  return (
    <aside className="w-full rounded-[2px] border border-[#aebbb4] bg-[#edf4f1]/55 px-5 py-5 text-foreground">
      <div className="border-b border-[#aebbb4]/70 pb-3">
        <div>
          <p className="text-label text-muted-foreground">
            National Intelligence
          </p>
          <h3 className="font-editorial mt-1 whitespace-nowrap text-2xl font-semibold leading-tight tracking-[-0.015em]">
            State Policy Landscape
          </h3>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <PolicyCount
          label="Total Policies"
          value={stats.totalPolicies.toLocaleString()}
        />
        <PolicyCount
          label="High Impact"
          value={stats.highImpactPolicies.toLocaleString()}
        />
        <PolicyCount
          label="Active States"
          value={stats.statesWithPolicies.toLocaleString()}
          accent
        />
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <TimelineTile label="First Policy" value={stats.firstPolicy || "—"} />
        <TimelineTile label="Most Recent" value={stats.mostRecentPolicy || "—"} />
      </div>

      <section className="mt-4">
        <h4 className="text-label text-muted-foreground">
          Most Common Operational Areas
        </h4>
        <div className="mt-2 space-y-2">
          {stats.topOperationalAreas.map((area) => (
            <OperationalAreaRow key={area.fullLabel} area={area} />
          ))}
        </div>
      </section>

      <section className="mt-4">
        <h4 className="text-label text-muted-foreground">
          Most Active States
        </h4>
        <div className="mt-2 divide-y divide-gray-100 border-y border-gray-100">
          {stats.mostActiveStates.map((state, index) => (
            <Link
              key={state.code}
              href={`/data/state-policies?sk=State&so=asc#${state.code}`}
              className="flex items-center justify-between gap-3 py-2.5 transition-colors hover:bg-gray-50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-semibold text-gray-600">
                  {index + 1}
                </span>
                <p className="truncate text-sm font-semibold text-gray-950">
                  {state.name} <span className="text-gray-500">({state.code})</span>
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-gray-950">
                {state.totalPolicies.toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <Link
        href="/operational-implications"
        className="mt-4 flex items-center justify-between gap-3 rounded-[2px] bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <span>Explore Operational Implications</span>
        <ArrowRightIcon className="h-4 w-4 shrink-0" />
      </Link>
    </aside>
  );
}

function PolicyCount({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={`min-w-0 rounded-[2px] border px-2.5 py-2 ${accent ? "border-[#7f9f95] bg-[#dcece6]" : "border-[#aebbb4]/60 bg-background/65"}`}>
      <p className="font-editorial text-xl font-semibold leading-none text-foreground">
        {value}
      </p>
      <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

function TimelineTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[2px] border border-[#aebbb4]/60 bg-background/65 px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-gray-950">{value}</p>
    </div>
  );
}

function OperationalAreaRow({
  area,
}: {
  area: StatePolicyLandscapeStats["topOperationalAreas"][number];
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="truncate text-sm font-semibold text-gray-950">{area.label}</p>
        <p className="shrink-0 text-sm font-semibold text-gray-600">
          {area.percentage}% of states
        </p>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden bg-background">
        <div
          className="h-full bg-[#287f73]"
          style={{ width: `${area.percentage}%` }}
        />
      </div>
    </div>
  );
}
