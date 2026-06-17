#!/usr/bin/env node
/**
 * TR7 QA — CLI Tool
 * Usage : node qa-cli.js <store-url> [--checks links,seo,schema,performance]
 */

const { runAllChecks } = require('./qa-runner');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const storeUrl = args[0];

if (!storeUrl) {
  console.error('\n❌ Usage : node qa-cli.js <store-url> [--checks links,seo,schema,performance]\n');
  console.error('Exemples :');
  console.error('  node qa-cli.js https://ma-boutique.myshopify.com');
  console.error('  node qa-cli.js https://ma-boutique.myshopify.com --checks seo,schema\n');
  process.exit(1);
}

const checksIdx = args.indexOf('--checks');
const checks = checksIdx !== -1 ? args[checksIdx + 1]?.split(',') : null;

const STATUS_ICONS = { pass: '✅', warn: '⚠️ ', fail: '❌', error: '💥' };
const STATUS_LABELS = { pass: 'PASS', warn: 'WARN', fail: 'FAIL', error: 'ERROR' };

async function main() {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║    TR7 Shop Builder — QA Automatisée         ║');
  console.log('╚══════════════════════════════════════════════╝\n');
  console.log(`🎯 Boutique : ${storeUrl}`);
  console.log(`📋 Checks   : ${checks ? checks.join(', ') : 'tous (links, seo, schema, performance)'}\n`);

  const startTime = Date.now();
  const results = await runAllChecks(storeUrl, checks);
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  let totalPass = 0, totalWarn = 0, totalFail = 0, totalError = 0;

  for (const [category, checks] of Object.entries(results)) {
    const catLabel = category.toUpperCase().padEnd(15);
    console.log(`\n──── ${catLabel}──────────────────────────────`);
    for (const check of checks) {
      const icon = STATUS_ICONS[check.status] || '?';
      const label = check.label.padEnd(45);
      console.log(`  ${icon} ${label} ${check.detail}`);
      if (check.status === 'pass') totalPass++;
      else if (check.status === 'warn') totalWarn++;
      else if (check.status === 'fail') totalFail++;
      else totalError++;
    }
  }

  const total = totalPass + totalWarn + totalFail + totalError;
  const score = total > 0 ? Math.round((totalPass / total) * 100) : 0;

  console.log('\n╔══════════════════════════════════════════════╗');
  console.log(`║  SCORE FINAL : ${score}/100                           ║`);
  console.log(`║  ✅ ${String(totalPass).padEnd(3)} PASS  |  ⚠️  ${String(totalWarn).padEnd(3)} WARN  |  ❌ ${String(totalFail).padEnd(3)} FAIL  ║`);
  console.log(`║  Durée : ${duration}s                                 ║`);
  console.log('╚══════════════════════════════════════════════╝\n');

  // Sauvegarder le rapport JSON
  const reportName = `qa-report-${Date.now()}.json`;
  const report = {
    storeUrl,
    timestamp: new Date().toISOString(),
    duration: `${duration}s`,
    score,
    summary: { pass: totalPass, warn: totalWarn, fail: totalFail, error: totalError },
    results
  };
  fs.writeFileSync(reportName, JSON.stringify(report, null, 2));
  console.log(`📄 Rapport sauvegardé : ${reportName}\n`);
}

main().catch(err => {
  console.error('Erreur fatale:', err.message);
  process.exit(1);
});
