'use client'

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/_components/AuthContext';
import { Button } from '@/app/ui/Button';
import { LinkButton } from '@/app/ui/LinkButton';
import styles from './style.module.css'
import { useRouter, usePathname } from 'next/navigation';

type Props = {
  showDrawerMenu?: boolean;
};

export function Header({
  showDrawerMenu = true,
}: Props) {
  const { isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const currentPathname = usePathname();
  if (loading) {
    return (
      <header className={styles.header}>
        {showDrawerMenu && (currentPathname as string) !== '/login' && (
        <span className={styles.drawerMenu}>
          <input type='checkbox' id='drawerMenu' aria-label='メニュー' />
        </span>
      )}
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
      {showDrawerMenu && (currentPathname as string) !== '/login' && (
        <span className={styles.drawerMenu}>
          <input type='checkbox' id='drawerMenu' aria-label='メニュー' />
        </span>
      )}
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
