'use server';

import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getCookie, setCookie } from 'cookies-next';
import { LoginDocument, LoginMutation, RefreshTokenDocument, RefreshTokenMutation } from '@/gql/components';

type Payload = {
  email: string;
  password: string;
};

export async function LoginAction(payload: Payload) {
  const router = useRouter();
  const [refreshToken] = useMutation<RefreshTokenMutation>(RefreshTokenDocument);
  const [login] = useMutation<LoginMutation>(LoginDocument);

  useEffect(() => {
    if (!getCookie('accessToken') && getCookie('refreshToken')) {
      const fetchNewToken = async () => {
        try {
          const newToken = await refreshToken({
            variables: {
              token: getCookie('refreshToken'),
            },
          });

          if (newToken.data?.refreshToken) {
            setCookie('accessToken', newToken.data.refreshToken.accessToken);
            setCookie(
              'refreshToken',
              newToken.data.refreshToken.refreshToken,
            );
            router.push('/');
          } else {
            console.log('newToken.data', newToken.data);
          }
        } catch (err) {
          console.error("トークンの更新エラー:", err);
        }
      };

      fetchNewToken();
    }
  }, [router, refreshToken]);

    try {
      const result = await login({
        variables: {
          email: payload.email,
          password: payload.password,
        },
      });

      if (result.data?.login) {
        setCookie('accessToken', result.data.login.accessToken);
        setCookie('refreshToken', result.data.login.refreshToken);
        router.push('/');
      }
    } catch (err) {
      console.error('Login error:', err);
  };
}
