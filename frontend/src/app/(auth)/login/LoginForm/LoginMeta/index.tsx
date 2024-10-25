'use client';

import { useEffect, useId, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/app/ui/Button';
import { Label } from '@/app/ui/Label';
import { TextField } from '@/app/ui/TextField';
import styles from './style.module.css';
import { Section } from '@/app/ui/Section';
import { HeadGroup } from '@/app/ui/HeadGroup';
import { Heading } from '@/app/ui/Heading';

type Props = {
  onChange: (state: State) => void;
};
type State = {
  email: string;
  password: string;
};

export function LoginMeta({ onChange }: Props) {
  const componentId = useId();
  const emailId = `${componentId}-email`;
  const passwordId = `${componentId}-password`;
  const [state, setState] = useState<State>({
    email: '',
    password: ''
  });
  const { pending } = useFormStatus();
  useEffect(() => {
    onChange(state);
  }, [state, onChange]);

  return (
    <>
      <Section>
        <HeadGroup>
          <Heading level={1} size='medium'>
            ログイン
          </Heading>
        </HeadGroup>
        <div className={styles.cardContainer}>
          <div className={styles.meta}>
            <div className={styles.row}>
              <Label size='xsmall' htmlFor={emailId}>Email</Label>
              <TextField
                className={styles.email}
                id={emailId}
                value={state.email}
                placeholder={'Email'}
                onChange={(event) => {
                  setState({ ...state, email: event.target.value });
                }}
              />
            </div>
            <div className={styles.row}>
              <Label size='xsmall' htmlFor={passwordId}>Password</Label>
              <TextField
                className={styles.title}
                id={passwordId}
                value={state.password}
                placeholder={'Password'}
                onChange={(event) => {
                  setState({ ...state, password: event.target.value });
                }}
              />
            </div>
            <Button type='submit' color='orange' size='large' disabled={pending}>
              Login
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}