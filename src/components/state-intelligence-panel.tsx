import type { StateIntelligence } from "@/lib/state-policy-intelligence";
type StateIntelligencePanelProps = {
  state: StateIntelligence;
};

export default function StateIntelligencePanel({ state }: StateIntelligencePanelProps) {
  const latestPolicyDate = state.latestPolicyDate || "N/A";
  const firstPolicyDate = state.firstPolicyDate || "N/A";
  const visibleRecentPolicies = state.recentPolicies.slice(0, 3);

  return (
    <aside className="w-full border-y border-foreground/25 bg-background py-3 text-foreground">
      <div className="flex items-start justify-between gap-4 border-b border-foreground/20 px-4 pb-3">
        <div className="min-w-0">
          <p className="text-label text-muted-foreground">
            State Intelligence
          </p>
          <h3 className="font-editorial mt-1 truncate text-3xl font-semibold leading-none">{state.name}</h3>
        </div>
        <DateBadge label="First policy" value={firstPolicyDate} subdued />
      </div>

      <div className="grid grid-cols-[1.4fr_0.6fr_0.75fr] border-b border-foreground/20">
        <div className="border-r border-t-2 border-r-foreground/15 border-t-[#b3a27a] px-4 py-2.5">
          <p className="text-label text-[#755f2c]">Most Recent Policy</p>
          <p className="font-editorial mt-1 text-lg font-semibold leading-none">{latestPolicyDate}</p>
        </div>
        <PolicyCount label="Total" value={state.totalPolicies.toLocaleString()} tone="teal" />
        <PolicyCount label="High impact" value={state.highImpactPolicies.toLocaleString()} tone="blue" />
      </div>

      <section className="px-4 py-3">
        <h4 className="text-label text-muted-foreground">
          Recent Policies
        </h4>
        {visibleRecentPolicies.length > 0 ? (
          <div className="mt-2 border-t border-foreground/20">
            {visibleRecentPolicies.map((policy) => (
              <div key={`${policy.title}-${policy.dateLabel}`} className="border-b border-foreground/15 py-2 last:border-b-0">
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

      <div className="border-t border-foreground/20 px-4 py-3">
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

function PolicyCount({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "teal" | "blue";
}) {
  const toneClasses = tone === "teal"
    ? "border-t-[#7f9f95] text-[#1f665d]"
    : "border-t-[#879aad] text-[#405a73]";

  return (
    <div className={`flex min-w-0 flex-col justify-center border-r border-t-2 border-foreground/15 px-3 py-2.5 last:border-r-0 ${toneClasses}`}>
      <span className="text-label whitespace-nowrap">{label}</span>
      <span className="font-editorial mt-1 text-2xl font-semibold leading-none text-foreground">{value}</span>
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
      <h4 className="text-label text-primary">{title}</h4>
      {values.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {values.map((value, index) => (
            <span
              key={value}
              className={`border px-1.5 py-0.5 text-xs font-semibold leading-5 ${
                index % 3 === 0
                  ? "border-[#7f9f95] bg-[#edf4f1] text-[#1f665d]"
                  : index % 3 === 1
                    ? "border-[#879aad] bg-[#eef2f6] text-[#405a73]"
                    : "border-[#b3a27a] bg-[#f7f1e4] text-[#755f2c]"
              }`}
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
