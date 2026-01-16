import { generateCoverageSummaryBadge, generateTypedocBadge } from "./generate-badges";

test('generateCoverageSummaryBadge test', async () => {
  const result = await generateCoverageSummaryBadge();
  expect(result).toBe(undefined);
});

test('generateTypedocBadge test', async () => {
  const result = await generateTypedocBadge();
  expect(result).toBe(undefined);
});

