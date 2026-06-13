import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth callback handler.
 *
 * After a user authenticates with an external provider (Google, GitHub, etc.),
 * Supabase redirects here with a `code` query parameter. We exchange it for
 * a session and redirect the user to the dashboard.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If there's no code or the exchange failed, redirect to the landing page.
  return NextResponse.redirect(`${origin}/?auth_error=true`);
}
