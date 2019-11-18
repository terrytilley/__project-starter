import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { NextPageContext } from 'next';

export interface PageContext extends NextPageContext {
  apolloClient: ApolloClient<NormalizedCacheObject>;
}
