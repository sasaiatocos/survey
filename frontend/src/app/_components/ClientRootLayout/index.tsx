'use client';

import type { ReactNode } from 'react';
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import * as Layout from '@/app/ui/Layout';

export function ClientRootLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Layout.Root>{children}</Layout.Root>
    </SessionProvider>
  );
}