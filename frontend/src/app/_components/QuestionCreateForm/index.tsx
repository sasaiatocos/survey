'use client';

import { useState } from 'react';
import { QuestionMeta } from './QuestionMeta';
import { postQuestionAction } from './action';
import styles from './style.module.css';

type Props = {
  close: () => void;
};

type State = {
  question: string;
  surveyId: number;
};

export function QuestionCreateForm({ close }: Props) {
  const [{ question, surveyId }, setState] = useState<State>({
    question: '',
    surveyId: 0,
  });
  const handleChangeMeta = (state: State) => {
    setState(state);
  };
  const handleSubmit = async () => {
    try {
      await postQuestionAction({ question, surveyId });
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
