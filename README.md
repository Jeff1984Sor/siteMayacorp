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
deploy/                   instalar.sh, nginx.sh, unit systemd e server block do Nginx
```

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha o SMTP. Sem SMTP, o formulário abre o e-mail do visitante
(`mailto:mayacorp@mayacorp.com.br`) com assunto e corpo pré-preenchidos.

## Deploy (VPS, usuário `deploy`, systemd)

Segue o padrão do servidor: um serviço systemd por app (`mayacorp-site.service`), Nginx na frente.

1. Como **deploy** — clona/atualiza, escolhe uma porta livre (a partir da 3010), builda e
   instala/reinicia o serviço systemd (pede a senha do sudo):

   ```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/Jeff1984Sor/siteMayacorp/main/deploy/instalar.sh)
   ```

2. Preencha o SMTP em `/home/deploy/mayacorp-site/.env` e rode `sudo systemctl restart mayacorp-site`.

3. Nginx (testa com `nginx -t` antes de recarregar) e, se o DNS já apontar para o servidor, HTTPS com Certbot:

   ```bash
   sudo bash /home/deploy/mayacorp-site/deploy/nginx.sh <PORTA>
   ```

## Como atualizar

Como `deploy`, rode o mesmo `instalar.sh` do passo 1 (faz `git pull`, build e `systemctl restart mayacorp-site`).

Logs: `sudo journalctl -u mayacorp-site -f`

## Testes rápidos

```bash
curl -I https://mayacorp.com.br
curl -I https://www.mayacorp.com.br          # deve redirecionar para https://mayacorp.com.br
curl -I http://mayacorp.com.br               # deve redirecionar para HTTPS
for s in mayapost mayasec mayaassinador mayafit mayatrade automacao-nfse; do
  curl -s -o /dev/null -w "%{http_code} /produtos/$s\n" https://mayacorp.com.br/produtos/$s
done
```
