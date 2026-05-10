import type { StateIntelligence } from "@/lib/state-policy-intelligence";

type StateIntelligencePanelProps = {
  state: StateIntelligence;
};

export default function StateIntelligencePanel({ state }: StateIntelligencePanelProps) {
  const latestPolicyDate = state.recentPolicies[0]?.dateLabel || "N/A";
  const visibleRecentPolicies = state.recentPolicies.slice(0, 3);

  return (
    <aside className="w-full rounded-lg border border-gray-200 bg-white px-4 py-4 text-gray-950">
      <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            State Intelligence
          </p>
          <h3 className="mt-0.5 truncate text-2xl font-semibold leading-tight">{state.name}</h3>
        </div>
        <div className="shrink-0 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-right">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Latest</p>
          <p className="text-xs font-semibold text-gray-950">{latestPolicyDate}</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 overflow-hidden rounded-md border border-gray-100 bg-gray-50 divide-x divide-gray-100">
        <Stat label="Policies" value={state.totalPolicies.toLocaleString()} />
        <Stat label="High Impact" value={state.highImpactPolicies.toLocaleString()} />
        <Stat label="First" value={state.firstPolicyDate || "N/A"} compact />
      </div>

      <section className="mt-3">
        <h4 className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
          Recent Policies
        </h4>
        {visibleRecentPolicies.length > 0 ? (
          <div className="mt-1.5 divide-y divide-gray-100 border-y border-gray-100">
            {visibleRecentPolicies.map((policy) => (
              <div key={`${policy.title}-${policy.dateLabel}`} className="py-2">
                <p className="line-clamp-2 text-sm font-medium leading-5 text-gray-950">
                  {policy.title}
                </p>
                <p className="mt-0.5 text-xs font-medium text-gray-500">{policy.dateLabel}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-1.5 text-sm text-gray-500">N/A</p>
        )}
      </section>

      <div className="mt-3 grid gap-3 border-t border-gray-100 pt-3">
        <ThemeSection title="Regulatory Themes" values={state.regulatoryThemes} />
        <ThemeSection title="Stakeholder Themes" values={state.stakeholderThemes} />
      </div>
    </aside>
  );
}

function Stat({ label, value, compact }: { label: string; value: string; compact?: boolean }) {
  return (
    <div className="min-w-0 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p
        className={
          compact
            ? "mt-0.5 truncate text-sm font-semibold leading-5 text-gray-950"
            : "mt-0.5 text-xl font-semibold leading-6 text-gray-950"
        }
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

function ThemeSection({ title, values }: { title: string; values: string[] }) {
  return (
    <section>
      <h4 className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{title}</h4>
      {values.length > 0 ? (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {values.map((value) => (
            <span
              key={value}
              className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-semibold text-gray-700"
            >
              {value}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-1 text-sm text-gray-500">N/A</p>
      )}
    </section>
  );
}
