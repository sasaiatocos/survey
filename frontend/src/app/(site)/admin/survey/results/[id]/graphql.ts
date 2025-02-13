import { gql } from '@apollo/client';

export const GET_SURVEY_STATS = gql`
query GetSurveyStats($surveyId: ID!) {
  getSurveyStats(surveyId: $surveyId) {
    totalResponses
    uniqueRespondents
    questions {
      id
      text
      options {
        id
        text
        responseCount
      }
    }
  }
}
`;