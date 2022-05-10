import { createHttpLink, ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: process.env.FAUNA_DB_URI,
});

const authLink = (token) => {
  return setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      },
    };
  });
};

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        getAllPeriods: {
          keyArgs: false,
          merge: (existing, incoming) => {
            const merged = Object.assign({}, incoming, {
              data: [
                ...(existing?.data.slice() ?? []),
                ...incoming?.data.slice(),
              ],
            });

            return merged;
          },
        },
      },
    },
  },
});

export const createClient = (token) =>
  new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: authLink(token).concat(httpLink),
    cache,
  });
