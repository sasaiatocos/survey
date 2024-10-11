'use server';

import { redirect } from 'next/navigation';
import { postQuestion } from '@/app/services/postQuestion';

type Payload = {
  question: string;
  surveyId: number;
};

export async function postQuestionAction(payload: Payload) {
  let questionId = 0;
  try {
    const question = await postQuestion(payload.question, payload.surveyId);
    questionId = question.id;
  } catch (err) {
    return { message: 'Internal Server Error' };
  }
  redirect(`/questions/${questionId}`);
}