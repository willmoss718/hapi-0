"use client";

import { parseAsString, useQueryState } from "nuqs";
import { TableHead, TableHeader, TableRow } from "./ui/table";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

export function SortableHeader({ validKeys }: { validKeys: string[] }) {
    const [sortByKey, setSortByKey] = useQueryState("sk", parseAsString.withDefault("").withOptions({ shallow: false }));
    const [sortOrder, setSortOrder] = useQueryState("so", parseAsString.withDefault("asc").withOptions({ shallow: false, clearOnDefault: false }));

    return (
        <TableHeader className="bg-gray-100">
            <TableRow>
                {validKeys.map((header) => (
                    <TableHead
                        key={header}
                        className={cn(
                            "cursor-pointer hover:font-bold",
                            sortByKey === header ? "font-bold flex flex-row items-center gap-2" : ""
                        )}
                        onClick={() => {
                            setSortByKey(header);
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        }}>
                        <span className="inline-flex items-baseline gap-0.5">
                        {header}
                        {header.toLowerCase().includes("effective") && (
                            <span className="text-gray-700 text-base leading-none relative -top-0.5">
                            *
                            </span>
                        )}
                        </span>
                        {sortByKey === header ? (sortOrder === "asc" ? <ArrowUpIcon className="size-4" /> : <ArrowDownIcon className="size-4" />) : null}
                    </TableHead>
                ))}
            </TableRow>
        </TableHeader>
    )
}