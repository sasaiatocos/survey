import * as Layout from '@/app/ui/Layout';
import { ClientRootLayout } from '../_components/ClientRootLayout';
import { LayoutHeader } from '../_components/LayoutHeader';
import { LayoutNavigation } from '../_components/LayoutNavigation';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientRootLayout>
      <LayoutHeader />
      <Layout.Container>
        <LayoutNavigation />
        <Layout.Main>
          {children}
        </Layout.Main>
      </Layout.Container>
      <Layout.Footer />
    </ClientRootLayout>
  );
}
