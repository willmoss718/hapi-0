"use client";

import { useEffect, useRef } from "react";
import { useHash } from "@/lib/client-utils";
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
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [hash, id, clearHash]);

  useEffect(() => {
    if (hash !== id) return;

    const timer = window.setTimeout(() => {
      const firstMatch = document.querySelectorAll(`[id="${id}"]`)[0];
      if (firstMatch === cellRef.current) {
        window.scrollBy({ top: 220, behavior: "smooth" });
      }
    }, 150);

    return () => window.clearTimeout(timer);
  }, [hash, id]);

  return (
    <td
      ref={cellRef}
      id={id}
      className="relative p-2 align-middle whitespace-nowrap max-w-xl truncate [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
    >
      <div
        className={cn(
          "absolute inset-0 pointer-events-none transition-all duration-300 z-10",
          isActive(id) ? "bg-amber-100/40" : "bg-amber-100/0",
        )}
      />
      {children}
    </td>
  );
}