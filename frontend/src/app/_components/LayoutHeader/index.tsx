'use client';

import { useSession } from 'next-auth/react';
import * as Layout from '@/app/ui/Layout';

type Props = {
  showDrawerMenu?: boolean;
};

export function LayoutHeader({ showDrawerMenu }: Props) {
  const { data: session } = useSession();
  return (
    <Layout.Header
      isLogin={Boolean(session)}
      showDrawerMenu={showDrawerMenu}
    />
  );
}