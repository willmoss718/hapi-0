import { FILES } from "@/assets/files";
import { getCsvData } from "@/lib/server-utils";
import neatCsv from "neat-csv";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  getRandomTailwindColor,
  getColumnValue,
  getColumnValueStartsWith,
} from "@/lib/utils";
import Back from "./back";
import RulePopup from "./rule-popup";

function parseTags(tags: string) {
  return tags
    .split(/[;,]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ policy: string }>;
}) {
  const { policy } = await params;
  const decodedPolicy = decodeURIComponent(policy);

  const allCsvFiles = await Promise.all(
    FILES.map(async (file) => {
      const csv = await getCsvData(file.path);
      return csv ? { file, csv } : null;
    }),
  ).then((files) => files.filter((f) => f != null));

  const allRowsWithSource = (
    await Promise.all(
      allCsvFiles.map(async ({ file, csv }) => {
        const rows = await neatCsv(csv);
        return rows.map((row: any) => ({ row, file }));
      }),
    )
  ).flat();

  const found = allRowsWithSource.find(({ row }) =>
    Object.values(row).some((value) => value === decodedPolicy),
  );
  const targetRow = found?.row;
  const targetCsv = found?.file;

  if (!targetRow) {
    return redirect("/");
  }

  // Safely extract column values with fallbacks
  const state = getColumnValue(targetRow, "State");
  const policyType = getColumnValue(targetRow, "Policy Type");
  const datePassed = getColumnValue(targetRow, "Date Passed");
  const effectiveDate = getColumnValue(targetRow, "Effective Date");
  const summary = getColumnValue(targetRow, "Summary");
  const healthcareImplications = getColumnValue(
    targetRow,
    "Healthcare Implications",
  );
  const impactLevel = getColumnValue(targetRow, "Impact Level");
  const keywordTags = getColumnValue(targetRow, "Keyword Tags");
  const stakeholderTags = getColumnValue(targetRow, "Stakeholder Tags");
  const specificImplications = getColumnValue(targetRow, "Specific Implications");
  const taxonomyRules = getColumnValue(targetRow, "Taxonomy Rules");
  const linkUrl = getColumnValue(
    targetRow,
    "Link to Text",
    "Link to text",
    "Link To Bill",
  );
  const dateIssued = getColumnValueStartsWith(targetRow, "Date");
  const source = targetCsv?.name.split(" ")[0];

  return (
    <div className="mx-auto mt-6 max-w-4xl pb-12 md:mt-8">
      {/* Header Section */}
      <div className="mb-8 space-y-5">
        <div className="flex flex-row items-center justify-between w-full">
          <Back />
          {dateIssued && !(datePassed || effectiveDate) && (
            <span className="flex flex-row items-end gap-1.5 text-sm font-medium tracking-tight">
              <span className="text-muted-foreground">Issued</span>
              <span className="text-foreground">{dateIssued}</span>
            </span>
          )}
        </div>
        <h1 className="font-editorial text-4xl font-semibold leading-[1.05] tracking-[-0.025em] md:text-5xl">
          {decodedPolicy}
        </h1>
        {(state || policyType) && (
          <div className="flex items-center gap-2">
            {state && (
              <Badge variant="secondary" className="rounded-[2px] border border-[#879aad] bg-[#eef2f6] text-sm font-normal">
                {state}
              </Badge>
            )}
            {policyType && (
              <Badge variant="secondary" className="rounded-[2px] border border-[#aebbb4] bg-[#f3efea] text-sm font-normal">
                {policyType}
              </Badge>
            )}
            {source && (
              <Badge variant="secondary" className="rounded-[2px] border border-[#7f9f95] bg-[#edf4f1] text-sm font-normal">
                {source}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Metadata Grid */}
      {(datePassed || effectiveDate) && (
        <div className="mb-10 grid grid-cols-2 rounded-[2px] border border-[#aebbb4] bg-[#edf4f1]/55">
          {datePassed && (
            <div className="border-r border-[#aebbb4]/60 p-5 last:border-r-0">
              <h2 className="text-label mb-2 text-muted-foreground">
                Date Passed
              </h2>
              <p className="font-editorial text-lg font-semibold">
                {new Date(datePassed).toLocaleDateString()}
              </p>
            </div>
          )}
          {effectiveDate && (
            <div className="p-5">
              <h2 className="text-label mb-2 text-muted-foreground">
                Effective Date
              </h2>
              <p className="font-editorial text-lg font-semibold">
                {new Date(effectiveDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-8">
        {(summary || healthcareImplications) && (
          <article className="px-0 leading-tight md:px-4">
            {summary && (
              <>
                <h2 className="font-editorial mb-4 text-2xl font-semibold">Summary</h2>
                <p className="text-[1.03rem] leading-8 text-foreground/85">{summary}</p>
              </>
            )}

            {healthcareImplications && (
              <>
                <h2 className="font-editorial mb-4 mt-10 border-t border-border pt-6 text-2xl font-semibold">
                  Healthcare Implications
                </h2>
                <p className="text-[1.03rem] leading-8 text-foreground/85">
                  {healthcareImplications}
                </p>
              </>
            )}

            {specificImplications && (
              <>
                <h2 className="font-editorial mb-4 mt-10 border-t border-border pt-6 text-2xl font-semibold">
                  Operational Implications
                </h2>
                <ul className="ml-5 list-outside list-disc space-y-3 text-[1.03rem] leading-8 text-foreground/85">
                  {specificImplications.split("|").map((item, i) => {
                    const ruleTokens = taxonomyRules
                      ? taxonomyRules.split("|").map((r) => r.trim())
                      : [];
                    const rule = ruleTokens[i];
                    const validRule = rule && rule !== "None" ? rule : null;
                    return (
                      <li key={i}>
                        {item.trim()}
                        {validRule && <RulePopup rule={validRule} />}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </article>
        )}

        {/* Tags Section */}
        {(impactLevel || keywordTags || stakeholderTags) && (
          <section className="rounded-[2px] border border-[#aebbb4] bg-[#edf4f1]/40 p-5 md:p-6">
            <div className="space-y-4">
              {impactLevel && (
                <div>
                  <h3 className="text-label mb-2 text-muted-foreground">
                    Impact Level
                  </h3>
                  <Badge
                    variant="secondary"
                    className="rounded-[2px] border border-foreground/10"
                    style={{
                      backgroundColor: getRandomTailwindColor("Impact Level"),
                    }}
                  >
                    {impactLevel}
                  </Badge>
                </div>
              )}

              {keywordTags && (
                <div>
                  <h3 className="text-label mb-2 text-muted-foreground">
                    Keywords
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {parseTags(keywordTags).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="rounded-[2px] border border-foreground/10"
                        style={{
                          backgroundColor:
                            getRandomTailwindColor("Keyword Tags"),
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {stakeholderTags && (
                <div>
                  <h3 className="text-label mb-2 text-muted-foreground">
                    Stakeholders
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {parseTags(stakeholderTags).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="rounded-[2px] border border-foreground/10"
                        style={{
                          backgroundColor:
                            getRandomTailwindColor("Stakeholder Tags"),
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Footer Section */}
        {linkUrl && (
          <div className="flex items-center justify-between pt-4">
            <Button asChild className="rounded-[2px] border-[#879aad] bg-[#eef2f6] shadow-none hover:bg-background" variant="outline">
              <Link href={linkUrl} target="_blank" rel="noopener noreferrer">
                View Original Source
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
