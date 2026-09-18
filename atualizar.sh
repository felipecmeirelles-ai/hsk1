#!/usr/bin/env bash
# Sobe uma versão nova: incrementa a VERSAO do service worker e faz commit.
# Uso:  ./atualizar.sh
set -e
cd "$(dirname "$0")"

atual=$(grep -oP 'const VERSAO = "v\K[0-9]+' sw.js)
nova=$((atual + 1))
sed -i "s/const VERSAO = \"v$atual\"/const VERSAO = \"v$nova\"/" sw.js
echo "Versão do cache: v$atual -> v$nova"

git add -A
git commit -m "app: versão v$nova"
git push
echo "Publicado. O celular atualiza na próxima abertura com internet."
