import Link from "next/link";
import MapSidebarShell from "@/components/map-sidebar-shell";
import {
  getStatePolicyCounts,
  getStatePolicyIntelligence,
} from "@/lib/state-policy-intelligence";

export default async function HomeMapSection() {
  const stateIntelligence = await getStatePolicyIntelligence();
  const statePolicyCounts = getStatePolicyCounts(stateIntelligence);

  return (
    <div className="mt-8 mb-8">
      <MapSidebarShell
        stateIntelligence={stateIntelligence}
        statePolicyCounts={statePolicyCounts}
      />

      <Link href="/about" className="block mt-3 pr-8">
        <p className="text-base text-gray-600 font-medium hover:underline">
          Created and maintained by Will Moss · Windreich Dept. of Artificial Intelligence and Human Health, Mount Sinai
        </p>
      </Link>
    </div>
  );
}
