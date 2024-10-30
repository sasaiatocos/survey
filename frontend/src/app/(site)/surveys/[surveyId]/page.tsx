import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import { SITE_NAME } from '@/constants';
import { findSurvey } from '@/services/findSurvey';
import { SurveyHero } from './_components/SurveyHero';
import { SurveyMeta } from './_components/SurveyMeta';
import styles from './style.module.css';
import type { Metadata } from 'next';

type Props = {
  params: { surveyId: number };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const survey = await findSurvey(params.surveyId);
  return {
    title: `${survey.title} | ${SITE_NAME}`,
  };
}

export default async function Page({ params }: Props) {
  const survey = await Promise.all([
    findSurvey(params.surveyId),
  ]);
  if (!survey) {
    notFound();
  }

  return (
    <>
      <SurveyHero survey={survey} />
      <div className={styles.content}>
        <SurveyMeta
          survey={survey}
        />
      </div>
    </>
  );
}

export const fetchCache = 'force-cache';