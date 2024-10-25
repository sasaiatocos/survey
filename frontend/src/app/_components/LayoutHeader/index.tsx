'use client';

import * as Layout from '@/app/ui/Layout';
import { useCookies } from 'react-cookie';

type Props = {
  showDrawerMenu?: boolean;
};

export function LayoutHeader({ showDrawerMenu }: Props) {
  return (
    <Layout.Header
      showDrawerMenu={showDrawerMenu}
    />
  );
}