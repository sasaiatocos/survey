'use server';

import { getClient } from '@/apollo/client';
import { FindSurveyDocument, FindSurveyQuery } from '@/gql/components';

export const findSurvey = async (id: number) => {
  const getClientFunc = await getClient();
  const { data } = await getClientFunc.query<FindSurveyQuery>({
    query: FindSurveyDocument,
    variables: { id }
  });
  return data.findSurvey;
};