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

generateCoverageSummaryBadge();

/**
 * Generates a code coverage summary badge based on the coverage summary JSON file.
 * Reads the coverage percentage, determines the badge color, and generates the SVG badge.
 */
function generateCoverageSummaryBadge(): void {    
    const inputPath : string = getCoverageSummaryFilePath()
    fs.readFile(inputPath, (err, data) => {
    if (handleError(inputPath, err)) {
        return
    }

    const percent: number = readPercentageFromCoverageSummary(data);
    const color: string = determineBackgroundColor(percent);

    generateBadge({
        name: "coverage-summary",
        outputPath: getCoverageSummaryBadgePath(),
        label: "coverage",
        percent: percent,
        color: color
    });
});
};

interface GenerateOptions {
    name: string;
    templatePath?: string;
    outputPath: string;
    label: string;
    percent: number;
    color: string;
}

function generateBadge(options: GenerateOptions): void {
    const templatePath : string = options.templatePath ? options.templatePath : getTemplateBadgePath();
    fs.readFile(templatePath, (err, templateData) => {
        if (handleError(templatePath, err)) {
            return
        }

        const replacements = {
            LABEL: options.label,
            PERCENT: options.percent,
            COLOR: options.color
        };

        const svgContent : string = templateData.toString('utf8');

        // Use a regex with a replacement function to dynamically insert values
        const generatedContent: string = svgContent.replace(/{{(.*?)}}/g, (match, key: string) => {
            const trimmedKey = key.trim() as keyof typeof replacements;
            // trim whitespace and look up the key in the data object
            return replacements[trimmedKey] !== undefined ? String(replacements[trimmedKey]) : match;
        })

        fs.writeFileSync(options.outputPath, generatedContent);
        console.log(`Generated badge ${options.name} percent ${options.percent} at ${options.outputPath}`);
    });
}

function readPercentageFromCoverageSummary(data: Buffer): number {
    const jsonData = JSON.parse(data.toString('utf8'));
    return jsonData.total.lines.pct;
}

function getCoverageSummaryFilePath(): string {
    return getEnvPathOrDefault('KIT_COVERAGE_SUMMARY_PATH', './coverage/coverage-summary.json');
}

function getTemplateBadgePath(): string {
    return getEnvPathOrDefault('KIT_TEMPLATE_BADGE_PATH', './scripts/code-coverage.svg.dat');
}

function getCoverageSummaryBadgePath(): string {
    return getEnvPathOrDefault('KIT_COVERAGE_SUMMARY_BADGE_PATH', './coverage/coverage-summary.svg');
}   

function getEnvPathOrDefault(envVarName: string, defaultPath: string): string {
    const myVarValue : string | undefined = process.env[envVarName];
    if (myVarValue && myVarValue.trim() !== '') {
        return myVarValue.trim();
    }
    return defaultPath;
}

function handleError(path: string, caught: any): caught is null {
    if (caught) {
        if (caught.code === 'ENOENT') {
            console.warn(`File not found at path: ${path}`);
        } else {
            console.error(`Error reading file at path: ${path}`, caught);
            throw caught;
        }
        return true;
    }
    return false;
}

function determineBackgroundColor(percent: number): string {
    if (percent >= 90) {
        return '#66FF00'; 
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
