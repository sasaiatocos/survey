'use client';

import type { ReactNode } from 'react';
import styles from './style.module.css';

type Props = {
    close: () => void;
    children: ReactNode;
};

export function QuestionCreateModal({ children, close }: Props) {
    return (
        <div className={styles.modal}>
            <div className={styles.overlay} onClick={close} />
                <div role='dialog' aria-modal='true' aria-label='アンケートの新規投稿'>
                {children}
            </div>
        </div>
    );
}