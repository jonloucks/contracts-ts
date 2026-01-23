import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

export function applyVersion(): void {
  try {
    const parsedJson: unknown = JSON.parse(readFileSync('package.json', 'utf8'));
    const { version } = parsedJson as { version?: string };
    if (typeof version === "string" && version.trim().length > 0) {
      const escapedVersion = JSON.stringify(String(version));
      writeFileSync(resolve('src', 'version.ts'), `export const VERSION: string = ${escapedVersion};\n`);
    }
  } catch (_error) {
    // continue to next path
  }
}

applyVersion();


