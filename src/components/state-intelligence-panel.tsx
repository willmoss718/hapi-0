import type { StateIntelligence } from "@/lib/state-policy-intelligence";
type StateIntelligencePanelProps = {
  state: StateIntelligence;
};

export default function StateIntelligencePanel({ state }: StateIntelligencePanelProps) {
  const latestPolicyDate = state.latestPolicyDate || "N/A";
  const firstPolicyDate = state.firstPolicyDate || "N/A";
  const visibleRecentPolicies = state.recentPolicies.slice(0, 3);

  return (
    <aside className="w-full border-y border-foreground/25 bg-background py-4 text-foreground">
      <div className="flex items-start justify-between gap-4 border-b border-foreground/20 px-4 pb-4">
        <div className="min-w-0">
          <p className="text-label text-muted-foreground">
            State Intelligence
          </p>
          <h3 className="font-editorial mt-1 truncate text-3xl font-semibold leading-none">{state.name}</h3>
        </div>
        <DateBadge label="First policy" value={firstPolicyDate} subdued />
      </div>

      <div className="grid grid-cols-[1.15fr_0.85fr] border-b border-foreground/20 bg-[#eef2f6]">
        <div className="border-r border-[#879aad]/45 px-4 py-3">
          <p className="text-label text-muted-foreground">Most Recent Policy</p>
          <p className="font-editorial mt-1 text-xl font-semibold leading-none">{latestPolicyDate}</p>
        </div>
        <div className="px-4 py-3">
          <p className="text-label text-muted-foreground">Policies</p>
          <div className="mt-1.5 flex items-baseline gap-4">
            <PolicyCount label="Total" value={state.totalPolicies.toLocaleString()} />
            <PolicyCount label="High impact" value={state.highImpactPolicies.toLocaleString()} />
          </div>
        </div>
      </div>

      <section className="px-4 py-4">
        <h4 className="text-label text-muted-foreground">
          Recent Policies
        </h4>
        {visibleRecentPolicies.length > 0 ? (
          <div className="mt-2 border-t border-foreground/20">
            {visibleRecentPolicies.map((policy) => (
              <div key={`${policy.title}-${policy.dateLabel}`} className="border-b border-foreground/15 py-2.5">
                <p className="line-clamp-2 text-sm font-semibold leading-5">
                  {policy.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{policy.dateLabel}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">N/A</p>
        )}
      </section>

      <div className="border-t border-foreground/20 bg-[#edf4f1] px-4 py-4">
        <ThemeSection
          title="Operational Implications"
          values={state.operationalImplications}
        />
      </div>
    </aside>
  );
}

function DateBadge({ label, value, subdued }: { label: string; value: string; subdued?: boolean }) {
  return (
    <div className={subdued ? "shrink-0 border-l border-foreground/20 pl-4 text-right" : "shrink-0 text-right"}>
      <p className="text-label text-muted-foreground">{label}</p>
      <p className="mt-1 text-xs font-semibold">{value}</p>
    </div>
  );
}

function PolicyCount({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="font-editorial text-2xl font-semibold leading-none">{value}</span>
      <span className="text-[0.64rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{label}</span>
    </div>
  );
}

function ThemeSection({
  title,
  values,
}: {
  title: string;
  values: string[];
}) {
  return (
    <section>
      <h4 className="text-label text-muted-foreground">{title}</h4>
      {values.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {values.map((value) => (
            <span
              key={value}
              className="border border-[#7f9f95] bg-background px-2 py-1 text-xs font-semibold text-primary"
            >
              {value}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-1 text-sm text-muted-foreground">N/A</p>
      )}
    </section>
  );
}
