import { handleFailed, handleSucceed, path } from '../';
import type { Question } from '../types';

export function postQuestions(payload: {
    option: string;
    surveyId: string;
}): Promise<{ question: Question }> {
    return fetch(path(`/graphql`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
    .then(handleSucceed)
    .catch(handleFailed);
}