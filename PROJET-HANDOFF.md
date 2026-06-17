# 📋 TR7 SHOP BUILDER — HANDOFF COMPLET
## Document de continuité projet pour VSCode
### Créé par Claude (NOE session) | Juin 2026

---

## 🗂️ STRUCTURE DES FICHIERS (état actuel)

```
TR7 Boutique Shopify/
└── TR7-Shop Shopify/
    │
    ├── 📄 TR7-SHOP-BUILDER.html          ← Dashboard principal (ouvrir dans browser)
    ├── 📄 README.md                       ← Vue d'ensemble du projet
    ├── 📦 tr7-shop-builder.bundle         ← Repo git prêt à pusher sur GitHub
    ├── 🔧 PUSH-GITHUB.sh                  ← Script de push GitHub (voir section GitHub)
    │
    ├── _AGENT-NOE/
    │   └── NOE-SYSTEM-PROMPT-v2.md        ← System prompt complet de l'agent NOE
    │
    ├── _DOCS-PROJET/
    │   ├── ANALYSE-PROJET-COMPLETE.md     ← Analyse + architecture multi-agents
    │   └── (ROADMAP-PROJET.md)            ← À créer (voir TODO)
    │
    ├── _TEMPLATE-BOUTIQUE/                ← Vide — template réutilisable à construire
    │
    └── Succespro-2.0/
        ├── AUDIT-SUCCESPRO-2.0.md         ← Audit complet du thème importé
        ├── assets/                        ← CSS + JS du thème (24 CSS, 17 JS)
        ├── config/
        │   ├── settings_data.json         ← Config design (couleurs, typo, logo)
        │   └── settings_schema.json       ← Schéma thème (nom: SuccessPro v1.2.0)
        ├── layout/
        │   └── theme.liquid               ← Layout principal (iCart intégré)
        ├── locales/                       ← 20+ langues
        ├── sections/                      ← 85 sections Liquid
        ├── snippets/                      ← 70+ snippets Liquid
        └── templates/                     ← 18 templates JSON/Liquid
```

---

## ✅ CE QUI A ÉTÉ FAIT (résumé complet)

### 1. Structure projet
- Dossier `TR7-Shop Shopify/` créé avec 4 sous-dossiers
- Sous-dossier `Succespro-2.0/` prêt à recevoir d'autres boutiques au même niveau

### 2. Agent NOE v2.0 (`_AGENT-NOE/NOE-SYSTEM-PROMPT-v2.md`)
System prompt complet de l'agent IA **NOE** (Navigateur des Opportunités E-Commerce), version améliorée du SHOPIFY STORE ARCHITECT initial. Contient :
- Section 0 : Identité (10 expertises fusionnées)
- Section 1 : Protocole onboarding (10 questions briefing)
- Section 2 : **14 modules** d'expertise
- Section 3 : Roadmap type 90 jours
- Section 4 : Règles de comportement
- Section 5 : **20 commandes shortcuts** (`/audit`, `/seo`, `/geo`, `/copy`, `/cro`, `/ads`, `/email`, `/brand`, `/roadmap`, `/qa`, `/deploy`, `/zip`, `/competitor`, `/pdp`, `/homepage`, `/legal`, `/kpis`, `/apps`, `/blog`, `/brief`)
- Section 6 : Gestion mémoire/contexte

**Nouveautés v2 vs v1 :**
- Module 13 — Recette & QA (checklist 25 points)
- Module 14 — Déploiement MCP Shopify (pipeline 6 étapes)
- GEO/AEO intégré dans SEO (ChatGPT Search, Perplexity, AI Overviews)
- Règle Message Match Ads ↔ PDP
- Shortcuts `/geo`, `/qa`, `/deploy`, `/zip`, `/competitor`, `/pdp`

### 3. Analyse projet (`_DOCS-PROJET/ANALYSE-PROJET-COMPLETE.md`)
- Vision et objectifs
- Données e-com 2026 (CVR benchmarks, AI Search +1500%, mobile 70-80%)
- Architecture multi-agents (NOE + 6 agents spécialisés)
- Stack MCP recommandé
- Stack Apps Shopify (essentiel / croissance / scale)
- Roadmap projet en 5 phases

### 4. ZIP Succespro 2.0 analysé
- Thème : **SuccessPro v1.2.0 by ByMade** (bymade.com)
- Design system extrait : palette `#fff` / `#9ed3ff` / `#fffced` / `#000`, Poppins body
- Apps détectées : iCart, Bundles, Quantity Breaks, Upsell, Trustpilot, AliReviews
- Score NOE : **5.8/10**
- 8 quick wins identifiés

