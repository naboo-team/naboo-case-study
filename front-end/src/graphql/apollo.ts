import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const getGraphqlUri = (): string => {
  if (typeof window === "undefined" && process.env.GRAPHQL_SSR_URL) {
    return process.env.GRAPHQL_SSR_URL;
  }
  return process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:3000/graphql";
};

export const graphqlClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: getGraphqlUri(),
    credentials: "include",
  }),
  ssrMode: typeof window === "undefined",
});
