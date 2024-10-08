'use client';

import type { ReactNode } from 'react';
import React from 'react';

import * as Layout from '@/app/ui/Layout';

export function ClientRootLayout({ children }: { children: ReactNode }) {
  return (
      <Layout.Root>{children}</Layout.Root>
  );
}