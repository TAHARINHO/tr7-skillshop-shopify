/**
 * TR7 QA — Schema Validator
 * Valide les données structurées JSON-LD (Product, FAQ, BreadcrumbList, Organization)
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

async function fetchPage(url, timeout = 10000) {
  return new Promise((resolve, reject) => {
    try {
      const lib = new URL(url).protocol === 'https:' ? https : http;
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

function extractJsonLd(html) {
  const regex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const schemas = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1].trim());
      schemas.push(parsed);
    } catch {}
  }
  return schemas;
}

function validateProductSchema(schema) {
  const issues = [];
  const required = ['name', 'description', 'image', 'offers'];
  for (const field of required) {
    if (!schema[field]) issues.push(`Champ manquant: "${field}"`);
  }
  if (schema.offers) {
    const offer = Array.isArray(schema.offers) ? schema.offers[0] : schema.offers;
    if (!offer.price) issues.push('offers.price manquant');
    if (!offer.priceCurrency) issues.push('offers.priceCurrency manquant');
    if (!offer.availability) issues.push('offers.availability manquant');
  }
  return issues;
}

function validateFaqSchema(schema) {
  const issues = [];
  if (!schema.mainEntity || !Array.isArray(schema.mainEntity)) {
    issues.push('mainEntity manquant ou pas un tableau');
    return issues;
  }
  if (schema.mainEntity.length < 3) {
    issues.push(`Seulement ${schema.mainEntity.length} Q&A — recommandé : 5+`);
  }
  schema.mainEntity.forEach((item, i) => {
    if (!item.name) issues.push(`Question ${i + 1}: champ "name" manquant`);
    if (!item.acceptedAnswer?.text) issues.push(`Question ${i + 1}: réponse manquante`);
  });
  return issues;
}

async function checkSchema(storeUrl) {
  const results = [];
  const base = storeUrl.replace(/\/$/, '');

  // Analyser la homepage
  let homeHtml = '';
  try {
    const res = await fetchPage(base + '/');
    homeHtml = res.html;
  } catch {
    return [{
      id: 'schema_fetch_error',
      label: 'Accès homepage',
      status: 'error',
      detail: '✗ Impossible d\'accéder à la homepage'
    }];
  }

  const homeSchemas = extractJsonLd(homeHtml);

  // Vérifier présence de schemas
  results.push({
    id: 'schema_count',
    label: `Schemas JSON-LD détectés (homepage)`,
    status: homeSchemas.length > 0 ? 'pass' : 'fail',
    detail: homeSchemas.length > 0
      ? `✓ ${homeSchemas.length} schema(s) trouvé(s) : ${homeSchemas.map(s => s['@type']).join(', ')}`
      : '✗ Aucun schema JSON-LD sur la homepage'
  });

  // Vérifier Organization schema
  const orgSchema = homeSchemas.find(s => s['@type'] === 'Organization' || s['@type'] === 'Store');
  results.push({
    id: 'schema_organization',
    label: 'Schema Organization présent',
    status: orgSchema ? 'pass' : 'warn',
    detail: orgSchema
      ? `✓ Organization: "${orgSchema.name}"`
      : '⚠ Pas de schema Organization — recommandé sur la homepage'
  });

  // Analyser une page produit (collection all puis premier produit)
  let productHtml = '';
  let productUrl = '';
  try {
    const collRes = await fetchPage(base + '/collections/all');
    if (collRes.status === 200) {
      const firstProductMatch = collRes.html.match(/href="(\/products\/[^"?]+)"/);
      if (firstProductMatch) {
        productUrl = base + firstProductMatch[1];
        const productRes = await fetchPage(productUrl);
        productHtml = productRes.html;
      }
    }
  } catch {}

  if (productHtml) {
    const productSchemas = extractJsonLd(productHtml);
    const productSchema = productSchemas.find(s => s['@type'] === 'Product');

    results.push({
      id: 'schema_product_present',
      label: 'Schema Product sur fiche produit',
      status: productSchema ? 'pass' : 'fail',
      detail: productSchema
        ? `✓ Schema Product trouvé : "${productSchema.name}"`
        : `✗ Pas de schema Product sur ${productUrl}`
    });

    if (productSchema) {
      const issues = validateProductSchema(productSchema);
      results.push({
        id: 'schema_product_valid',
        label: 'Schema Product — champs requis',
        status: issues.length === 0 ? 'pass' : 'warn',
        detail: issues.length === 0
          ? '✓ Tous les champs requis sont présents'
          : `⚠ Champs manquants : ${issues.join(' | ')}`
      });

      results.push({
        id: 'schema_product_rating',
        label: 'Schema Product — aggregateRating',
        status: productSchema.aggregateRating ? 'pass' : 'warn',
        detail: productSchema.aggregateRating
          ? `✓ Note: ${productSchema.aggregateRating.ratingValue}/5 (${productSchema.aggregateRating.reviewCount} avis)`
          : '⚠ aggregateRating absent — les Rich Snippets étoiles ne s\'afficheront pas'
      });
    }

    // FAQ schema sur produit
    const faqSchema = productSchemas.find(s => s['@type'] === 'FAQPage');
    results.push({
      id: 'schema_faq',
      label: 'Schema FAQPage sur fiche produit (GEO/AEO)',
      status: faqSchema ? 'pass' : 'warn',
      detail: faqSchema
        ? `✓ FAQPage avec ${faqSchema.mainEntity?.length || 0} questions`
        : '⚠ Pas de FAQPage — impact GEO/AEO (visibilité dans ChatGPT, Perplexity)'
    });

    if (faqSchema) {
      const faqIssues = validateFaqSchema(faqSchema);
      results.push({
        id: 'schema_faq_valid',
        label: 'Schema FAQPage — qualité',
        status: faqIssues.length === 0 ? 'pass' : 'warn',
        detail: faqIssues.length === 0
          ? '✓ FAQPage valide et complète'
          : `⚠ ${faqIssues.join(' | ')}`
      });
    }

    // BreadcrumbList
    const breadcrumb = productSchemas.find(s => s['@type'] === 'BreadcrumbList');
    results.push({
      id: 'schema_breadcrumb',
      label: 'Schema BreadcrumbList',
      status: breadcrumb ? 'pass' : 'warn',
      detail: breadcrumb
        ? `✓ BreadcrumbList avec ${breadcrumb.itemListElement?.length || 0} niveaux`
        : '⚠ Pas de BreadcrumbList — Rich Snippets breadcrumb non affichés'
    });
  } else {
    results.push({
      id: 'schema_no_product',
      label: 'Analyse fiche produit',
      status: 'warn',
      detail: '⚠ Aucune fiche produit accessible pour analyse — vérifiez la collection /collections/all'
    });
  }

  return results;
}

module.exports = { checkSchema };
