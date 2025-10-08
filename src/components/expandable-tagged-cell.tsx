"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { TableCell } from "@/components/ui/table";
import { getRandomTailwindColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ExpandableTaggedCellProps {
  value: string;
  row: Record<string, string>;
  tagKeys: string[];
  isExpanded?: boolean;
}

export function ExpandableTaggedCell({ value, row, tagKeys, isExpanded }: ExpandableTaggedCellProps) {
  return (
    <TableCell className="max-w-xl overflow-x-auto whitespace-nowrap">
      <div className="flex items-start gap-2">
        <button
          data-expand-trigger
          className="mt-0.5 p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
          aria-label={isExpanded ? "Collapse row" : "Expand row"}
        >
          <ChevronDown 
            className={cn(
              "w-4 h-4 transition-transform duration-200 ease-in-out",
              isExpanded && "rotate-180"
            )} 
          />
        </button>
        <div className="flex-1">
          <Link 
            href={`/policies/${encodeURIComponent(value)}`}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="underline underline-offset-4 font-semibold hover:text-gray-700">
              {value}
            </span>
            <div className="flex flex-row gap-2 mt-2 overflow-x-auto">
              {tagKeys.map((tagKey) => {
                const rawValue = row[tagKey];
                const semicolonDelimitedValues = rawValue.split(";");
                return semicolonDelimitedValues.map((value) => (
                  <Badge
                    key={value}
                    variant="secondary"
                    className="empty:hidden"
                    style={{
                      backgroundColor: getRandomTailwindColor(tagKey),
                    }}
                  >
                    {value}
                  </Badge>
                ));
              })}
            </div>
          </Link>
        </div>
      </div>
    </TableCell>
  );
}

ExpandableTaggedCell.displayName = 'ExpandableTaggedCell';
