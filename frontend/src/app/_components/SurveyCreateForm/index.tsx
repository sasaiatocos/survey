'use client';

import { useState } from 'react';
import { Icon } from '@/app/ui/Icon';
import { Typography } from '@/app/ui/Typography';
import { SurveyMeta } from './SurveyMeta';
import { postSurvey } from '@/app/services/postSurvey';
import styles from './style.module.css';
import React from 'react';

type Props = {
    close: () => void;
};

type State = {
    title: string;
    categoryId: string;
    description: string;
};

export function SurveyCreateForm({ close }: Props) {
    const [{ title, categoryId, description }, setState] = useState<State>({
        title: '',
        categoryId: '',
        description: '',
    });
    const handleChangeMeta = (state: State) => {
        setState(state);
    };
    const [recipeData, setRecipeData] = useState<Blob>();
    const handleSubmit = async () => {
        if (!recipeData) return;
        close();
    };
    return (
        <form className={styles.form} action={handleSubmit}>
            <SurveyMeta onChange={handleChangeMeta} />
        </form>
    );
}