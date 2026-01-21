import { readFileSync } from "fs";
import { resolve, join } from "path";

const DEVELOPMENT_PATH: string = join(__dirname, "..", "package.json");
const PRODUCTION_PATH: string = resolve(__dirname, 'package.json');

export const VERSION: string = ((): string => {
  for (const path of [PRODUCTION_PATH, DEVELOPMENT_PATH]) {
    try {
      const parsedJson: unknown = JSON.parse(readFileSync(path, 'utf8'));
      const { version } = parsedJson as { version?: string };
      if (version !== undefined && version !== null) {
        return version;
      }
    } catch (_error) {
      // continue to next path
    }
  }
  return "unknown";
})();



