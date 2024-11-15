'use client'

import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Section } from '@/app/ui/Section';
import { HeadGroup } from '@/app/ui/HeadGroup';
import { Heading } from '@/app/ui/Heading/index';
import { Label } from '@/app/ui/Label';

const GET_SURVEYS = gql`
  query GetAllSurveys {
    getAllSurveys {
      id
      title
      description
      isPublic
    }
  }
`;

const TOGGLE_SURVEY_VISIBILITY = gql`
  mutation ToggleSurveyVisibility($id: ID!, $isPublic: Boolean!) {
    toggleSurveyVisibility(id: $id, isPublic: $isPublic) {
      id
      isPublic
    }
  }
`;

const SurveyStatusPage = () => {
  const { data, loading, refetch } = useQuery(GET_SURVEYS);
  const [toggleSurveyVisibility] = useMutation(TOGGLE_SURVEY_VISIBILITY);
  const handleVisibilityToggle = async (id: number, currentStatus: boolean) => {
    await toggleSurveyVisibility({
      variables: { id, isPublic: !currentStatus },
    });
    refetch();
    window.location.reload();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Section>
        <HeadGroup>
          <Heading level={1} size='medium'>
            アンケート公開・非公開設定
          </Heading>
        </HeadGroup>
        <ul>
        {data?.getAllSurveys.map((survey: any) => (
          <li key={survey.id}>
            <Label>{survey.title}</Label>
            <button onClick={() => handleVisibilityToggle(survey.id, survey.isPublic)}>
              {survey.isPublic ? '非公開にする' : '公開にする'}
            </button>
          </li>
        ))}
      </ul>
      </Section>
    </>
  );
};

export default SurveyStatusPage;
