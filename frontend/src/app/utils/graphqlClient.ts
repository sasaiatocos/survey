import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});

export const CREATE_SURVEY = gql`
  mutation CreateSurvey($title: String!) {
    createSurvey(title: $title) {
      id
      title
    }
  }
`;

export default client;
