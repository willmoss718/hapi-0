import { FILES } from '@/assets/files';
import { Card } from '@/components/ui/card';
import fs from 'fs/promises';
import neatCsv from 'neat-csv';
import { redirect } from 'next/navigation';
import path from 'path';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function DataPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;
  const csvStr = await getCsvData(path);
  const matchingFile = FILES.find((file) => file.path === path);

  if (!matchingFile || !csvStr) {
    return redirect('/');
  }

  const csv = await neatCsv(csvStr);

  return (
    <>
      <h1 className="text-4xl mt-8 font-medium md:mt-16">{matchingFile.name}</h1>
      <h2 className="text-xl mt-4">{matchingFile.description}</h2>

      <Table className="w-full mt-12 border shadow">
        <TableHeader className="bg-gray-100">
          <TableRow>
            {Object.keys(csv[0]).map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {csv.map((row, index) => (
            <TableRow key={index}>
              {Object.values(row).map((value) => (
                <TableCell key={value}>{value}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
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