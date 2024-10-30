'use client';
import { useEffect, useContext } from 'react';
import { SurveyIdsContext } from './provider';

export function SurveyIdsContainer({
  surveyIds,
  children,
}: {
  surveyIds: readonly string[];
  children: React.ReactNode;
}) {
    const surveyIdsRef = useContext(SurveyIdsContext);
  useEffect(() => {
    surveyIdsRef.current = surveyIds;
    return () => {
      surveyIdsRef.current = [];
    };
  }, [surveyIdsRef, surveyIds]);
  return children;
};