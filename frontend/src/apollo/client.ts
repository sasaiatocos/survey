import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import {
  registerApolloClient,
} from '@apollo/experimental-nextjs-app-support';

export const { getClient } = registerApolloClient(async () => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: getLink(),
  });
});
const getLink = () => {
  const httpLink = new HttpLink({
    uri: process.env.API_ENDPOINT,
    fetchOptions: { cache: 'no-store' },
    credentials: 'include',
  });
  const authLink = setContext(async (_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: 'Bearer XXX',
      },
    };
  });
  const redirectLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      );
    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
  });
  return authLink.concat(redirectLink).concat(httpLink);
};