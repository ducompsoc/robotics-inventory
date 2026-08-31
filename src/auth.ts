import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

declare module "next-auth" {
  interface Session {
    // Needed to end the Keycloak SSO session on sign-out (id_token_hint).
    idToken?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Keycloak],
  trustHost: true,
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
    jwt({ token, account }) {
      if (account?.id_token) token.idToken = account.id_token;
      return token;
    },
    session({ session, token }) {
      session.idToken = token.idToken as string | undefined;
      return session;
    },
  },
});
