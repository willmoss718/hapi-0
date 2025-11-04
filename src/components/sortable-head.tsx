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
                        {/* Header label with optional info icon */}
                        <span className="inline-flex items-center gap-1">
                        {header}
                        {header.toLowerCase().includes("effective") && (
                            <span
                            title="Some policies have multiple effective dates; this table shows one primary date."
                            aria-label="Effective date info"
                            className="inline-block align-middle cursor-help opacity-60 text-xs leading-none"
                            >
                            ⓘ
                            </span>
                        )}
                        </span>

                        {/* Sort icons */}
                        {sortKey === header ? (
                        sortOrder === "asc" ? (
                            <ArrowUpIcon className="size-4" />
                        ) : (
                            <ArrowDownIcon className="size-4" />
                        )
                        ) : null}
                    </TableHead>
                ))}
            </TableRow>
        </TableHeader>
    )
}