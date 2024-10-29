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
  expiredAt: string;
};

export function SurveyCreateForm({ close }: Props) {
  const [{ title, expiredAt }, setState] = useState<State>({
    title: '',
    expiredAt: '',
  });
  const handleChangeMeta = (state: State) => {
    setState(state);
  };
  const handleSubmit = async () => {
    try {
      await postSurveyAction({ title, expiredAt });
    } catch (err) {
      window.alert('アンケートの作成に失敗しました');
    }
    close();
  };
  return (
    <form className={styles.form} action={handleSubmit}>
      <SurveyMeta onChange={handleChangeMeta} />
    </form>
  );
};
