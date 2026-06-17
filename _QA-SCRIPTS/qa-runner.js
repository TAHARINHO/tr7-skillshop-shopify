/**
 * TR7 Shop Builder — QA Runner
 * Orchestrateur principal de tous les checks QA
 */

const { checkLinks } = require('./link-checker');
const { checkSEO } = require('./seo-checker');
const { checkSchema } = require('./schema-validator');
const { checkPerformance } = require('./web-vitals-sim');

async function runAllChecks(storeUrl, selectedChecks = null) {
  const all = ['links', 'seo', 'schema', 'performance'];
  const toRun = selectedChecks ? all.filter(c => selectedChecks.includes(c)) : all;

  console.log(`\n🔍 TR7 QA Runner — ${storeUrl}`);
  console.log(`   Checks : ${toRun.join(', ')}\n`);

  const results = {};
  const runners = {
    links: () => checkLinks(storeUrl),
    seo: () => checkSEO(storeUrl),
    schema: () => checkSchema(storeUrl),
    performance: () => checkPerformance(storeUrl)
  };

  for (const check of toRun) {
    console.log(`  ▶ Running ${check}...`);
    try {
      results[check] = await runners[check]();
      const passed = results[check].filter(r => r.status === 'pass').length;
      const total = results[check].length;
      console.log(`  ✓ ${check}: ${passed}/${total} passed`);
    } catch (err) {
      console.error(`  ✗ ${check} error: ${err.message}`);
      results[check] = [{
        id: `${check}_error`,
        label: `Erreur ${check}`,
        status: 'error',
        detail: err.message
      }];
    }
  }

  return results;
}

module.exports = { runAllChecks };
