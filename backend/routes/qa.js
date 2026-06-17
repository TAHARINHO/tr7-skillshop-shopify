const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { runAllChecks } = require('../../_QA-SCRIPTS/qa-runner');

const reportsDir = path.join(__dirname, '..', 'reports');
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

// POST /api/qa/run — Lance une vérification QA complète
router.post('/run', async (req, res) => {
  const { storeUrl, storeName, checks } = req.body;

  if (!storeUrl) {
    return res.status(400).json({ error: 'storeUrl requis' });
  }

  const reportId = `qa_${Date.now()}`;
  const report = {
    id: reportId,
    storeName: storeName || 'Boutique inconnue',
    storeUrl,
    startedAt: new Date().toISOString(),
    status: 'running',
    results: {}
  };

  // Sauvegarder le rapport initial
  fs.writeFileSync(
    path.join(reportsDir, `${reportId}.json`),
    JSON.stringify(report, null, 2)
  );

  // Répondre immédiatement avec l'ID
  res.json({ reportId, message: 'QA en cours...', pollUrl: `/api/qa/report/${reportId}` });

  // Lancer les checks en arrière-plan
  try {
    const results = await runAllChecks(storeUrl, checks);
    report.status = 'completed';
    report.completedAt = new Date().toISOString();
    report.results = results;
    report.score = computeScore(results);
  } catch (err) {
    report.status = 'error';
    report.error = err.message;
  }

  fs.writeFileSync(
    path.join(reportsDir, `${reportId}.json`),
    JSON.stringify(report, null, 2)
  );
});

// GET /api/qa/report/:id — Récupère un rapport QA
router.get('/report/:id', (req, res) => {
  const reportPath = path.join(reportsDir, `${req.params.id}.json`);
  if (!fs.existsSync(reportPath)) {
    return res.status(404).json({ error: 'Rapport non trouvé' });
  }
  res.json(JSON.parse(fs.readFileSync(reportPath, 'utf8')));
});

// GET /api/qa/reports — Liste tous les rapports
router.get('/reports', (req, res) => {
  const files = fs.readdirSync(reportsDir).filter(f => f.endsWith('.json'));
  const reports = files.map(f => {
    const data = JSON.parse(fs.readFileSync(path.join(reportsDir, f), 'utf8'));
    return {
      id: data.id,
      storeName: data.storeName,
      storeUrl: data.storeUrl,
      status: data.status,
      score: data.score,
      startedAt: data.startedAt,
      completedAt: data.completedAt
    };
  });
  res.json(reports.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt)));
});

function computeScore(results) {
  const allChecks = Object.values(results).flat();
  if (allChecks.length === 0) return 0;
  const passed = allChecks.filter(c => c.status === 'pass').length;
  return Math.round((passed / allChecks.length) * 100);
}

module.exports = router;
