'use client';

import { useEffect, useState } from 'react';
import { LoginMeta } from './LoginMeta';
import styles from './style.module.css';
import { getCookie, setCookie } from 'cookies-next';
import { refreshToken } from '@/services/refreshToken';
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

  useEffect(() => {
    if (!getCookie('accessToken') && getCookie('refreshToken')) {
      const fetchNewToken = async () => {
        try {
          const oldToken = getCookie('refreshToken') as string;
          const newToken = await refreshToken(oldToken);

          if (newToken?.refreshToken) {
            setCookie('accessToken', newToken.accessToken);
            setCookie('refreshToken', newToken.refreshToken);
            router.push('/')
          } else {
            console.log('newToken.data', newToken);
          }
        } catch (error) {
          const oldToken = getCookie('refreshToken') as string;
          console.log(oldToken);
          console.error('トークンの更新エラー:', error);
        }
      };
      fetchNewToken();
    }
  }, [router]);

  const handleSubmit = async () => {
    try {
      const result = await login(email, password);
      if (result?.user) {
        setCookie('accessToken', result.accessToken, { maxAge: 30 * 60 });
        setCookie('refreshToken', result.refreshToken
        );
        router.push('/');
      }
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
