/**
 * Aplica um arquivo SQL no Supabase via Management API.
 * Uso:
 *   $env:SUPA_TOKEN="seu-personal-access-token"
 *   $env:SUPA_REF="seu-project-ref"
 *   node scripts/apply-migration.mjs supabase/updates/2026-05-27-pdde-controle-financeiro.sql
 */

import { readFileSync } from "fs";
import { resolve } from "path";

const token = process.env.SUPA_TOKEN;
const ref   = process.env.SUPA_REF;
const file  = process.argv[2];

if (!token || !ref || !file) {
  console.error("\nVariaveis necessarias:");
  console.error("  $env:SUPA_TOKEN  = personal access token (supabase.com > Account > Access Tokens)");
  console.error("  $env:SUPA_REF    = project ref  (os caracteres antes de .supabase.co na URL)");
  console.error("\nUso:");
  console.error("  node scripts/apply-migration.mjs supabase/updates/ARQUIVO.sql\n");
  process.exit(1);
}

const sql = readFileSync(resolve(file), "utf8");

console.log(`\nAplicando: ${file}`);
console.log(`Projeto:   ${ref}`);
console.log(`SQL:       ${sql.length} caracteres\n`);

const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query: sql }),
});

const body = await res.text();

if (!res.ok) {
  console.error(`Erro ${res.status}:`);
  try { console.error(JSON.stringify(JSON.parse(body), null, 2)); }
  catch { console.error(body); }
  process.exit(1);
}

console.log("Migracao aplicada com sucesso!");
try {
  const data = JSON.parse(body);
  if (Array.isArray(data) && data.length > 0) console.log(data);
} catch { /* resposta vazia e normal */ }
