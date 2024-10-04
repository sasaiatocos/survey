export type Survey = {
    id: number;
    createdAt: string;
    updatedAt: string;
    title: string;
    expiredAt: string;
};

export type Question = {
    id: string;
    createdAt: string;
    updatedAt: string;
    options: string;
    surveyId: number;
};

export type Answer = {
    id: string;
    createdAt: string;
    updatedAt: string;
    surveyId: number;
    questionId: number;
    userId: string;
};