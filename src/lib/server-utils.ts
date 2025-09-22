import path from "path";
import fs from "fs/promises";
// import neatCsv from 'neat-csv';

export async function getCsvData(csv: string) {
  try {
    const newPath = path.join(process.cwd(), "src", "assets", `${csv}.csv`);
    let csvData = await fs.readFile(newPath, "utf-8");
    // Remove BOM if present
    if (csvData.charCodeAt(0) === 0xfeff) {
      csvData = csvData.slice(1);
    }
    return csvData;
  } catch (error) {
    console.error("Error reading CSV file:", error);
    return null;
  }
}
