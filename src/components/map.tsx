"use client";

import USAMap from "@mirawision/usa-map-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CustomState = {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  onClick?: () => void;
  onHover?: () => void;
  onLeave?: () => void;
  tooltip?: {
    enabled: boolean;
    render?: (state: string) => ReactNode;
  };
};

type MapProps = {
  statePolicyCounts: Record<string, number>;
  stateLawPresence: Record<string, boolean>;
  hoveredState?: string | null;
  onStateHover?: (state: string | null) => void;
  compact?: boolean;
  editorial?: boolean;
};

export default function Map({
  statePolicyCounts,
  stateLawPresence,
  hoveredState,
  onStateHover,
  compact = false,
  editorial = false,
}: MapProps) {
  const router = useRouter();

  const customStates = useMemo(() => {
    const states: Record<string, CustomState> = {};

    for (const state of ALL_US_STATES) {
      const baseFill = getStateFill(state, statePolicyCounts, stateLawPresence);
      const isHovered = hoveredState === state;

      states[state] = {
        fill: isHovered ? getHoveredFill(baseFill) : baseFill,
        stroke: isHovered ? "#111827" : "#ffffff",
        // Keep stroke width fixed so hover never changes map geometry.
        strokeWidth: 1.5,
        onHover: () => onStateHover?.(state),
        onLeave: () => onStateHover?.(null),
        tooltip: { enabled: false },
      };

      if (statePolicyCounts[state]) {
        states[state].onClick = () => {
          router.push(`/data/state-policies?sk=State&so=asc#${state}`);
        };
      }
    }

    return states;
  }, [hoveredState, onStateHover, router, statePolicyCounts, stateLawPresence]);

  const labelStyleRules = useMemo(() => {
    const activeStateSelectors = ALL_US_STATES
      .filter((state) => stateLawPresence[state] || statePolicyCounts[state] > 0)
      .map((state) => `.hapi-policy-map .${state.toLowerCase()}-label`)
      .join(",\n");
    const inactiveStateSelectors = [...ALL_US_STATES, "DC"]
      .filter((state) => !stateLawPresence[state] && !statePolicyCounts[state])
      .map((state) => `.hapi-policy-map .${state.toLowerCase()}-label`)
      .join(",\n");

    return `
      .hapi-policy-map .state-label {
        text-shadow: none !important;
        stroke: none !important;
        paint-order: normal !important;
        font-family: var(--font-public-sans), ui-sans-serif, sans-serif;
        font-weight: 600 !important;
      }
      ${activeStateSelectors} {
        fill: #fffdf6 !important;
      }
      ${inactiveStateSelectors} {
        fill: #1f2933 !important;
      }
    `;
  }, [stateLawPresence, statePolicyCounts]);

  return (
    <div
      className={cn(
        "hapi-policy-map w-full overflow-hidden",
        editorial ? "border-0" : "rounded-lg border border-gray-200",
        !compact && !editorial && "h-full",
      )}
      onMouseLeave={() => onStateHover?.(null)}
    >
      <style>{labelStyleRules}</style>
      <div
        className={cn(
          "w-full",
          compact || editorial ? "aspect-[1.72/1]" : "h-full",
        )}
      >
        <USAMap
          className={cn("w-full h-full", compact ? "p-1 md:p-2" : "p-8")}
          customStates={customStates}
        />
      </div>
      <legend
        className={cn(
          "flex flex-col items-start justify-start gap-2",
          editorial
            ? "border-0 px-0 pb-0 pt-2 text-base"
            : compact
              ? "border-t border-gray-200 p-4 text-base"
              : "border-t border-gray-200 p-8",
        )}
      >
        <h2 className={cn(editorial ? "font-editorial text-2xl font-semibold" : "uppercase font-medium tracking-wide")}>Explore by State</h2>
        <div
          className={cn(
            "flex justify-start gap-2",
            compact || editorial
              ? "flex-col items-start text-sm sm:flex-row sm:flex-wrap sm:items-center"
              : "flex-row items-center",
          )}
        >
          <div className="flex items-center gap-2">
            <div className="size-3 bg-[#287f73]"></div>
            <p>State Law(s) Present</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 bg-[#5b7896]"></div>
            <p>State Policies, No Law</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 bg-[#d8d5cc]"></div>
            <p>No State Policies</p>
          </div>
        </div>
      </legend>
    </div>
  );
}

function getStateFill(
  state: string,
  statePolicyCounts: Record<string, number>,
  stateLawPresence: Record<string, boolean>,
) {
  if (stateLawPresence[state]) return "#287f73";
  if (statePolicyCounts[state] > 0) return "#5b7896";
  return "#d8d5cc";
}

function getHoveredFill(fill: string) {
  if (fill === "#287f73") return "#1e6b61";
  if (fill === "#5b7896") return "#456581";
  return "#c3bfb4";
}

const ALL_US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];
