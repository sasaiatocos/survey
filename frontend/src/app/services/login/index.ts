'use server';

import { getClient } from '@/apollo/client';
import { LoginDocument, LoginMutation } from '@/gql/components';
import { revalidatePath } from 'next/cache';
export const login = async (email: string, password:string) => {
  const client = await getClient();
  await client.mutate<LoginMutation>({
    mutation: LoginDocument,
    variables: { email, password },
  });
  revalidatePath('/');
};