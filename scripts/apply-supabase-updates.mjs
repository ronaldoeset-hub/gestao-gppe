import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Client } = pg;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;

  const content = readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.join(root, ".env"));
loadEnvFile(path.join(root, ".env.local"));

const databaseUrl = process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL;
const dryRun = args.has("--dry-run");
const includeBaseSchema = args.has("--include-base-schema");

if (!databaseUrl) {
  console.error("SUPABASE_DB_URL ou DATABASE_URL nao encontrado.");
  console.error("Defina uma URL PostgreSQL administrativa do Supabase e rode: npm run supabase:apply");
  process.exit(1);
}

const migrationFiles = [
  ...(includeBaseSchema ? [path.join(root, "supabase", "schema.sql")] : []),
  ...readdirSync(path.join(root, "supabase", "updates"))
    .filter((file) => file.endsWith(".sql"))
    .sort()
    .map((file) => path.join(root, "supabase", "updates", file)),
  path.join(root, "supabase", "storage.sql")
];

const client = new Client({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes("sslmode=disable") ? false : { rejectUnauthorized: false }
});

function migrationName(filePath) {
  return path.relative(root, filePath).replace(/\\/g, "/");
}

async function ensureMigrationLog() {
  await client.query(`
    create table if not exists public.gppe_migration_log (
      id bigserial primary key,
      migration_name text not null unique,
      applied_at timestamptz not null default now()
    );
  `);
}

async function alreadyApplied(name) {
  const result = await client.query(
    "select 1 from public.gppe_migration_log where migration_name = $1 limit 1",
    [name]
  );
  return Boolean(result.rowCount);
}

async function applyFile(filePath) {
  const name = migrationName(filePath);
  const sql = readFileSync(filePath, "utf8");

  if (await alreadyApplied(name)) {
    console.log(`OK ja aplicado: ${name}`);
    return;
  }

  if (dryRun) {
    console.log(`DRY-RUN aplicaria: ${name}`);
    return;
  }

  console.log(`Aplicando: ${name}`);
  await client.query("begin");
  try {
    await client.query(sql);
    await client.query(
      "insert into public.gppe_migration_log (migration_name) values ($1) on conflict (migration_name) do nothing",
      [name]
    );
    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  }
}

try {
  await client.connect();
  await ensureMigrationLog();

  for (const file of migrationFiles) {
    await applyFile(file);
  }

  console.log(dryRun ? "Dry-run concluido." : "Supabase atualizado com sucesso.");
} catch (error) {
  console.error("Falha ao aplicar updates do Supabase:");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => undefined);
}
