import path from "path";
import fs from "fs/promises";
// import neatCsv from 'neat-csv';

export async function getCsvData(csv: string) {
  try {
    const newPath = path.join(process.cwd(), "src", "assets", `${csv}.csv`);
    let csvData = await fs.readFile(newPath, "utf-8");
    csvData = stripBom(csvData);
    csvData = await appendCsvSupplementRows(csv, csvData);
    return csvData;
  } catch (error) {
    console.error("Error reading CSV file:", error);
    return null;
  }
}

async function appendCsvSupplementRows(csv: string, csvData: string) {
  try {
    const supplementPath = path.join(
      process.cwd(),
      "src",
      "assets",
      `${csv}-supplement.csv`,
    );
    const supplementData = stripBom(await fs.readFile(supplementPath, "utf-8"));
    const baseRows = getNonEmptyCsvLines(csvData);
    const supplementRows = getNonEmptyCsvLines(supplementData).slice(1);
    const existingRows = new Set(baseRows.slice(1).map(normalizeCsvLine));
    const newRows = supplementRows.filter(
      (row) => !existingRows.has(normalizeCsvLine(row)),
    );

    if (newRows.length === 0) {
      return csvData;
    }

    return `${csvData.trimEnd()}\n${newRows.join("\n")}\n`;
  } catch {
    return csvData;
  }
}

function stripBom(value: string) {
  return value.charCodeAt(0) === 0xfeff ? value.slice(1) : value;
}

function getNonEmptyCsvLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter(Boolean);
}

function normalizeCsvLine(value: string) {
  return value.replace(/\s+/g, " ").trim();
}
