export { auth as proxy } from "@/auth";

export const config = {
  // Everything except Next internals, static assets, the auth endpoints, and
  // the post-logout landing page. Those must stay reachable while signed out,
  // or the sign-in/sign-out flows would redirect to themselves.
  matcher: [
    "/((?!api/auth|signin|signed-out|_next/static|_next/image|favicon.ico).*)",
  ],
};
