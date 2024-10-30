'use server';

import { revalidatePath } from 'next/cache';
import { createSurvey } from '@/services/createSurvey';

type Payload = {
  title: string;
  expiredAt: string;
};

export async function postSurveyAction(payload: Payload) {
  try {
    await createSurvey(payload.title, payload.expiredAt);
  } catch (err) {
    return { message: 'Internal Server Error' };
  }
  revalidatePath('/');
}