/**
 * Best effort generation of code coverage badge from coverage summary JSON file.
 * Reads coverage percentage from JSON file, determines badge color based on thresholds,
 * and generates an SVG badge using a template file with placeholders.
 * 
 * Environment Variables:
 * - KIT_COVERAGE_SUMMARY_PATH: Path to the coverage summary JSON file. Default: './coverage/coverage-summary.json'
 * - KIT_TEMPLATE_BADGE_PATH: Path to the SVG badge template file. Default: './scripts/code-coverage.svg.dat'
 * - KIT_COVERAGE_SUMMARY_BADGE_PATH: Output path for the generated coverage badge SVG file. Default: './coverage/coverage-summary.svg'     
 *  * Template Placeholders:
 * - {{LABEL}}: Placeholder for the badge label (e.g., "coverage").
 * - {{VALUE}}: Placeholder for the coverage percentage value.
 * - {{COLOR}}: Placeholder for the badge background color.
 * Usage:   
 * ```
 * npm run badges
 * ```
 */
import { readFileSync, writeFileSync } from "fs";
import { VERSION } from "../version";

const SUCCESS_COLOR : string = '#4bc124';

generateNpmBadge();
generateCoverageSummaryBadge();
generateTypedocBadge();

/**
 * Generates an npm version badge based on the current package version.
 * Reads the version from the VERSION constant, determines the badge color,
 * and generates the SVG badge.
 */
export async function generateNpmBadge(): Promise<void> {
    bestEffort("generate npm badge", (): void => {
    generateBadge({
      name: "npm",
      outputPath: getNpmBadgePath(),
      label: "  npm  ",
      value: VERSION,
      color: SUCCESS_COLOR
    });
  });
}

/**
 * Generates a code coverage summary badge based on the coverage summary JSON file.
 * Reads the coverage percentage, determines the badge color, and generates the SVG badge.
 */
export async function generateCoverageSummaryBadge(): Promise<void> {
  bestEffort("generate coverage summary badge", (): void => {
    const inputPath: string = getCoverageSummaryFilePath();
    const data: Buffer = readFileSync(inputPath);
    processCoverageSummaryReport(data);
  });
}

/**
 * Generates a TypeDoc documentation badge with a fixed value of 100%.
 * The badge indicates that the documentation is complete.
 */
export async function generateTypedocBadge(): Promise<void> {
  bestEffort("generate typedoc badge", (): void => {
    generateBadge({
      name: "typedoc",
      outputPath: getTypedocBadgePath(),
      label: " typedoc ",
      value: "100%",
      color: SUCCESS_COLOR
    });
  });
}

function processCoverageSummaryReport(data: Buffer): void {
  const percentage: number = readPercentageFromCoverageSummary(data);
  generateBadge({
    name: "coverage-summary",
    outputPath: getCoverageSummaryBadgePath(),
    label: "coverage",
    value: percentage + "%",
    color: determineBackgroundColor(percentage)
  });
}

function bestEffort<T>(name: string, block: () => T): T {
  try {
    return block();
  } catch (error) {
    console.warn(`Best effort ${name} operation failed:`, error);
    return undefined as unknown as T;
  }
}

interface GenerateOptions {
  name: string;
  templatePath?: string;
  outputPath: string;
  label: string;
  value: string;
  color: string;
}

/**
 * Asynchronously generates a badge file based on the provided options and template.
 * @param options 
 */
function generateBadge(options: GenerateOptions): void {
  const templatePath: string = options.templatePath ? options.templatePath : getTemplateBadgePath();
  console.log(`Generating badge ${options.name} at ${options.outputPath} using template ${templatePath}`);
  const data: Buffer = readFileSync(templatePath);
  const generated: string = replaceKeywords(options, data.toString('utf8'));
  writeBadgeToFile(options, generated);
  console.log(`Generated badge ${options.name} value ${options.value} at ${options.outputPath}`);
};

function writeBadgeToFile(options: GenerateOptions, content: string): void {
  writeFileSync(options.outputPath, content);
}

function replaceKeywords(options: GenerateOptions, template: string): string {
  const replacements = {
    LABEL: options.label,
    VALUE: options.value,
    COLOR: options.color
  };
  // Use a regex with a replacement function to dynamically insert values
  const generatedContent: string = template.replace(/{{(.*?)}}/g, (match, key: string) => {
    const trimmedKey = key.trim() as keyof typeof replacements;
    // trim whitespace and look up the key in the data object
    return replacements[trimmedKey] !== undefined ? String(replacements[trimmedKey]) : match;
  })
  return generatedContent;
}

function readPercentageFromCoverageSummary(data: Buffer): number {
  const text: string = data.toString('utf8');
  const jsonData = JSON.parse(text);
  return jsonData.total.lines.pct;
}

function getCoverageSummaryFilePath(): string {
  return getEnvPathOrDefault('KIT_COVERAGE_SUMMARY_PATH', './coverage/coverage-summary.json');
}

function getTemplateBadgePath(): string {
  return getEnvPathOrDefault('KIT_TEMPLATE_BADGE_PATH', './scripts/badge-template.svg.dat');
}

function getCoverageSummaryBadgePath(): string {
  return getEnvPathOrDefault('KIT_COVERAGE_SUMMARY_BADGE_PATH', './coverage/coverage-summary.svg');
}

function getTypedocBadgePath(): string {
  return getEnvPathOrDefault('KIT_TYPEDOC_BADGE_PATH', './coverage/typedoc-badge.svg');
}

function getNpmBadgePath(): string {
  return getEnvPathOrDefault('KIT_NPM_BADGE_PATH', './coverage/npm-badge.svg');
}

function getEnvPathOrDefault(envVarName: string, defaultPath: string): string {
  const myVarValue: string | undefined = process.env[envVarName];
  if (myVarValue && myVarValue.trim() !== '') {
    return myVarValue.trim();
  }
  return defaultPath;
}

function determineBackgroundColor(percent: number): string {
  if (percent >= 95) {
    return SUCCESS_COLOR;
  } else if (percent >= 75) {
    return 'yellowgreen';
  } else if (percent >= 60) {
    return 'yellow';
  } else if (percent >= 40) {
    return 'orange';
  } else {
    return 'red';
  }
}
