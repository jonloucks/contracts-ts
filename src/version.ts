import { readFileSync } from "fs";
import { resolve } from "path";

export const VERSION: string = ((): string => {
  try {
    const packageJsonPath = resolve(__dirname, 'package.json'); 
    const parsedJson : unknown = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    const { version } = parsedJson as { version?: string };
    return version ?? "unknown";
  } catch (_error) {
    return "unknown";
  }
})();

