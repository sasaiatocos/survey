'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/_components/AuthContext';
import { ApolloError, useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from './graphql';
import { loginSchema } from './schema';
import { Section } from '@/app/ui/Section';
import { HeadGroup } from '@/app/ui/HeadGroup';
import { Heading } from '@/app/ui/Heading';
import { Button } from '@/app/ui/Button';
import { Label } from '@/app/ui/Label';
import { TextField } from '@/app/ui/TextField';
import { AlertLabel } from '@/app/ui/AlertLabel';
import styles from './style.module.css';
import Link from 'next/link';

type State = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const { currentUser, isAuthenticated, loading, refetchUser } = useAuth();
  const router = useRouter();
  const [login, { loading: loginLoading }] = useMutation(LOGIN_MUTATION);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [state, setState] = useState<State>({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      router.push('/');
    }
  }, [isAuthenticated, currentUser, router]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = loginSchema.safeParse(state);
    if (!result.success) {
      const errors: { [key: string]: string } = {};
      result.error.errors.forEach((e) => {
        if (e.path && e.path[0]) {
          errors[e.path[0].toString()] = e.message;
        }
      });
      setValidationErrors(errors);
      return;
    }

    try {
      await login({ variables: state });
      await refetchUser();
      router.push('/');
    } catch (error) {
      console.error('ログインに失敗しました', error);
      if (error instanceof ApolloError) {
        let serverError = 'ログインに失敗しました。再度お試しください';
        if (error.graphQLErrors[0]?.message.includes('email or password')) {
          serverError = 'メールアドレスまたはパスワードが間違っています';
        }
        setValidationErrors({ server: serverError });
      } else {
        setValidationErrors({ server: '予期しないエラーが発生しました' });
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
    setValidationErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  if (loading) return (
      <>
          <Section>
            <HeadGroup>
              <Heading level={1} size='small'>
                Loading...
              </Heading>
            </HeadGroup>
          </Section>
        </>
    );

  return (
    <>
      <Section>
        <HeadGroup>
          <Heading level={1} size='medium'>
            Login
          </Heading>
        </HeadGroup>
        {validationErrors.server && (
          <AlertLabel>{validationErrors.server}</AlertLabel>
        )}
        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.meta}>
            <div className={styles.row}>
              <Label size='xsmall' htmlFor='email'>Email:</Label>
              <TextField
                className={styles.email}
                type='email'
                name='email'
                id='email'
                placeholder={'Email'}
                aria-label='Email'
                value={state.email}
                autoComplete='username'
                onChange={handleInputChange}
                aria-describedby={validationErrors.email ? 'email-error' : undefined}
              />
              {validationErrors.email && (
                <AlertLabel id='email-error'>{validationErrors.email}</AlertLabel>
              )}
            </div>
            <div className={styles.row}>
              <Label size='xsmall' htmlFor='password'>Password:</Label>
              <TextField
                className={styles.password}
                type='password'
                name='password'
                id='password'
                placeholder={'Password'}
                aria-label='Password'
                value={state.password}
                autoComplete='current-password'
                onChange={handleInputChange}
                aria-describedby={validationErrors.password ? 'password-error' : undefined}
              />
              {validationErrors.password && (
                <AlertLabel id='password-error'>{validationErrors.password}</AlertLabel>
              )}
            </div>
            <div className={styles.row}>
              <Button type='submit' disabled={loginLoading}>
                {loginLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </div>
        </form>
        <div className={styles.register}>
          <Link href='/register' className={styles.register_link}>
            新規会員登録はこちらから
          </Link>
        </div>
      </Section>
    </>
  );
};

export default LoginPage;