import { gql } from '@apollo/client';

export const GET_MY_SURVEYS = gql`
  query GetMySurveys {
    getMySurveys {
      id
      title
      description
    }
  }
`;