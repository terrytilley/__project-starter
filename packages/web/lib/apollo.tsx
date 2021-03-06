import cookie from 'cookie';
import unfetch from 'isomorphic-unfetch';
import JwtDecode from 'jwt-decode';
import Head from 'next/head';
import React from 'react';

import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import { TokenRefreshLink } from 'apollo-link-token-refresh';

import { getAccessToken, setAccessToken } from './accessToken';

// tslint:disable-next-line: strict-type-predicates
const isServer = () => typeof window === 'undefined';

export function withApollo(PageComponent: any, { ssr = true } = {}) {
  const WithApollo = ({ apolloState, serverAccessToken, ...pageProps }: any) => {
    if (!isServer() && !getAccessToken()) {
      setAccessToken(serverAccessToken);
    }
    const client = pageProps.apolloClient || initApolloClient(apolloState);

    return <PageComponent {...pageProps} apolloClient={client} />;
  };

  if (process.env.NODE_ENV !== 'production') {
    // Find correct display name
    const displayName = PageComponent.displayName || PageComponent.name || 'Component';

    // Warn if old way of installing apollo is used
    if (displayName === 'App') {
      console.warn('This withApollo HOC only works with PageComponents.');
    }

    // Set correct display name for devtools
    WithApollo.displayName = `withApollo(${displayName})`;
  }

  if (ssr || PageComponent.getInitialProps) {
    WithApollo.getInitialProps = async (ctx: any) => {
      const {
        AppTree,
        ctx: { req, res },
      } = ctx;

      let serverAccessToken = '';

      if (isServer()) {
        const hasCookie = req.headers && req.headers.cookie;
        const cookies = cookie.parse(hasCookie ? req.headers.cookie : '');
        if (cookies.jid) {
          const response = await unfetch('http://localhost:4000/refresh_token', {
            method: 'POST',
            credentials: 'include',
            headers: {
              cookie: `jid=${cookies.jid}`,
            },
          });
          const data = await response.json();
          serverAccessToken = data.accessToken;
        }
      }

      // Run all GraphQL queries in the component tree
      // and extract the resulting data
      const apolloClient = (ctx.ctx.apolloClient = initApolloClient(
        {},
        serverAccessToken
      ));

      const pageProps = PageComponent.getInitialProps
        ? await PageComponent.getInitialProps(ctx)
        : {};

      // Only on the server
      if (isServer()) {
        // When redirecting, the response is finished.
        // No point in continuing to render
        if (res && res.finished) {
          return {};
        }

        if (ssr) {
          try {
            // Run all GraphQL queries
            const { getDataFromTree } = await import('@apollo/react-ssr');
            await getDataFromTree(
              <AppTree
                pageProps={{
                  ...pageProps,
                  apolloClient,
                }}
                apolloClient={apolloClient}
              />
            );
          } catch (error) {
            // Prevent Apollo Client GraphQL errors from crashing SSR.
            // Handle them in components via the data.error prop:
            // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
            console.error('Error while running `getDataFromTree`', error);
          }
        }

        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      // Extract query data from the Apollo store
      const apolloState = apolloClient.cache.extract();

      return {
        ...pageProps,
        apolloState,
        serverAccessToken,
      };
    };
  }

  return WithApollo;
}

let appClient: ApolloClient<NormalizedCacheObject> | null = null;

/**
 * Always creates a new apollo client on the server
 * Creates or reuses apollo client in the browser.
 */
function initApolloClient(initState: any, serverAccessToken?: string) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (isServer()) {
    return createApolloClient(initState, serverAccessToken);
  }

  // Reuse client on the client-side
  if (!appClient) {
    // setAccessToken(cookie.parse(document.cookie).test);
    appClient = createApolloClient(initState);
  }

  return appClient;
}

function createApolloClient(initialState = {}, serverAccessToken?: string) {
  const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql',
    credentials: 'include',
    fetch: unfetch,
  });

  const refreshLink = new TokenRefreshLink({
    accessTokenField: 'accessToken',
    isTokenValidOrUndefined: () => {
      const token = getAccessToken();

      if (!token) {
        return true;
      }

      try {
        const { exp } = JwtDecode(token);
        if (Date.now() >= exp * 1000) {
          return false;
        }

        return true;
      } catch {
        return false;
      }
    },
    fetchAccessToken: async () => {
      return unfetch('http://localhost:4000/refresh_token', {
        method: 'POST',
        credentials: 'include',
      });
    },
    handleFetch: accessToken => {
      setAccessToken(accessToken);
    },
    handleError: err => {
      console.warn('Your refresh token is invalid. Try to relogin');
      console.error(err);
    },
  });

  const authLink = setContext((_, { headers }) => {
    const token = isServer() ? serverAccessToken : getAccessToken();

    return {
      headers: {
        ...headers,
        authorization: token ? `bearer ${token}` : '',
      },
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      console.error(graphQLErrors);
    }
    if (networkError) {
      console.error(networkError);
    }
  });

  return new ApolloClient({
    ssrMode: isServer(), // Disables forceFetch on the server (so queries are only run once)
    link: ApolloLink.from([refreshLink, authLink, errorLink, httpLink]),
    cache: new InMemoryCache().restore(initialState),
  });
}
