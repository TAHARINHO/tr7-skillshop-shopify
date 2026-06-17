/**
 * TR7 QA — SEO Checker
 * Vérifie les meta tags, title, H1, robots, sitemap et éléments SEO
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

async function fetchPage(url, timeout = 10000) {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(url);
      const lib = parsedUrl.protocol === 'https:' ? https : http;
      let data = '';
      const req = lib.get(url, { timeout }, (res) => {
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => resolve({ status: res.statusCode, html: data }));
      });
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    } catch (err) { reject(err); }
  });
}

function extractTag(html, regex, group = 1) {
  const match = html.match(regex);
  return match ? match[group].trim() : null;
}

async function checkSEO(storeUrl) {
  const results = [];
  const base = storeUrl.replace(/\/$/, '');

  let html = '';
  try {
    const res = await fetchPage(base + '/');
    html = res.html;
  } catch {
    return [{
      id: 'seo_fetch_error',
      label: 'Accès page homepage',
      status: 'error',
      detail: '✗ Impossible de récupérer la homepage pour analyse SEO'
    }];
  }

  // Title tag
  const title = extractTag(html, /<title[^>]*>([^<]+)<\/title>/i);
  results.push({
    id: 'seo_title',
    label: 'Title tag présent',
    status: title ? 'pass' : 'fail',
    detail: title
      ? `✓ "${title}" (${title.length} car.)`
      : '✗ Aucun title tag trouvé'
  });

  if (title) {
    results.push({
      id: 'seo_title_length',
      label: 'Title tag longueur (< 60 car.)',
      status: title.length <= 60 ? 'pass' : 'warn',
      detail: title.length <= 60
        ? `✓ ${title.length} caractères`
        : `⚠ ${title.length} caractères — tronqué par Google (max 60)`
    });
  }

  // Meta description
  const metaDesc = extractTag(html, /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
    || extractTag(html, /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
  results.push({
    id: 'seo_meta_desc',
    label: 'Meta description présente',
    status: metaDesc ? 'pass' : 'fail',
    detail: metaDesc
      ? `✓ "${metaDesc.substring(0, 80)}..." (${metaDesc.length} car.)`
      : '✗ Aucune meta description'
  });

  if (metaDesc) {
    results.push({
      id: 'seo_meta_desc_length',
      label: 'Meta description longueur (< 155 car.)',
      status: metaDesc.length <= 155 ? 'pass' : 'warn',
      detail: metaDesc.length <= 155
        ? `✓ ${metaDesc.length} caractères`
        : `⚠ ${metaDesc.length} caractères — trop long (max 155)`
    });
  }

  // H1
  const h1 = extractTag(html, /<h1[^>]*>([^<]+)<\/h1>/i);
  const h1Count = (html.match(/<h1/gi) || []).length;
  results.push({
    id: 'seo_h1_present',
    label: 'H1 présent',
    status: h1 ? 'pass' : 'fail',
    detail: h1 ? `✓ "${h1}"` : '✗ Aucun H1 trouvé'
  });
  results.push({
    id: 'seo_h1_unique',
    label: 'Un seul H1 par page',
    status: h1Count === 1 ? 'pass' : h1Count === 0 ? 'fail' : 'warn',
    detail: h1Count === 1
      ? '✓ Un seul H1'
      : `⚠ ${h1Count} H1 détectés (doit être unique)`
  });

  // Robots meta
  const robotsMeta = extractTag(html, /<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i)
    || extractTag(html, /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']robots["']/i);
  const isNoIndex = robotsMeta && /noindex/i.test(robotsMeta);
  results.push({
    id: 'seo_robots_meta',
    label: 'Page indexable (pas de noindex)',
    status: isNoIndex ? 'fail' : 'pass',
    detail: isNoIndex
      ? `✗ Page en noindex : "${robotsMeta}"`
      : '✓ Page indexable'
  });

  // Canonical
  const canonical = extractTag(html, /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  results.push({
    id: 'seo_canonical',
    label: 'URL canonique définie',
    status: canonical ? 'pass' : 'warn',
    detail: canonical
      ? `✓ canonical: ${canonical}`
      : '⚠ Pas de balise canonical — recommandé pour éviter le contenu dupliqué'
  });

  // Open Graph
  const ogTitle = extractTag(html, /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
  const ogImage = extractTag(html, /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
  results.push({
    id: 'seo_og_tags',
    label: 'Open Graph (partage réseaux sociaux)',
    status: ogTitle && ogImage ? 'pass' : 'warn',
    detail: ogTitle && ogImage
      ? `✓ og:title et og:image présents`
      : `⚠ OG incomplet — og:title: ${ogTitle ? 'ok' : '✗'}, og:image: ${ogImage ? 'ok' : '✗'}`
  });

  // Sitemap check
  let sitemapOk = false;
  try {
    const sitemapRes = await fetchPage(base + '/sitemap.xml');
    sitemapOk = sitemapRes.status === 200 && sitemapRes.html.includes('<urlset');
  } catch {}
  results.push({
    id: 'seo_sitemap',
    label: 'Sitemap XML accessible',
    status: sitemapOk ? 'pass' : 'fail',
    detail: sitemapOk
      ? '✓ /sitemap.xml accessible et valide'
      : '✗ Sitemap inaccessible ou invalide'
  });

  // Schema markup
  const hasSchema = html.includes('application/ld+json');
  results.push({
    id: 'seo_schema_present',
    label: 'Schema markup (JSON-LD) détecté',
    status: hasSchema ? 'pass' : 'warn',
    detail: hasSchema
      ? '✓ Au moins un bloc JSON-LD trouvé'
      : '⚠ Aucun schema JSON-LD — impact SEO et GEO/AEO'
  });

  // Langue
  const lang = extractTag(html, /<html[^>]*lang=["']([^"']+)["']/i);
  results.push({
    id: 'seo_lang',
    label: 'Attribut lang sur <html>',
    status: lang ? 'pass' : 'warn',
    detail: lang ? `✓ lang="${lang}"` : '⚠ Attribut lang manquant sur <html>'
  });

  return results;
}

module.exports = { checkSEO };
