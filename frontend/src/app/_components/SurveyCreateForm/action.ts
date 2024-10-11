'use server';

import { redirect } from 'next/navigation';
import { postSurvey } from '@/app/services/postSurvey';

type Payload = {
  title: string;
  expired_at: string;
};

export async function postSurveyAction(payload: Payload) {
  let surveyId = 0;
  try {
    const survey = await postSurvey(payload.title, payload.expired_at);
    surveyId = survey.id;
  } catch (err) {
    return { message: 'Internal Server Error' };
  }
  redirect(`/surveys/${surveyId}`);
}