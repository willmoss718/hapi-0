import type { StateIntelligence } from "@/lib/state-policy-intelligence";

type StateIntelligencePanelProps = {
  state: StateIntelligence;
};

export default function StateIntelligencePanel({ state }: StateIntelligencePanelProps) {
  return (
    <aside className="w-full rounded-lg border border-gray-200 bg-white px-5 py-4 text-gray-950">
      <div className="border-b border-gray-100 pb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          State Intelligence
        </p>
        <h3 className="mt-1 text-2xl font-semibold leading-tight">{state.name}</h3>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <MetricCard label="Policies" value={state.totalPolicies.toLocaleString()} />
        <MetricCard label="High Impact" value={state.highImpactPolicies.toLocaleString()} />
      </div>

      <section className="mt-4 rounded-md border border-gray-100 bg-gray-50 px-4 py-3">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          First Policy Date
        </h4>
        <p className="mt-1 text-sm font-semibold text-gray-900">
          {state.firstPolicyDate || "N/A"}
        </p>
      </section>

      <section className="mt-4">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Recent Policies
        </h4>
        {state.recentPolicies.length > 0 ? (
          <div className="mt-2 divide-y divide-gray-100 rounded-md border border-gray-100">
            {state.recentPolicies.map((policy) => (
              <div key={`${policy.title}-${policy.dateLabel}`} className="px-3 py-2.5">
                <p className="line-clamp-2 text-sm font-medium leading-5 text-gray-950">
                  {policy.title}
                </p>
                <p className="mt-1 text-xs font-medium text-gray-500">{policy.dateLabel}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 rounded-md border border-gray-100 px-3 py-2 text-sm text-gray-500">
            N/A
          </p>
        )}
      </section>

      <ThemeSection title="Regulatory Themes" values={state.regulatoryThemes} />
      <ThemeSection title="Stakeholder Themes" values={state.stakeholderThemes} />
    </aside>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-gray-100 bg-gray-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold leading-none text-gray-950">{value}</p>
    </div>
  );
}

function ThemeSection({ title, values }: { title: string; values: string[] }) {
  return (
    <section className="mt-4">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</h4>
      {values.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {values.map((value) => (
            <span
              key={value}
              className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700"
            >
              {value}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-gray-500">N/A</p>
      )}
    </section>
  );
}
