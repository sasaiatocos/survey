'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/app/ui/Icon';
import * as Layout from '@/app/ui/Layout';
import { renderLink } from '@/app/ui/Layout/Navigation';
import { roboto } from '@/app/fonts';
import styles from './style.module.css';

export function ClientLayoutNavigation() {
  const currentPathname = usePathname();
  const linkClassName = roboto.className;

  return (
    <Layout.Navigation
      linkClassName={linkClassName}
      currentPathname={currentPathname}
    >
      <li className={styles.list_item}>
        {renderLink(currentPathname === '/results', (attr) => (
          <Link href='/results' className={linkClassName} {...attr}>
            <Icon type='result' color={Boolean(attr) ? 'orange' : 'black'} />
            result
          </Link>
        ))}
      </li>
    </Layout.Navigation>
  );
}