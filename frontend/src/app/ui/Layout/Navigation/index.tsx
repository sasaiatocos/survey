'use client'

import React from 'react';
import type { ReactNode } from 'react';
import { roboto } from '@/app/fonts';
import clsx from 'clsx';
import Link from 'next/link';
import { Icon } from '@/app/ui/Icon';
import styles from './style.module.css';

type Props = {
  children?: React.ReactNode;
  linkClassName?: string;
  currentPathname: string;
};

export function renderLink(
  flag: boolean,
  renderer: (attr?: { 'aria-current': 'page' }) => ReactNode,
) {
  return renderer(flag ? { 'aria-current': 'page' as const } : undefined);
}

export function Navigation({
  children,
  linkClassName,
  currentPathname,
}: Props) {
  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        <li className={styles.list_item}>
          {renderLink(currentPathname === '/', (attr) => (
            <Link href='/' className={linkClassName} {...attr}>
              <Icon type='home' color={Boolean(attr) ? 'orange' : 'black'} />
              home
            </Link>
          ))}
        </li>
        <li className={styles.list_item}>
          {renderLink(currentPathname === '/survey', (attr) => (
          <Link href='/survey' className={linkClassName} {...attr}>
            <Icon type='write' color={Boolean(attr) ? 'orange' : 'black'} />
            create
          </Link>
        ))}
        </li>
        <li className={styles.list_item}>
          {renderLink(currentPathname === '/result', (attr) => (
          <Link href='/result' className={linkClassName} {...attr}>
            <Icon type='result' color={Boolean(attr) ? 'orange' : 'black'} />
            result
          </Link>
        ))}
        </li>
      </ul>
    </nav>
  );
};

