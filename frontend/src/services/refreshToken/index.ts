'use server';

import { getClient } from '@/apollo/client';
import { RefreshTokenDocument, RefreshTokenMutation } from '@/gql/components';

export const refreshToken = async()  => {
  const client = await getClient();
  const result = await client.mutate<RefreshTokenMutation>({
    mutation: RefreshTokenDocument
  });
  return result.data?.refreshToken;
};