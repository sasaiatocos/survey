'use server';

import { getClient } from '@/apollo/client';
import { CurrentUserDocument, CurrentUserQuery } from '@/gql/components';

export const currentUser = async () => {
  const getClientFunc = await getClient();
  const { data } = await getClientFunc.query<CurrentUserQuery>({
    query: CurrentUserDocument,
  });
  return data?.user;
};