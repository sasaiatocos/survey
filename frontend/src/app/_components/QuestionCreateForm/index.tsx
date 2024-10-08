'use client';

import { useState } from 'react';
import { Icon } from '@/app/ui/Icon';
import { Typography } from '@/app/ui/Typography';
import { QuestionMeta } from './QuestionMeta';
import { postQuestionAction } from './action';
import styles from './style.module.css';
import React from 'react';

type Props = {
  close: () => void;
};

type State = {
  title: string;
  description: string;
};

export function QuestionCreateForm({ close }: Props) {
    const [{ title, description }, setState] = useState<State>({
        title: '',
        description: '',
    });
    const handleChangeMeta = (state: State) => {
        setState(state);
    };
    const [questionData, setQuestionData] = useState<Blob>();
    const handleSubmit = async () => {
        if (!questionData) return;
        close();
    };
  return (
    <form className={styles.form} action={handleSubmit}>
      <QuestionMeta onChange={handleChangeMeta} />
    </form>
  );
}