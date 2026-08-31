// Next 16 renamed `middleware` to `proxy`; the export must be named `proxy`
// (or be the default) or Next will not pick this file up.
export { auth as proxy } from "@/auth";

export const config = {
  // Everything except Next internals, static assets, and the auth endpoints
  // themselves — those must stay reachable while signed out, or the sign-in
  // flow would redirect to itself.
  matcher: ["/((?!api/auth|signin|_next/static|_next/image|favicon.ico).*)"],
};
