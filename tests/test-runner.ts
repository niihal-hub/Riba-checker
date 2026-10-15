import fs from 'fs/promises';
import path from 'path';
import { runRuleBasedChecks } from '../lib/analysis/rules';

async function runTests() {
  console.log('🚀 Starting RibaCheck Validation Suite...\n');

  const expectedPath = path.join(process.cwd(), 'tests/expected.json');
  const expected = JSON.parse(await fs.readFile(expectedPath, 'utf8'));

  let passed = 0;
  let failed = 0;

  for (const test of expected) {
    process.stdout.write(`Testing ${test.name}... `);

    // Run rule-based checks
    const flags = runRuleBasedChecks(test.content);

    // Validate if the expected flags are caught by the rule engine
    const caughtCategories = flags.map(f => f.category);
    const allExpectedCaught = test.expected_flags.every(cat => caughtCategories.includes(cat));

    if (allExpectedCaught) {
      console.log('✅ PASS');
      passed++;
    } else {
      console.log('❌ FAIL');
      console.log(`   - Expected: ${test.expected_flags.join(', ')}`);
      console.log(`   - Caught: ${caughtCategories.join(', ')}`);
      failed++;
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
