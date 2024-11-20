'use client'

import React from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { Section } from '@/app/ui/Section';
import { HeadGroup } from '@/app/ui/HeadGroup';
import { Heading } from '@/app/ui/Heading';
import { CardContainer } from '@/app/ui/CardContainer';
import { Typography } from '@/app/ui/Typography';
import { Tag } from '@/app/ui/Tag';
import { GET_All_SURVEYS } from './graphql';

const ResultTopPage: React.FC = () => {
  const { loading, error, data } = useQuery(GET_All_SURVEYS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Section>
        <HeadGroup>
          <Heading level={1} size='medium'>
            アンケート結果トップ
          </Heading>
        </HeadGroup>
        <CardContainer>
          {data.getAllSurveys.map((survey: { id: number; title: string; description: string }) => (
            <div key={survey.id}>
              <Link href={`/survey/results/${survey.id}`}>
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

export default ResultTopPage;
