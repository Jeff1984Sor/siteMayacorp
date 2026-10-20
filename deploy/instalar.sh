#!/usr/bin/env bash
# Instala ou atualiza o site — rodar como usuário deploy:
#   bash <(curl -fsSL https://raw.githubusercontent.com/Jeff1984Sor/siteMayacorp/main/deploy/instalar.sh)
# Não mexe em nenhum outro processo do PM2 nem no Nginx.
set -euo pipefail

REPO="https://github.com/Jeff1984Sor/siteMayacorp.git"
DIR="$HOME/mayacorp-site"
APP="mayacorp-site"

echo "== Ambiente =="
echo "usuário: $(whoami)  host: $(hostname)"
command -v node >/dev/null || { echo "ERRO: Node não encontrado para o usuário $(whoami)."; exit 1; }
command -v pm2 >/dev/null || { echo "ERRO: PM2 não encontrado para o usuário $(whoami)."; exit 1; }
echo "node $(node -v) | npm $(npm -v) | pm2 $(pm2 -v)"
NODE_MAJOR=$(node -v | sed 's/v\([0-9]*\).*/\1/')
[ "$NODE_MAJOR" -ge 18 ] || { echo "ERRO: Next 15 precisa de Node >= 18.18."; exit 1; }

echo "== Código =="
if [ -d "$DIR/.git" ]; then
  git -C "$DIR" pull --ff-only
else
  git clone "$REPO" "$DIR"
fi
cd "$DIR"

echo "== Porta =="
if [ -f .env ] && grep -q '^PORT=' .env; then
  PORT=$(grep '^PORT=' .env | cut -d= -f2)
  echo "usando a porta já configurada: $PORT"
else
  PORT=3010
  while ss -tln | awk '{print $4}' | grep -qE "[:.]$PORT\$"; do PORT=$((PORT + 1)); done
  [ -f .env ] || cp .env.example .env
  sed -i "s/^PORT=.*/PORT=$PORT/" .env
  echo "porta livre escolhida: $PORT (gravada no .env)"
fi

echo "== Build =="
if [ -f package-lock.json ]; then npm ci; else npm install; fi
npm run check:termos
npm run build

echo "== PM2 =="
if pm2 describe "$APP" >/dev/null 2>&1; then
  pm2 restart "$APP" --update-env
else
  pm2 start ecosystem.config.cjs
fi
pm2 save

sleep 3
echo "== Teste local =="
curl -s -o /dev/null -w "HTTP %{http_code} em http://127.0.0.1:$PORT\n" "http://127.0.0.1:$PORT/" || true

echo
echo "OK. Porta do site: $PORT"
echo "Próximo passo (como root): bash $DIR/deploy/nginx.sh $PORT"
grep -q '^SMTP_HOST=.\+' .env || echo "Aviso: SMTP vazio no $DIR/.env — o formulário usará o fallback mailto."
