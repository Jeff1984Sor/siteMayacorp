#!/usr/bin/env bash
# Instala ou atualiza o site — rodar como usuário deploy (usa sudo só para o systemd):
#   bash <(curl -fsSL https://raw.githubusercontent.com/Jeff1984Sor/siteMayacorp/main/deploy/instalar.sh)
# Segue o padrão do servidor: um serviço systemd por app. Não mexe nos outros serviços nem no Nginx.
set -euo pipefail

REPO="https://github.com/Jeff1984Sor/siteMayacorp.git"
DIR="$HOME/mayacorp-site"
SERVICO="mayacorp-site"
UNIT="/etc/systemd/system/$SERVICO.service"

echo "== Ambiente =="
echo "usuário: $(whoami)  host: $(hostname)"
command -v node >/dev/null || { echo "ERRO: Node não encontrado."; exit 1; }
echo "node $(node -v) | npm $(npm -v)"
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

echo "== Serviço systemd =="
TMP=$(mktemp)
sed -e "s|__PORT__|$PORT|g" -e "s|__DIR__|$DIR|g" -e "s|__USER__|$(whoami)|g" deploy/mayacorp-site.service > "$TMP"
if ! sudo cmp -s "$TMP" "$UNIT"; then
  sudo install -m 644 "$TMP" "$UNIT"
  sudo systemctl daemon-reload
  sudo systemctl enable "$SERVICO"
fi
rm -f "$TMP"
sudo systemctl restart "$SERVICO"

sleep 4
echo "== Teste local =="
sudo systemctl --no-pager --lines=5 status "$SERVICO" || true
curl -s -o /dev/null -w "HTTP %{http_code} em http://127.0.0.1:$PORT\n" "http://127.0.0.1:$PORT/" || true

echo
echo "OK. Porta do site: $PORT"
echo "Próximo passo: sudo bash $DIR/deploy/nginx.sh $PORT"
grep -q '^SMTP_HOST=.\+' .env || echo "Aviso: SMTP vazio no $DIR/.env — o formulário usará o fallback mailto."
