import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

export async function POST(request: NextRequest) {
  let response = NextResponse.redirect(new URL("/login", request.url), { status: 303 });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        }
      }
    }
  );

  await supabase.auth.signOut();

  request.cookies.getAll().forEach((cookie) => {
    if (cookie.name.startsWith("sb-")) {
      response.cookies.set(cookie.name, "", {
        path: "/",
        maxAge: 0
      });
    }
  });

  response.headers.set("Cache-Control", "no-store");

  return response;
}
