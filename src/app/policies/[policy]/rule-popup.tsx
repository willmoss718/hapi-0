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
        <div className="absolute bottom-full left-0 z-50 mb-2 w-80 rounded-[2px] border border-[#aebbb4] bg-background p-4 shadow-lg">
          <p className="text-sm leading-snug text-foreground/80">
            This policy falls under the realm of{" "}
            <strong>{rule}</strong>{" "}
            See other states with a similar policy.{" "}
            <Link
              href={`/operational-implications?rule=${encodeURIComponent(ruleCode)}`}
              className="inline-flex items-center gap-0.5 font-medium text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary"
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
