import React from "react";
import "~/styles/globals.css";
import "~/styles/app.css";

interface AppProps<Props = Record<string, unknown>> {
  Component: React.JSXElementConstructor<Props>;
  pageProps: Props;
}

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default App;
