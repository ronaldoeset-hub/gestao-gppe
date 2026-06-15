import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type SyncPayload = {
  unit_id?: string;
  unit_name?: string;
  payload?: unknown;
  updated_by?: string | null;
  updated_at?: string;
};

const GPPE_ROLES = new Set(["admin_sme", "tecnico_gppe"]);

function isValidUnitId(unitId: unknown) {
  return typeof unitId === "string" && /^UE-[0-9]{2}$/.test(unitId);
}

async function authorizeGppeUser(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: NextResponse.json({ error: "Acesso nao autenticado." }, { status: 401 }) };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, access_status")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return { error: NextResponse.json({ error: profileError.message }, { status: 500 }) };
  }

  if (!profile || profile.access_status !== "aprovado" || !GPPE_ROLES.has(profile.role)) {
    return { error: NextResponse.json({ error: "Acesso restrito a tecnicos GPPE aprovados." }, { status: 403 }) };
  }

  return { user };
}

export async function GET() {
  const supabase = await createClient();
  const auth = await authorizeGppeUser(supabase);
  if (auth.error) return auth.error;

  const { data, error } = await supabase
    .from("gppe_financial_control_sync")
    .select("unit_id,payload,updated_at,updated_by")
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const auth = await authorizeGppeUser(supabase);
  if (auth.error) return auth.error;

  const body = (await request.json().catch(() => null)) as SyncPayload | null;

  if (!body || !isValidUnitId(body.unit_id) || !body.unit_name || typeof body.payload !== "object" || body.payload === null) {
    return NextResponse.json({ error: "Dados invalidos para sincronizacao." }, { status: 400 });
  }

  const updatedAt = body.updated_at || new Date().toISOString();
  const updatedBy = body.updated_by || auth.user.email || auth.user.id;

  const { data, error } = await supabase
    .from("gppe_financial_control_sync")
    .upsert(
      {
        unit_id: body.unit_id,
        unit_name: body.unit_name,
        payload: body.payload,
        updated_by: updatedBy,
        updated_at: updatedAt
      },
      { onConflict: "unit_id" }
    )
    .select("unit_id,payload,updated_at,updated_by")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
