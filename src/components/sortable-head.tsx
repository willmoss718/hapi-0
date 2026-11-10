"use client";

import { parseAsString, useQueryState } from "nuqs";
import { TableHead, TableHeader, TableRow } from "./ui/table";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

export function SortableHeader({ validKeys, editorial = false }: { validKeys: string[]; editorial?: boolean }) {
    const [sortByKey, setSortByKey] = useQueryState("sk", parseAsString.withDefault("").withOptions({ shallow: false }));
    const [sortOrder, setSortOrder] = useQueryState("so", parseAsString.withDefault("asc").withOptions({ shallow: false, clearOnDefault: false }));

    return (
        <TableHeader className={editorial ? "bg-[#e6eeeb]" : "bg-gray-100"}>
            <TableRow>
                {validKeys.map((header) => (
                    <TableHead
                        key={header}
                        className={cn(
                            "cursor-pointer hover:font-bold",
                            editorial ? "h-12 px-3 text-[0.68rem] font-semibold uppercase tracking-[0.07em] text-foreground/75" : "",
                            sortByKey === header ? "font-bold" : ""
                        )}
                        onClick={() => {
                            setSortByKey(header);
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        }}>
                        <span className="inline-flex items-center gap-1.5">
                        {header}
                        {header.toLowerCase().includes("effective") && (
                            <span className="text-gray-700 text-base leading-none relative -top-0.5">
                            *
                            </span>
                        )}
                        </span>
                        {sortByKey === header ? (sortOrder === "asc" ? <ArrowUpIcon className="size-3.5" /> : <ArrowDownIcon className="size-3.5" />) : null}
                    </TableHead>
                ))}
            </TableRow>
        </TableHeader>
    )
}
