import { FILES } from '@/assets/files';
import { Card } from '@/components/ui/card';
import fs from 'fs/promises';
import neatCsv, { Row } from 'neat-csv';
import { redirect } from 'next/navigation';
import path from 'path';
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

export default async function DataPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;
  const csvStr = await getCsvData(path);
  const matchingFile = FILES.find((file) => file.path === path);

  if (!matchingFile || !csvStr) {
    return redirect('/');
  }

  const csv = await neatCsv(csvStr);
  const tags = Object.keys(csv[0]).filter((key) => key.trim().endsWith('Tags'));
  const validKeys = Object.keys(csv[0]).filter((key) => !tags.includes(key));

  return (
    <>
      <h1 className="text-4xl mt-8 font-medium md:mt-16">{matchingFile.name}</h1>
      <h2 className="text-xl mt-4">{matchingFile.description}</h2>
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
            <TableRow key={index}>
              {Object.entries(row).map(([key, value], colIndex) => (
                colIndex === 1 ? (
                  <TaggedCell key={key} value={value} row={row} tagKeys={tags} />
                ) : validKeys.includes(key) ? (
                  <CustomCell key={key} value={value} />
                ) : null
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

function CustomCell({ value }: { value: string }) {
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

  return <TableCell>{value}</TableCell>;
}

function TaggedCell({ value, row, tagKeys }: { value: string, row: Row, tagKeys: string[] }) {
  return (
    <TableCell>
      {value}
      <div className="flex flex-row gap-2 mt-1">
        {tagKeys.map((tagKey) => (
          <Badge key={tagKey} variant="secondary" className="empty:hidden">{row[tagKey]}</Badge>
        ))}
      </div>
    </TableCell>
  );
}

async function getCsvData(csv: string) {
  try {
    const ourPath = `/src/assets/${csv}.csv`
    const newPath = path.join(process.cwd(), ourPath);
    const csvData = await fs.readFile(newPath, 'utf-8');
    return csvData;
  } catch (error) {
    console.error('Error reading CSV file:', error);
    return null;
  }
}