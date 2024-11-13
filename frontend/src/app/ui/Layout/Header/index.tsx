'use client'

import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { useAuth } from '@/app/_components/AuthContext';
import { Button } from '@/app/ui/Button';
import { LinkButton } from '@/app/ui/LinkButton';
import styles from './style.module.css'

type Props = {
  showDrawerMenu?: boolean;
};

export const Header: React.FC = ({
  showDrawerMenu = true,
}: Props) => {
  const { isAuthenticated, currentUser, loading } = useAuth();
  if (loading) return <div>Loading...</div>;

  return (
    <header className={styles.header}>
      {showDrawerMenu && (
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
              <p>Welcome, {currentUser?.email}!</p>
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
