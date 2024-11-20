import { gql } from '@apollo/client';

export const GET_PUBLIC_SURVEYS = gql`
  query GetPublicSurveys {
    getPublicSurveys {
      id
      title
      description
    }
  }
`;