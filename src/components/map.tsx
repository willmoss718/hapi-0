"use client";

import USAMap from "@mirawision/usa-map-react";
import mapData from "@/assets/Map-Data.json";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type CustomState = {
    fill: string;
    onClick: () => void;
}

export default function Map() {
  const router = useRouter();

  useEffect(function prefetchAllStates() {
    mapData["law-present"].forEach((state) => {
      router.prefetch(`/data/state-policies#${state}`);
    });
    mapData["policies-no-law"].forEach((state) => {
      router.prefetch(`/data/state-policies#${state}`);
    });
  }, [router]);
  
  const customStates: Record<string, CustomState> = {};
  mapData["law-present"].forEach((state) => {
    customStates[state] = {
      fill: '#30c48d',
      onClick: () => {
        router.push(`/data/state-policies#${state}`);
      },
    };
  });
  mapData["policies-no-law"].forEach((state) => {
    customStates[state] = {
      fill: '#5a8def',
      onClick: () => {
        router.push(`/data/state-policies#${state}`);
      },
    };
  });

  return (
    <div className="w-full h-full rounded-lg border border-gray-200">
        <USAMap className="w-full h-full p-8" customStates={customStates} />
        <legend className="flex flex-col justify-start items-start gap-1 p-8 border-t border-gray-200">
            <h3 className="uppercase font-medium tracking-wide">Explore by State</h3>
            <div className="flex flex-row justify-start items-center gap-2">
                <div className="w-4 h-4 bg-green-500"></div>
                <p>Law Present</p>
                <div className="w-4 h-4 bg-blue-500"></div>
                <p>Policies, no law</p>
                <div className="w-4 h-4 bg-gray-500"></div>
                <p>No policies yet</p>
            </div>
        </legend>
    </div>
  );
}