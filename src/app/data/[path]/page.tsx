import { FILES } from "@/assets/files";
// import { Card } from '@/components/ui/card';

import neatCsv, { Row } from "neat-csv";
import { redirect } from "next/navigation";
// import path from 'path';
import ServerMap from "@/components/server-map";
import {
  Table,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ArrowUpRightIcon } from "lucide-react";
import { getCsvData } from "@/lib/server-utils";
import Filters from "@/components/filters";
import { SortableHeader } from "@/components/sortable-head";
import HighlightedTableCell from "@/components/highlighted-table-cell";
import { ExpandableRow } from "@/components/expandable-row";
import { ExpandableTaggedCell } from "@/components/expandable-tagged-cell";
import PolicyPreview from "@/components/policy-preview";

const HIDDEN_KEYS = ["Summary", "Healthcare Implications"];

export default async function DataPage({
  params,
  searchParams,
}: {
  params: Promise<{ path: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { path } = await params;
  const { q, t, sk, so } = await searchParams;

  const csvStr = await getCsvData(path);
  const matchingFile = FILES.find((file) => file.path === path);

  if (!matchingFile || !csvStr) {
    return redirect("/");
  }

  const csv = await neatCsv(csvStr);
  const tagKeys = Object.keys(csv[0]).filter((key) =>
    key.trim().endsWith("Tags") || key === "Impact Level",
  );
  const validKeys = Object.keys(csv[0]).filter((key) => !tagKeys.includes(key) && !HIDDEN_KEYS.includes(key));

  const tags: Record<string, string[]> = {};
  for (const row of csv) {
    for (const key of tagKeys) {
      const rawValue = row[key];
      const cleanedValues = rawValue.split(";").map((value) => value.trim());
      for (const value of cleanedValues) {
        if (!tags[key]) {
          tags[key] = [];
        }
        if (value && !tags[key].includes(value)) {
          tags[key].push(value);
        }
      }
    }
  }

  let sortedCsv = [...csv];
  if (sk) {
    sortedCsv = csv.sort((a, b) => {
      const aValue = a[sk as keyof typeof a];
      const bValue = b[sk as keyof typeof b];
      if (so === "asc") {
        return aValue.localeCompare(bValue);
      }
      return bValue.localeCompare(aValue);
    });
  }

  return (
    <>
      <h1 className="text-4xl mt-8 font-medium md:mt-16">
        {matchingFile.name}
      </h1>
      <h2 className="text-xl mt-4">{matchingFile.description}</h2>
      {path === "state-policies" && (
        <div id="map" className="w-full h-full mt-12 flex flex-row justify-center items-center">
          <div className="w-full h-full max-w-5xl">
            <ServerMap />
          </div>
        </div>
      )}
      <Filters availableTags={tags} />
      <Table className="w-full my-12 border shadow">
        <SortableHeader validKeys={validKeys} />
        <TableBody>
          {sortedCsv.map((row, index) =>
            rowMatchesFilters(row, { q, t }, tagKeys) ? (
              <ExpandableRow
                key={index}
                className="relative"
                expandedContent={<PolicyPreview data={row} />}
              >
                {Object.entries(row).map(([key, value], colIndex) =>
                  colIndex === 1 ? (
                    <ExpandableTaggedCell
                      key={key}
                      value={value}
                      row={row}
                      tagKeys={tagKeys}
                    />
                  ) : validKeys.includes(key) ? (
                    <CustomCell
                      includeId={colIndex === 0}
                      key={key}
                      value={value}
                    />
                  ) : null,
                )}
              </ExpandableRow>
            ) : null,
          )}
        </TableBody>
      </Table>
      <p className="text-base text-gray-700 italic mt-4 mb-4 pl-4">
        <span className="text-gray-800 font-semibold">*</span>{" "}
        Some policies have multiple effective dates; only one primary date is displayed here.
      </p>
    </>
  );
}

function rowMatchesFilters(
  row: Row,
  filters: { q: unknown; t: unknown },
  tagKeys: string[],
) {
  // Text search
  const serializedRow = JSON.stringify(row);
  const matchesSearch =
    filters.q && typeof filters.q === "string"
      ? serializedRow.toLowerCase().includes(filters.q.toLowerCase())
      : true;

  // Tag filtering: require ALL selected tags (AND)
  if (filters.t && typeof filters.t === "string") {
    const queryFilterTags = filters.t
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    const matchesTags = queryFilterTags.every((tag) =>
      tagKeys.some((tagKey) => {
        const rawValue = String(row[tagKey] ?? "");
        const values = rawValue
          .split(";")
          .map((v) => v.trim().toLowerCase())
          .filter(Boolean);
        return values.includes(tag);
      }),
    );

    return matchesSearch && matchesTags;
  }

  // No tag filter → only search matters
  return matchesSearch;
}


function CustomCell({
  value,
  includeId,
}: {
  value: string;
  includeId: boolean;
}) {
  if (value.trim().startsWith("http")) {
    return (
      <TableCell className="flex flex-row items-center translate-y-3 gap-1 underline underline-offset-4 max-w-xl truncate">
        <a href={value} target="_blank" rel="noopener noreferrer">
          LINK
        </a>
        <ArrowUpRightIcon className="w-4 h-4" />
      </TableCell>
    );
  }

  if (value.length > 250) {
    return (
      <TableCell className="max-w-xl truncate">
        <HoverCard>
          <HoverCardTrigger>{value.slice(0, 20)}...</HoverCardTrigger>
          <HoverCardContent className="w-96" align="start">
            <p className="text-sm">{value}</p>
          </HoverCardContent>
        </HoverCard>
      </TableCell>
    );
  }

  if (includeId) {
    return <HighlightedTableCell id={value.trim()}>{value}</HighlightedTableCell>;
  }

  return <TableCell className="max-w-xl truncate">{value}</TableCell>;
}