### 5. Dashboard HTML (`TR7-SHOP-BUILDER.html`)
Interface complète ~54KB, 7 onglets :
- **Vue d'ensemble** : scores, quick wins avec cases à cocher
- **NOE Prompt** : zone de texte libre + 15 shortcuts + import ZIP drag & drop
- **Audit** : scores par dimension, blocs homepage/PDP analysés
- **Design System** : palette, typographies, branding assets
- **Apps Stack** : apps détectées + apps recommandées
- **Recette QA** : checklist 25 points (Technique / Parcours / SEO / Tracking / Légal)
- **Déploiement** : pipeline 6 étapes via MCP Shopify

### 6. Sauvegardes
- **Mémoire Claude** : 4 fichiers (user, projet, feedback, références)
- **Google Drive** : Dossier "TR7 Shop Builder" créé avec 3 Google Docs + HTML
- **GitHub** : Repo git initialisé, bundle prêt (`tr7-shop-builder.bundle`)

---

## 🔜 CE QUI RESTE À FAIRE (TODO)

### Phase 3 — Agents Spécialisés
```
[ ] Agent BRAND & COPY — fichier prompt dédié
[ ] Agent SEO / GEO — avec templates title/meta/schema
[ ] Agent CRO / UX — avec wireframes et checklists
[ ] Agent ADS & MARKETING — avec structures campagnes Meta/Google
[ ] Agent TECH & SHOPIFY — pipeline MCP détaillé
[ ] Agent ANALYTICS — setup GA4 + GTM + Meta Pixel
```

### Phase 4 — QA Automatisée
```
[ ] Script Python/Node de vérification liens cassés
[ ] Script de validation schema JSON-LD (Rich Results Test API)
[ ] Script de check Core Web Vitals (PageSpeed Insights API)
[ ] Script de validation title tags + meta (< 60 / < 155 car.)
[ ] Rapport QA auto-généré en HTML
```

### Phase 5 — Pipeline MCP Shopify
```
[ ] Script de création produits via Shopify MCP
[ ] Script de création collections
[ ] Script d'injection SEO (title, meta, canonical)
[ ] Script d'upload schema JSON-LD
[ ] Rapport de déploiement auto-généré
```

### Succespro 2.0 — Quick Wins à implémenter
```
[ ] 1. Remplacer AliReviews → Loox (photos UGC)
[ ] 2. Exit-intent popup Klaviyo
[ ] 3. Title tags + meta descriptions toutes pages
[ ] 4. Social Proof Bar homepage
[ ] 5. Section Bestsellers homepage
[ ] 6. Klaviyo Welcome Flow (5 emails) + Abandoned Cart (3 messages)
[ ] 7. Schema JSON-LD Product + FAQ (snippet Liquid)
[ ] 8. Installer Hotjar
```

### Améliorations Dashboard
```
[ ] Connexion live au MCP Shopify (afficher stats boutique en temps réel)
[ ] Historique des sessions NOE par boutique (sauvegarde localStorage)
[ ] Export PDF du rapport d'audit
[ ] Système d'import/export de briefs
[ ] Mode multi-boutiques (switcher sans recharger)
```

### GitHub
```
[ ] Créer le repo sur github.com/new (nom: tr7-shop-builder, privé)
[ ] Générer un Personal Access Token (Settings > Developer settings > Tokens)
[ ] Editer PUSH-GITHUB.sh : remplacer YOUR_GITHUB_TOKEN
[ ] Exécuter dans terminal : bash PUSH-GITHUB.sh
[ ] Ajouter GitHub connection sur maton.ai pour automation future
```

---

## 🛠️ COMMENT CONTINUER DANS VSCODE

### Ouvrir le projet
```bash
code "/Users/taharinho/Documents/Claude/Projects/TR7 Boutique Shopify/TR7-Shop Shopify"
```

### Extensions VSCode recommandées
```
- Liquid (Shopify.theme-check-vscode) — syntax Liquid
- Prettier — formatage HTML/JS/CSS
- GitLens — historique git
- REST Client — tester les appels MCP Shopify
- Markdown Preview Enhanced — lire les .md
```

### Pusher sur GitHub (depuis le terminal VSCode)
```bash
# 1. Créer repo sur github.com/new → tr7-shop-builder (privé, sans README)
# 2. Générer token : github.com/settings/tokens (scope: repo)
# 3. Éditer PUSH-GITHUB.sh et remplacer YOUR_GITHUB_TOKEN
# 4. Exécuter :
bash PUSH-GITHUB.sh
```

