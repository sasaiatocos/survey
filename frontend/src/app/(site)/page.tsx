'use client'

import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';

const GET_SURVEYS = gql`
  query GetAllSurveys {
    getAllSurveys {
      id
      title
      description
    }
  }
`;

const HomePage: React.FC = () => {
  const { loading, error, data } = useQuery(GET_SURVEYS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>回答可能なアンケート</h1>
      <ul>
        {data.getAllSurveys.map((survey: { id: string; title: string; description: string }) => (
          <li key={survey.id}>
            <Link href={`/survey/${survey.id}`}>
              <h2>{survey.title}</h2>
              <p>{survey.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
