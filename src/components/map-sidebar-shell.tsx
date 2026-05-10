"use client";

import { useCallback, useState } from "react";
import type { StateIntelligence } from "@/lib/state-policy-intelligence";
import Map from "@/components/map";
import StateIntelligencePanel from "@/components/state-intelligence-panel";
import WhatsNew from "@/components/whats-new";

type MapSidebarShellProps = {
  statePolicyCounts: Record<string, number>;
  stateIntelligence: Record<string, StateIntelligence>;
};

export default function MapSidebarShell({
  statePolicyCounts,
  stateIntelligence,
}: MapSidebarShellProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const handleStateHover = useCallback((state: string | null) => {
    setHoveredState((current) => (current === state ? current : state));
  }, []);

  const activeState = hoveredState ? stateIntelligence[hoveredState] : null;

  return (
    <div className="flex flex-col gap-6 pr-8 md:flex-row md:gap-8">
      <div id="map" className="w-full h-full">
        <Map
          hoveredState={hoveredState}
          statePolicyCounts={statePolicyCounts}
          onStateHover={handleStateHover}
        />
      </div>

      <div id="about" className="w-full md:w-96 h-full flex flex-col gap-4">
        {activeState ? <StateIntelligencePanel state={activeState} /> : <WhatsNew />}
      </div>
    </div>
  );
}
