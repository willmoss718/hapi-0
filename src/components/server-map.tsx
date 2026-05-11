// src/components/server-map.tsx

import Map from "./map";
import {
  getStatePolicyCounts,
  getStatePolicyIntelligence,
} from "@/lib/state-policy-intelligence";

export default async function ServerMap() {
  const stateIntelligence = await getStatePolicyIntelligence();
  const statePolicyCounts = getStatePolicyCounts(stateIntelligence);

  return <Map statePolicyCounts={statePolicyCounts} />;
}
