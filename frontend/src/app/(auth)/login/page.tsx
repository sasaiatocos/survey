'use client'

import styles from './style.module.css';
import { LoginForm } from '@/app/_components/LoginForm';

export default function Page() {
  return (
    <div className={styles.page}>
      <div className={styles.surveys}>
        <LoginForm />
      </div>
    </div>
  );
}