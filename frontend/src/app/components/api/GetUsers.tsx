import { gql } from '@apollo/client';
import { getClient } from '@/apollo/client';
import { cookies } from 'next/headers';

const USER_QUERY = gql`
  query Query {
    user {
      id
      name
      email
      role
    }
  }
`;

export const UserData = async() => {
  const client = getClient();

  const token = cookies().get('access_token')?.value;

  const { data } = await client.query({
    query: USER_QUERY,
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  console.log('data:', data?.user);
  return (
    <>
      <h1>{data?.user?.name}</h1>
      <h2>{data?.user?.email}</h2>
    </>
  )
}