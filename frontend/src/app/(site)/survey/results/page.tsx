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
import { AlertText } from '@/app/ui/AlertText';
import { GET_All_SURVEYS } from './graphql';
import { Survey } from '@/app/libs/type';
import styles from '../../style.module.css';

const ResultTopPage: React.FC = () => {
  const { loading, error, data } = useQuery(GET_All_SURVEYS);

  if (loading) {
    return (
      <>
        <Section>
          <HeadGroup>
            <Heading level={1} size='small'>
              Loading...
            </Heading>
          </HeadGroup>
        </Section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Section>
          <HeadGroup>
            <Heading level={1} size='small'>
              <AlertText>
                Error: {error.message}
              </AlertText>
            </Heading>
          </HeadGroup>
        </Section>
      </>
    );
  }

  return (
    <>
      <Section>
        <HeadGroup>
          <Heading level={1} size='medium'>
            アンケート結果トップ
          </Heading>
        </HeadGroup>
        <CardContainer>
          {data.getAllSurveys.map((survey: Survey) => (
            <Link href={`/survey/results/${survey.id}`} key={survey.id}>
              <Tag className={styles.title} color='gray'>{survey.title}</Tag>
              <Typography className={styles.description}>{survey.description}</Typography>
            </Link>
          ))}
        </CardContainer>
      </Section>
    </>
  );
};

export default ResultTopPage;
