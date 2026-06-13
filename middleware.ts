import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js middleware entry point.
 *
 * Currently only refreshes the Supabase auth session.
 * Route protection will be added in a later phase when
 * the auth UI (login / signup) pages are implemented.
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     *  - _next/static  (static assets)
     *  - _next/image   (image optimization)
     *  - favicon.ico   (browser favicon)
     *  - public assets (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
};
