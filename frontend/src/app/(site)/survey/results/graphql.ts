import { gql } from '@apollo/client';

export const GET_All_SURVEYS = gql`
  query GetAllSurveys {
    getAllSurveys {
      id
      title
      description
    }
  }
`;
