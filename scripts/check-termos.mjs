// Garante que nomes proibidos não aparecem no código do site.
// Os termos ficam codificados em base64 para que este próprio arquivo não seja um falso positivo.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const termos = ["ZmxpY3NhbGVz", "cmNvbm5lY3Q=", "cmNhIGZpbmFs", "ciBjb3N0YQ==", "cmNh"].map((b) =>
  Buffer.from(b, "base64").toString("utf8"),
);
// o termo curto é checado como palavra inteira (evita falso positivo em "mercado")
const regexes = termos.map((t) => (t.length <= 3 ? new RegExp(`\\b${t}\\b`, "i") : new RegExp(t.replace(" ", "\\s*"), "i")));

const raiz = fileURLToPath(new URL("..", import.meta.url));
const ignorar = new Set(["node_modules", ".next", ".git"]);
const achados = [];

function varrer(dir) {
  for (const nome of readdirSync(dir)) {
    if (ignorar.has(nome)) continue;
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) {
      varrer(caminho);
      continue;
    }
    const rel = relative(raiz, caminho);
    regexes.forEach((re) => {
      if (re.test(rel)) achados.push(`${rel} (nome do arquivo)`);
    });
    if (!/\.(tsx?|mjs|cjs|js|css|json|md|svg|conf|txt|example)$/.test(nome)) continue;
    readFileSync(caminho, "utf8")
      .split("\n")
      .forEach((linha, i) => {
        if (regexes.some((re) => re.test(linha))) achados.push(`${rel}:${i + 1}`);
      });
  }
}

varrer(raiz);
if (achados.length) {
  console.error("Termos proibidos encontrados:\n" + achados.join("\n"));
  process.exit(1);
}
console.log("OK: nenhum termo proibido encontrado.");
