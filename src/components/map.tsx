"use client";

import USAMap from "@mirawision/usa-map-react";
import mapData from "@/assets/Map-Data.json";
import { useRouter } from "next/navigation";

type CustomState = {
    fill?: string;
    onClick?: () => void;
    tooltip?: {
      enabled: boolean;
      render: (state: string) => React.ReactNode;
    };
}

type MapProps = {
  statePolicyCounts: Record<string, number>;
}

export default function Map({ statePolicyCounts }: MapProps) {
  const router = useRouter();
  
  const customStates: Record<string, CustomState> = {};
  mapData["law-present"].forEach((state) => {
    customStates[state] = {
      fill: '#30c48d',
      onClick: () => {
        router.push(`/data/state-policies#${state}`);
      },
      tooltip: {
        enabled: true,
        render: (state) => (
          <div>
            {statePolicyCounts[state] || 0} state {statePolicyCounts[state] === 1 ? 'policy' : 'policies'}
          </div>
        )
      }
    };
  });
  mapData["policies-no-law"].forEach((state) => {
    customStates[state] = {
      fill: '#5a8def',
      onClick: () => {
        router.push(`/data/state-policies?sk=State&so=asc#${state}`);
      },
      tooltip: {
        enabled: true,
        render: (state) => (
          <div>
            {statePolicyCounts[state] || 0} state {statePolicyCounts[state] === 1 ? 'policy' : 'policies'}
          </div>
        )
      }
    };
  });
  for (const state of ALL_US_STATES) {
    if (!customStates[state]) {
      customStates[state] = {
        tooltip: { enabled: true, render: () => <div>0 state policies</div> }
      };
    }
  }

  return (
    <div className="w-full h-full rounded-lg border border-gray-200">
        <USAMap className="w-full h-full p-8" customStates={customStates} />
        <legend className="flex flex-col justify-start items-start gap-1 p-8 border-t border-gray-200">
            <h3 className="uppercase font-medium tracking-wide">Explore by State</h3>
            <div className="flex flex-row justify-start items-center gap-2">
                <div className="w-4 h-4 bg-green-500"></div>
                <p>State Law(s) Present</p>
                <div className="w-4 h-4 bg-blue-500"></div>
                <p>State Policies, No Law</p>
                <div className="w-4 h-4 bg-[#D3D3D3]"></div>
                <p>No State Policies</p>
            </div>
        </legend>
    </div>
  );
}

const ALL_US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];