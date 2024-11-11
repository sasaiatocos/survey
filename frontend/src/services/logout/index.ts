'use server';

import { getClient } from '@/apollo/client';
import { LogoutDocument, LogoutMutation } from '@/gql/components';

export const logout = async () => {
  const client = await getClient();
  const result = await client.mutate<LogoutMutation>({
    mutation: LogoutDocument,
  });
  return result.data?.logout;
};