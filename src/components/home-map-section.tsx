import MapSidebarShell from "@/components/map-sidebar-shell";
import {
  getStatePolicyCounts,
  type StateIntelligence,
} from "@/lib/state-policy-intelligence";
import type { HomepagePolicyUpdate } from "@/lib/homepage-policies";

type HomeMapSectionProps = {
  stateIntelligence: Record<string, StateIntelligence>;
  whatsNewUpdates: HomepagePolicyUpdate[];
};

export default function HomeMapSection({
  stateIntelligence,
  whatsNewUpdates,
}: HomeMapSectionProps) {
  const statePolicyCounts = getStatePolicyCounts(stateIntelligence);

  return (
    <div className="mt-8 mb-8">
      <MapSidebarShell
        stateIntelligence={stateIntelligence}
        statePolicyCounts={statePolicyCounts}
        whatsNewUpdates={whatsNewUpdates}
      />
    </div>
  );
}
