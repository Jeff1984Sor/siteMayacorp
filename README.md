# MayaCorp — site institucional

Site de **https://mayacorp.com.br** em Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion.

## Estrutura

```
src/
  app/                    rotas (home, /produtos/[slug], /privacidade, 404, API, SEO)
    api/contato/route.ts  envio do formulário (SMTP via nodemailer, com fallback mailto)
  components/             componentes e seções da home
  content/
    produtos.ts           ← conteúdo de TODOS os produtos (edite aqui)
    site.ts               ← textos da home (números, sob medida, etapas, diferenciais, FAQ)
    interesses.ts         ← opções do select do formulário
  lib/                    configurações do site, e-mail, rate limit, schema do formulário
public/logo.svg           logo (para usar o arquivo, ative USE_LOGO_FILE em src/components/logo.tsx)
deploy/nginx/             server block do Nginx
ecosystem.config.cjs      configuração do PM2
```

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha o SMTP. Sem SMTP, o formulário abre o e-mail do visitante
(`mailto:mayacorp@mayacorp.com.br`) com assunto e corpo pré-preenchidos.

## Primeiro deploy (servidor)

```bash
cd /home/mayacorp22
git clone https://github.com/Jeff1984Sor/siteMayacorp.git mayacorp-site
cd mayacorp-site
cp .env.example .env && nano .env        # SMTP e porta
npm install                              # gera o package-lock.json (depois use npm ci)
npm run check:termos
npm run build
pm2 start ecosystem.config.cjs && pm2 save

sudo cp deploy/nginx/mayacorp.com.br.conf /etc/nginx/sites-available/mayacorp.com.br
sudo ln -s /etc/nginx/sites-available/mayacorp.com.br /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# só depois de confirmar que o DNS aponta para o IP do servidor:
sudo certbot --nginx -d mayacorp.com.br -d www.mayacorp.com.br --redirect
```

## Como atualizar

```bash
cd /home/mayacorp22/mayacorp-site
git pull
npm ci
npm run build
pm2 restart mayacorp-site
```

## Testes rápidos

```bash
curl -I https://mayacorp.com.br
curl -I https://www.mayacorp.com.br          # deve redirecionar para https://mayacorp.com.br
curl -I http://mayacorp.com.br               # deve redirecionar para HTTPS
for s in mayapost mayasec mayaassinador mayafit mayatrade automacao-nfse; do
  curl -s -o /dev/null -w "%{http_code} /produtos/$s\n" https://mayacorp.com.br/produtos/$s
done
```
