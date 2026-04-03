import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export const runtime = "experimental-edge";

export async function proxy(request) {
  const { pathname } = request.nextUrl;

 
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  try {
    let response = NextResponse.next();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookies) => {
            cookies.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

   
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return response;
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.next();
  }
}