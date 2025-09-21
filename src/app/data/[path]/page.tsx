import { FILES } from '@/assets/files';
import { Card } from '@/components/ui/card';

import neatCsv, { Row } from 'neat-csv';
import { redirect } from 'next/navigation';
import path from 'path';
import Map from "@/components/map";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { ArrowUpRightIcon } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import Link from 'next/link';
import { getCsvData } from '@/lib/server-utils';
import Filters from '@/components/filters';

export default async function DataPage({ params, searchParams }: { params: Promise<{ path: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { path } = await params;
  const { q, t } = await searchParams;

  const csvStr = await getCsvData(path);
  const matchingFile = FILES.find((file) => file.path === path);

  if (!matchingFile || !csvStr) {
    return redirect('/');
  }

  const csv = await neatCsv(csvStr);
  const tagKeys = Object.keys(csv[0]).filter((key) => key.trim().endsWith('Tags'));
  const validKeys = Object.keys(csv[0]).filter((key) => !tagKeys.includes(key));
  
  const tags: Record<string, string[]> = {};
  for (const row of csv) {
    for (const key of tagKeys) {
      const rawValue = row[key];
      const cleanedValues = rawValue.split(';').map((value) => value.trim());
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

  return (
    <>
      <h1 className="text-4xl mt-8 font-medium md:mt-16">{matchingFile.name}</h1>
      <h2 className="text-xl mt-4">{matchingFile.description}</h2>
      {path === "state-policies" && (
        <div id="map" className="w-full h-full max-w-3xl mt-12">
          <Map />
        </div>
      )}
      <Filters availableTags={tags} />
      <Table className="w-full my-12 border shadow">
        <TableHeader className="bg-gray-100">
          <TableRow>
            {validKeys.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {csv.map((row, index) => (
            rowMatchesFilters(row, { q, t }, tagKeys) ? (
              <TableRow key={index}>
                {Object.entries(row).map(([key, value], colIndex) => (
                  colIndex === 1 ? (
                    <TaggedCell key={key} value={value} row={row} tagKeys={tagKeys} />
                  ) : validKeys.includes(key) ? (
                    <CustomCell includeId={colIndex === 0} key={key} value={value} />
                  ) : null
                ))}
              </TableRow>
            ) : null
          ))}
        </TableBody>
      </Table>
    </>
  )
}

function rowMatchesFilters(row: Row, filters: { q: unknown, t: unknown }, tagKeys: string[]) {
  const serializedRow = JSON.stringify(row);
  const matchesSearch = filters.q && typeof filters.q === 'string' ? serializedRow.toLowerCase().includes(filters.q.toLowerCase()) : true;
  
  let matchesTags = false;
  if (filters.t && typeof filters.t === 'string') {
    const queryFilterTags = filters.t.split(',');
    for (const tag of queryFilterTags) {
      for (const tagKey of tagKeys) {
        const rawValue = row[tagKey];
        const semicolonDelimitedValues = rawValue.split(';');
        if (semicolonDelimitedValues.some((value) => value.toLowerCase() === tag.toLowerCase())) {
          matchesTags = true;
        }
      }
    }
  } else {
    matchesTags = true;
  }

  return matchesSearch && matchesTags;
}

function CustomCell({ value, includeId }: { value: string; includeId: boolean }) {
  if (value.trim().startsWith('http')) {
    return (
      <TableCell className='flex flex-row items-center translate-y-3 gap-1 underline underline-offset-4'>
        <a href={value} target="_blank" rel="noopener noreferrer">LINK</a>
        <ArrowUpRightIcon className="w-4 h-4" />
      </TableCell>
    )
  }

  if (value.length > 100) {
    return (
      <TableCell>
        <HoverCard>
          <HoverCardTrigger>{value.slice(0, 20)}...</HoverCardTrigger>
          <HoverCardContent className="w-96" align="start">
            <p className="text-sm">
              {value}
            </p>
          </HoverCardContent>
        </HoverCard>
      </TableCell>
    )
  }

  if (includeId) {
    return <TableCell id={value.trim()}>{value}</TableCell>;
  }

  return <TableCell>{value}</TableCell>;
}

function TaggedCell({ value, row, tagKeys }: { value: string, row: Row, tagKeys: string[] }) {
  return (
    <TableCell>
      <Link href={`/policies/${encodeURIComponent(value)}`}>
        <span className="underline underline-offset-4 font-semibold">
          {value}
        </span>
        <div className="flex flex-row gap-2 mt-2">
          {tagKeys.map((tagKey) => {
            const rawValue = row[tagKey];
            const semicolonDelimitedValues = rawValue.split(';');
            return semicolonDelimitedValues.map((value) => (
              <Badge key={value} variant="secondary" className="empty:hidden">{value}</Badge>
            ));
          })}
        </div>
      </Link>
    </TableCell>
  );
}
