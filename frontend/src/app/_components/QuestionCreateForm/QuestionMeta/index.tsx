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
  question: string;
  surveyId: number;
};

export function QuestionMeta({ onChange }: Props) {
  const componentId = useId();
  const questionId = `${componentId}-question`;
  const [state, setState] = useState<State>({
    question: '',
    surveyId: 0,
  });
  const { pending } = useFormStatus();
  useEffect(() => {
    onChange(state);
  }, [state, onChange]);

  return (
    <div className={styles.meta}>
      <div className={styles.row}>
        <Label size='xsmall' htmlFor={questionId}>
          タイトル
        </Label>
        <TextField
          className={styles.title}
          id={questionId}
          value={state.question}
          placeholder={'設問を入力...'}
          onChange={(event) => {
            setState({ ...state, question: event.target.value });
          }}
        />
      </div>
      <Button type='submit' color='orange' size='large' disabled={pending}>
        質問を投稿する
      </Button>
    </div>
  );
}