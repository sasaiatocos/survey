'use client';

import { gql, useQuery } from '@apollo/client';
import { Launch } from '@/gql/graphql';

const ALL_LAUNCHES = gql`
  query GetAllLaunches {
    launches {
      mission_name
      rocket {
        rocket_name
      }
    }
  }
`;
export const GetLaunches = () => {
  const { data, loading, error } = useQuery(ALL_LAUNCHES);
  if (loading) return <div>LOADING...</div>;
  if (error) return <div>{error.message}</div>;
  return (
    <div>
      <ul>
        {data.launches.map((launch: Launch, idx: number) => (
          <li key={String(idx)}>
            mission_name: {launch.mission_name}(rocket_name: {launch.rocket?.rocket_name})
          </li>
        ))}
      </ul>
    </div>
  );
};