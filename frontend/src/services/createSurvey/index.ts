'use server';

import { getClient } from '@/apollo/client';
import { CreateSurveyDocument, CreateSurveyMutation } from '@/gql/components';

export const createSurvey = async (title: string, expiredAt: string) => {
  const client = await getClient();
  await client.mutate<CreateSurveyMutation>({
    mutation: CreateSurveyDocument,
    variables: { title, expiredAt },
  });
};