// app/data/state-policies/page.tsx
import neatCsv from "neat-csv";
import { getCsvData } from "@/lib/server-utils";

type CsvRow = Record<string, string | undefined>;

const STATE_ABBR: Record<string, string> = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA",
  Colorado: "CO", Connecticut: "CT", Delaware: "DE", Florida: "FL", Georgia: "GA",
  Hawaii: "HI", Idaho: "ID", Illinois: "IL", Indiana: "IN", Iowa: "IA",
  Kansas: "KS", Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD",
  Massachusetts: "MA", Michigan: "MI", Minnesota: "MN", Mississippi: "MS",
  Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH",
  "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC",
  "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK", Oregon: "OR", Pennsylvania: "PA",
  "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", Tennessee: "TN",
  Texas: "TX", Utah: "UT", Vermont: "VT", Virginia: "VA", Washington: "WA",
  "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY"
};

function normalizeState(raw?: string): string {
  if (!raw) return "";
  const t = raw.trim();

  if (/^[A-Z]{2}$/.test(t)) return t;
  const paren = t.match(/\(([A-Z]{2})\)\s*$/);
  if (paren) return paren[1];
  if (STATE_ABBR[t]) return STATE_ABBR[t];
  const title = toTitleCase(t);
  if (STATE_ABBR[title]) return STATE_ABBR[title];
  return "";
}

function toTitleCase(s: string) {
  return s
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

// Allowed columns you permit sorting by (keys that your CSV exposes)
const SORTABLE_COLUMNS = new Set([
  "State",
  "state",
  "Policy",
  "Policy name/number",
  "Policy Name/Number",
  "policyName",
  "Date Passed",
  "Date passed",
  "datePassed",
  "Effective Date",
  "Effective date",
  "dateEffective"
]);

export default async function StatePoliciesPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // extract sk and so safely
  const rawSk = Array.isArray(searchParams?.sk)
    ? searchParams?.sk[0]
    : (searchParams?.sk as string | undefined);
  const rawSo = Array.isArray(searchParams?.so)
    ? searchParams?.so[0]
    : (searchParams?.so as string | undefined);

  const csvStr = await getCsvData("state-policies");
  if (!csvStr) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">State Policies</h1>
        <p>Unable to load state policies data (no CSV found).</p>
      </div>
    );
  }

  const rows = (await neatCsv(csvStr)) as CsvRow[];

  // Build safeRows with normalized columns
  const safeRows = rows
    .map((row) => {
      const stateRaw = row.State || row.state || row.Jurisdiction || row["State "] || row["state "];
      const state = normalizeState(stateRaw);

      const policyName = (row["Policy name/number"] ||
        row["Policy Name/Number"] ||
        row["Policy"] ||
        row["policyName"] ||
        "").trim();

      if (!state || !policyName) return null;

      return {
        state,
        policyName,
        policyType: (row["Policy type"] || row["Policy Type"] || row["Type"] || "").trim(),
        datePassed: (row["Date Passed"] || row["Date passed"] || "").trim(),
        effectiveDate: (row["Effective Date"] || row["Effective date"] || "").trim(),
        summary: (row["Summary"] || "").trim(),
        healthcareRelevance: (row["Healthcare relevance/implications"] || row["Healthcare relevance"] || "").trim(),
        link: (row["Link to text"] || row["Link"] || row["URL"] || "").trim(),
      };
    })
    .filter(Boolean) as {
      state: string;
      policyName: string;
      policyType: string;
      datePassed: string;
      effectiveDate: string;
      summary: string;
      healthcareRelevance: string;
      link: string;
    }[];

  // If valid sk provided and allowed, do server-side sort
  const sk = rawSk ? String(rawSk) : undefined;
  const so = rawSo ? String(rawSo).toLowerCase() : "asc";

  if (sk && SORTABLE_COLUMNS.has(sk)) {
    // Map sk to a safe key used in safeRows mapping
    // Accept a few variations
    const keyMap: Record<string, (r: any) => string> = {
      State: (r) => r.state,
      state: (r) => r.state,
      "Policy name/number": (r) => r.policyName,
      "Policy Name/Number": (r) => r.policyName,
      Policy: (r) => r.policyName,
      policyName: (r) => r.policyName,
      "Date Passed": (r) => r.datePassed,
      "Date passed": (r) => r.datePassed,
      datePassed: (r) => r.datePassed,
      "Effective Date": (r) => r.effectiveDate,
      "Effective date": (r) => r.effectiveDate,
    };

    const getter = keyMap[sk];
    if (getter) {
      safeRows.sort((a, b) => {
        const A = (getter(a) || "").toLowerCase();
        const B = (getter(b) || "").toLowerCase();
        if (A === B) return 0;
        return so === "desc" ? (B < A ? -1 : 1) : (A < B ? -1 : 1);
      });
    }
    // if getter isn't present, we simply don't sort (fail safe)
  } else {
    // default stable sort by state then policyName
    safeRows.sort((a, b) => a.state === b.state ? a.policyName.localeCompare(b.policyName) : a.state.localeCompare(b.state));
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">State Policies</h1>
      <p className="mb-4 text-sm text-gray-600">
        State laws and policies related to AI in health care. Click a state on the map to jump to that section.
      </p>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 pr-2">State</th>
            <th className="text-left py-2 pr-2">Policy</th>
            <th className="text-left py-2 pr-2">Type</th>
            <th className="text-left py-2 pr-2">Date Passed</th>
            <th className="text-left py-2 pr-2">Effective Date</th>
            <th className="text-left py-2 pr-2">Summary</th>
            <th className="text-left py-2 pr-2">Healthcare Relevance</th>
          </tr>
        </thead>
        <tbody>
          {safeRows.map((row, idx) => (
            <tr key={idx} id={row.state} className="border-b align-top">
              <td className="py-2 pr-2 font-semibold">{row.state}</td>
              <td className="py-2 pr-2">
                {row.link ? (
                  <a href={row.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{row.policyName}</a>
                ) : (
                  row.policyName
                )}
              </td>
              <td className="py-2 pr-2">{row.policyType}</td>
              <td className="py-2 pr-2">{row.datePassed}</td>
              <td className="py-2 pr-2">{row.effectiveDate}</td>
              <td className="py-2 pr-2 max-w-xs">{row.summary || <span className="text-gray-400">—</span>}</td>
              <td className="py-2 pr-2 max-w-xs">{row.healthcareRelevance || <span className="text-gray-400">—</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
