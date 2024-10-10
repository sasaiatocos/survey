'use client';

import { useState } from 'react';
import { QuestionMeta } from './QuestionMeta';
import { postQuestion } from '@/app/services/postQuestion';
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