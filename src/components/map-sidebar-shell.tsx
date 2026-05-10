"use client";

import { useCallback, useState, type ReactNode } from "react";
import type { StateIntelligence } from "@/lib/state-policy-intelligence";
import Map from "@/components/map";
import StateIntelligencePanel from "@/components/state-intelligence-panel";
import WhatsNew from "@/components/whats-new";

type MapSidebarShellProps = {
  statePolicyCounts: Record<string, number>;
  stateIntelligence: Record<string, StateIntelligence>;
  mapFooter?: ReactNode;
};

export default function MapSidebarShell({
  statePolicyCounts,
  stateIntelligence,
  mapFooter,
}: MapSidebarShellProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const handleStateHover = useCallback((state: string | null) => {
    setHoveredState((current) => (current === state ? current : state));
  }, []);

  const activeState = hoveredState ? stateIntelligence[hoveredState] : null;

  return (
    <div className="flex flex-col items-start gap-6 pr-8 md:flex-row md:gap-8">
      <div id="map" className="w-full min-w-0 flex-1 h-full">
        <Map
          hoveredState={hoveredState}
          statePolicyCounts={statePolicyCounts}
          onStateHover={handleStateHover}
        />
        {mapFooter}
      </div>

      <div
        id="about"
        className="w-full flex-none md:w-96 md:min-w-[24rem] md:max-w-[24rem] h-full flex flex-col gap-4"
      >
        {activeState ? <StateIntelligencePanel state={activeState} /> : <WhatsNew />}
      </div>
    </div>
  );
}
