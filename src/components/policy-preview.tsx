import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getRandomTailwindColor } from "@/lib/utils";

type PolicyData = {
  [key: string]: string;
};

export default function PolicyPreview({ data }: { data: PolicyData }) {
  return (
    <div className="p-6 bg-gray-50 border-t">
      <div className="max-w-4xl space-y-4">
        {/* Header with state and type badges */}
        {(data["﻿State"] || data["Policy Type"]) && (
          <div className="flex items-center gap-2 flex-wrap">
            {data["﻿State"] && (
              <Badge variant="secondary" className="text-sm font-normal">
                {data["﻿State"]}
              </Badge>
            )}
            {data["Policy Type"] && (
              <Badge variant="secondary" className="text-sm font-normal">
                {data["Policy Type"]}
              </Badge>
            )}
          </div>
        )}

        {/* Dates in a compact grid */}
        {(data["Date Passed"] || data["Effective Date"]) && (
          <div className="grid grid-cols-2 gap-4 max-w-md">
            {data["Date Passed"] && (
              <div className="space-y-1">
                <h3 className="text-xs font-medium text-muted-foreground">Date Passed</h3>
                <p className="text-sm">{new Date(data["Date Passed"]).toLocaleDateString()}</p>
              </div>
            )}
            {data["Effective Date"] && (
              <div className="space-y-1">
                <h3 className="text-xs font-medium text-muted-foreground">Effective Date</h3>
                <p className="text-sm">{new Date(data["Effective Date"]).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        )}

        {/* Summary and Healthcare Implications */}
        <div className="space-y-3">
          {data["Summary"] && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Summary</h3>
              <p className="text-sm text-gray-700 line-clamp-3">{data["Summary"]}</p>
            </div>
          )}

          {data["Healthcare Implications"] && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Healthcare Implications</h3>
              <p className="text-sm text-gray-700 line-clamp-2">{data["Healthcare Implications"]}</p>
            </div>
          )}
        </div>

        {/* Tags section */}
        <div className="space-y-2">
          {data["Impact Level"] && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Impact:</span>
              <Badge 
                variant="secondary" 
                className="text-xs"
                style={{
                  backgroundColor: getRandomTailwindColor("Impact Level"),
                }}
              >
                {data["Impact Level"]}
              </Badge>
            </div>
          )}

          {data["Keyword Tags"] && (
            <div className="flex items-start gap-2">
              <span className="text-xs font-medium text-muted-foreground mt-0.5">Keywords:</span>
              <div className="flex gap-1 flex-wrap">
                {data["Keyword Tags"].split(",").map((tag: string) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="text-xs"
                    style={{
                      backgroundColor: getRandomTailwindColor("Keyword Tags"),
                    }}
                  >
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {data["Stakeholder Tags"] && (
            <div className="flex items-start gap-2">
              <span className="text-xs font-medium text-muted-foreground mt-0.5">Stakeholders:</span>
              <div className="flex gap-1 flex-wrap">
                {data["Stakeholder Tags"].split(",").map((tag: string) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="text-xs"
                    style={{
                      backgroundColor: getRandomTailwindColor("Stakeholder Tags"),
                    }}
                  >
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-2">
          <Button asChild size="sm" variant="default">
            <Link href={`/policies/${encodeURIComponent(data[Object.keys(data)[1]])}`}>
              View Full Details
            </Link>
          </Button>
          {data["Link To Bill"] && (
            <Button asChild size="sm" variant="outline">
              <Link href={data["Link To Bill"]} target="_blank" rel="noopener noreferrer">
                Original Bill
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
