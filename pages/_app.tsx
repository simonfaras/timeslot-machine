import React from "react";
import { Provider } from "next-auth/client";
import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "styled-components";

import { createClient } from "@/graphql/client";
import Layout from "@/components/Layout";
import theme from "@/styles/theme";

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
        <ThemeProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </Provider>
    </ApolloProvider>
  );
}

export default App;
