'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/app/lib/auth';
import { postQuestions } from '@/app/services/postQuestions';

type Payload = {
    title: string;
    surveyId: string;
};

export async function postQuestionAction(payload: Payload) {
    const session = await getServerSession();
    if (!session) {
        return { message: 'Unauthorized' };
    }
    let questionId = '';
    try {
        const { question } = await postQuestions({
            title: payload.title,
            surveyId: payload.surveyId,
        });
        revalidateTag(`questions?authorId=${session.user.id}`);
        questionId = question.id;
    } catch (err) {
        return { message: 'Internal Server Error' };
    }
    redirect(`/questions/${questionId}`);
}