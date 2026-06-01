import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { isSupabaseEnabled, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

const ADMIN_ONLY_PREFIXES = ["/perfis", "/administracao", "/admin"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { pathname } = request.nextUrl;

  if (!isSupabaseEnabled()) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const isLogin               = pathname.startsWith("/login");
  const isSignup              = pathname.startsWith("/cadastro");
  const isWaitingApproval     = pathname.startsWith("/aguardando-aprovacao");
  const isAccessBlocked       = pathname.startsWith("/acesso-bloqueado");
  const isPasswordRecovery    = pathname.startsWith("/nova-senha");
  const isEducationalPortal   = pathname.startsWith("/recursos-educacionais");
  const isInstitutionalNotice = pathname.startsWith("/aviso-institucional");
  const isControleFinanceiro  = pathname.startsWith("/controle-financeiro");
  const isStaticOrFile        = pathname.startsWith("/_next") || pathname.includes(".");
  const isAppRoute            = !isStaticOrFile;
  const isLogout              = pathname.startsWith("/auth/logout");

  // ── 1. Usuário não autenticado ───────────────────────────────────────────
  if (
    !user &&
    !isLogin &&
    !isSignup &&
    !isWaitingApproval &&
    !isAccessBlocked &&
    !isPasswordRecovery &&
    !isEducationalPortal &&
    !isInstitutionalNotice &&
    !isControleFinanceiro &&
    isAppRoute
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // ── 2. Usuário autenticado: verificar perfil ─────────────────────────────
  if (user && !isWaitingApproval && !isAccessBlocked && !isLogout && isAppRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("access_status, role")
      .eq("id", user.id)
      .maybeSingle();

    // 2a. Acesso bloqueado
    if (profile?.access_status === "bloqueado") {
      const url = request.nextUrl.clone();
      url.pathname = "/acesso-bloqueado";
      return NextResponse.redirect(url);
    }

    // 2b. Aguardando aprovação
    if (profile?.access_status === "pendente") {
      const url = request.nextUrl.clone();
      url.pathname = "/aguardando-aprovacao";
      return NextResponse.redirect(url);
    }

    // 2c. Rotas exclusivas de admin_sme
    const isAdminRoute = ADMIN_ONLY_PREFIXES.some((prefix) => pathname.startsWith(prefix));
    if (isAdminRoute && profile?.role !== "admin_sme") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // ── 3. Já autenticado: sai das páginas públicas de auth ─────────────────
  if (user && (isLogin || isSignup)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
