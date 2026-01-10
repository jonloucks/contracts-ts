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
 * - {{PERCENT}}: Placeholder for the coverage percentage value.
 * - {{COLOR}}: Placeholder for the badge background color.
 * Usage:   
 * npx tsx scripts/generate-code-coverage-badge.ts
 */
import fs from 'fs';

generateCoverageSummaryBadge()
generateTypedocBadge()

/**
 * Generates a code coverage summary badge based on the coverage summary JSON file.
 * Reads the coverage percentage, determines the badge color, and generates the SVG badge.
 */
function generateCoverageSummaryBadge(): void {
    bestEffort("generate coverage summary badge", () => {
        const inputPath: string = getCoverageSummaryFilePath();

        fs.readFile(inputPath, (err, data) => {
            bestEffort(`Read coverage summary report '${inputPath}'`, () => {
                if (isError(inputPath, err)) {
                    return;
                }
                processCoverageSummaryReport(data);
            });
        });
    });
}

function generateTypedocBadge(): void {
    bestEffort("generate typedoc badge", () => {
        generateBadge({
            name: "typedoc",
            outputPath: getTypedocBadgePath(),
            label: " typedoc ",
            percent: 100
        });
    });
}

function processCoverageSummaryReport(data: Buffer): void {
    generateBadge({
        name: "coverage-summary",
        outputPath: getCoverageSummaryBadgePath(),
        label: "coverage",
        percent: readPercentageFromCoverageSummary(data)
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
    percent: number;
}

/**
 * Asynchronously generates a badge file based on the provided options and template.
 * @param options 
 */
function generateBadge(options: GenerateOptions): void {
    const templatePath: string = options.templatePath ? options.templatePath : getTemplateBadgePath();
    console.log(`Generating badge ${options.name} at ${options.outputPath} using template ${templatePath}`);
    fs.readFile(templatePath, (err, data) => {
        bestEffort(`Read template content '${templatePath}'`, () => {
            if (isError(templatePath, err)) {
                return
            }
            const generated: string = replaceKeywords(options, data.toString('utf8'));
            writeBadgeToFile(options, generated);
            console.log(`Generated badge ${options.name} percent ${options.percent} at ${options.outputPath}`);
        });
    });
};

function writeBadgeToFile(options: GenerateOptions, content: string): void {
    fs.writeFileSync(options.outputPath, content);
}

function replaceKeywords(options: GenerateOptions, template: string): string {
    const color: string = determineBackgroundColor(options.percent);
    const replacements = {
        LABEL: options.label,
        PERCENT: options.percent,
        COLOR: color
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

function getEnvPathOrDefault(envVarName: string, defaultPath: string): string {
    const myVarValue: string | undefined = process.env[envVarName];
    if (myVarValue && myVarValue.trim() !== '') {
        return myVarValue.trim();
    }
    return defaultPath;
}

function isError(path: string, caught: any): caught is null {
    if (caught) {
        if (caught.code === 'ENOENT') {
            console.warn(`File not found at path: ${path}`);
        }
        return true;
    }
    return false;
}

function determineBackgroundColor(percent: number): string {
    if (percent >= 90) {
        return '#4bc124';
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
