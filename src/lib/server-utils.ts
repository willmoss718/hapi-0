
import path from "path";
import fs from 'fs/promises';

export async function getCsvData(csv: string) {
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