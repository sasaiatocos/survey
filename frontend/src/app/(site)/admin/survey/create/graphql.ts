import { gql } from '@apollo/client';

export const CREATE_SURVEY_MUTATION = gql`
  mutation CreateSurvey($title: String!, $description: String, $questions: [CreateQuestionInput!]!) {
  createSurvey(title: $title, description: $description, questions: $questions) {
    id
    title
    description
    questions {
      id
      text
      type
      options {
        id
        text
      }
    }
  }
}
`;