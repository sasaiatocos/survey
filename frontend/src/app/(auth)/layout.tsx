import * as Layout from '@/app/ui/Layout';
import { ClientRootLayout } from '@/app/_components/ClientRootLayout';
import { LayoutHeader } from '@/app/_components/LayoutHeader';

type Props = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default async function SiteLayout({ children, modal }: Props) {
  return (
    <ClientRootLayout>
      <LayoutHeader />
      <Layout.Container>
        <Layout.Main>
          {children}
          {modal}
        </Layout.Main>
      </Layout.Container>
      <Layout.Footer />
    </ClientRootLayout>
  );
}