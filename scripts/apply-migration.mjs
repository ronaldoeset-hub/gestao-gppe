// Aplica um arquivo SQL no Supabase via Management API
// Uso: node scripts/apply-migration.mjs <arquivo.sql>
// Requer: SUPA_TOKEN (Personal Access Token) e SUPA_REF (Project Ref)

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sqlFile = process.argv[2];

if (!sqlFile) {
  console.error("Uso: node scripts/apply-migration.mjs <arquivo.sql>");
  process.exit(1);
}

const token = process.env.SUPA_TOKEN;
const ref   = process.env.SUPA_REF;

if (!token || !ref) {
  console.error("Defina SUPA_TOKEN e SUPA_REF antes de rodar.");
  console.error("SUPA_TOKEN: supabase.com → perfil → Access Tokens");
  console.error("SUPA_REF  : supabase.com → projeto → Settings → General → Reference ID");
  process.exit(1);
}

const filePath = path.isAbsolute(sqlFile) ? sqlFile : path.join(root, sqlFile);

if (!existsSync(filePath)) {
  console.error(`Arquivo não encontrado: ${filePath}`);
  process.exit(1);
}

const sql = readFileSync(filePath, "utf8");

console.log(`Aplicando: ${sqlFile}`);

const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query: sql }),
});

if (!res.ok) {
  const body = await res.text();
  console.error(`Erro ${res.status}: ${body}`);
  process.exit(1);
}

console.log("Aplicado com sucesso!");
