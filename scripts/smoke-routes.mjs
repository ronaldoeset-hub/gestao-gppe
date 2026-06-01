const baseUrl = process.env.SMOKE_BASE_URL || "https://gestao-gppe.vercel.app";

const routes = [
  "/",
  "/login",
  "/dashboard",
  "/unidades",
  "/conselhos",
  "/central-prazos",
  "/relatorios",
  "/controle-financeiro/index.html"
];

let failed = false;

for (const route of routes) {
  const url = new URL(route, baseUrl);
  const response = await fetch(url, { redirect: "manual" });
  const ok = response.status < 500;
  console.log(`${ok ? "OK" : "FAIL"} ${response.status} ${url.href}`);
  if (!ok) failed = true;
}

if (failed) {
  process.exitCode = 1;
}
