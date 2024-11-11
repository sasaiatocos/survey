'use client';

import { useState } from 'react';
import { LoginMeta } from './LoginMeta';
import styles from './style.module.css';
import { useRouter } from 'next/navigation';
import { login } from '@/services/login';

type State = {
  email: string;
  password: string;
};

export function LoginForm() {
  const [{ email, password }, setState] = useState<State>({
    email: '',
    password: '',
  });
  const router = useRouter();
  const handleChangeMeta = (state: State) => {
    setState(state);
  };

  const handleSubmit = async () => {
    try {
      const result = await login(email, password);
      if (result?.user) {
        router.push('/');
      }
    } catch (err) {
      window.alert('ログインに成功しました');
    }
  };

  return (
    <form className={styles.form} action={handleSubmit}>
      <LoginMeta onChange={handleChangeMeta} />
    </form>
  );
};

