import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

// Clear session and end Keycloak SSO session.
export async function POST() {
  const session = await auth();
  const idToken = session?.idToken;

  await signOut({ redirect: false });

  const issuer = process.env.AUTH_KEYCLOAK_ISSUER;
  if (!issuer) redirect("/signed-out");

  const endSession = new URL(`${issuer}/protocol/openid-connect/logout`);
  if (idToken) {
    // With id_token_hint Keycloak logs out silently.
    endSession.searchParams.set("id_token_hint", idToken);
  } else {
    // Without it Keycloak needs client_id, and shows a confirmation prompt.
    endSession.searchParams.set(
      "client_id",
      process.env.AUTH_KEYCLOAK_ID ?? "",
    );
  }

  const origin = process.env.AUTH_URL;
  if (origin) {
    endSession.searchParams.set(
      "post_logout_redirect_uri",
      `${origin}/signed-out`,
    );
  }

  redirect(endSession.toString());
}
