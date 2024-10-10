'use server';

import { getClient } from '@/apollo/client';
import { LoginDocument, LoginMutation } from '@/gql/components';
import { revalidatePath } from 'next/cache';
export const login = async (email: string, password:string) => {
  const getClientFunc = await getClient();
  const { data } = await getClientFunc.query<LoginMutation>({
    query: LoginDocument,
    variables: { email, password },
  });
  revalidatePath('/');
  return data.login;
};