"use client";

import { useMemo, useState } from "react";
import USAMap from "@mirawision/usa-map-react";
import mapData from "@/assets/Map-Data.json";
import WhatsNew from "@/components/whats-new";
import InsightsCarousel from "@/components/insights-carousel";

type StateStats = {
  policyCount: number;
  highImpactCount: number;
  lastUpdatedYear: string | null;
};

type Props = {
  stateStats: Record<string, StateStats>;
};

export default function StateHoverProxy({ stateStats }: Props) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const customStates = useMemo(() => {
    const states: Record<string, any> = {};

    const withLaws = mapData["law-present"];
    const policiesOnly = mapData["policies-no-law"];

    for (const state of withLaws) {
      states[state] = {
        fill: "#30c48d",
        onMouseEnter: () => setHoveredState(state),
        onMouseLeave: () => setHoveredState(null),
        tooltip: { enabled: false },
      };
    }

    for (const state of policiesOnly) {
      states[state] = {
        fill: "#5a8def",
        onMouseEnter: () => setHoveredState(state),
        onMouseLeave: () => setHoveredState(null),
        tooltip: { enabled: false },
      };
    }

    for (const state of ALL_US_STATES) {
      if (!states[state]) {
        states[state] = {
          onMouseEnter: () => setHoveredState(state),
          onMouseLeave: () => setHoveredState(null),
          tooltip: { enabled: false },
        };
      }
    }

    return states;
  }, []);

  const stats = hoveredState ? stateStats[hoveredState] : null;

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 pr-8 my-8">
      <div className="w-full h-full rounded-lg border border-gray-200">
        <USAMap className="w-full h-full p-8" customStates={customStates} />
      </div>

      <div className="w-full md:w-96 h-full flex flex-col gap-4">
        {hoveredState ? (
          <div className="rounded-lg border border-gray-200 p-5 space-y-2">
            <h3 className="text-lg font-semibold">{STATE_NAME_BY_ABBR[hoveredState] ?? hoveredState}</h3>
            <p>
              {stats?.policyCount ?? 0} policies
              {` (${stats?.highImpactCount ?? 0} high-impact)`}
            </p>
            <p>Last updated: {stats?.lastUpdatedYear ?? "N/A"}</p>
            <p className="text-gray-600">Regulatory overview (coming soon)</p>
          </div>
        ) : (
          <>
            <WhatsNew />
            <div className="w-full">
              <InsightsCarousel />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const ALL_US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

const STATE_NAME_BY_ABBR: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado",
  CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho",
  IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana",
  ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi",
  MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma",
  OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota",
  TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington",
  WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};
