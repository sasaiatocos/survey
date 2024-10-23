'use server';

import { getClient } from '@/apollo/client';
import { CreateUserDocument, CreateUserMutation } from '@/gql/components';
import { revalidatePath } from 'next/cache';
export const postUser = async (name: string, email: string, password: string) => {
  const client = await getClient();
  await client.mutate<CreateUserMutation>({
    mutation: CreateUserDocument,
    variables: { name, email, password },
  });
  revalidatePath('/');
};