// PM2 — `pm2 start ecosystem.config.cjs && pm2 save`
// Ajuste PORT se a 3010 estiver ocupada no servidor (conferir com `ss -tlnp`).
const PORT = process.env.SITE_PORT || 3010;

module.exports = {
  apps: [
    {
      name: "mayacorp-site",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: `start -p ${PORT} -H 127.0.0.1`,
      env: { NODE_ENV: "production" },
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "400M",
      autorestart: true,
    },
  ],
};
