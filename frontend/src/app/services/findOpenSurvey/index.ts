'use server';

import { getClient } from '@/apollo/client';
import { FindOpenSurveyDocument, FindOpenSurveyQuery } from '@/gql/components';
export const findOpenSurvey = async () => {
  const getClientFunc = await getClient();
  const { data } = await getClientFunc.query<FindOpenSurveyQuery>({
    query: FindOpenSurveyDocument,
  });
  return data?.findOpenSurvey;
};