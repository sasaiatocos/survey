'use client'

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/_components/AuthContext';
import { Button } from '@/app/ui/Button';
import { LinkButton } from '@/app/ui/LinkButton';
import styles from './style.module.css'
import { useRouter } from 'next/navigation';


export const Header: React.FC = () => {
  const { isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  if (loading) {
    return (
      <header className={styles.header}>
        <div className={styles.link}>
          <Link href='/'>
            <p className={styles.siteName}>Survey</p>
          </Link>
          <p>Loading...</p>
        </div>
      </header>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.link}>
        <Link href='/'>
          <p className={styles.siteName}>Survey</p>
        </Link>
        <div className={styles.avatar}>
          <>
            {isAuthenticated ? (
              <Button size='xsmall' color='gray' onClick={handleLogout}>
                ログアウト
              </Button>
            ) : (
              <LinkButton size='xsmall' color='white' href='/login'>
                ログイン
              </LinkButton>
            )}
          </>
        </div>
      </div>
    </header>
  );
};
