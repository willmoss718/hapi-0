"use client";

import { useCallback, useState, type ReactNode } from "react";
import type { StateIntelligence } from "@/lib/state-policy-intelligence";
import Map from "@/components/map";
import StateIntelligencePanel from "@/components/state-intelligence-panel";
import WhatsNew from "@/components/whats-new";
import type { HomepagePolicyUpdate } from "@/lib/homepage-policies";
import { cn } from "@/lib/utils";

type MapSidebarShellProps = {
  statePolicyCounts: Record<string, number>;
  stateIntelligence: Record<string, StateIntelligence>;
  whatsNewUpdates?: HomepagePolicyUpdate[];
  defaultPanel?: ReactNode;
  mapFooter?: ReactNode;
  compactMap?: boolean;
  className?: string;
  mapColumnClassName?: string;
  sidebarClassName?: string;
};

export default function MapSidebarShell({
  statePolicyCounts,
  stateIntelligence,
  whatsNewUpdates,
  defaultPanel,
  mapFooter,
  compactMap = false,
  className,
  mapColumnClassName,
  sidebarClassName,
}: MapSidebarShellProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const handleStateHover = useCallback((state: string | null) => {
    setHoveredState((current) => (current === state ? current : state));
  }, []);

  const activeState = hoveredState ? stateIntelligence[hoveredState] : null;
  const fallbackPanel = defaultPanel ?? (
    whatsNewUpdates ? <WhatsNew updates={whatsNewUpdates} /> : null
  );
  const preserveStaticSidebarHeight = Boolean(defaultPanel && fallbackPanel);

  return (
    <div className={cn("flex flex-col items-start gap-6 pr-8 md:flex-row md:gap-8", className)}>
      <div id="map" className={cn("w-full min-w-0 flex-1 h-full", mapColumnClassName)}>
        <Map
          compact={compactMap}
          hoveredState={hoveredState}
          statePolicyCounts={statePolicyCounts}
          onStateHover={handleStateHover}
        />
        {mapFooter}
      </div>

      <div
        id="about"
        className={cn(
          "w-full flex-none md:w-96 md:min-w-[24rem] md:max-w-[24rem] h-full flex flex-col gap-4",
          sidebarClassName,
        )}
      >
        {preserveStaticSidebarHeight ? (
          <div className="relative">
            <div className={cn(activeState ? "invisible" : "")}>{fallbackPanel}</div>
            {activeState && (
              <div className="absolute inset-0">
                <StateIntelligencePanel state={activeState} />
              </div>
            )}
          </div>
        ) : activeState ? (
          <StateIntelligencePanel state={activeState} />
        ) : (
          fallbackPanel
        )}
      </div>
    </div>
  );
}
