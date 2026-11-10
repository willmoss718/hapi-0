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
    <section className="mb-14 mt-8 md:mt-10" aria-label="Explore HAPI">
      <MapSidebarShell
        editorialMap
        className="gap-10 pr-0 md:grid md:grid-cols-[minmax(0,1fr)_21rem] md:items-start lg:grid-cols-[minmax(0,1fr)_23rem] xl:grid-cols-[minmax(0,1fr)_25rem]"
        sidebarClassName="md:w-auto md:min-w-0 md:max-w-none"
        stateIntelligence={stateIntelligence}
        statePolicyCounts={statePolicyCounts}
        whatsNewUpdates={whatsNewUpdates}
      />
    </section>
  );
}
