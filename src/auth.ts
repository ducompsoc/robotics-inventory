import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Registered with no arguments on purpose: Auth.js reads AUTH_KEYCLOAK_ID,
  // AUTH_KEYCLOAK_SECRET and AUTH_KEYCLOAK_ISSUER from the environment by
  // convention for the provider id "keycloak".
  providers: [Keycloak],
  // Required in production; already the default in dev. Set explicitly so the
  // app also works when reached over the LAN, where Host is not "localhost".
  trustHost: true,
  pages: {
    // Keycloak is the only provider, so skip Auth.js's provider-picker page.
    signIn: "/signin",
  },
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
});
