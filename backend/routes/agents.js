const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const AGENTS_DIR = path.join(__dirname, '..', '..', '_AGENT-NOE');

const AGENT_META = {
  'NOE': {
    file: 'NOE-SYSTEM-PROMPT-v2.md',
    icon: '🧠',
    role: 'Orchestrateur Principal',
    color: '#6c5ce7',
    shortcuts: ['/audit','/seo','/geo','/copy','/cro','/ads','/email','/brand','/roadmap','/qa','/deploy','/brief']
  },
  'BRAND': {
    file: 'AGENT-BRAND-COPY.md',
    icon: '🎨',
    role: 'Brand Strategy & Copywriting',
    color: '#e84393',
    shortcuts: ['/brand-foundation','/persona','/homepage-copy','/pdp-copy','/taglines','/email-welcome','/brand-voice','/naming']
  },
  'SEO': {
    file: 'AGENT-SEO-GEO.md',
    icon: '🔍',
    role: 'SEO & GEO/AEO',
    color: '#00cec9',
    shortcuts: ['/seo-audit','/keywords','/title-meta','/schema-product','/schema-faq','/geo-audit','/blog-plan','/llms-txt']
  },
  'CRO': {
    file: 'AGENT-CRO-UX.md',
    icon: '📈',
    role: 'CRO & UX',
    color: '#fd7b2e',
    shortcuts: ['/cro-audit','/wireframe','/ab-tests','/mobile-audit','/cwv-check','/trust-signals','/checkout-audit']
  },
  'ADS': {
    file: 'AGENT-ADS-MARKETING.md',
    icon: '📣',
    role: 'Ads & Performance Marketing',
    color: '#fdcb6e',
    shortcuts: ['/ads-strategy','/meta-structure','/hooks','/creative-brief','/email-strategy','/kpi-dashboard','/budget-split']
  },
  'TECH': {
    file: 'AGENT-TECH-SHOPIFY.md',
    icon: '⚙️',
    role: 'Tech & Shopify MCP',
    color: '#a29bfe',
    shortcuts: ['/deploy-plan','/create-products','/inject-seo','/schema-install','/apps-setup','/perf-audit','/graphql']
  },
  'DATA': {
    file: 'AGENT-ANALYTICS-DATA.md',
    icon: '📊',
    role: 'Analytics & Data Intelligence',
    color: '#55efc4',
    shortcuts: ['/analytics-setup','/kpi-dashboard','/weekly-report','/ltv-calc','/rfm-segment','/ga4-events','/analytics-audit']
  }
};

// GET /api/agents/list — Liste tous les agents
router.get('/list', (req, res) => {
  const agents = Object.entries(AGENT_META).map(([name, meta]) => {
    const filePath = path.join(AGENTS_DIR, meta.file);
    const exists = fs.existsSync(filePath);
    const stats = exists ? fs.statSync(filePath) : null;
    return {
      name,
      icon: meta.icon,
      role: meta.role,
      color: meta.color,
      shortcuts: meta.shortcuts,
      file: meta.file,
      available: exists,
      size: stats ? Math.round(stats.size / 1024) + 'KB' : null,
      lastModified: stats ? stats.mtime : null
    };
  });
  res.json(agents);
});

// GET /api/agents/:name — Récupère le contenu d'un agent
router.get('/:name', (req, res) => {
  const name = req.params.name.toUpperCase();
  const meta = AGENT_META[name];

  if (!meta) {
    return res.status(404).json({ error: `Agent "${name}" non trouvé` });
  }

  const filePath = path.join(AGENTS_DIR, meta.file);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `Fichier agent non trouvé : ${meta.file}` });
  }

  const content = fs.readFileSync(filePath, 'utf8');
  res.json({
    name,
    ...meta,
    content,
    wordCount: content.split(/\s+/).length
  });
});

module.exports = router;
