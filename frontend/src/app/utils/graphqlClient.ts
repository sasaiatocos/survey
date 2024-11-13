import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const createApolloClient = () => {
  return new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache: new InMemoryCache(),
    credentials: 'include'
  });
}

export const apolloClient = createApolloClient();
