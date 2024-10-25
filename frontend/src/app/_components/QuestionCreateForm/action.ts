'use server';

import { CreateQuestionDocument, CreateQuestionMutation } from '@/gql/components';
import { useMutation } from '@apollo/client';
import { redirect } from 'next/navigation';

type Payload = {
  question: string;
  surveyId: number;
};

export async function postQuestionAction(payload: Payload) {
  let questionId = 0;
  const [question] = useMutation<CreateQuestionMutation>(CreateQuestionDocument);
  try {
    const postQuestion = await question({
      variables: {
        question: payload.question,
        surveyId: payload.surveyId
      },
    });
    questionId = postQuestion.id;
  } catch (err) {
    return { message: 'Internal Server Error' };
  }
  redirect(`/questions/${questionId}`);
}