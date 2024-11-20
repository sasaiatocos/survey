import { gql } from '@apollo/client';

export const GET_SURVEYS = gql`
  query GetAllSurveys {
    getAllSurveys {
      id
      title
      description
      isPublic
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