/**
 * TR7 QA — Web Vitals Simulator
 * Simule une analyse de performance et Core Web Vitals
 * (En production, intégrer PageSpeed Insights API avec clé API)
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

async function fetchWithTiming(url, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    try {
      const lib = new URL(url).protocol === 'https:' ? https : http;
      let data = '';
      const req = lib.get(url, { timeout }, (res) => {
        const firstByte = Date.now() - start;
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            html: data,
            ttfb: firstByte,
            loadTime: Date.now() - start,
            size: Buffer.byteLength(data, 'utf8')
          });
        });
      });
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    } catch (err) { reject(err); }
  });
}

function analyzeHtml(html) {
  const metrics = {
    hasPreload: html.includes('rel="preload"') || html.includes("rel='preload'"),
    hasDeferScripts: (html.match(/\bdefer\b/g) || []).length,
    hasAsyncScripts: (html.match(/\basync\b/g) || []).length,
    hasLazyImages: (html.match(/loading=["']lazy["']/g) || []).length,
    imageCount: (html.match(/<img/gi) || []).length,
    imagesWithAlt: (html.match(/<img[^>]*alt=["'][^"']+["']/gi) || []).length,
    imagesWithDimensions: (html.match(/<img[^>]*(width|height)[^>]*>/gi) || []).length,
    hasWebFont: html.includes('fonts.googleapis.com') || html.includes('fonts.gstatic.com'),
    hasFontDisplay: html.includes('font-display'),
    scriptCount: (html.match(/<script(?!\s+type=["']application\/ld)/gi) || []).length,
    inlineStyleBlocks: (html.match(/<style[^>]*>/gi) || []).length,
    hasViewport: html.includes('name="viewport"') || html.includes("name='viewport'"),
    hasCLS_risk: !html.includes('width=') || !html.includes('height='),
  };
  return metrics;
}

async function checkPerformance(storeUrl) {
  const results = [];
  const base = storeUrl.replace(/\/$/, '');

  let pageData;
  try {
    pageData = await fetchWithTiming(base + '/');
  } catch {
    return [{
      id: 'perf_fetch_error',
      label: 'Accès homepage pour analyse',
      status: 'error',
      detail: '✗ Impossible de récupérer la page pour analyse de performance'
    }];
  }

  const { ttfb, loadTime, size, html } = pageData;
  const metrics = analyzeHtml(html);

  // TTFB (Time to First Byte)
  const ttfbScore = ttfb < 200 ? 'pass' : ttfb < 600 ? 'warn' : 'fail';
  results.push({
    id: 'perf_ttfb',
    label: 'Time to First Byte (TTFB)',
    status: ttfbScore,
    detail: ttfbScore === 'pass'
      ? `✓ ${ttfb}ms — Excellent (< 200ms)`
      : ttfbScore === 'warn'
        ? `⚠ ${ttfb}ms — Acceptable (200-600ms), optimisable`
        : `✗ ${ttfb}ms — Trop lent (> 600ms) — impact LCP`
  });

  // Taille page HTML
  const sizeKb = Math.round(size / 1024);
  results.push({
    id: 'perf_page_size',
    label: 'Taille page HTML',
    status: sizeKb < 150 ? 'pass' : sizeKb < 400 ? 'warn' : 'fail',
    detail: sizeKb < 150
      ? `✓ ${sizeKb}KB — Léger`
      : `⚠ ${sizeKb}KB — ${sizeKb < 400 ? 'Acceptable mais optimisable' : 'Trop lourd — réduire le HTML'}`
  });

  // Viewport meta
  results.push({
    id: 'perf_viewport',
    label: 'Viewport meta (mobile)',
    status: metrics.hasViewport ? 'pass' : 'fail',
    detail: metrics.hasViewport
      ? '✓ <meta name="viewport"> présent'
      : '✗ Viewport meta manquant — page non-responsive mobile !'
  });

  // Preload hero image
  results.push({
    id: 'perf_preload',
    label: 'Préchargement image hero (LCP)',
    status: metrics.hasPreload ? 'pass' : 'warn',
    detail: metrics.hasPreload
      ? '✓ rel="preload" détecté — bonne pratique LCP'
      : '⚠ Pas de preload — ajouter <link rel="preload"> sur l\'image hero pour améliorer le LCP'
  });

  // Scripts defer/async
  const deferRatio = metrics.scriptCount > 0
    ? Math.round(((metrics.hasDeferScripts + metrics.hasAsyncScripts) / metrics.scriptCount) * 100)
    : 100;
  results.push({
    id: 'perf_scripts',
    label: `Scripts asynchrones (defer/async)`,
    status: deferRatio >= 80 ? 'pass' : deferRatio >= 50 ? 'warn' : 'fail',
    detail: `${metrics.scriptCount} scripts détectés, ${metrics.hasDeferScripts} defer + ${metrics.hasAsyncScripts} async (${deferRatio}%)${deferRatio < 80 ? ' — ajouter defer sur les scripts non-critiques' : ''}`
  });

  // Lazy loading images
  const lazyRatio = metrics.imageCount > 0
    ? Math.round((metrics.hasLazyImages / metrics.imageCount) * 100)
    : 100;
  results.push({
    id: 'perf_lazy_images',
    label: 'Lazy loading images',
    status: lazyRatio >= 50 ? 'pass' : 'warn',
    detail: `${metrics.hasLazyImages}/${metrics.imageCount} images en lazy loading (${lazyRatio}%)`
  });

  // Alt text images
  const altRatio = metrics.imageCount > 0
    ? Math.round((metrics.imagesWithAlt / metrics.imageCount) * 100)
    : 100;
  results.push({
    id: 'perf_img_alt',
    label: 'Alt text sur les images',
    status: altRatio >= 90 ? 'pass' : altRatio >= 70 ? 'warn' : 'fail',
    detail: `${metrics.imagesWithAlt}/${metrics.imageCount} images avec alt text (${altRatio}%)`
  });

  // CLS risk (images sans dimensions)
  const hasAllDimensions = metrics.imagesWithDimensions >= metrics.imageCount * 0.8;
  results.push({
    id: 'perf_cls_risk',
    label: 'Risque CLS (images avec dimensions)',
    status: hasAllDimensions ? 'pass' : 'warn',
    detail: hasAllDimensions
      ? '✓ La plupart des images ont des dimensions définies (bon pour CLS)'
      : `⚠ ${metrics.imageCount - metrics.imagesWithDimensions} images sans width/height — risque CLS`
  });

  // Web fonts
  results.push({
    id: 'perf_font_display',
    label: 'font-display (éviter FOIT)',
    status: !metrics.hasWebFont || metrics.hasFontDisplay ? 'pass' : 'warn',
    detail: !metrics.hasWebFont
      ? '✓ Pas de police web externe (polices système)'
      : metrics.hasFontDisplay
        ? '✓ font-display détecté'
        : '⚠ Police web Google Fonts sans font-display:swap — risque de flash de texte invisible'
  });

  // Résumé général
  const passCount = results.filter(r => r.status === 'pass').length;
  const totalCount = results.length;
  const score = Math.round((passCount / totalCount) * 100);

  results.unshift({
    id: 'perf_summary',
    label: `Score Performance estimé`,
    status: score >= 80 ? 'pass' : score >= 60 ? 'warn' : 'fail',
    detail: `${score}/100 — ${passCount}/${totalCount} checks passés (basé sur analyse statique — utiliser PageSpeed Insights pour données réelles)`
  });

  return results;
}

module.exports = { checkPerformance };
