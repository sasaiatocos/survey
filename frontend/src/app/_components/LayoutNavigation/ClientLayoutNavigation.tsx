'use client';

import { usePathname } from 'next/navigation';
import * as Layout from '@/app/ui/Layout';
import { roboto } from '@/app/fonts';

export function ClientLayoutNavigation() {
  const currentPathname = usePathname();
  const linkClassName = roboto.className;

  return (
    <Layout.Navigation
      linkClassName={linkClassName}
      currentPathname={currentPathname}
    >
    </Layout.Navigation>
  );
}