import { useSession } from "next-auth/client";

export default function StartPage() {
  const session = useSession();

  console.log(session);

  return (
    <pre>
      <code>{JSON.stringify(session, null, 2)}</code>
    </pre>
  );
}
