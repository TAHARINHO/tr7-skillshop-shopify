/**
 * TR7 QA — Link Checker
 * Vérifie les liens cassés, redirections et pages 404
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

async function checkUrl(url, timeout = 8000) {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(url);
      const lib = parsedUrl.protocol === 'https:' ? https : http;
      const req = lib.request(
        { method: 'HEAD', hostname: parsedUrl.hostname, path: parsedUrl.pathname + parsedUrl.search, timeout },
        (res) => resolve({ url, status: res.statusCode, ok: res.statusCode < 400 })
      );
      req.on('error', () => resolve({ url, status: 0, ok: false, error: 'Connection failed' }));
      req.on('timeout', () => { req.destroy(); resolve({ url, status: 0, ok: false, error: 'Timeout' }); });
      req.end();
    } catch {
      resolve({ url, status: 0, ok: false, error: 'Invalid URL' });
    }
  });
}

async function checkLinks(storeUrl) {
  const results = [];
  const base = storeUrl.replace(/\/$/, '');

  // Pages critiques à vérifier
  const criticalPages = [
    { path: '/', label: 'Homepage' },
    { path: '/collections/all', label: 'Collection principale' },
    { path: '/cart', label: 'Panier' },
    { path: '/pages/faq', label: 'Page FAQ' },
    { path: '/pages/contact', label: 'Page Contact' },
    { path: '/policies/privacy-policy', label: 'Politique de confidentialité' },
    { path: '/policies/refund-policy', label: 'Politique de retour' },
    { path: '/policies/shipping-policy', label: 'Politique de livraison' },
    { path: '/policies/terms-of-service', label: 'CGV' },
    { path: '/sitemap.xml', label: 'Sitemap XML' },
    { path: '/robots.txt', label: 'Robots.txt' },
  ];

  for (const page of criticalPages) {
    const url = base + page.path;
    const result = await checkUrl(url);
    results.push({
      id: `link_${page.path.replace(/\//g, '_')}`,
      label: page.label,
      url,
      status: result.ok ? 'pass' : (result.status === 404 ? 'fail' : 'warn'),
      detail: result.ok
        ? `✓ ${result.status} OK`
        : result.status === 0
          ? `✗ Inaccessible (${result.error})`
          : `✗ HTTP ${result.status}`,
      httpStatus: result.status
    });
  }

  // Check spécifique : la boutique est-elle accessible du tout ?
  const mainCheck = results.find(r => r.url === base + '/');
  if (mainCheck && mainCheck.status === 'fail') {
    results.unshift({
      id: 'link_store_accessible',
      label: 'Boutique accessible',
      status: 'fail',
      detail: '✗ La boutique principale est inaccessible — vérifiez l\'URL et le statut Shopify'
    });
  } else {
    results.unshift({
      id: 'link_store_accessible',
      label: 'Boutique accessible',
      status: 'pass',
      detail: '✓ La boutique répond correctement'
    });
  }

  return results;
}

module.exports = { checkLinks, checkUrl };
