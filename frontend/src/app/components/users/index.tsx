'use client';

import { useQuery, gql } from '@apollo/client';
import { User } from '@/gql/graphql';

const ALL_USERS = gql`
  query getUsers {
    users {
      id
      name
      email
    }
  }
`

export const GetUsers = () => {
  const { data, loading, error } = useQuery(ALL_USERS);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <div>
      <ul>
        {data.users.map((user: User, idx: number) => (
          <li key={String(idx)}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  )
}