"use client";

import { useEffect, useRef } from "react";
import { useHash } from "@/lib/client-utils";
import { TableCell } from "./ui/table";

export default function HighlightedTableCell({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  const cellRef = useRef<HTMLTableCellElement>(null);
  const { hash, clearHash } = useHash({ scroll: false });

  useEffect(() => {
    if (hash !== id) return;

    const timer = window.setTimeout(() => {
      const firstCell = document.querySelector<HTMLElement>(
        `td[data-state="${id}"]`
      );
      if (firstCell !== cellRef.current) return;

      const targetRow = document.querySelector<HTMLElement>(
        `tr[data-state-row="${id}"]`
      );
      if (!targetRow) return;

      document
        .querySelectorAll<HTMLElement>(".state-row-highlight")
        .forEach((row) => row.classList.remove("state-row-highlight"));

      targetRow.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      targetRow.classList.add("state-row-highlight");

      window.setTimeout(() => {
        targetRow.classList.remove("state-row-highlight");
        clearHash();
      }, 2200);
    }, 100);

    return () => window.clearTimeout(timer);
  }, [hash, id, clearHash]);

  return (
    <TableCell
      ref={cellRef}
      data-state={id}
      className="max-w-xl truncate scroll-mt-40"
    >
      {children}
    </TableCell>
  );
}
