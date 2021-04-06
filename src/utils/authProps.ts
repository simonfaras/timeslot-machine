import {session} from "next-auth/client";

export default async function getServerSideAuth(context) {
  const s = await session(context);

  if (!s) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session: await session(context),
    },
  };
}