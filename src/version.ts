import { readFileSync } from "fs";
import { join } from "path";

// Read package.json at runtime
const packageJsonPath = join(process.cwd(), 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

export const VERSION: string = packageJson.version;
