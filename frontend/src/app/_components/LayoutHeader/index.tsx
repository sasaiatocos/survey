'use client';

import * as Layout from '@/app/ui/Layout';
import { useCookies } from 'react-cookie';

type Props = {
  showDrawerMenu?: boolean;
};

export function LayoutHeader({ showDrawerMenu }: Props) {
  const admin = useCookies(['jwt']);
  return (
    <Layout.Header
      isLogin={Boolean(admin)}
      showDrawerMenu={showDrawerMenu}
    />
  );
}