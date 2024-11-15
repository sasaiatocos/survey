'use client'

import React from 'react';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { Section } from '../ui/Section';
import { HeadGroup } from '../ui/HeadGroup';
import { Heading } from '../ui/Heading';
import { CardContainer } from '../ui/CardContainer';
import { Typography } from '../ui/Typography';
import { LinkTag } from '../ui/LinkTag';
import { Tag } from '../ui/Tag';

const GET_PUBLIC_SURVEYS = gql`
  query GetPublicSurveys {
    getPublicSurveys {
      id
      title
      description
    }
  }
`;

const HomePage: React.FC = () => {
  const { loading, error, data } = useQuery(GET_PUBLIC_SURVEYS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Section>
        <HeadGroup>
          <Heading level={1} size='medium'>
            回答可能なアンケート
          </Heading>
        </HeadGroup>
        <CardContainer>
          {data.getPublicSurveys.map((survey: { id: number; title: string; description: string }) => (
            <div key={survey.id}>
              <Link href={`/survey/${survey.id}`}>
                <Tag>{survey.title}</Tag>
                <Typography>{survey.description}</Typography>
              </Link>
            </div>
          ))}
        </CardContainer>
      </Section>
    </>
  );
};

export default HomePage;
