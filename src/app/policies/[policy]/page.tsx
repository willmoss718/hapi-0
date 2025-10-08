import { FILES } from "@/assets/files";
import { getCsvData } from "@/lib/server-utils";
import neatCsv from "neat-csv";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getRandomTailwindColor, getColumnValue } from "@/lib/utils";
import Back from "./back";

export default async function PolicyPage({ params }: { params: Promise<{ policy: string }> }) {
    const { policy } = await params;
    const decodedPolicy = decodeURIComponent(policy);

    const allCsvFiles = await Promise.all(FILES.map(async (file) => {
        const csv = await getCsvData(file.path);
        return csv ? { file, csv } : null;
    })).then((files) => files.filter((f) => f != null));

    const allRowsWithSource = (
        await Promise.all(
            allCsvFiles.map(async ({ file, csv }) => {
                const rows = await neatCsv(csv);
                return rows.map((row: any) => ({ row, file }));
            })
        )
    ).flat();

    const found = allRowsWithSource.find(({ row }) =>
        Object.values(row).some((value) => value === decodedPolicy)
    );
    const targetRow = found?.row;
    const targetCsv = found?.file;

    if (!targetRow) {
        return redirect('/');
    }

    // Safely extract column values with fallbacks
    const state = getColumnValue(targetRow, "State");
    const policyType = getColumnValue(targetRow, "Policy Type");
    const datePassed = getColumnValue(targetRow, "Date Passed");
    const effectiveDate = getColumnValue(targetRow, "Effective Date");
    const summary = getColumnValue(targetRow, "Summary");
    const healthcareImplications = getColumnValue(targetRow, "Healthcare Implications");
    const impactLevel = getColumnValue(targetRow, "Impact Level");
    const keywordTags = getColumnValue(targetRow, "Keyword Tags");
    const stakeholderTags = getColumnValue(targetRow, "Stakeholder Tags");
    const linkUrl = getColumnValue(targetRow, "Link to Text", "Link to text", "Link To Bill");
    const source = targetCsv?.name.split(" ")[0];

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            {/* Header Section */}
            <div className="space-y-4 mb-8">
                <Back />
                <h1 className="text-4xl font-semibold tracking-tight">
                    {decodedPolicy}
                </h1>
                {(state || policyType) && <div className="flex items-center gap-2">
                    {state && <Badge variant="secondary" className="text-sm font-normal">
                        {state}
                    </Badge>}
                    {policyType && <Badge variant="secondary" className="text-sm font-normal">
                        {policyType}
                    </Badge>}
                    {source && <Badge variant="secondary" className="text-sm font-normal">
                        {source}
                    </Badge>}
                </div>}
            </div>

            {/* Metadata Grid */}
            {(datePassed || effectiveDate) && <div className="grid grid-cols-2 gap-6 mb-8">
                {datePassed && <Card className="p-6">
                    <h2 className="text-sm font-medium text-muted-foreground mb-2">Date Passed</h2>
                    <p className="text-sm">{new Date(datePassed).toLocaleDateString()}</p>
                </Card>}
                {effectiveDate && <Card className="p-6">
                    <h2 className="text-sm font-medium text-muted-foreground mb-2">Effective Date</h2>
                    <p className="text-sm">{new Date(effectiveDate).toLocaleDateString()}</p>
                </Card>}
            </div>}

            {/* Main Content */}
            <div className="space-y-8">
                {(summary || healthcareImplications) && <article className="leading-tight px-4">
                    {summary && <>
                        <h2 className="text-xl font-semibold mb-4">Summary</h2>
                        <p className="text-gray-700 leading-relaxed">
                            {summary}
                        </p>
                    </>}

                    {healthcareImplications && <>
                        <h2 className="text-xl font-semibold mb-4 mt-10">Healthcare Implications</h2>
                        <p className="text-gray-700 leading-relaxed">
                            {healthcareImplications}
                        </p>
                    </>}
                </article>}

                {/* Tags Section */}
                {(impactLevel || keywordTags || stakeholderTags) && <Card className="p-6">
                    <div className="space-y-4">
                        {impactLevel && <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Impact Level</h3>
                            <Badge variant="secondary" style={{
                                backgroundColor: getRandomTailwindColor("Impact Level"),
                            }}>
                                {impactLevel}
                            </Badge>
                        </div>}
                        
                        {keywordTags && (
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">Keywords</h3>
                                <div className="flex gap-2 flex-wrap">
                                    {keywordTags.split(",").map((tag: string) => (
                                        <Badge key={tag} variant="secondary" style={{
                                            backgroundColor: getRandomTailwindColor("Keyword Tags"),
                                        }}>
                                            {tag.trim()}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {stakeholderTags && (
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">Stakeholders</h3>
                                <div className="flex gap-2 flex-wrap">
                                    {stakeholderTags.split(",").map((tag: string) => (
                                        <Badge key={tag} variant="secondary" style={{
                                            backgroundColor: getRandomTailwindColor("Stakeholder Tags"),
                                        }}>
                                            {tag.trim()}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>}

                {/* Footer Section */}
                {linkUrl && <div className="flex items-center justify-between pt-4">
                    <Button asChild variant="outline">
                        <Link href={linkUrl} target="_blank" rel="noopener noreferrer">
                            View Original Source
                        </Link>
                    </Button>
                </div>}
            </div>
        </div>
    );
}