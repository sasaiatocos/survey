import { gql } from '@apollo/client';

export const GET_SURVEY = gql`
  query GetSurvey($id: ID!) {
    getSurvey(id: $id) {
      id
      title
      description
      questions {
        id
        text
        options {
          id
          text
        }
      }
    }
  }
`;

export const SUBMIT_ANSWER = gql`
  mutation SubmitAnswers($answers: [AnswerInput!]!) {
    submitAnswers(answers: $answers) {
      id
      selectedOption {
        id
      }
    }
  }
`;