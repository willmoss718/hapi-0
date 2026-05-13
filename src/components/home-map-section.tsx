import Link from "next/link";
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

  const mapFooter = (
    <Link key="map-footer" href="/about" className="block mt-3">
      <p className="text-base text-gray-600 font-medium hover:underline">
        Created and maintained by Will Moss · Windreich Dept. of Artificial Intelligence and Human Health, Mount Sinai
      </p>
    </Link>
  );

  return (
    <div className="mt-8 mb-8">
      <MapSidebarShell
        stateIntelligence={stateIntelligence}
        statePolicyCounts={statePolicyCounts}
        whatsNewUpdates={whatsNewUpdates}
        mapFooter={mapFooter}
      />
    </div>
  );
}
