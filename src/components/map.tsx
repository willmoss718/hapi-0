"use client";

import USAMap from "@mirawision/usa-map-react";
import mapData from "@/assets/Map-Data.json";
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
  hoveredState?: string | null;
  onStateHover?: (state: string | null) => void;
  compact?: boolean;
};

export default function Map({
  statePolicyCounts,
  hoveredState,
  onStateHover,
  compact = false,
}: MapProps) {
  const router = useRouter();

  const customStates = useMemo(() => {
    const states: Record<string, CustomState> = {};

    for (const state of ALL_US_STATES) {
      const baseFill = getStateFill(state);
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
  }, [hoveredState, onStateHover, router, statePolicyCounts]);

  return (
    <div
      className="w-full h-full overflow-hidden rounded-lg border border-gray-200"
      onMouseLeave={() => onStateHover?.(null)}
    >
      <USAMap
        className={cn("w-full h-full", compact ? "p-4 md:p-5" : "p-8")}
        customStates={customStates}
      />
      <legend
        className={cn(
          "flex flex-col justify-start items-start gap-1 border-t border-gray-200",
          compact ? "p-4 text-sm" : "p-8",
        )}
      >
        <h3 className="uppercase font-medium tracking-wide">Explore by State</h3>
        <div
          className={cn(
            "flex justify-start gap-2",
            compact
              ? "flex-col items-start text-xs sm:flex-row sm:flex-wrap sm:items-center"
              : "flex-row items-center",
          )}
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500"></div>
            <p>State Law(s) Present</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500"></div>
            <p>State Policies, No Law</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#D3D3D3]"></div>
            <p>No State Policies</p>
          </div>
        </div>
      </legend>
    </div>
  );
}

function getStateFill(state: string) {
  if (mapData["law-present"].includes(state)) return "#30c48d";
  if (mapData["policies-no-law"].includes(state)) return "#5a8def";
  return "#D3D3D3";
}

function getHoveredFill(fill: string) {
  if (fill === "#30c48d") return "#22d38f";
  if (fill === "#5a8def") return "#3f7df4";
  return "#b9c0ca";
}

const ALL_US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];
