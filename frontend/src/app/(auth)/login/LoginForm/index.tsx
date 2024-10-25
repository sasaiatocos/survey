'use client';

import { useState } from 'react';
import { LoginMeta } from './LoginMeta';
import { LoginAction } from './action';
import styles from './style.module.css';

type Props = {
  close: () => void;
};

type State = {
  email: string;
  password: string;
};

export function LoginForm({ close }: Props) {
  const [{ email, password }, setState] = useState<State>({
    email: '',
    password: '',
  });
  const handleChangeMeta = (state: State) => {
    setState(state);
  };
  const handleSubmit = async () => {
    try {
      await LoginAction({ email, password });
    } catch (err) {
      window.alert('ログインに成功しました');
    }
    close();
  };
  return (
    <form className={styles.form} action={handleSubmit}>
      <LoginMeta onChange={handleChangeMeta} />
    </form>
  );
};

