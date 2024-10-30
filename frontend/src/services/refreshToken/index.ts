'use server';

import { getClient } from '@/apollo/client';
import { RefreshTokenDocument, RefreshTokenMutation } from '@/gql/components';

export const refreshToken = async (refreshToken: string) => {
  const client = await getClient();
  const result = await client.mutate<RefreshTokenMutation>({
    mutation: RefreshTokenDocument,
    variables: {refreshToken}
  });
  return result.data?.refreshToken;
};