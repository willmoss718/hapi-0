import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const pageRoot = path.join(root, "src", "app");
const componentRoot = path.join(root, "src", "components");

async function walk(dir, predicate = () => true) {
  const entries = await readdir(dir);
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const info = await stat(fullPath);
    if (info.isDirectory()) {
      files.push(...await walk(fullPath, predicate));
    } else if (predicate(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

function countH1(source) {
  return source.match(/<h1(\s|>)/g)?.length ?? 0;
}

const pageFiles = await walk(pageRoot, (file) => file.endsWith("page.tsx"));
const componentFiles = await walk(componentRoot, (file) => file.endsWith(".tsx"));
const failures = [];

for (const file of pageFiles) {
  const source = await readFile(file, "utf8");
  const h1Count = countH1(source);
  if (h1Count !== 1) {
    failures.push(`${path.relative(root, file)} has ${h1Count} <h1> elements`);
  }
}

for (const file of componentFiles) {
  const source = await readFile(file, "utf8");
  const h1Count = countH1(source);
  if (h1Count > 0) {
    failures.push(`${path.relative(root, file)} renders ${h1Count} shared <h1> element(s)`);
  }
}

if (failures.length > 0) {
  console.error("H1 accessibility check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`H1 accessibility check passed for ${pageFiles.length} routes.`);
