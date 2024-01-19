import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { useMemo } from "react";
import { setContext } from '@apollo/client/link/context';
import { GetServerSideProps, GetServerSidePropsContext, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";

let apolloClient : null | ApolloClient<any> = null

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'  


function createApolloClient(ctx?: any) {
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        cookie:
          (typeof window === 'undefined'
            ? ctx?.req?.headers.cookie || undefined
            : undefined) || '',
      },
    };
  });

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link:  authLink.concat(new HttpLink({
      uri: "http://localhost:3000/graphql",
      credentials: "include",
    })),
    cache: new InMemoryCache(),
  })
}


export function initializeApollo(initialState?: NormalizedCacheObject, context?: any): ApolloClient<NormalizedCacheObject> {
  const _apolloClient = apolloClient ?? createApolloClient(context)


  if (initialState) {
    const existingCache = _apolloClient.extract()
    _apolloClient.cache.restore({ ...existingCache, ...initialState })
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

function addApolloState(client : ApolloClient<NormalizedCacheObject>, pageProps : any) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
  }
  return pageProps
}

export function useApollo(pageProps : any) {
  const state = pageProps[APOLLO_STATE_PROP_NAME]
  const store = useMemo(() => initializeApollo(state), [state])
  return store
}

export function withApolloClient<T extends { [key: string]: any; }>(fn: (client:  ApolloClient<NormalizedCacheObject>, context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => ReturnType<GetServerSideProps<T>>) {
  return async (context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {
    const client = initializeApollo(undefined, context)
    const pageProps = await fn(client, context)
    return addApolloState(client, pageProps)
  }
}