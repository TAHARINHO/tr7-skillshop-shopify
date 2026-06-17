#!/bin/bash
# ======================================================
# TR7 Shop Builder — Script de push GitHub
# Exécuter depuis le terminal après avoir créé le repo
# ======================================================

# ÉTAPE 1 : Créer un repo sur GitHub
# Aller sur https://github.com/new
# Nom : tr7-shop-builder
# Visibilité : Private
# NE PAS initialiser avec README (déjà fait)

# ÉTAPE 2 : Remplacer YOUR_GITHUB_TOKEN ci-dessous
GITHUB_TOKEN="YOUR_GITHUB_TOKEN"
GITHUB_USER="traifak"
REPO_NAME="tr7-shop-builder"

# ÉTAPE 3 : Restaurer le repo depuis le bundle et pusher
cd "$(dirname "$0")"

git clone tr7-shop-builder.bundle temp-push-repo
cd temp-push-repo
git remote add origin "https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"
git push -u origin main
cd ..
rm -rf temp-push-repo

echo ""
echo "✅ Repo pushé sur https://github.com/${GITHUB_USER}/${REPO_NAME}"
