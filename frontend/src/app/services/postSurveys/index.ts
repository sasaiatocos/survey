import { handleFailed, handleSucceed, path } from '../';
import type { Survey } from '../types';

export function postSurveys(payload: {
    title: string;
    expiredAt: string;
}): Promise<{ survey: Survey }> {
    return fetch(path(`/graphql`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
    .then(handleSucceed)
    .catch(handleFailed);
}