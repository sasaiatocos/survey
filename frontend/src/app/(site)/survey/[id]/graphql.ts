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
        type
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
      question {
        id
      }
      survey {
        id
      }
      optionIds
    }
  }
`;