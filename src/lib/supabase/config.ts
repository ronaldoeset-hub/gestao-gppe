export type GppeDataMode = "real" | "mock";

export const gppeDataMode: GppeDataMode =
  process.env.NEXT_PUBLIC_GPPE_DATA_MODE === "mock" ? "mock" : "real";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function isMockMode() {
  return gppeDataMode === "mock";
}

export function hasSupabaseCredentials() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function isSupabaseEnabled() {
  return gppeDataMode === "real" && hasSupabaseCredentials();
}

export function assertSupabaseConfig() {
  if (!hasSupabaseCredentials()) {
    throw new Error(
      "Supabase nao configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY ou use NEXT_PUBLIC_GPPE_DATA_MODE=mock."
    );
  }
}
