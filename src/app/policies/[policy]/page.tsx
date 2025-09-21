import { FILES } from "@/assets/files";
import { getCsvData } from "@/lib/server-utils";
import neatCsv from "neat-csv";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function PolicyPage({ params }: { params: Promise<{ policy: string }> }) {
    const { policy } = await params;
    const decodedPolicy = decodeURIComponent(policy);

    const allCsvFiles = await Promise.all(FILES.map((file) => getCsvData(file.path))).then((files) => files.filter((file) => file != null));
    const allCsvData = await Promise.all(allCsvFiles.map((csv) => neatCsv(csv))).then((data) => data.flat());
    const targetRow = allCsvData.find((row) => Object.values(row).some((value) => value === decodedPolicy));
    if (!targetRow) {
        return redirect('/');
    }

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            {/* Header Section */}
            <div className="space-y-4 mb-8">
                <h2 className="text-lg font-medium text-muted-foreground mb-2">
                    Policy Details
                </h2>
                <h1 className="text-4xl font-semibold tracking-tight">
                    {targetRow["Policy Name/Number"]} – Artificial Intelligence Task Force
                </h1>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-sm font-normal">
                        {targetRow["﻿State"]}
                    </Badge>
                    <Badge variant="secondary" className="text-sm font-normal">
                        {targetRow["Policy Type"]}
                    </Badge>
                </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                <Card className="p-6">
                    <h2 className="text-sm font-medium text-muted-foreground mb-2">Date Passed</h2>
                    <p className="text-sm">{new Date(targetRow["Date Passed"]).toLocaleDateString()}</p>
                </Card>
                <Card className="p-6">
                    <h2 className="text-sm font-medium text-muted-foreground mb-2">Effective Date</h2>
                    <p className="text-sm">{new Date(targetRow["Effective Date"]).toLocaleDateString()}</p>
                </Card>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
                <article className="leading-tight px-4">
                    <h2 className="text-xl font-semibold mb-4">Summary</h2>
                    <p className="text-gray-700 leading-relaxed">
                        {targetRow["Summary"]}
                    </p>

                    <h2 className="text-xl font-semibold mb-4 mt-10">Healthcare Implications</h2>
                    <p className="text-gray-700 leading-relaxed">
                        {targetRow["Healthcare Implications"]}
                    </p>
                </article>

                {/* Tags Section */}
                <Card className="p-6">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Impact Level</h3>
                            <Badge variant="secondary">
                                {targetRow["Impact Level"]}
                            </Badge>
                        </div>
                        
                        {targetRow["Keyword Tags"] && (
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">Keywords</h3>
                                <div className="flex gap-2 flex-wrap">
                                    {targetRow["Keyword Tags"].split(",").map((tag: string) => (
                                        <Badge key={tag} variant="outline">
                                            {tag.trim()}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {targetRow["Stakeholder Tags"] && (
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">Stakeholders</h3>
                                <div className="flex gap-2 flex-wrap">
                                    {targetRow["Stakeholder Tags"].split(",").map((tag: string) => (
                                        <Badge key={tag} variant="outline">
                                            {tag.trim()}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Footer Section */}
                <div className="flex items-center justify-between pt-4">
                    {targetRow["Link To Bill"] && <Button asChild variant="outline">
                        <Link href={targetRow["Link To Bill"]} target="_blank" rel="noopener noreferrer">
                            View Original Bill
                        </Link>
                    </Button>}
                    {targetRow["Last Updated On"] && <p className="text-sm text-muted-foreground">
                        Last updated: {targetRow["Last Updated On"]}
                    </p>}
                </div>
            </div>
        </div>
    );
}