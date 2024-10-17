'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/app/ui/Icon';
import * as Layout from '@/app/ui/Layout';
import { renderLink } from '@/app/ui/Layout/Navigation';
import { roboto } from '@/app/fonts';
import { QuestionCreateModalContainer } from '../QuestionCreateModalContainer';
import styles from './style.module.css';
import { useCookies } from 'react-cookie';
import { Button } from '@/app/ui/Button';



export function ClientLayoutAdminNavigation() {
  const currentPathname = usePathname();
  const linkClassName = roboto.className;
  const cookie = useCookies(['jwt']);

  return (
    <Layout.Navigation
      linkClassName={linkClassName}
      currentPathname={currentPathname}
    >
      <li className={styles.list_item}>
        {renderLink(currentPathname === '/result', (attr) => (
          <Link href='/result' className={linkClassName} {...attr}>
            <Icon type='result' color={Boolean(attr) ? 'orange' : 'black'} />
            result
          </Link>
        ))}
      </li>
      <li className={styles.list_item}>
        {cookie ? (
          <>
            <QuestionCreateModalContainer
              toggleClassName={clsx(styles.listitemChild, linkClassName)}
            >
              <Icon type='write' />
              create
            </QuestionCreateModalContainer>
            <form action="">
              <Button type='submit' className={linkClassName}>
              <Icon type='logout' />
              logout
            </Button>
            </form>
          </>
        ) : (
          <Link href='/login' className={linkClassName}>
            <Icon type='login' />
            login
          </Link>
        )}
      </li>
    </Layout.Navigation>
  );
}