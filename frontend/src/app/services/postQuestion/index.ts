'use server';

import { getClient } from '@/apollo/client';
import { CreateQuestionDocument, CreateQuestionMutation } from '@/gql/components';
import { revalidatePath } from 'next/cache';
export const postQuestion = async (title: string, surveyId: number) => {
    const client = await getClient();
    await client.mutate<CreateQuestionMutation>({
        mutation: CreateQuestionDocument,
        variables: { title, surveyId },
    });
    revalidatePath('/');
};