### Tester le dashboard
```bash
open TR7-SHOP-BUILDER.html
# ou dans VSCode : clic droit → Open with Live Server
```

### Ajouter une nouvelle boutique
```bash
mkdir "Nouvelle-Boutique"
mkdir "Nouvelle-Boutique/"{01-BRIEFING,02-STRATEGIE,03-DESIGN-SYSTEM,04-COPY-CONTENT,05-SEO,06-FICHES-PRODUITS,07-CRO-TESTING,08-RECETTE-QA,09-DEPLOIEMENT}
```

### Utiliser NOE dans Claude
1. Ouvrir une nouvelle conversation Claude
2. Copier le contenu de `_AGENT-NOE/NOE-SYSTEM-PROMPT-v2.md`
3. Le coller en tant que system prompt ou en début de conversation
4. Utiliser les commandes shortcuts (`/audit`, `/brief`, etc.)

---

## 🔌 MCP SHOPIFY — RÉFÉRENCE RAPIDE

Le MCP Shopify est déjà connecté dans Cowork. Outils disponibles :

| Outil MCP | Usage |
|---|---|
| `get-shop-info` | Infos boutique (plan, devise, domaine) |
| `search-products` | Rechercher des produits |
| `get-product` | Détail d'un produit |
| `create-product` | Créer un produit |
| `update-product` | Mettre à jour un produit |
| `search-collections` | Rechercher collections |
| `get-collection` | Détail d'une collection |
| `create-collection` | Créer une collection |
| `list-orders` | Lister les commandes |
| `get-order` | Détail d'une commande |
| `list-customers` | Lister les clients |
| `graphql-query` | Requête GraphQL libre |
| `graphql-mutation` | Mutation GraphQL libre |
| `set-inventory` | Gérer le stock |
| `create-discount` | Créer un code promo |
| `run-analytics-query` | Données analytics |

---

## 📊 ÉTAT DU PROJET

| Phase | Status | Description |
|---|---|---|
| Phase 1 — Fondations | ✅ Terminé | Structure + NOE v2.0 + Analyse |
| Phase 2 — Dashboard + Audit | ✅ Terminé | HTML dashboard + Audit Succespro |
| Phase 3 — Agents spécialisés | 🔜 À faire | 6 agents + prompts dédiés |
| Phase 4 — QA automatisée | 🔜 À faire | Scripts + rapports auto |
| Phase 5 — Deploy MCP | 🔜 À faire | Pipeline complet |

**Score Succespro 2.0 actuel : 5.8/10**
**Potentiel après quick wins : ~8/10**

---

## 📁 FICHIERS GOOGLE DRIVE

Dossier : **TR7 Shop Builder** (traifak@gmail.com)
URL : https://drive.google.com/drive/folders/1o2_3HHATpjU-gatGpVYWHST7PIEO3zyZ

| Fichier | Drive ID |
|---|---|
| Dossier racine TR7 Shop Builder | `1o2_3HHATpjU-gatGpVYWHST7PIEO3zyZ` |
| Dossier _AGENT-NOE | `1NbzaqVyp5mJtGQsAOwq7r4nKgHlWGGIF` |
| Dossier _DOCS-PROJET | `19gjoVGraej-PORYuiqKRy8RP3FXPktLh` |
| Dossier Succespro-2.0 | `1FkaXYB1arTh-mlaWImdHOTWjPQ-szMIH` |
| NOE-SYSTEM-PROMPT-v2 (Doc) | `14trD6KaXpcHT7jR9MK2tw9rxPzSmsPiBEeRwnxD2mAQ` |
| ANALYSE-PROJET-COMPLETE (Doc) | `1NNGyGb05SHf4w9ISwJdtnvuNc7yXc1SEYXL3Y2qSzvw` |
| AUDIT-SUCCESPRO-2.0 (Doc) | `1n-7OZIxh4zcKjWBB4RTKKMI7IB05wo_i58nbtjxvfYk` |

---

## 🤖 REPRENDRE AVEC CLAUDE

Pour continuer ce projet dans une nouvelle session Claude/Cowork, dis simplement :

> "Reprends le projet TR7 Shop Builder, on continue sur [PHASE 3 / quick wins Succespro / dashboard / GitHub...]"

Claude chargera automatiquement la mémoire du projet et reprendra où on s'est arrêtés.

---

*Document généré par Claude (Cowork mode) | TR7 Agency Studio | Juin 2026*
*infos@tr7agencystudio.com*
