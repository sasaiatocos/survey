'use client';

import { useEffect, useId, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/app/ui/Button';
import { Label } from '@/app/ui/Label';
import { TextField } from '@/app/ui/TextField';
import styles from './style.module.css';

type Props = {
  onChange: (state: State) => void;
};
type State = {
  title: string;
  surveyId: number;
};

export function QuestionMeta({ onChange }: Props) {
  const componentId = useId();
  const titleId = `${componentId}-title`;
  const [state, setState] = useState<State>({
    title: '',
    surveyId: 0,
  });
    const { pending } = useFormStatus();
  useEffect(() => {
    onChange(state);
  }, [state, onChange]);

  return (
    <div className={styles.meta}>
      <div className={styles.row}>
        <Label size='xsmall' htmlFor={titleId}>
          タイトル
        </Label>
        <TextField
          className={styles.title}
          id={titleId}
          value={state.title}
          placeholder={'設問を入力...'}
          onChange={(event) => {
            setState({ ...state, title: event.target.value });
          }}
        />
      </div>
      <Button type='submit' color='orange' size='large' disabled={pending}>
        質問を投稿する
      </Button>
    </div>
  );
}