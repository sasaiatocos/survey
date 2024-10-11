import { findOpenSurvey } from '@/app/services/findOpenSurvey';
import { HeadGroup } from '@/app/ui/HeadGroup';
import { Heading } from '@/app/ui/Heading';
import { Section } from '@/app/ui/Section';
import { SurveyIdsContainer } from '@/app/_components/SurveyViewNavigator/container';
import styles from './style.module.css';
import React from 'react';

export const TopSurveys = async () => {
  const surveys = await findOpenSurvey();

  return (
    <>
      <Section>
        <HeadGroup>
          <Heading level={1} size='medium'>
            アンケート一覧
          </Heading>
        </HeadGroup>
        <div className={styles.cardContainer}>
          <SurveyIdsContainer surveyIds={surveys && surveys.map((survey) => survey.id)}>
            {surveys && surveys.map((survey) => (
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