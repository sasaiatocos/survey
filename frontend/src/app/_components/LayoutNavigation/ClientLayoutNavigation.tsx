'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/app/ui/Icon';
import * as Layout from '@/app/ui/Layout';
import { renderLink } from '@/app/ui/Layout/Navigation';
import { roboto } from '@/app/fonts';
import styles from './style.module.css';
import { useCookies } from 'react-cookie';

export function ClientLayoutNavigation() {
  const currentPathname = usePathname();
  const linkClassName = roboto.className;
  const admin = useCookies(['jwt']);
  return (
    <Layout.Navigation
      linkClassName={linkClassName}
      currentPathname={currentPathname}
      isLogin={Boolean(admin)}
    >
      <li className={styles.list_item}>
        {renderLink(currentPathname === '/result', (attr) => (
          <Link href='/result' className={linkClassName} {...attr}>
            <Icon type='result' color={Boolean(attr) ? 'orange' : 'black'} />
            result
          </Link>
        ))}
      </li>
    </Layout.Navigation>
  );
}