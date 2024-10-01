'use client';

import { useState } from 'react';
import { Icon } from '@/app/ui/Icon';
import { Typography } from '@/app/ui/Typography';
import type { GetCategoriesResponse } from '@/services/getCategories';
import { QuestionMeta } from './QuestionMeta';
import { postQuestionAction } from './action';
import styles from './style.module.css';
import React from 'react';

type Props = {
    categories: GetCategoriesResponse['categories'];
    close: () => void;
};

type State = {
    title: string;
    categoryId: string;
    description: string;
};

export function QuestionCreateForm({ categories, close }: Props) {
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
            <QuestionMeta categories={categories} onChange={handleChangeMeta} />
        </form>
    );
}