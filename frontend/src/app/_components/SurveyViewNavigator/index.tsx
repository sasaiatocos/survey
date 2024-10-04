'use client';

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useKey } from '@/app/_hooks/useKey';
import { SurveyIdsContext } from './provider';

export function SurveyViewNavigator({ surveyId }: { surveyId: string }) {
    const router = useRouter();
    const surveyIds = useContext(SurveyIdsContext).current;
    const currentIndex = surveyIds.indexOf(surveyId);
    const prevSurveyId = currentIndex > 0 ? surveyIds[currentIndex - 1]:undefined;
    const nextSurveyId =
        currentIndex >= 0 && currentIndex < surveyIds.length - 1
            ? surveyIds[currentIndex + 1]
            : undefined;

    useKey('ArrowLeft', () => {
        if (prevSurveyId) {
            router.replace(`/surveys/${prevSurveyId}/view`, { scroll: false });
        }
    });
    useKey('ArrowRight', () => {
        if (nextSurveyId) {
            router.replace(`/surveys/${nextSurveyId}/view`, { scroll: false });
        }
    });

    return null;
}