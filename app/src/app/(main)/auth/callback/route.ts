import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/server/supabase/server";

export const GET = async (request: NextRequest) => {
  // for some reason the origin is not set in the request even though nginx already set
  ///  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  //   proxy_set_header X-Forwarded-Proto $scheme;
  //   proxy_set_header X-Forwarded-Host $host;
  // => quick workaround
  const { searchParams } = new URL(request.url);
  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;

  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirect") || "/";
  const authError = searchParams.get("error");
  const authErrorDescription = searchParams.get("error_description");

  if (authError) {
    const error = encodeURIComponent(authError);
    const description = authErrorDescription ? encodeURIComponent(authErrorDescription) : null;

    return NextResponse.redirect(
      `${origin}/auth/login?error=${error}&error_description=${description}`,
    );
  }

  if (code) {
    const supabase = await createClient();
    const session = await supabase.auth.exchangeCodeForSession(code);

    if (session.error) {
      const description = encodeURIComponent(session.error.message);

      return NextResponse.redirect(
        `${origin}/auth/login?error=exchange_failed&error_description=${description}`,
      );
    }
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  return NextResponse.redirect(`${origin}/auth/login?error=no_code`);
};
