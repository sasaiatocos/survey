'use client';

import type { ReactNode } from 'react';
import React from 'react';
import * as Layout from '@/app/ui/Layout';
import { SessionProvider } from 'next-auth/react';

export function ClientRootLayout({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <Layout.Root>{children}</Layout.Root>
        </SessionProvider>
    );
}