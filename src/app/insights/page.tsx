import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

export default function InsightsPage() {
  return (
    <div className="mx-auto mt-6 max-w-5xl md:mt-8">

      <h1 className="font-editorial mb-4 text-4xl font-semibold leading-[1.05] tracking-[-0.025em] md:text-5xl">
        Insights on AI in Healthcare Policy
      </h1>

      <p className="mb-2 text-lg leading-7 text-foreground/80">
        Analysis of how AI policy translates into real-world healthcare practice.
      </p>

      {/* Subtle section byline */}
      <p className="mb-10 text-sm text-muted-foreground">
        By Will Moss · Windreich Dept. of AI and Human Health, Mount Sinai
      </p>

      <div className="border-t border-border">
        <div>

          <Link href="/insights/hospital-governance" className="group flex items-center justify-between gap-6 border-b border-border px-1 py-7 transition-colors hover:bg-[#edf4f1]/55 sm:px-5">
            <div>
              <h2 className="font-editorial text-2xl font-semibold tracking-[-0.01em]">
                Hospitals Are Being Forced to Build AI Governance Themselves
              </h2>
              <p className="mt-1 text-muted-foreground">
                Why hospitals are becoming the primary site of AI oversight.
              </p>
            </div>
            <ArrowRightIcon className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </Link>

          <Link href="/insights/wrong-layer" className="group flex items-center justify-between gap-6 border-b border-border px-1 py-7 transition-colors hover:bg-[#edf4f1]/55 sm:px-5">
            <div>
              <h2 className="font-editorial text-2xl font-semibold tracking-[-0.01em]">
                AI Regulation Is Targeting the Wrong Layer
              </h2>
              <p className="mt-1 text-muted-foreground">
                Why current policy focuses on process instead of clinical use.
              </p>
            </div>
            <ArrowRightIcon className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </Link>

          <Link href="/insights/state-rules" className="group flex items-center justify-between gap-6 border-b border-border px-1 py-7 transition-colors hover:bg-[#edf4f1]/55 sm:px-5">
            <div>
              <h2 className="font-editorial text-2xl font-semibold tracking-[-0.01em]">
                States Are Quietly Setting the Rules for Clinical AI
              </h2>
              <p className="mt-1 text-muted-foreground">
                How state-level policy is shaping real-world deployment decisions.
              </p>
            </div>
            <ArrowRightIcon className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </Link>

        </div>
      </div>

    </div>
  );
}
