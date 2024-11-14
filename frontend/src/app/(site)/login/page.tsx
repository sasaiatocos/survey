'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/_components/AuthContext';
import { gql, useMutation } from '@apollo/client';
import styles from './style.module.css';
import { Section } from '@/app/ui/Section';
import { HeadGroup } from '@/app/ui/HeadGroup';
import { Heading } from '@/app/ui/Heading';
import { Button } from '@/app/ui/Button';
import { Label } from '@/app/ui/Label';
import { TextField } from '@/app/ui/TextField';
import { useFormStatus } from 'react-dom';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
    }
  }
`;

type State = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const { currentUser, isAuthenticated, loading, refetchUser } = useAuth();
  const router = useRouter();
  const [login, { loading: loginLoading, error }] = useMutation(LOGIN_MUTATION);
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
    const form = event.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await login({ variables: { email, password } });
      await refetchUser();
      router.push('/');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <form className={styles.form} onSubmit={handleLogin}>
        <Section>
          <HeadGroup>
            <Heading level={1} size='medium'>
              Login
            </Heading>
          </HeadGroup>
          {error && <p>Error: {error.message}</p>}
          <div className={styles.cardContainer}>
            <div className={styles.meta}>
              <div className={styles.row}>
                <Label size='xsmall'>Email:</Label>
                <TextField
                  className={styles.email}
                  type='email'
                  name='email'
                  placeholder={'Email'}
                  onChange={(event) => {
                    setState({ ...state, email: event.target.value });
                  }} />
              </div>
              <div className={styles.row}>
                <Label size='xsmall'>Password:</Label>
                <TextField
                  className={styles.password}
                  type="password"
                  name="password"
                  placeholder={'Password'}
                  onChange={(event) => {
                    setState({ ...state, password: event.target.value });
                  }} />
              </div>
              <Button type="submit" disabled={loginLoading}>
                {loginLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </div>
        </Section>
      </form>
    </>
  );
};

export default LoginPage;
