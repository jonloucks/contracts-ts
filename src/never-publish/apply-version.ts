import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

export function applyVersion(): void {
  try {
    const parsedJson: unknown = JSON.parse(readFileSync('package.json', 'utf8'));
    const { version } = parsedJson as { version?: string };
    if (version !== undefined && version !== null) {
      writeFileSync(resolve('src', 'version.ts'), `export const VERSION: string = "${version}";\n`);
    }
  } catch (_error) {
    // continue to next path
  }
}

applyVersion();


