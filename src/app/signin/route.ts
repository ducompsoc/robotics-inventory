import { signIn } from "@/auth";

// A route handler rather than a page, so there is no interstitial "Sign in with
// Keycloak" screen: the chain is `protected page -> /signin -> Keycloak`, and an
// already-authenticated Keycloak user never sees a prompt at all.
export async function GET(request: Request) {
  const callbackUrl =
    new URL(request.url).searchParams.get("callbackUrl") ?? "/";
  return signIn("keycloak", { redirectTo: callbackUrl });
}
