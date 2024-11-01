'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/app/ui/Icon';
import * as Layout from '@/app/ui/Layout';
import { renderLink } from '@/app/ui/Layout/Navigation';
import { roboto } from '@/app/fonts';
import styles from './style.module.css';
import { useEffect } from 'react';
import { getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { refreshToken } from '@/services/refreshToken';

export function ClientLayoutNavigation() {
  const currentPathname = usePathname();
  const router = useRouter();
  const linkClassName = roboto.className;

  useEffect(() => {
    if (!getCookie('accessToken') && getCookie('refreshToken')) {
      const fetchNewToken = async () => {
        try {
          const oldToken = getCookie('refreshToken') as string;
          const newToken = await refreshToken(oldToken);

          if (newToken?.refreshToken) {
            setCookie('accessToken', newToken.accessToken);
            setCookie('refreshToken', newToken.refreshToken);
            router.push('/')
          } else {
            console.log('newToken.data', newToken);
          }
        } catch (error) {
          const oldToken = getCookie('refreshToken') as string;
          console.log(oldToken);
          console.error('トークンの更新エラー:', error);
        }
      };
      fetchNewToken();
    }
  }, [router]);

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
    </Layout.Navigation>
  );
}