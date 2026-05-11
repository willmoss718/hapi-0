"use client";

import { useState, useRef, useEffect } from "react";
import { CircleHelp, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Props {
  rule: string; // full rule string e.g. "U1: Adverse coverage decisions..."
}

export default function RulePopup({ rule }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const ruleCode = rule.split(":")[0].trim();

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <span ref={ref} className="relative inline-flex items-center align-middle ml-1.5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label="About this rule"
      >
        <CircleHelp className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-2 z-50 w-80 bg-white border rounded-lg shadow-lg p-4">
          <p className="text-sm text-gray-700 leading-snug">
            This policy falls under the realm of{" "}
            <strong>{rule}</strong>{" "}
            See what other states have a similar policy.{" "}
            <Link
              href={`/operational-implications?rule=${encodeURIComponent(ruleCode)}`}
              className="inline-flex items-center gap-0.5 text-foreground underline underline-offset-2 hover:text-muted-foreground font-medium"
              onClick={() => setOpen(false)}
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </p>
        </div>
      )}
    </span>
  );
}
