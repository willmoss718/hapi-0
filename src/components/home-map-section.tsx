import Link from "next/link";
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
        mapFooter={mapFooter}
      />
    </div>
  );
}
