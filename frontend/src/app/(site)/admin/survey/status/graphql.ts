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

export const TOGGLE_SURVEY_VISIBILITY = gql`
  mutation ToggleSurveyVisibility($id: ID!, $isPublic: Boolean!) {
    toggleSurveyVisibility(id: $id, isPublic: $isPublic) {
      id
      isPublic
    }
  }
`;