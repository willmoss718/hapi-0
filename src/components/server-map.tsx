// src/components/server-map.tsx (TEMP DIAGNOSTIC VERSION)

import Map from "./map";

export default async function ServerMap() {
  // 🚧 TEMP: completely ignore CSV and just hard-code some counts
  const statePolicyCounts = {
    CA: 7,
    NY: 4,
    TX: 5,
  };

  return <Map statePolicyCounts={statePolicyCounts} />;
}