'use server';

import { getClient } from '@/apollo/client';
import { LoginDocument, LoginMutation } from '@/gql/components';

export const login = async (email: string, password: string) => {
  const client = await getClient();
  const result = await client.mutate<LoginMutation>({
    mutation: LoginDocument,
    variables: { email, password },
  });
  return result.data?.login;
};