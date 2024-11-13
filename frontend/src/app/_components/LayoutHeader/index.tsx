'use client';

import * as Layout from '@/app/ui/Layout';

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