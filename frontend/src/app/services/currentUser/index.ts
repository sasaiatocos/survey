'use server';

import { getClient } from '@/apollo/client';
import { CurrentUserDocument, CurrentUserQuery } from '@/gql/components';

export const currentUser = async (email: string) => {
  const getClientFunc = await getClient();
  const { data } = await getClientFunc.query<CurrentUserQuery>({
    query: CurrentUserDocument,
    variables: { email },
  });
  return data?.user;
};