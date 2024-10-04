'use server';

import { getClient } from '@/apollo/client';
import { FindUserByEmailDocument, FindUserByEmailQuery } from '@/gql/components';

export const findUserByEmail= async () => {
    const getClientFunc = await getClient();
    const { data } = await getClientFunc.query<FindUserByEmailQuery>({
      query: FindUserByEmailDocument,
    });
    return data?.findUserByEmail;
};