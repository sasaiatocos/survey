'use client';

import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { signIn, signOut } from 'next-auth/react';
import { Button } from '../../Button';
import { LinkButton } from '../../LinkButton';
import styles from './style.module.css';

type Props = {
    isLogin?: boolean;
    showDrawerMenu?: boolean;
};

export function Header({
    isLogin = false,
    showDrawerMenu = true,
}: Props) {
    return (
        <header className={styles.header}>
            {showDrawerMenu && (
                <span className={styles.drawerMenu}>
                    <input type='checkbox' id='drawerMenu' aria-label='メニュー' />
                </span>
            )}
            <div className={styles.link}>
                <Link href='/'>
                    <p className={styles.siteName}>NutriCook</p>
                </Link>
                <div className={styles.avatar}>
                    <div className={clsx(styles.action, isLogin && styles.isLogin)}>
                        {isLogin ? (
                            <>
                                <Button size='xsmall' color='white' onClick={() => signOut()}>
                                    ログアウト
                                </Button>
                                <LinkButton size='xsmall' color='white' href='/profile'>
                                    プロフィール
                                </LinkButton>
                            </>
                        ) : (
                                <Button size='xsmall' color='white' onClick={() => signIn()}>
                                ログイン
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}