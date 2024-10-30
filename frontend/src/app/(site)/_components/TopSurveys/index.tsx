import Link from 'next/link';
import { HeadGroup } from '@/app/ui/HeadGroup';
import { Heading } from '@/app/ui/Heading';
import { Section } from '@/app/ui/Section';
import { SurveyIdsContainer } from '@/app/_components/SurveyViewNavigator/container';
import styles from './style.module.css';
import React from 'react';
import { getSurveys } from '@/services/getSurveys';

export const TopSurveys = async() => {
  const surveys = await getSurveys();

  return (
    <>
      <Section>
        <HeadGroup>
          <Heading level={1} size='medium'>
            アンケート一覧
          </Heading>
        </HeadGroup>
        <div className={styles.cardContainer}>
          <SurveyIdsContainer surveyIds={surveys && surveys.map((survey) => survey.id) }>
            {surveys && surveys.map((survey) => (
            <Link key={survey.id} href={`/surveys/${survey.id}/view`} prefetch={true}>
              {`${survey.id}: ${survey.title}`}
            </Link>
          ))}
          </SurveyIdsContainer>
        </div>
      </Section>
    </>
  )
}