'use client';

import { useState } from 'react';
import { QuestionMeta } from './QuestionMeta';
import { postQuestionAction } from './action';
import styles from './style.module.css';

type Props = {
  close: () => void;
};

type State = {
  title: string;
  surveyId: number;
};

export function QuestionCreateForm({ close }: Props) {
  const [{ title, surveyId }, setState] = useState<State>({
    title: '',
    surveyId: 0,
  });
  const handleChangeMeta = (state: State) => {
    setState(state);
  };
  const handleSubmit = async () => {
    try {
      await postQuestionAction({ title, surveyId });
    } catch (err) {
      window.alert('質問の作成に失敗しました');
    }
    close();
  };
  return (
    <form className={styles.form} action={handleSubmit}>
      <QuestionMeta onChange={handleChangeMeta} />
    </form>
  );
};
