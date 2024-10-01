'use client';

import * as Layout from '@/app/ui/Layout';
import { useSession } from 'next-auth/react';

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