import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const isLogin = request.nextUrl.pathname.startsWith("/login");
  const isSignup = request.nextUrl.pathname.startsWith("/cadastro");
  const isWaitingApproval = request.nextUrl.pathname.startsWith("/aguardando-aprovacao");
  const isPasswordRecovery = request.nextUrl.pathname.startsWith("/nova-senha");
  const isEducationalResourcesPortal = request.nextUrl.pathname.startsWith("/recursos-educacionais");
  const isInstitutionalNotice = request.nextUrl.pathname.startsWith("/aviso-institucional");
  const isAppRoute = !request.nextUrl.pathname.startsWith("/_next") && !request.nextUrl.pathname.includes(".");

  if (!user && !isLogin && !isSignup && !isWaitingApproval && !isPasswordRecovery && !isEducationalResourcesPortal && !isInstitutionalNotice && isAppRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && !isWaitingApproval && !request.nextUrl.pathname.startsWith("/auth/logout") && isAppRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("access_status")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.access_status && profile.access_status !== "aprovado") {
      const url = request.nextUrl.clone();
      url.pathname = "/aguardando-aprovacao";
      return NextResponse.redirect(url);
    }
  }

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
