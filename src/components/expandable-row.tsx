"use client";

import { useState, ReactNode, Children, cloneElement, isValidElement } from "react";
import { TableRow } from "./ui/table";
import { cn } from "@/lib/utils";

interface ExpandableRowProps {
  children: ReactNode;
  expandedContent: ReactNode;
  className?: string;
}

export function ExpandableRow({ children, expandedContent, className }: ExpandableRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Pass the isExpanded state to ExpandableTaggedCell children
  const childrenWithProps = Children.map(children, child => {
    if (isValidElement(child) && child?.type && 
        ((child.type as any).displayName === 'ExpandableTaggedCell' || 
         (child.type as any).name === 'ExpandableTaggedCell')) {
      return cloneElement(child as any, { isExpanded });
    }
    return child;
  });

  return (
    <>
      <TableRow 
        className={cn("relative", className)}
        data-expanded={isExpanded}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest("[data-expand-trigger]")) {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
      >
        {childrenWithProps}
      </TableRow>
      {isExpanded && (
        <TableRow className="hover:bg-transparent">
          <td colSpan={100} className="p-0">
            {expandedContent}
          </td>
        </TableRow>
      )}
    </>
  );
}