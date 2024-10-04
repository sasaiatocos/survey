'use server';

import { getClient } from '@/apollo/client';
import { CreateSurveyDocument, CreateSurveyMutation } from '@/gql/components';
import { revalidatePath } from 'next/cache';
export const postSurvey = async (title: string, expiredAt: string) => {
    const client = await getClient();
    await client.mutate<CreateSurveyMutation>({
        mutation: CreateSurveyDocument,
        variables: { title, expiredAt },
    });
    revalidatePath('/');
};