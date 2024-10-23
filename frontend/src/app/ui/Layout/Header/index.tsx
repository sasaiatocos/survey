'use client';

import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { Button } from '../../Button';
import { LinkButton } from '../../LinkButton';
import { Avatar } from '../../Avatar';
import styles from './style.module.css';
import { logout } from '@/app/services/logout';

type Props = {
  isLogin?: boolean;
  showDrawerMenu?: boolean;
  avatarImageUrl?: string | null;
};

export function Header({
  isLogin = false,
  showDrawerMenu = true,
  avatarImageUrl
}: Props
) {
  const handleClick = async () => {
    await logout();
  };

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
          <Avatar avatarImageUrl={avatarImageUrl} />
          <div className={clsx(styles.action && styles.isLogin)}>
            {isLogin ? (
              <>
                <Button size='xsmall' color='white' onClick={handleClick}>
                    ログアウト
                </Button>
                <LinkButton size='xsmall' color='white' href='/profile'>
                  プロフィール
                </LinkButton>
              </>
            ) : (
              <Button size='xsmall' color='white'>
                ログイン
              </Button>
            )
            }
          </div>
        </div>
      </div>
    </header>
  );
}