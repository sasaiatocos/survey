'use client';

import { useState } from 'react';
import { SurveyMeta } from './SurveyMeta';
import { postSurveyAction } from './action';
import styles from './style.module.css';

type Props = {
  close: () => void;
};

type State = {
  title: string;
  expired_at: string;
};

export function SurveyCreateForm({ close }: Props) {
  const [{ title, expired_at }, setState] = useState<State>({
    title: '',
    expired_at: '',
  });
  const handleChangeMeta = (state: State) => {
    setState(state);
  };
  const handleSubmit = async () => {
    try {
      await postSurveyAction({ title, expired_at });
    } catch (err) {
      window.alert('質問の作成に失敗しました');
    }
    close();
  };
  return (
    <form className={styles.form} action={handleSubmit}>
      <SurveyMeta onChange={handleChangeMeta} />
    </form>
  );
};
