'use server';

import { getClient } from '@/apollo/client';
import { LogoutDocument, LogoutMutation } from '@/gql/components';
import { revalidatePath } from 'next/cache';
export const logout = async () => {
  const client = await getClient();
  await client.mutate<LogoutMutation>({
    mutation: LogoutDocument
  });
  revalidatePath('/');
};