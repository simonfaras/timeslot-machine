import React from "react";
import { Provider } from "next-auth/client";
import { ApolloProvider } from "@apollo/client";

import { createClient } from "@/graphql/client";

import "@/styles/globals.css";
import "@/styles/app.css";

interface AppProps<Props = Record<string, unknown>> {
  Component: React.JSXElementConstructor<Props>;
  pageProps: Props;
}

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const client = createClient((session as any)?.accessToken);



  return (
    <ApolloProvider client={client}>
      <Provider session={session as any}>
        <Component {...pageProps} />
      </Provider>
    </ApolloProvider>
  );
}

export default App;
