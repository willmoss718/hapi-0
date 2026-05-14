import { getCsvData } from "@/lib/server-utils";
import neatCsv from "neat-csv";
import ImplicationsTable, { PolicyMatch } from "./implications-table";

const ALL_STATES = [
  "AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD",
  "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH",
  "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY",
];

function parseRuleCode(code: string): { prefix: string; num: number; suffix: string } {
  const match = code.match(/^([A-Z]+)(\d+)([a-z]*)/);
  if (!match) return { prefix: code, num: 0, suffix: "" };
  return { prefix: match[1], num: parseInt(match[2]), suffix: match[3] };
}

function getRuleCode(rule: string) {
  return rule.split(":")[0].trim();
}

function getRuleDescription(rule: string) {
  return rule.split(":").slice(1).join(":").trim();
}

export default async function OperationalImplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ rule?: string }>;
}) {
  const { rule: initialRuleCode } = await searchParams;
  const csvStr = await getCsvData("state-policies");
  const rows = csvStr ? await neatCsv(csvStr) : [];

  const ruleToStates: Record<string, Set<string>> = {};
  const policyDetails: Record<string, Record<string, PolicyMatch[]>> = {};
  const ruleDescriptions: Record<string, string> = {};

  for (const row of rows) {
    const state = (row["State"] ?? "").trim();
    const rulesRaw = (row["Taxonomy Rules"] ?? "").trim();
    if (!state || !rulesRaw || rulesRaw === "None") continue;

    const policyName = (row["Policy Name/Number"] ?? "").trim();
    const link = (row["Link to Text"] ?? row["Link to text"] ?? row["Link To Bill"] ?? "").trim();
    const ruleTokens = rulesRaw.split("|").map((r) => r.trim());
    const implTokens = (row["Specific Implications"] ?? "").split("|").map((s) => s.trim());

    for (let idx = 0; idx < ruleTokens.length; idx++) {
      const rule = ruleTokens[idx];
      if (!rule || rule === "None") continue;
      const ruleCode = getRuleCode(rule);
      const ruleDescription = getRuleDescription(rule);
      ruleDescriptions[ruleCode] ??= ruleDescription;
      const canonicalRule = ruleDescriptions[ruleCode]
        ? `${ruleCode}: ${ruleDescriptions[ruleCode]}`
        : ruleCode;

      (ruleToStates[canonicalRule] ??= new Set()).add(state);

      const byState = (policyDetails[canonicalRule] ??= {});
      (byState[state] ??= []).push({
        name: policyName,
        link,
        specificImplication: implTokens[idx] ?? null,
      });
    }
  }

  const sortedRules = Object.keys(ruleToStates).sort((a, b) => {
    const pa = parseRuleCode(a.split(":")[0].trim());
    const pb = parseRuleCode(b.split(":")[0].trim());
    if (pa.prefix !== pb.prefix) return pa.prefix.localeCompare(pb.prefix);
    if (pa.num !== pb.num) return pa.num - pb.num;
    return pa.suffix.localeCompare(pb.suffix);
  });

  const matrix = Object.fromEntries(
    sortedRules.map((rule) => [rule, [...ruleToStates[rule]]])
  );

  return (
    <div className="py-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-semibold tracking-tight">Operational Implications</h1>
        <p className="text-xl text-muted-foreground">
          See common policies and which states have enacted them.
        </p>
      </div>
      <ImplicationsTable
        rules={sortedRules}
        matrix={matrix}
        states={ALL_STATES}
        policyDetails={policyDetails}
        initialRuleCode={initialRuleCode}
      />
    </div>
  );
}
