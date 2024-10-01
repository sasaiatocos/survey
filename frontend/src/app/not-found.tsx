import * as Layout from '@/app/ui/Layout';
import { NotFound } from '@/app/ui/NotFound';
import { ClientRootLayout } from './_components/ClientRootLayout';
import { LayoutHeader } from './_components/LayoutHeader';

export default function NotFoundPage() {
    return (
        <ClientRootLayout>
            <LayoutHeader />
            <Layout.Container>
                <Layout.Main>
                    <NotFound />
                </Layout.Main>
            </Layout.Container>
            <Layout.Footer />
        </ClientRootLayout>
    );
}