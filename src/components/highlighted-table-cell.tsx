"use client";

import { useEffect, useRef } from "react";
import { useHash } from "@/lib/client-utils";
import { TableCell } from "./ui/table";
import { cn } from "@/lib/utils";

export default function HighlightedTableCell({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  const cellRef = useRef<HTMLTableCellElement | null>(null);
  const { hash, clearHash, isActive } = useHash({ scroll: true });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

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

  useEffect(() => {
    if (hash !== id) return;

    const timer = window.setTimeout(() => {
      const el = cellRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const topOffset = 140;

      window.scrollTo({
        top: window.scrollY + rect.top - topOffset,
        behavior: "smooth",
      });
    }, 150);

    return () => window.clearTimeout(timer);
  }, [hash, id]);

  return (
    <TableCell
      ref={cellRef}
      id={id}
      className="relative max-w-xl truncate scroll-mt-40"
    >
      <div
        className={cn(
          "absolute inset-0 pointer-events-none transition-all duration-300 z-10",
          isActive(id) ? "bg-amber-100/40" : "bg-amber-100/0",
        )}
      />
      {children}
    </TableCell>
  );
}