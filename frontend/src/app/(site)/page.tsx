'use client'

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_PUBLIC_SURVEYS } from './graphql';
import Link from 'next/link';
import { Section } from '../ui/Section';
import { HeadGroup } from '../ui/HeadGroup';
import { Heading } from '../ui/Heading';
import { CardContainer } from '../ui/CardContainer';
import { Typography } from '../ui/Typography';
import { AlertText } from '../ui/AlertText';
import { Survey } from '../libs/type';
import { Tag } from '../ui/Tag';
import styles from './style.module.css';

const HomePage: React.FC = () => {
  const { loading, error, data } = useQuery(GET_PUBLIC_SURVEYS);

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
            回答可能なアンケート
          </Heading>
        </HeadGroup>
        {data.getPublicSurveys.length > 0 ? (
          <CardContainer>
            {data.getPublicSurveys.map((survey: Survey) => (
              <Link href={`/survey/${survey.id}`} key={survey.id}>
                <Tag className={styles.title} color='gray'>{survey.title}</Tag>
                <Typography className={styles.description}>{survey.description}</Typography>
              </Link>
            ))
            }
          </CardContainer>
        ) : (
          <CardContainer>
            <Typography>回答可能なアンケートはありません</Typography>
          </CardContainer>
        )
        }
      </Section>
    </>
  );
};

export default HomePage;
