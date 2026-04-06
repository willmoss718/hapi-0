"use client";

import { useEffect } from "react";
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
      const firstMatch = document.querySelector<HTMLElement>(
        `td[data-state="${id}"]`
      );

      firstMatch?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [hash, id]);

  return (
    <TableCell
      data-state={id}
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