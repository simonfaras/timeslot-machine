import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import faunadb, { query as q } from "faunadb";
import faunadbAdapter from "@/utils/faunadb";

const faunaClient = new faunadb.Client({
  secret: process.env.FAUNA_SERVER_KEY,
});

export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
  },
  adapter: faunadbAdapter.Adapter({ faunaClient }),
  callbacks: {
    async redirect() {
      return "/periods";
    },
    async jwt(token, user) {
      if (!token.access_token && !!user) {
        const sessionToken: { secret: string } = await faunaClient.query(
          q.Create(q.Tokens(), {
            instance: q.Ref(q.Collection("users"), (user as any).id),
          })
        );
        token.accessToken = sessionToken.secret;
      }

      return token;
    },
    // @ts-expect-error blabla
    async session(session, token) {
      session.accessToken = (token as any).accessToken;

      return session;
    },
  },
  debug: false,
});
