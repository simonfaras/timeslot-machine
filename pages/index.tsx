import getAuthServerSideProps from "@/utils/getAuthServerSideProps";

export default function StartPage() {
  return <div>Här var det tomt, logga in för att fylla upp...</div>;
}

export async function getServerSideProps(context) {
  const { props } = await getAuthServerSideProps(context);

  if (props?.session?.user) {
    return {
      redirect: {
        destination: "/periods",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
