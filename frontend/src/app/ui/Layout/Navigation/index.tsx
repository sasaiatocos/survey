import clsx from 'clsx';
import type { ReactNode } from 'react';
import React from 'react';
import Link from 'next/link';
import { Icon } from '../../Icon';
import styles from './style.module.css';
import { SurveyCreateModalContainer } from '@/app/_components/SurveyCreateModalContainer';

type Props = {
  children?: React.ReactNode;
  linkClassName?: string;
  currentPathname: string;
  isLogin: boolean;
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
  isLogin = false,
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
        {children}
        {isLogin ? (
          <li className={styles.list_item}>
            <SurveyCreateModalContainer
              toggleClassName={clsx(styles.listitemChild, linkClassName)}
            >
              <Icon type='write' />
              create
            </SurveyCreateModalContainer>
          </li>
        ) : (
          <li></li>
        )}
      </ul>
    </nav>
  );
}