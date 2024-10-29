'use server';

import { redirect } from 'next/navigation';
import { CreateSurveyDocument, CreateSurveyMutation } from '@/gql/components';
import { useMutation } from '@apollo/client';

type Payload = {
  title: string;
  expiredAt: string;
};

export async function postSurveyAction(payload: Payload) {
  const [newSurvey] = useMutation<CreateSurveyMutation>(CreateSurveyDocument);
  let surveyId = '';
  try {
    const result = await newSurvey({
        variables: {
          title: payload.title,
          expiredAt: payload.expiredAt,
        },
      });
    surveyId = result.data?.createSurvey.id!;
  } catch (err) {
    return { message: 'Internal Server Error' };
  }
  redirect(`/surveys/${surveyId}`);
}