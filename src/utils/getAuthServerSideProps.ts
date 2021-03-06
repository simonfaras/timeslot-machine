import { session as authSession } from "next-auth/client";

export default async function getAuthServerSideProps(context) {
  const session = await authSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
