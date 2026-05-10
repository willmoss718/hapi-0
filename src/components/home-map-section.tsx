import MapSidebarShell from "@/components/map-sidebar-shell";
import {
  getStatePolicyCounts,
  type StateIntelligence,
} from "@/lib/state-policy-intelligence";

type HomeMapSectionProps = {
  stateIntelligence: Record<string, StateIntelligence>;
};

export default function HomeMapSection({ stateIntelligence }: HomeMapSectionProps) {
  const statePolicyCounts = getStatePolicyCounts(stateIntelligence);

  return (
    <div className="mt-8 mb-8">
      <MapSidebarShell
        stateIntelligence={stateIntelligence}
        statePolicyCounts={statePolicyCounts}
      />
    </div>
  );
}
