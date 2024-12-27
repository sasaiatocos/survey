'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/_components/AuthContext';
import { useMutation } from '@apollo/client';
import { REGISTER_MUTATION } from './graphql';
import { registerSchema } from './schema';
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
  name: string;
  email: string;
  password: string;
};

const RegisterPage: React.FC = () => {
  const { currentUser, isAuthenticated, loading, refetchUser } = useAuth();
  const router = useRouter();
  const [register, { loading: registerLoading }] = useMutation(REGISTER_MUTATION);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [state, setState] = useState<State>({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      router.push('/');
    }
  }, [isAuthenticated, currentUser, router]);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = registerSchema.safeParse(state);
    if (!result.success) {
      setValidationErrors(result.error.errors.map((e) => e.message));
      return;
    }

    try {
      await register({ variables: state });
      await refetchUser();
      router.push('/login');
    } catch (error) {
      console.error('ログインに失敗しました', error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
    setValidationErrors([]);
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
            Register
          </Heading>
        </HeadGroup>
        {validationErrors.length > 0 && (
          <ul className={styles.errorList}>
            {validationErrors.map((error, index) => (
              <AlertLabel key={index}>
                {error}
              </AlertLabel>
            ))}
          </ul>
        )}
        <form className={styles.form} onSubmit={handleRegister}>
          <div className={styles.meta}>
            <div className={styles.row}>
              <Label size='xsmall'>Name:</Label>
              <TextField
                className={styles.name}
                type='name'
                name='name'
                placeholder={'Name'}
                aria-label='Name'
                value={state.name}
                autoComplete='username'
                onChange={handleInputChange} />
            </div>
            <div className={styles.row}>
              <Label size='xsmall'>Email:</Label>
              <TextField
                className={styles.email}
                type='email'
                name='email'
                placeholder={'Email'}
                aria-label='Email'
                value={state.email}
                autoComplete='username'
                onChange={handleInputChange} />
            </div>
            <div className={styles.row}>
              <Label size='xsmall'>Password:</Label>
              <TextField
                className={styles.password}
                type='password'
                name='password'
                placeholder={'Password'}
                aria-label='Password'
                value={state.password}
                autoComplete='current-password'
                onChange={handleInputChange} />
            </div>
            <div className={styles.row}>
              <Button type='submit' disabled={registerLoading}>
                {registerLoading ? 'Registering...' : 'Register'}
              </Button>
            </div>
          </div>
        </form>
        <div className={styles.login}>
          <Link href='/login' className={styles.login_link}>ログインはこちらから</Link>
        </div>
      </Section>
    </>
  );
};

export default RegisterPage;
