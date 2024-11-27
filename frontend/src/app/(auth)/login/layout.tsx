import * as Layout from '@/app/ui/Layout';
import { ClientRootLayout } from '@/app/_components/ClientRootLayout';
import { LayoutHeader } from '@/app/_components/LayoutHeader';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientRootLayout>
      <LayoutHeader />
      <Layout.Container>
        <Layout.Main>
          {children}
        </Layout.Main>
      </Layout.Container>
      <Layout.Footer />
    </ClientRootLayout>
  );
}
