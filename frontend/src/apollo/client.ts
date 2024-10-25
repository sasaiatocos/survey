import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: process.env.API_ENDPOINT,
  cache: new InMemoryCache(),
});