'use client'

import { HeadGroup } from '@/app/ui/HeadGroup';
import { Heading } from '@/app/ui/Heading';
import { Section } from '@/app/ui/Section';
import { SurveyIdsContainer } from '@/app/_components/SurveyViewNavigator/container';
import styles from './style.module.css';
import React from 'react';
import { useQuery } from '@apollo/client';
import { FindOpenSurveyDocument, FindOpenSurveyQuery } from '@/gql/components';

export const TopSurveys = () => {
  const surveys = useQuery<FindOpenSurveyQuery>(FindOpenSurveyDocument);

  return (
    <>
      <Section>
        <HeadGroup>
          <Heading level={1} size='medium'>
            アンケート一覧
          </Heading>
        </HeadGroup>
        <div className={styles.cardContainer}>
          <SurveyIdsContainer surveyIds={surveys.data && surveys.data.findOpenSurvey.map((survey) => survey.id)}>
            {surveys.data && surveys.data.findOpenSurvey.map((survey) => (
            <div key={survey.id}>
              {`${survey.id}: ${survey.title}`}
            </div>
          ))}
          </SurveyIdsContainer>
        </div>
      </Section>
    </>
  )
}