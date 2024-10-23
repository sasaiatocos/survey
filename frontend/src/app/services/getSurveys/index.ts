'use server';

import { getClient } from '@/apollo/client';
import { GetSurveysDocument, GetSurveysQuery } from '@/gql/components';
export const getSurveys = async () => {
  const getClientFunc = await getClient();
  const { data } = await getClientFunc.query<GetSurveysQuery>({
    query: GetSurveysDocument,
  });
  return data?.surveys;
};