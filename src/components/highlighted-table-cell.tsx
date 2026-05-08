"use client";

import { useEffect, useRef } from "react";
import { useHash } from "@/lib/client-utils";
import { TableCell } from "./ui/table";

const removeStateHighlights = () => {
  document
    .querySelectorAll<HTMLElement>(
      ".state-row-highlight, .state-row-highlight-primary"
    )
    .forEach((row) => {
      row.classList.remove("state-row-highlight");
      row.classList.remove("state-row-highlight-primary");
    });
};

export default function HighlightedTableCell({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  const cellRef = useRef<HTMLTableCellElement>(null);
  const { hash } = useHash({ scroll: false });

  useEffect(() => {
    if (!hash) {
      removeStateHighlights();
      return;
    }

    if (hash !== id) return;

    const timer = window.setTimeout(() => {
      const firstCell = document.querySelector<HTMLElement>(
        `td[data-state="${id}"]`
      );
      if (firstCell !== cellRef.current) return;

      const stateRows = Array.from(
        document.querySelectorAll<HTMLElement>(`tr[data-state-row="${id}"]`)
      );
      const targetRow = stateRows[0];
      if (!targetRow) return;

      removeStateHighlights();

      stateRows.forEach((row) => row.classList.add("state-row-highlight"));
      targetRow.classList.add("state-row-highlight-primary");

      const rowTop = targetRow.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: Math.max(rowTop - 12, 0),
        behavior: "smooth",
      });
    }, 100);

    return () => window.clearTimeout(timer);
  }, [hash, id]);

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
