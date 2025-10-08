import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getRandomTailwindColor, getColumnValue } from "@/lib/utils";

type PolicyData = {
  [key: string]: string;
};

export default function PolicyPreview({ data }: { data: PolicyData }) {
  const state = getColumnValue(data, "State");
  const policyType = getColumnValue(data, "Policy Type");
  const datePassed = getColumnValue(data, "Date Passed");
  const effectiveDate = getColumnValue(data, "Effective Date");
  const summary = getColumnValue(data, "Summary");
  const healthcareImplications = getColumnValue(data, "Healthcare Implications");
  const impactLevel = getColumnValue(data, "Impact Level");
  const keywordTags = getColumnValue(data, "Keyword Tags");
  const stakeholderTags = getColumnValue(data, "Stakeholder Tags");
  const linkUrl = getColumnValue(data, "Link to Text", "Link to text", "Link To Bill");
  
  // Get the policy name (second column, index 1)
  const policyName = data[Object.keys(data)[1]];

  return (
    <div className="p-6 bg-gray-50 border-t">
      <div className="max-w-4xl space-y-4">
        {/* Header with state and type badges */}
        {(state || policyType) && (
          <div className="flex items-center gap-2 flex-wrap">
            {state && (
              <Badge variant="secondary" className="text-sm font-normal">
                {state}
              </Badge>
            )}
            {policyType && (
              <Badge variant="secondary" className="text-sm font-normal">
                {policyType}
              </Badge>
            )}
          </div>
        )}

        {/* Dates in a compact grid */}
        {(datePassed || effectiveDate) && (
          <div className="grid grid-cols-2 gap-4 max-w-md">
            {datePassed && (
              <div className="space-y-1">
                <h3 className="text-xs font-medium text-muted-foreground">Date Passed</h3>
                <p className="text-sm">{new Date(datePassed).toLocaleDateString()}</p>
              </div>
            )}
            {effectiveDate && (
              <div className="space-y-1">
                <h3 className="text-xs font-medium text-muted-foreground">Effective Date</h3>
                <p className="text-sm">{new Date(effectiveDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        )}

        {/* Summary and Healthcare Implications */}
        <div className="space-y-3">
          {summary && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Summary</h3>
              <p className="text-sm text-gray-700 line-clamp-3">{summary}</p>
            </div>
          )}

          {healthcareImplications && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Healthcare Implications</h3>
              <p className="text-sm text-gray-700 line-clamp-2">{healthcareImplications}</p>
            </div>
          )}
        </div>

        {/* Tags section */}
        <div className="space-y-2">
          {impactLevel && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Impact:</span>
              <Badge 
                variant="secondary" 
                className="text-xs"
                style={{
                  backgroundColor: getRandomTailwindColor("Impact Level"),
                }}
              >
                {impactLevel}
              </Badge>
            </div>
          )}

          {keywordTags && (
            <div className="flex items-start gap-2">
              <span className="text-xs font-medium text-muted-foreground mt-0.5">Keywords:</span>
              <div className="flex gap-1 flex-wrap">
                {keywordTags.split(",").map((tag: string) => (
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

          {stakeholderTags && (
            <div className="flex items-start gap-2">
              <span className="text-xs font-medium text-muted-foreground mt-0.5">Stakeholders:</span>
              <div className="flex gap-1 flex-wrap">
                {stakeholderTags.split(",").map((tag: string) => (
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
            <Link href={`/policies/${encodeURIComponent(policyName)}`}>
              View Full Details
            </Link>
          </Button>
          {linkUrl && (
            <Button asChild size="sm" variant="outline">
              <Link href={linkUrl} target="_blank" rel="noopener noreferrer">
                Original Source
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
