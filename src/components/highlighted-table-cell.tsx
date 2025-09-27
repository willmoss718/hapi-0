"use client";

import { useHash } from "@/lib/client-utils";
import { TableCell } from "./ui/table";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export default function HighlightedTableCell({ children, id }: { children: React.ReactNode, id: string }) {
    const { hash, clearHash, isActive } = useHash({ scroll: true });

    useEffect(() => {
        let timeoutId: NodeJS.Timeout | null = null;
        
        if (hash === id) {
            timeoutId = setTimeout(() => {
                clearHash();
            }, 4000);
        }
        
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [hash, id, clearHash]);
    
    return (
        <TableCell className="max-w-xl truncate">
            <div className={cn(
                "absolute inset-0 pointer-events-none transition-all duration-300 z-10",
                isActive(id) ? "bg-amber-100/40" : "bg-amber-100/0"
            )} id={id} />
            {children}
        </TableCell>
    )
}