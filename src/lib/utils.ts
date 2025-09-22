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
