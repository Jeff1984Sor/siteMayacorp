// PM2 — `pm2 start ecosystem.config.cjs && pm2 save`
// A porta vem de PORT no .env (o deploy/instalar.sh escolhe uma porta livre e grava lá).
const fs = require("fs");
const path = require("path");

function portaDoEnv() {
  try {
    const env = fs.readFileSync(path.join(__dirname, ".env"), "utf8");
    const m = env.match(/^PORT=(\d+)/m);
    if (m) return m[1];
  } catch {}
  return "3010";
}

module.exports = {
  apps: [
    {
      name: "mayacorp-site",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: `start -p ${portaDoEnv()} -H 127.0.0.1`,
      env: { NODE_ENV: "production" },
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "400M",
      autorestart: true,
    },
  ],
};
