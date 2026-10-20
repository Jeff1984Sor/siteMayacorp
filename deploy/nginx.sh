#!/usr/bin/env bash
# Configura o Nginx (e o HTTPS, se o DNS já apontar para este servidor) — rodar como root:
#   sudo bash /home/deploy/mayacorp-site/deploy/nginx.sh <PORTA>
# Só cria o arquivo do mayacorp.com.br; não altera os sites existentes.
set -euo pipefail

PORT="${1:?informe a porta, ex.: bash nginx.sh 3010}"
DIR="$(cd "$(dirname "$0")/.." && pwd)"
CONF=/etc/nginx/sites-available/mayacorp.com.br

[ "$(id -u)" -eq 0 ] || { echo "ERRO: rode com sudo."; exit 1; }
command -v nginx >/dev/null || { echo "ERRO: Nginx não encontrado."; exit 1; }

if grep -rqs "server_name[^;]*mayacorp\.com\.br" /etc/nginx/sites-enabled/ /etc/nginx/conf.d/ \
   && [ ! -e /etc/nginx/sites-enabled/mayacorp.com.br ]; then
  echo "ERRO: já existe outro server block com mayacorp.com.br. Verifique antes de continuar."; exit 1
fi

sed "s/127\.0\.0\.1:3010/127.0.0.1:$PORT/" "$DIR/deploy/nginx/mayacorp.com.br.conf" > "$CONF"
ln -sf "$CONF" /etc/nginx/sites-enabled/mayacorp.com.br

if ! nginx -t; then
  echo "ERRO no teste do Nginx — removendo a configuração nova, nada foi recarregado."
  rm -f /etc/nginx/sites-enabled/mayacorp.com.br
  exit 1
fi
systemctl reload nginx
echo "Nginx recarregado."

IP=$(curl -fsS https://api.ipify.org || hostname -I | awk '{print $1}')
DNS=$(getent ahostsv4 mayacorp.com.br | awk 'NR==1{print $1}' || true)
DNS_WWW=$(getent ahostsv4 www.mayacorp.com.br | awk 'NR==1{print $1}' || true)
echo "IP do servidor: $IP | mayacorp.com.br -> ${DNS:-sem registro} | www -> ${DNS_WWW:-sem registro}"

if [ "$DNS" = "$IP" ] && [ "$DNS_WWW" = "$IP" ]; then
  command -v certbot >/dev/null || { echo "Certbot não encontrado: apt install certbot python3-certbot-nginx"; exit 1; }
  certbot --nginx -d mayacorp.com.br -d www.mayacorp.com.br --redirect --non-interactive --agree-tos -m mayacorp@mayacorp.com.br
  systemctl reload nginx
  echo "HTTPS ativo."
else
  echo "DNS ainda não aponta para este servidor — certificado NÃO emitido."
  echo "Crie o registro A de @ e www -> $IP e rode este script de novo."
fi
