import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import faunadb from "faunadb";
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
  adapter: faunadbAdapter.Adapter({ faunaClient }),
  callbacks: {
    redirect: async () => "/periods",
  },
  debug: false,
});
