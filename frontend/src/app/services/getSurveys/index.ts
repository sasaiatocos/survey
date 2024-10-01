import { handleFailed, handleSucceed } from '../';
import type { Survey } from '../types';

export type GetSurveysResponse = {
    surveys: (Omit<Survey, 'surveys'> & { totalSurveyCount: number })[];
};

export async function getSurveys(): Promise<GetSurveysResponse> {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/graphql', {
        cache: 'force-cache',
        next: { tags: ['surveys'] },
    })
    .then(handleSucceed)
    .catch(handleFailed);
}