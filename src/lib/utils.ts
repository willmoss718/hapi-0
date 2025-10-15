import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRandomTailwindColor(seed?: string) {
  const colors = ["#fbe7c6", "#b4f8c8", "#a0e7e5", "#ffaebc"];

  if (seed) {
    const hash = seed
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  } else {
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Safely get a column value from a row object with fallback column names
 * Useful for handling CSV columns with inconsistent naming
 * @param row - The row object to search
 * @param columnNames - Column names to try in order
 * @returns The first non-empty column value found, or undefined
 */
export function getColumnValue(
  row: Record<string, string>,
  ...columnNames: string[]
): string | undefined {
  for (const name of columnNames) {
    if (name in row && row[name]) return row[name];
  }
  return undefined;
}

/**
 * Same as getColumnValue, but returns the first column value that starts with the given string
 */
export function getColumnValueStartsWith(
  row: Record<string, string>,
  startsWith: string,
): string | undefined {
  for (const name of Object.keys(row)) {
    if (name.startsWith(startsWith) && row[name]) return row[name];
  }
  return undefined;
}
