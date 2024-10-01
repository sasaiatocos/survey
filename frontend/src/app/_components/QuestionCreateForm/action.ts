'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/app/lib/auth';
import { postRecipes } from '@/services/postRecipes';

type Payload = {
    imageUrl: string;
    title: string;
    categoryId: string;
    description: string;
};

export async function postQuestionAction(payload: Payload) {
    const session = await getServerSession();
    if (!session) {
        return { message: 'Unauthorized' };
    }
    let recipeId = '';
    try {
        const { recipe } = await postRecipes({
            userId: session.user.id,
            imageUrl: payload.imageUrl,
            title: payload.title,
            categoryId: payload.categoryId,
            description: payload.description,
        });
        revalidateTag(`recipes?authorId=${session.user.id}`);
        recipeId = recipe.id;
    } catch (err) {
        return { message: 'Internal Server Error' };
    }
    redirect(`/recipes/${recipeId}`);
}