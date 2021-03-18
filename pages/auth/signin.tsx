import { providers, signIn } from "next-auth/client";

interface SignInProps {
  providers: any[];
}

export default function SignIn({ providers }: SignInProps) {
  console.log("providers", providers);
  return (
    <>
      {/*{Object.values(providers).map((provider) => (*/}
      {/*  <div key={provider.name}>*/}
      {/*    <button onClick={() => signIn(provider.id)}>*/}
      {/*      Sign in with {provider.name}*/}
      {/*    </button>*/}
      {/*  </div>*/}
      {/*))}*/}
    </>
  );
}

export async function getServerSideProps() {
  const p = await providers();
  console.log("SERVER SIDE PROPS", p);
  return {
    props: {
      providers: p,
    },
  };
}
