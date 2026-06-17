#!/bin/bash
# TR7 Shop Builder — Script de déploiement Hostinger
# Usage: bash deploy-hostinger.sh
# Prérequis: SSH configuré, Node.js + PM2 installés sur le VPS

set -e

# ─── CONFIGURATION ───────────────────────────────────────────────
REMOTE_USER="u123456789"                    # → Votre user Hostinger
REMOTE_HOST="xxx.xxx.xxx.xxx"              # → IP VPS Hostinger
REMOTE_PATH="/home/u123456789/tr7-shop"   # → Chemin sur le serveur
REMOTE_PORT="22"                           # → Port SSH (souvent 22)

# ─── COULEURS ────────────────────────────────────────────────────
GREEN='\033[0;32m'; BLUE='\033[0;34m'; NC='\033[0m'

echo -e "${BLUE}🚀 TR7 Shop Builder — Déploiement Hostinger${NC}"
echo "   Serveur : ${REMOTE_USER}@${REMOTE_HOST}"
echo "   Chemin  : ${REMOTE_PATH}"
echo ""

# ─── 1. BUILD LOCAL ──────────────────────────────────────────────
echo -e "${BLUE}[1/4] Vérification locale...${NC}"
cd "$(dirname "$0")"
if [ ! -f "TR7-SHOP-BUILDER.html" ]; then
  echo "❌ Erreur: lancez ce script depuis le dossier TR7-SkillShopShopify"
  exit 1
fi
echo -e "${GREEN}✓ Fichiers OK${NC}"

# ─── 2. SYNC FICHIERS ────────────────────────────────────────────
echo -e "${BLUE}[2/4] Envoi des fichiers sur Hostinger...${NC}"
rsync -avz --progress \
  --exclude='.git' \
  --exclude='.DS_Store' \
  --exclude='node_modules' \
  --exclude='backend/reports' \
  --exclude='.env' \
  --exclude='*.log' \
  -e "ssh -p ${REMOTE_PORT}" \
  ./ "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/"
echo -e "${GREEN}✓ Fichiers synchronisés${NC}"

# ─── 3. INSTALL DEPS + RESTART ───────────────────────────────────
echo -e "${BLUE}[3/4] Installation dépendances et redémarrage PM2...${NC}"
ssh -p "${REMOTE_PORT}" "${REMOTE_USER}@${REMOTE_HOST}" << 'ENDSSH'
  cd ~/tr7-shop/backend
  npm install --production
  cd ..
  mkdir -p logs
  # PM2: restart si existe, sinon start
  pm2 describe tr7-shop-builder > /dev/null 2>&1 \
    && pm2 restart tr7-shop-builder \
    || pm2 start ecosystem.config.js
  pm2 save
ENDSSH
echo -e "${GREEN}✓ Backend redémarré${NC}"

# ─── 4. VÉRIFICATION ─────────────────────────────────────────────
echo -e "${BLUE}[4/4] Vérification santé...${NC}"
sleep 3
STATUS=$(ssh -p "${REMOTE_PORT}" "${REMOTE_USER}@${REMOTE_HOST}" \
  "curl -s -o /dev/null -w '%{http_code}' http://localhost:3700/api/health" 2>/dev/null)

if [ "$STATUS" = "200" ]; then
  echo -e "${GREEN}✓ Backend opérationnel (HTTP 200)${NC}"
else
  echo "⚠️  Backend status: $STATUS — vérifiez les logs: pm2 logs tr7-shop-builder"
fi

echo ""
echo -e "${GREEN}✅ Déploiement terminé !${NC}"
echo ""
echo "  Dashboard : https://${REMOTE_HOST}/TR7-SHOP-BUILDER.html"
echo "  API Health: http://${REMOTE_HOST}:3700/api/health"
echo "  PM2 logs  : ssh ${REMOTE_USER}@${REMOTE_HOST} 'pm2 logs tr7-shop-builder'"
echo ""
