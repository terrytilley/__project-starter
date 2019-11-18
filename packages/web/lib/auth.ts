import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import gql from 'graphql-tag';

import { Redirect } from '../lib/redirect';
import { PageContext } from '../types';

export const checkLoggedIn = (apolloClient: ApolloClient<NormalizedCacheObject>) =>
  apolloClient
    .query({
      query: gql`
        query Me {
          me {
            id
            email
          }
        }
      `,
    })
    .then(({ data }) => {
      return { loggedInUser: data };
    })
    .catch(() => {
      // Fail gracefully
      return { loggedInUser: {} };
    });

export const authRedirect = async (ctx: PageContext, isAuth = false) => {
  const { loggedInUser } = await checkLoggedIn(ctx.apolloClient);

  if (isAuth && loggedInUser.me) {
    Redirect(ctx, '/');
  }

  if (!isAuth && !loggedInUser.me) {
    Redirect(ctx, '/login');
  }

  return { loggedInUser };
};
