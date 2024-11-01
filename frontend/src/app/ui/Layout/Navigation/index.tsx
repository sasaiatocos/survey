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
        {children}
        <li className={styles.list_item}>
          <SurveyCreateModalContainer
            toggleClassName={clsx(styles.listitemChild, linkClassName)}
          >
            <Icon type='write' />
            create
          </SurveyCreateModalContainer>
        </li>
      </ul>
    </nav>
  );
}