'use client';

import { useEffect, useId, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/app/ui/Button';
import { Label } from '@/app/ui/Label';
import { TextArea } from '@/app/ui/TextArea';
import { TextField } from '@/app/ui/TextField';
import styles from './style.module.css';

type Props = {
    onChange: (state: State) => void;
};
type State = {
    title: string;
    categoryId: string;
    description: string;
};

export function QuestionMeta({ onChange }: Props) {
    const componentId = useId();
    const titleId = `${componentId}-title`;
    const descriptionId = `${componentId}-description`;
    const [state, setState] = useState<State>({
        title: '',
        categoryId: '',
        description: '',
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
                    placeholder={'タイトルを入力...'}
                    onChange={(event) => {
                        setState({ ...state, title: event.target.value });
                    }}
                />
            </div>
            <div className={styles.row}>
                <Label size='xsmall' htmlFor={descriptionId}>
                    レシピの概要
                </Label>
                <TextArea
                    className={styles.description}
                    id={descriptionId}
                    placeholder={'レシピの概要を入力...'}
                    onChange={(event) => {
                        setState({ ...state, description: event.target.value });
                    }}
                />
            </div>
            <Button type='submit' color='orange' size='large' disabled={pending}>
                レシピを投稿する
            </Button>
        </div>
    );
}